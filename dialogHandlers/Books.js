/**
 * Created by charea on 23.07.2017.
 */

var builder = require('botbuilder');
var Logger = require('../logger/logger');
var request = require('request');
class Books {
    constructor() {
        Logger.logger().info("Creating Books Dialog");
        this.dialogs = [
            Books.showMsg
        ];
    }

    static showMsg(session){
        session.send("test");
    }


    get dialog() {
        return this.dialogs;
    }

    static name() {
        return "/books";
    }

    static match() {
        return /books/i;
    }
}
module.exports = Books;