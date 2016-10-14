/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var DayFactory = require('../view/DayFactory');
var builder = require('botbuilder');
var Logger = require('../logger/logger');
var moment = require('moment');

class PlaceOrderDialog
{
    constructor() {
        Logger.logger().info("Creating PlaceOrderDialog Dialog");
        this.dialogs = [
            PlaceOrderDialog.askUserForMeal
        ];
    }
    static askUserForMeal(session, results, next) {
        let userSelectedMenuDate = session.userData.orderActionDate;
        let day = DayFactory.buildDay(session, session.userData.sheet.getDayByDate(userSelectedMenuDate.toDate()));
        let dayName = userSelectedMenuDate.isSame(moment(new Date),'day')? 'Today' : userSelectedMenuDate.format('dddd');
        session.send("Here is " + dayName + " menu:");
        builder.Prompts.choice(session, day.msg, day.choises);
    }
    
    static name() {
        return "/placeOrder";
    }
    get dialog() {
        return this.dialogs;
    }
}
module.exports = PlaceOrderDialog;
