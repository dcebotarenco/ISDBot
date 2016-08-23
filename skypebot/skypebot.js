/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var botbuilder = require('botbuilder');
var RootIntent = require('../dialogHandlers/rootDialogHandler.js');
var LogWorkDialog = require('../dialogHandlers/logworkDialogHandler.js');

class SkypeBot
{
    constructor()
    {
        this.APP_ID = process.env.MICROSOFT_APP_ID;
        this.PSW = process.env.MICROSOFT_APP_PASSWORD;
        this.botConnection = new botbuilder.ChatConnector({
            appId: this.APP_ID,
            appPassword: this.PSW
        });
        this.bot = new botbuilder.UniversalBot(this.botConnection);
        
        this.rootIntent = new RootIntent();
        this.worklog = new LogWorkDialog();
        this.bot.dialog('/', this.rootIntent.intent);
        this.bot.dialog(LogWorkDialog.name(), this.worklog.dialog);
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
