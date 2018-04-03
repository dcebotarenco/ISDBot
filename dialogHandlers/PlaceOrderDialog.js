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
var Choice = require('../orderFood/employeesChoises/Choice.js');
var Employee = require('../registration/Employee');

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
        let userSelectedMenuDate = moment(session.userData.orderActionDate);
        let dayName = userSelectedMenuDate.isSame(moment(new Date), 'day') ? 'Today' : userSelectedMenuDate.format('dddd');
        //let menuForDay = session.userData.sheet.getDayByDate(userSelectedMenuDate.toDate());
        let menuForDay = session.userData.sheet.getMenusForDate(userSelectedMenuDate.toDate());
        if (menuForDay !== undefined) {
            //let menusForDayView = MenusFactory.buildMenus(session, menuForDay);
            let menusForDayView = MenusFactory.buildMenusForDay(session, menuForDay);
            session.send("Here is menu for " + dayName + ":");
            Logger.logger().info("Asking for meal");
            session.userData.choicesSheet = null;
            builder.Prompts.choice(session, menusForDayView.msg, menusForDayView.choises, { retryPrompt: 'Ok funny guy, if you keep it up, you\'ll end up ordering food by yourself.' });
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
        let choicesSheet = ModelBuilder.createChoiceModelSheet(rows, session.userData.employeesList);
        let users = choicesSheet.getUsersById(session.message.user.id);
        let actionDate = moment(session.userData.orderActionDate);
        let choicesObj = users[0].getChoicesByDate(actionDate.toDate());
        /*adding in session non circular variable*/
        let userChoicesNonCircular = [];
        choicesObj.choices.forEach(function (choice) {
            userChoicesNonCircular.push({
                choiceMenuNumber: choice.choiceMenuNumber,
                choiceMenuName: choice.choiceMenuName,
                columnLetter: choice.choiceDay.columnLetter,
                rowNumber: choice.rowNumber
            });
        });
        session.userData.userChoicesNonCircular = userChoicesNonCircular;
        next();
    }

    static placeOrder(session, results, next) {
        let choicesObjNonCircular = session.userData.userChoicesNonCircular;
        Logger.logger().info('Placing order[%s] for id[%s]', session.message.text, session.message.user.id);
        let userChoice = session.message.text;
        Logger.logger().info('Resolved choice[%s]', userChoice);
        if (choicesObjNonCircular) {
            let emptyChoicesNonCircular = choicesObjNonCircular.filter(function (choice) {
                return choice.choiceMenuNumber.length === 0;
            });
            if (emptyChoicesNonCircular.length > 0) {
                if(SheetUtil.contains(session.userData.allMenuTypes,userChoice)){
                Logger.logger().debug('User has empty choices. Updating one..');
                Choice.updateChoice(userChoice, emptyChoicesNonCircular[0].columnLetter, emptyChoicesNonCircular[0].rowNumber, (response, err, value)=>function (response, err, value, session) {
                    if (err) {
                        Logger.logger().error('The API returned an error: ' + err);
                        session.userData.choicesSheet = null;
                        session.endDialog(err.message);
                    }
                    else {
                        Logger.logger().info('Range[%s] updated with value[%s]', response.updatedRange, value);
                        session.userData.choicesSheet = null;
                        session.endDialog("Order Placed \"" + value + "\". Thank you for choosing our airline ;) .");
                    }
                }(response, err, value, session));
                }else{
                    session.endDialog("The kitten has exploded, don't mess with us, or another kitten will die");
                }
            }
            else {
                Logger.logger().info('User has no empty choices.');
                Logger.logger().debug('Sorting choices by update numbers to get the least updated choice');
                if (choicesObjNonCircular.length > 1) {
                    session.userData.choicesSheet = null;
                    session.endDialog("Dude sorry :( , seems that you have all choices completed. Can you delete one via 'food cancel (today|mo|tu|we|th|fr)'.");
                }
                else {
                    Choice.updateChoice(userChoice, choicesObjNonCircular[0].columnLetter, choicesObjNonCircular[0].rowNumber, (response, err, value)=>function (response, err, value, session) {
                        if (err) {
                            Logger.logger().error('The API returned an error: ' + err);
                            session.userData.choicesSheet = null;
                            session.endDialog(err.message);
                        }
                        else {
                            Logger.logger().info('Range[%s] updated with value[%s]', response.updatedRange, value);
                            session.userData.choicesSheet = null;
                            session.endDialog("Order Placed \"" + value + "\". Thank you for choosing our airline ;) .");
                        }
                    }(response, err, value, session));
                }
            }
        }
        else {
            session.endDialog("There is no such date [%s] in the menu" + actionDate.toDate());
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
