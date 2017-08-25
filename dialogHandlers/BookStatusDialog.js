/**
 * Created by aumanet on 30.07.2017.
 */
var book = require('../viewBooks/Book');
var bookStatusView = require('../viewBooks/bookStatusView');
var builder = require('botbuilder');
var Logger = require('../logger/logger');
var request = require('request');

class BookStatusDialog {
    constructor() {
        Logger.logger().info("Creating Books Dialog");
        this.dialogs = [
            BookStatusDialog.showBooks
        ];
    }

    static showBooks(session) {
        var books = session.userData.books;
        var cards = new bookStatusView(session, books).message;
        var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);
        session.endDialog(msg);
    }

    get dialog() {
        return this.dialogs;
    }

    static getCurrentUser(session){
        var userId = session.message.user.id;
    }

    static name() {
        return "/bookStatus";
    }

    static match() {
        return /book status/i;
    }
}

module.exports = BookStatusDialog;
