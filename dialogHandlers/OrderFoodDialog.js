var Logger = require('../logger/logger');
var google = require('../google/googleConnection');
var CalendarUtil = require('../util/CalendarUtil');
var ModelBuilder = require('../modelBuilder/ModelBuilder');
var PlaceOrderDialog = require('../dialogHandlers/PlaceOrderDialog');
var CancelOrderDialog = require('../dialogHandlers/CancelOrderDialog');
var UserChoisesStatusDialog = require('../dialogHandlers/UserChoisesStatusDialog');
var moment = require('moment');
var menuSheetName = 'Lunch Menu';
class OrderFoodDialog {

    constructor() {
        Logger.logger().info("Creating OrderFood Dialog");
        this.dialogs = [
            OrderFoodDialog.isUserRegistered,
            OrderFoodDialog.fetchMenu,
            OrderFoodDialog.resolveAction
        ];
    }

    static isUserRegistered(session, results, next) {
        google.fetchRegisteredEmployees((response) => OrderFoodDialog.onEmployeesFetched(session, results, next, response.values));
    }

    static onEmployeesFetched(session, results, next, rows) {
        let employeeList = ModelBuilder.createRegisteredEmployees(rows);
        session.userData.employeesList = employeeList;
        if (employeeList.filter(function (employee) {
                return session.message.address.user.id === employee.id;
            }).length === 0) {
            session.endDialog("Sorry. You are not registered. Contact Administrator")
        }
        next();
    }

    static fetchMenu(session, results, next) {
        Logger.logger().info("Gather all data from [%s]", menuSheetName);
        google.fetchGoogleSheet(process.env.G_SPREADSHEET_ID, menuSheetName, 'ROWS', (response) => OrderFoodDialog.onMenuReceived(session, results, next, response));
    }

    static onMenuReceived(session, results, next, columns) {
        Logger.logger().info("Menu Received");
        if(columns === null){
            //notify user
            session.endDialog(`Ooops, something went wrong while reading google spreadsheet [${menuSheetName}] :(`);
            // TO DO: notify admin
            return;
        }
        let sheet = ModelBuilder.createMenuModelSheet(columns.values,session);
        session.userData.sheet = sheet;
        var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        Logger.logger().info('Today: %s', today);

        //check if menu was updated
        if (sheet.updateDate.getWeek() === today.getWeek()) {
            Logger.logger().info('Sheet week[%s] is in today week[%s]', sheet.updateDate.getWeek(), today.getWeek());
            if (today.getDay() <= 5) {
                Logger.logger().info('Update date is OK!');
            } else {
                Logger.logger().warn('Today is weekend');
                session.endDialog("Seems that is weekend (o) Nobody is working now. See you on Monday |-)");
            }
        } else {
            Logger.logger().info('Sheet week[%s] is not in today week[%s]', sheet.updateDate.getWeek(), today.getWeek());
            Logger.logger().warn('Update date is not in interval!');
            session.endDialog("Seems that the lunch list was not updated yet");
        }
        next();
    }

    static resolveAction(session, results, next) {
        Logger.logger().info("Resolving Orderfood Dialog");
        let userMsg = session.message.text.toLowerCase().trim();
        let cancelRegex = /^food cancel( )?(today|mo|tu|we|th|fr|nd)?$/;
        let statusRegex = /^food status( )?(today|mo|tu|we|th|fr|nd)?$/;
        let foodRegex = /^food( )?(today|mo|tu|we|th|fr|nd)?$/;

        //user entered food cancel
        if (cancelRegex.test(userMsg)) {
            let foodCancelOnSpecificDayRegex = /(food cancel (today|mo|tu|we|th|fr|nd))/i;
            let isfoodCancelOnSpecificDay = foodCancelOnSpecificDayRegex.exec(userMsg);
            let foodCancelOnCurrentDayRegex = /(food cancel)/i;
            let isfoodCancelOnCurrentDay = foodCancelOnCurrentDayRegex.exec(userMsg);
            if (isfoodCancelOnSpecificDay) {
                Logger.logger().info("Cancel order for a specific day");
                let date = CalendarUtil.resolveDate(isfoodCancelOnSpecificDay[2]);
                if (date.isSameOrAfter(moment(new Date()), 'day')) {
                    session.userData.orderActionDate = date.toDate();
                    session.beginDialog(CancelOrderDialog.name());
                } else {
                    session.userData.sheet = null;
                    session.endDialog("Hey Dude, look at the calendar. You cannot cancel an order in the past. Come on.. |-(")
                }
            } else if (isfoodCancelOnCurrentDay) {
                Logger.logger().info("Cancel order for current day");
                session.userData.orderActionDate = new Date();
                session.beginDialog(CancelOrderDialog.name());
            } else {
                session.userData.choicesSheet = null;
                session.endDialog("Invalid input. Use food cancel (today|mo|tu|we|th|fr|nd)");
            }
        //user entered food status
        } else if (statusRegex.test(userMsg)) {
            let foodStatusOnSpecificDayRegex = /(food status (today|mo|tu|we|th|fr|nd))/i;
            let isFoodStatusOnSpecificDay = foodStatusOnSpecificDayRegex.exec(userMsg);
            let foodStatusOnCurrentDayRegex = /(food status)/i;
            let isFoodStatusOnCurrentDay = foodStatusOnCurrentDayRegex.exec(userMsg);
            if (isFoodStatusOnSpecificDay) {
                Logger.logger().info("User choices status for a specific day");
                let date = CalendarUtil.resolveDate(isFoodStatusOnSpecificDay[2]);
                session.userData.orderActionDate = date.toDate();
                session.beginDialog(UserChoisesStatusDialog.name());
            } else if (isFoodStatusOnCurrentDay) {
                Logger.logger().info("User choices status for current day");
                session.userData.orderActionDate = new Date();
                session.beginDialog(UserChoisesStatusDialog.name());
            } else {
                session.userData.choicesSheet = null;
                session.endDialog("Invalid input. Use food status (today|mo|tu|we|th|fr|nd)");
            }
        }
        //user entered food
        else if (foodRegex.test(userMsg)) {
            let placeOrderOnCurrentDayRegex = /(food)/i;
            let isPlaceOrderOnCurrentDay = placeOrderOnCurrentDayRegex.exec(userMsg);
            let placeOrderOnSpecificDayRegex = /(food (mo|tu|we|th|fr|nd))/i;
            let isPlaceOrderOnSpecificDay = placeOrderOnSpecificDayRegex.exec(userMsg);
            if (isPlaceOrderOnSpecificDay) {
                Logger.logger().info("Place order for a specific day");
                let userDay = CalendarUtil.resolveDate(isPlaceOrderOnSpecificDay[2]);
                if (userDay.isSameOrAfter(moment(new Date()), 'day')) {
                    session.userData.orderActionDate = userDay.toDate();
                    session.beginDialog(PlaceOrderDialog.name());
                } else {
                    session.userData.choicesSheet = null;
                    session.endDialog("Hey Dude, look at the calendar. You cannot place an order in the past. Come on.. |-(")
                }
            } else if (isPlaceOrderOnCurrentDay) {
                Logger.logger().info("Place order for current day");
                session.userData.orderActionDate = new Date();
                session.beginDialog(PlaceOrderDialog.name());
            }
        } else {
            Logger.logger().info("Orderfood dialog called without no input message. This is Cron");
            if (session.options.dialogArgs.dialogToStart === PlaceOrderDialog.name()) {
                OrderFoodDialog.startCronDialog(session, PlaceOrderDialog.name());
            }else if(session.options.dialogArgs.dialogToStart === UserChoisesStatusDialog.name()){
                OrderFoodDialog.startCronDialog(session, UserChoisesStatusDialog.name());
            }
        }
    }

    static startCronDialog(session, dialogName){
        Logger.logger().info('Begin Cron Dialog [%s]', dialogName);
        let dialogArguments = session.options.dialogArgs;
        let date = new Date();
        session.userData.orderActionDate = date;
        session.beginDialog(dialogName);
    }

    get dialog() {
        return this.dialogs;
    }

    static name() {
        return "/orderfood";
    }

    static match() {
        return /(^food( )?(today|mo|tu|we|th|fr|nd)?$)|(^food status( )?(today|mo|tu|we|th|fr|nd)?$)|(^food cancel( )?(today|mo|tu|we|th|fr|nd)?$)/i;
    }
}
module.exports = OrderFoodDialog;