var Logger = require('../logger/logger');
var google = require('../google/googleConnection');
var CalendarUtil = require('../util/CalendarUtil');
var ModelBuilder = require('../modelBuilder/ModelBuilder');
var PlaceOrderDialog = require('../dialogHandlers/PlaceOrderDialog');
var CancelOrderDialog = require('../dialogHandlers/CancelOrderDialog');
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
        if (employeeList.filter(function (employee) {
                return session.message.address.user.id === employee.id;
            }).length === 0) {
            session.endDialog("Sorry. You are not registered. Contact Administrator")
        }
        next();
    }

    static fetchMenu(session, results, next) {
        Logger.logger().info("Gather all data from [%s]", menuSheetName);
        google.fetchGoogleSheet(process.env.G_SPREADSHEET_ID, menuSheetName, 'COLUMNS', (response) => OrderFoodDialog.onMenuReceived(session, results, next, response.values));
    }

    static onMenuReceived(session, results, next, columns) {
        let sheet = ModelBuilder.createMenuModelSheet(columns);
        session.userData.sheet = sheet;
        var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        Logger.logger().info('Today: %s', today);

        if (sheet.updateDate.getWeek() === today.getWeek()) {
            Logger.logger().info('Sheet week[%s] is in today week[%s]', sheet.updateDate.getWeek(), today.getWeek());
            if (today.getDay() <= 5) {
                Logger.logger().info('Update date is OK!');
            } else {
                Logger.logger().info('Today is weekend');
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

        if (session.message.text.includes('food') && session.message.text.includes('cancel')) {
            let cancelOrderRegex = /(food cancel (today|mo|tu|we|th|fr))/i;
            let isCancelOrder = cancelOrderRegex.exec(session.message.text);
            if (isCancelOrder) {
                Logger.logger().info("Cancel order for a specific day");
                let date = CalendarUtil.resolveDate(isCancelOrder[2]);
                if (date.isSameOrAfter(moment(new Date()), 'day')) {
                    session.userData.orderActionDate = date;
                    session.beginDialog(CancelOrderDialog.name());
                } else {
                    session.userData.choicesSheet = null;
                    session.endDialog("Hey Dude, look at the calendar. You cannot cancel an order in the past. Come on.. |-(")
                }
            }
            else {
                session.endDialog("Invalid input. Use food cancel (today|mo|tu|we|th|fr)");
            }
        }
        else {
            let placeOrderOnCurrentDayRegex = /(food)/i;
            let isPlaceOrderOnCurrentDay = placeOrderOnCurrentDayRegex.exec(session.message.text);
            let placeOrderOnSpecificDayRegex = /(food (mo|tu|we|th|fr))/i;
            let isPlaceOrderOnSpecificDay = placeOrderOnSpecificDayRegex.exec(session.message.text);
            if (isPlaceOrderOnSpecificDay) {
                Logger.logger().info("Place order for a specific day");
                let userDay = CalendarUtil.resolveDate(isPlaceOrderOnSpecificDay[2]);
                if (userDay.isSameOrAfter(moment(new Date()), 'day')) {
                    session.userData.orderActionDate = userDay;
                    session.beginDialog(PlaceOrderDialog.name());
                } else {
                    session.userData.choicesSheet = null;
                    session.endDialog("Hey Dude, look at the calendar. You cannot place an order in the past. Come on.. |-(")
                }
            } else if (isPlaceOrderOnCurrentDay) {
                Logger.logger().info("Place order for current day");
                session.userData.orderActionDate = moment(new Date());
                session.beginDialog(PlaceOrderDialog.name());
            } else {
                Logger.logger().info("Orderfood dialog called without no input message. This is Cron");
                Logger.logger().info("Place order for current day");
                session.userData.orderActionDate = moment(new Date());
                session.beginDialog(PlaceOrderDialog.name());
            }
        }
    }

    get dialog() {
        return this.dialogs;
    }

    static name() {
        return "/orderfood";
    }

    static match() {
        return /(food cancel (mo|tu|we|th|fr))|(food (mo|tu|we|th|fr))|(food)/i;
    }
}
module.exports = OrderFoodDialog;