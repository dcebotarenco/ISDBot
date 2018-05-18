/**
 * Created by charea on 18.05.2018.
 */
var builder = require('botbuilder');
var Logger = require('../logger/logger');
class SendMessageToUser {
    constructor() {
        Logger.logger().info("Creating Send msg to user dialog");
        this.dialogs = [
            SendMessageToUser.sendMsg
        ];
    }

    static sendMsg(session) {
        session.endDialog(session.options.dialogArgs);
    }

    get dialog() {
        return this.dialogs;
    }

    static name() {
        return "/sendMsgToUser";
    }

    static match() {
        return /sendMsgToUser/i;
    }
}
module.exports = SendMessageToUser;