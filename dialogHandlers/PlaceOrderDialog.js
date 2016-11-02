/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var MenusFactory = require('../view/MenusFactory');
var builder = require('botbuilder');
var Logger = require('../logger/logger');
var moment = require('moment');
var SheetUtil = require('../util/SheetUtil');
var google = require('../google/googleConnection');
var ModelBuilder = require('../modelBuilder/ModelBuilder');
var moment = require('moment');

class PlaceOrderDialog {
    constructor() {
        Logger.logger().info("Creating PlaceOrderDialog Dialog");
        this.dialogs = [
            PlaceOrderDialog.askUserForMeal,
            PlaceOrderDialog.fetchEmployeeChoices,
            PlaceOrderDialog.placeOrder,
        ];
    }

    static askUserForMeal(session, results, next) {
        let userSelectedMenuDate = session.userData.orderActionDate;
        let dayName = userSelectedMenuDate.isSame(moment(new Date), 'day') ? 'Today' : userSelectedMenuDate.format('dddd');
        let menuForDay = session.userData.sheet.getDayByDate(userSelectedMenuDate.toDate());
        if (menuForDay !== undefined) {
            let menusForDayView = MenusFactory.buildMenus(session, menuForDay);
            session.send("Here is " + dayName + " menu:");
            Logger.logger().info("Asking for meal");
            builder.Prompts.choice(session, menusForDayView.msg, menusForDayView.choises);
        } else {
            session.endDialog("There is no menu for " + dayName);
        }
    }

    static fetchEmployeeChoices(session, results, next) {
        var month = new Date().toLocaleString("en-us", {month: "long"});
        var year = new Date().getFullYear();
        var choiceSheetName = month + " " + year;
        Logger.logger().info("Gather all data from [%s]", choiceSheetName);
        google.fetchGoogleSheet(process.env.G_SPREADSHEET_ID, choiceSheetName, 'ROWS', (response) => PlaceOrderDialog.onChoicesReceived(session, results, next, response.values));
    }

    static onChoicesReceived(session, results, next, rows) {
        Logger.logger().info("Choices Received");
        let choicesSheet = ModelBuilder.createChoiceModelSheet(rows);
        session.dialogData.choicesSheet = choicesSheet;
        next();
    }

    static placeOrder(session, results, next) {
        let choiceSheet = session.dialogData.choicesSheet;
        let actionDate = moment(session.userData.orderActionDate);
        let user = choiceSheet.getUsersById(session.message.user.id);
        Logger.logger().info('Placing order[%s] for id[%s]', session.message.text, session.message.user.id);
        if (user.length > 0) {
            Logger.logger().info('User found');
            let userChoice = SheetUtil.resolveMenuType(session.message.text);
            Logger.logger().info('Resolved choice[%s]', userChoice);
            let choicesObj = user[0].getChoicesByDate(actionDate.toDate());
            if (choicesObj) {
                let emptyChoices = choicesObj.choices.filter(function (choice) {
                    return choice.choiceMenuNumber.length === 0;
                });
                if (emptyChoices.length > 0) {
                    Logger.logger().info('User has empty choices. Updating one..');
                    emptyChoices[0].update(userChoice, (response, err, value)=>function (response, err, value, session) {
                        if (err) {
                            Logger.logger().error('The API returned an error: ' + err);
                            session.endDialog(err.message);
                        }
                        else {
                            Logger.logger().info('Range[%s] updated with value[%s]', response.updatedRange, value);
                            session.endDialog("Order Placed \"" + value + "\". Thank you for choosing our airline ;) .");
                        }
                    }(response, err, value, session));
                }
                else {
                    Logger.logger().info('User has no empty choices.');
                    Logger.logger().info('Sorting choices by update numbers to get the least updated choice');
                    if (choicesObj.choices.length > 1) {
                        session.endDialog("Dude sorry :( , seems that you have all choices completed. Can you delete one via 'food cancel (today|mo|tu|we|th|fr)'.");
                    }
                    else {
                        choicesObj.choices[0].update(userChoice);
                        session.endDialog("Order Placed \"" + userChoice + "\". Thank you for choosing our airline ;) .");
                    }
                }
            }
            else {
                session.endDialog("There is no such date [%s] in the menu" + actionDate.toDate());
            }
        }
        else {
            Logger.logger().info('No user found.');
        }
    }

    static name() {
        return "/placeOrder";
    }

    get dialog() {
        return this.dialogs;
    }
}
module.exports = PlaceOrderDialog;
