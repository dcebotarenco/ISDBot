/**
 * Created by dcebotarenco on 10/6/2016.
 */
var builder = require('botbuilder');
var Logger = require('../logger/logger');

class GreetingDialog {
    constructor()
    {
        Logger.logger().info("Creating Greeting Dialog");
        this.dialogs = [
            GreetingDialog.showGreeting
        ];
    }

    static showGreeting(session)
    {
        var card = new builder.HeroCard(session)
            .title("ISD Bot")
            .text("Your bots - wherever your users are talking.")
            .images([
                builder.CardImage.create(session, "http://isd-soft.com/wp-content/themes/isd/images/logo.png")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hi... I'm the ISD Bot for Skype. I can order some food for you.");
        session.endDialog("Please provide this key [%s] to Administrator",session.message.user.id);
    }

    get dialog() {
        return this.dialogs;
    }

    static name() {
        return "/greeting";
    }

    static match() {
        return /!greeting/i;
    }
}
module.exports = GreetingDialog;