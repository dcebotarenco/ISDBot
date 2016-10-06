/**
 * Created by dcebotarenco on 10/6/2016.
 */
var builder = require('botbuilder');
var Logger = require('../logger/logger');

class HelpDialog
{
    constructor()
    {
        Logger.logger().info("Creating HelpDialog Dialog");
        this.dialogs = [
            HelpDialog.showHelpCommands
        ];
    }

    static showHelpCommands(session)
    {
        session.endDialog("Here are the commands you can run: !orderfood, !help, !greeting");
    }

    get dialog() {
        return this.dialogs;
    }

    static name() {
        return "/help";
    }

    static match() {
        return /!help/i;
    }

}
module.exports = HelpDialog;