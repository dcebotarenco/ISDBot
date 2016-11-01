/**
 * Created by dcebotarenco on 10/6/2016.
 */
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
            .attachments([
                new builder.ReceiptCard(session)
                    .title('Commands you can run')
                    .facts([
                        builder.Fact.create(session, 'hi', 'Hello'),
                        builder.Fact.create(session, 'bye', 'End a conversation'),
                        builder.Fact.create(session, 'food', 'Order food for today'),
                        builder.Fact.create(session, 'food (today|mo|tu|we|th|fr)', 'Order food for a specific day'),
                        builder.Fact.create(session, 'food cancel (today|mo|tu|we|th|fr)', 'Cancel a Order for a specific day')
                    ])
                    .items([

                    ])
            ]);
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