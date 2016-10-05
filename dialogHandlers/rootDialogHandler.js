/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var botbuilder = require('botbuilder');
var OrderFoodDialog = require('./orderFoodDialogHandler.js');
var Logger = require('../logger/logger');

class RootIntent
{
    constructor()
    {
        Logger.logger().info("Creating Root Intent");
        this.rootIntents = new botbuilder.IntentDialog();
        this.rootIntents.onBegin(function (session, args, next) {
            Logger.logger().info("Service URL[%s]",session.message.address.serviceUrl);
            Logger.logger().info("Service URL[%s]",session.message.address.channelId);
            Logger.logger().info("Service URL[%s]",session.message.address.bot.name);
            Logger.logger().info("Service URL[%s]",session.message.address.user.name);
            Logger.logger().info("Service URL[%s]",session.message.address.useAuth);
            Logger.logger().info("User[%s]",session.message.address.user.name);
            if(!session.message.address.user.name.match(/inther_(.+)/i))
            {
                session.endDialog();
            }
            else {
                next();
            }
        });
        this.rootIntents.matches(OrderFoodDialog.match(), OrderFoodDialog.name());
        this.rootIntents.onDefault([
            function (session) {
                session.send("I'm sorry. I didn't understand. Bastard");
                session.send("What would you like me to do?");
                session.send("!logwork");
            }
        ]);
    }

    get intent()
    {
        return this.rootIntents;
    }

    static name()
    {
        return "/";
    }
}

module.exports = RootIntent;

