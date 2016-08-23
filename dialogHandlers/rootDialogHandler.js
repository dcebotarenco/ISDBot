/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var botbuilder = require('botbuilder');
var LogWorkDialog = require('./logworkDialogHandler.js');

class RootIntent
{
    constructor()
    {
        this.rootIntents = new botbuilder.IntentDialog();
        this.rootIntents.matches(LogWorkDialog.match(), LogWorkDialog.name());
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
}

module.exports = RootIntent;

