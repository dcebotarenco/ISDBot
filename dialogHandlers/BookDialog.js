/**
 * Created by aumanet on 30.07.2017.
 */
var book = require('../viewBooks/Book');
var bookView = require('../viewBooks/BookView');
var builder = require('botbuilder');
var Logger = require('../logger/logger');
var request = require('request');

class BookDialog {
    constructor() {
        Logger.logger().info("Creating Books Dialog");
        this.dialogs = [
            BookDialog.showBook
        ];
    }

    static showBook(session, results, next) {
        var bookId = session.message.text;
        var book = BookDialog.getBookById(session, bookId.substr(4));
        var msg = new builder.Message(session).addAttachment(new bookView(session, book).message);
        session.endDialog(msg);
    }

    get dialog() {
        return this.dialogs;
    }

    static name() {
        return "/book";
    }

    static match() {
        return /book[\d]+/i;
    }

    static getBookById(session, bookId){
        var books = session.userData.books;
        return books[bookId-1];
    }
}

module.exports = BookDialog;