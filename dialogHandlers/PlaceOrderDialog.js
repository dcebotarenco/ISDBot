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

class PlaceOrderDialog {
    constructor() {
        Logger.logger().info("Creating PlaceOrderDialog Dialog");
        this.dialogs = [
            PlaceOrderDialog.askUserForMeal,
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
            builder.Prompts.choice(session, menusForDayView.msg, menusForDayView.choises);
        } else {
            //Clear choice sheet, because of circular JSON parsing.
            session.userData.choicesSheet = null;
            session.endDialog("There is no menu for " + dayName);
        }
    }

    static placeOrder(session, results, next) {
        let choiceSheet = session.userData.choicesSheet;
        let user = choiceSheet.getUsersById(session.message.user.id);
        Logger.logger().info('Placing order[%s] for id[%s]', session.message.text, session.message.user.id);
        if (user.length > 0) {
            Logger.logger().info('User found');
            let userChoice = SheetUtil.resolveMenuType(session.message.text);
            Logger.logger().info('Resolved choice[%s]', userChoice);
            let choices = user[0].getChoicesByDate(new Date());
            let emptyChoices = choices.filter(function (choice) {
                return choice.choiceMenuNumber.length === 0;
            });
            if (emptyChoices.length > 0) {
                Logger.logger().info('User has empty choices. Updating one..');
                emptyChoices[0].update(userChoice);
            }
            else {
                Logger.logger().info('User has no empty choices.');
                Logger.logger().info('Sorting choices by update numbers to get the least updated choice');
                let sortedByUpdatedChoices = choices.sort(function (choice1, choice2) {
                    var keyA = new Date(choice1.numberOfUpdates),
                        keyB = new Date(choice2.numberOfUpdates);
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                });
                Logger.logger().info('choices sorted');
                Logger.logger().info('Updating the least updated one..');
                sortedByUpdatedChoices[0].update(userChoice);
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
