/**
 * Created by dcebotarenco on 10/6/2016.
 */
var builder = require('botbuilder');
var Logger = require('../logger/logger');
var HelpDialog = require('../dialogHandlers/HelpDialog.js');


class GreetingDialog {
    constructor() {
        Logger.logger().info("Creating Greeting Dialog");
        this.dialogs = [
            GreetingDialog.showGreeting
        ];
    }

    static showGreeting(session) {
        var logo = new builder.HeroCard(session)
            .title("ISD Bot")
            .subtitle("Hi! I'm the ISD Bot for Skype.")
            .text("I can order some food for you.")
            .images([
                builder.CardImage.create(session, "http://isd-soft.com/wp-content/themes/isd/images/logo.png")
            ]);
        var id = new builder.HeroCard(session)
            .subtitle("Your ID")
            .text("Please provide this key [%s] to Administrator", session.message.user.id);
        var msg = new builder.Message(session).attachments([logo,id]);
        session.send(msg);
        session.beginDialog(HelpDialog.name());
    }

    get dialog() {
        return this.dialogs;
    }

    static name() {
        return "/greeting";
    }

    static match() {
        return /hi/i;
    }
}
module.exports = GreetingDialog;