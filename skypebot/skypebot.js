/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var botbuilder = require('botbuilder');
var RootIntent = require('../dialogHandlers/rootDialogHandler.js');
var LogWorkDialog = require('../dialogHandlers/logworkDialogHandler.js');
var Logger = require('../logger/logger');

class SkypeBot
{
    constructor()
    {
        Logger.logger().info("Creating Bot");
        this.APP_ID = process.env.MICROSOFT_APP_ID;
        this.PSW = process.env.MICROSOFT_APP_PASSWORD;
        this.botConnection = new botbuilder.ChatConnector({
            appId: this.APP_ID,
            appPassword: this.PSW
        });
        this.bot = new botbuilder.UniversalBot(this.botConnection);
        // Install First Run middleware and dialog
        this.bot.use({botbuilder: function (session, next) {
                Logger.logger().info("Message receive[%s]", session.message.text);
                    next();
                }
        });
        Logger.logger().info("Adding Dialogs");
        this.rootIntent = new RootIntent();
        this.logwork = new LogWorkDialog();
        this.bot.dialog('/', this.rootIntent.intent);
        this.bot.dialog(LogWorkDialog.name(), this.logwork.dialog);
    }
    get connection()
    {
        return this.botConnection;
    }
    set connection(connection)
    {
        this.botConnection = connection;
    }

}
module.exports = SkypeBot;
