/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var botbuilder = require('botbuilder');

class SkypeBot
{
    constructor()
    {
        this.APP_ID = "ba07cfa7-1eed-40d4-b746-825205d1a4fe";
        this.PSW = "LrAmnvjnNViw5uxnBUjPnp1";
        this.botConnection = new botbuilder.ChatConnector({
            appId: this.APP_ID,
            appPassword: this.PSW
        });

        this.bot = new botbuilder.UniversalBot(this.botConnection);
        this.bot.dialog('/', function (session) {
            session.send("Hello");
        });
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
