/****
 ** Created by dcebotarenco on 10/6/2016.
 **/
var builder = require('botbuilder');
var Logger = require('../logger/logger');

class HelpDialog {
    constructor() {
        Logger.logger().info("Creating HelpDialog Dialog");
        this.dialogs = [
            HelpDialog.showHelpCommands
        ];
    }

    static showHelpCommands(session) {
        var msg = new builder.Message(session)
                    .text('Say \'**hi**\' when you what to see the greeting message<br/>' +
                        'Say \'**bye**\' when you want to end current conversation<br/>' +
                        'Say \'**help**\' when you forgot the commands<br/>' +
                        'Say \'**food fr**\' when you want to order meal for Friday<br/>' +
                        'Say \'**food cancel mo**\' when you want to cancel your meal for Monday<br/>' +
                        'Say \'**food status**\' when you want to see your choises for Today');
        session.endDialog(msg);
    }

    get dialog() {
        return this.dialogs;
    }

    static name() {
        return "/help";
    }

    static match() {
        return /help/i;
    }

}
module.exports = HelpDialog;