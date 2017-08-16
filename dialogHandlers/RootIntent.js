/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var botbuilder = require('botbuilder');
var OrderFoodDialog = require('./OrderFoodDialog.js');
var HelpDialog = require('./HelpDialog.js');
var GreetingDialog = require('./GreetingDialog.js');
var BooksDialog = require('./BooksDialog');
var BookDialog = require('./BookDialog');
var Logger = require('../logger/logger');

class RootIntent {
    constructor() {
        Logger.logger().info("Creating Root Intent");
        this.rootIntents = new botbuilder.IntentDialog();
        this.rootIntents.matches(OrderFoodDialog.match(), OrderFoodDialog.name());
        this.rootIntents.matches(HelpDialog.match(), HelpDialog.name());
        this.rootIntents.matches(GreetingDialog.match(), GreetingDialog.name());
        this.rootIntents.matches(BooksDialog.match(), BooksDialog.name());
        this.rootIntents.matches(BookDialog.match(), BookDialog.name());
        this.rootIntents.onDefault([
            function (session) {
                session.send("I'm sorry. I didn't understand. Bastard");
                session.send("What would you like me to do?");
                session.beginDialog(HelpDialog.name());
            }
        ]);
    }

    get intent() {
        return this.rootIntents;
    }

    static name() {
        return "/";
    }
}

module.exports = RootIntent;

