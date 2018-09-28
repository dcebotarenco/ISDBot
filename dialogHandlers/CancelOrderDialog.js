/**
 * Created by charea on 17.10.2016.
 */
var MenusFactory = require('../viewChoice/MenusFactory');
var builder = require('botbuilder');
var Logger = require('../logger/logger');
var moment = require('moment');
var SheetUtil = require('../util/SheetUtil');
var google = require('../google/googleConnection');
var ModelBuilder = require('../modelBuilder/ModelBuilder');
var moment = require('moment');
let MenuFactory = require('../orderFood/factory/MenuFactory');
let Day = require('../orderFood/lunchList/Day');
let Choice = require('../orderFood/employeesChoises/Choice');
let Sheet = require('../orderFood/lunchList/Sheet');

class CancelOrderDialog {
    constructor() {
        Logger.logger().info("Creating CancelOrderDialog Dialog");
        this.dialogs = [
            CancelOrderDialog.fetchEmployeeChoices,
            CancelOrderDialog.fetchChoicesPerUserPerDay,
            CancelOrderDialog.fetchMenuForDay,
            CancelOrderDialog.cancelOrder
        ];
    }

    static fetchEmployeeChoices(session, results, next) {
        var month = new Date(session.userData.orderActionDate).toLocaleString("en-us", {month: "long"});
        var year = new Date(session.userData.orderActionDate).getFullYear();
        var choiceSheetName = month + " " + year;
        session.userData.choiceSheetName = choiceSheetName;
        Logger.logger().info("CancelOrderDialog: Gather all data from [%s]", choiceSheetName);
        google.fetchGoogleSheet(process.env.G_SPREADSHEET_ID, choiceSheetName, 'ROWS', (response) => CancelOrderDialog.onChoicesReceived(session, results, next, response));
    }

    static onChoicesReceived(session, results, next, rows) {
        Logger.logger().info("CancelOrderDialog: Choices Received");
        if(rows === null){
            //notify user
            session.endDialog(`Ooops, something went wrong while reading google spreadsheet [${session.userData.choiceSheetName}] :(`);
            // TO DO: notify admin
            return;
        }
        let choicesSheet = ModelBuilder.createChoiceModelSheet(rows.values, session.userData.employeesList,session.userData.orderActionDate);
        session.dialogData.choicesSheet = choicesSheet;
        next();
    }

    static fetchChoicesPerUserPerDay(session, results, next) {
        Logger.logger().info("CancelOrderDialog.fetchChoicesPerUserPerDay");
        let choicesSheet = session.dialogData.choicesSheet;
        let actionDate = moment(session.userData.orderActionDate);
        let user = choicesSheet.getUsersById(session.message.user.id);
        let availableUserChoicesPerDay;
        Logger.logger().info('Cancel order for id[%s]', session.message.user.id);
        if (user.length > 0) {
            Logger.logger().debug('User found');
            let choicesObj = user[0].getChoicesByDate(actionDate.toDate());
            if (choicesObj) {
                let emptyChoices = choicesObj.choices.filter(function (choice) {
                    return choice.choiceMenuNumber.length === 0;
                });
                /*checking length of emptyChoices and choicesObj. If they are equal, there is nothing to cancel*/
                if (choicesObj.choices.length !== emptyChoices.length) {
                    availableUserChoicesPerDay = choicesObj.choices.filter(function (choice) {
                        return choice.choiceMenuNumber.length !== 0;
                    });
                    session.userData.availableUserChoicesPerDay = availableUserChoicesPerDay;
                    Logger.logger().info('User [%s] has [%d] choice(s) available for deleting on [%s]', session.message.user.id, availableUserChoicesPerDay.length, actionDate.format("YYYY-MM-DD"));
                    /*adding in session non circular variable*/
                    let userChoicesNonCircular = [];
                    availableUserChoicesPerDay.forEach(function (choice) {
                        userChoicesNonCircular.push({
                            choiceMenuNumber: choice.choiceMenuNumber,
                            choiceMenuName: choice.choiceMenuName,
                            columnLetter: choice.choiceDay.columnLetter,
                            rowNumber: choice.rowNumber
                        });
                    });
                    session.userData.userChoicesNonCircular = userChoicesNonCircular;
                    next();
                } else {
                    Logger.logger().info('There are not available choices(notEmpty) to cancel for users [%s] and date[%s]', session.message.user.id, actionDate.format("YYYY-MM-DD"));
                    session.endDialog("There is nothing to cancel on %s", actionDate.format("D MMM YYYY"));
                }

            }
            else {
                session.endDialog("There is no such date [%s] in the menu", actionDate.format("D MMM YYYY"));
            }
        }
        else {
            Logger.logger().info('No user found.');
        }

    }

    static fetchMenuForDay(session, results, next) {
        let userSelectedMenuDate = moment(session.userData.orderActionDate);
        let dayName = userSelectedMenuDate.isSame(moment(new Date), 'day') ? 'Today' : userSelectedMenuDate.format('dddd');
        let sheet = new Sheet(session.userData.sheet);


        //check if order is for next weeks, nr. of days is going to be subtracted depending of nr. of weeks difference related to current week
        let nrOfDaysDiff = 0;
        var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        if (today.getWeek() < session.userData.orderActionDate.getWeek()) {
            nrOfDaysDiff = (session.userData.orderActionDate.getWeek()- today.getWeek()) *7;//week difference * nr. of days per week
            Logger.logger().info(`Current week [${today.getWeek()}], order is for week [${session.userData.orderActionDate.getWeek()}], subtracting [${nrOfDaysDiff}] from order date [${session.userData.orderActionDate}]`);
        }
        let newUserSelectedMenuDate = userSelectedMenuDate.toDate();
        newUserSelectedMenuDate.setDate(newUserSelectedMenuDate.getDate() - nrOfDaysDiff);
        let menuForDay = sheet.getMenusForDate(newUserSelectedMenuDate);
        let availableUserChoicesPerDay = session.userData.availableUserChoicesPerDay;
        let menuList = [];
        if (menuForDay !== undefined) {
            availableUserChoicesPerDay.forEach(function (item) {
                let menuName = SheetUtil.resolveMenuNumber(item.choiceMenuNumber);
                menuForDay.forEach(function (menu) {
                    if (menu._number == item.choiceMenuNumber) {
                        menuList.push({menu: menu, menuName: item.choiceMenuName, menuNumber: item.choiceMenuNumber});
                        Logger.logger().info("Added menu[%s]", menu.constructor.name);
                    }
                });

            });

            let menusForDayView = MenusFactory.buildMenus(session, menuList);
            session.send("Here are your choices for " + dayName + ":");
            Logger.logger().info("Asking for meal");
            /*cleaning up session, otherwise we get "TypeError: Converting circular structure to JSON"*/
            let responseStr = 'Don\'t mess with us, we know where you work.<br/>Choose what you want to cancel from your order or say "bye".';
            session.userData.availableUserChoicesPerDay = null;
            session.dialogData.choicesSheet = null;
            builder.Prompts.choice(session, menusForDayView.msg, menusForDayView.choises, { retryPrompt: responseStr, listStyle: builder.ListStyle.none });
        } else {
            session.endDialog("There is no menu for  " + dayName);
        }
    }

    static cancelOrder(session, results, next) {
        Logger.logger().info('Canceling order[%s] for id[%s]', session.message.text, session.message.user.id);
        let userChoicesNonCircular = session.userData.userChoicesNonCircular;
        let menuToCancel = session.message.text;
        Logger.logger().info('Resolved choice[%s]',menuToCancel);
        let choiceToDelete;
        userChoicesNonCircular.forEach(function (choice) {
            /*if there are more then one menu, the last one is going to be chosen*/
            if ((choice.choiceMenuNumber+choice.choiceMenuName) === menuToCancel) {
                choiceToDelete = choice;
            }
        });
        var month = new Date(session.userData.orderActionDate).toLocaleString("en-us", {month: "long"});
        var year = new Date(session.userData.orderActionDate).getFullYear();
        var choiceSheetName = month + " " + year;
        google.updateValue(choiceToDelete.columnLetter, choiceToDelete.rowNumber, '', choiceSheetName, (response, err, value)=>function (response, err, value, session) {
            if (err) {
                session.endDialog(err.message);
            }
            else {
                session.endDialog("Order Canceled \"" + choiceToDelete.choiceMenuNumber + choiceToDelete.choiceMenuName + "\". Thank you for choosing our service ;) .");
            }
        }(response, err, value, session));

    }

    static name() {
        return "/cancelOrder";
    }

    get dialog() {
        return this.dialogs;
    }
}
module.exports = CancelOrderDialog;