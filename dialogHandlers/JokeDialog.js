/**
 * Created by dcebotarenco on 10/15/2016.
 */
var builder = require('botbuilder');
var Logger = require('../logger/logger');
var request = require('request');
class JokeDialog {
    constructor(settings) {
        Logger.logger().info("Creating Greeting Dialog");
        this.dialogs = [
            (session) => JokeDialog.sendJoke(session, settings)
        ];
    }

    static sendJoke(session, settings) {
        request(settings.getValueByKey('jokes_url'), (error, response, body)=> function (error, response, body, session) {
            let bodyObj = JSON.parse(body);
            session.endDialog("Hey Dude , here is a joke .. lmao.. " + bodyObj.value.joke.replace(/(&quot\;)/g, "\"") + " :D");
        }(error, response, body, session));
    }

    get dialog() {
        return this.dialogs;
    }

    static name() {
        return "/jokes";
    }

    static match() {
        return /!jokes/i;
    }
}
module.exports = JokeDialog;