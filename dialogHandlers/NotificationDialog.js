/**
 * Created by charea on 09.08.2017.
 */
// var builder = require('botbuilder');
var Logger = require('../logger/logger');
// var moment = require('moment');
// var google = require('../google/googleConnection');

class NotificationDialog {
    constructor() {
        Logger.logger().info("Creating NotificationDialog Dialog");
        this.dialogs = [
            NotificationDialog.fetchAllNotifications
        ];
    }

    static fetchAllNotifications(session, results, next) {
        session.endDialog("Turning off..");
    }

    static name() {
        return "/notification";
    }

    get dialog() {
        return this.dialogs;
    }


    static match() {
        return /notification/i;
    }
}
module.exports = NotificationDialog;
