/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var MenusFactory = require('../view/MenusFactory');
var builder = require('botbuilder');
var Logger = require('../logger/logger');
var moment = require('moment');

class PlaceOrderDialog {
    constructor() {
        Logger.logger().info("Creating PlaceOrderDialog Dialog");
        this.dialogs = [
            PlaceOrderDialog.askUserForMeal
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

    static name() {
        return "/placeOrder";
    }

    get dialog() {
        return this.dialogs;
    }
}
module.exports = PlaceOrderDialog;
