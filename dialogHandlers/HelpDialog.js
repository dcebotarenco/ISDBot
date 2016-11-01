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
            .textFormat(builder.TextFormat.markdown)
            .attachments([
                new builder.HeroCard(session)
                    .title("Help")
                    .subtitle("Commands you can run:")
                    .text("food,\nfood (today|mo|tu|we|th|fr),\nfood cancel (today|mo|tu|we|th|fr),\nhelp,\nhi,\nbye")
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