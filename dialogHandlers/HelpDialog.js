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
                new builder.HeroCard(session)
                    .title('hi')
                    .text('Say \'hi\' when you what to see the greeting message'),
                new builder.HeroCard(session)
                    .title('bye')
                    .text('Say \'bye\' when you want to end current conversation'),
                new builder.HeroCard(session)
                    .title('help')
                    .text('Say \'help\' when you forgot the commands')
                , new builder.HeroCard(session)
                    .title('food')
                    .text('Say \'food\' when you want to order meal for today')
                , new builder.HeroCard(session)
                    .title('food (today|mo|tu|we|th|fr)')
                    .text('Say \'food fr\' when you want to order meal for Friday')
                , new builder.HeroCard(session)
                    .title('food cancel (today|mo|tu|we|th|fr)')
                    .text('Say \'food cancel mo\' when you want to cancel your meal for Monday')
                , new builder.HeroCard(session)
                    .title('food status (today|mo|tu|we|th|fr)')
                    .text('Say \'food status today\' when you want to cancel your meal for Today')
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