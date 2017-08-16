/**
 * Created by charea on 23.07.2017.
 */

var builder = require('botbuilder');
var Logger = require('../logger/logger');
var request = require('request');
var BooksView = require('../viewBooks/BooksView');
var google = require('../google/googleConnection');
var booksSheetName = "Physical library";
var ModelBuilder = require('../modelBuilder/ModelBuilder');

class BooksDialog {
    constructor() {
        Logger.logger().info("Creating Books Dialog");
        this.dialogs = [
            BooksDialog.showBooks
        ];
    }

    static showMsg(session){
        session.send("test");
    }

    static showBooks(session) {
        google.fetchGoogleSheet(process.env.G_SPREADSHEET_ID, booksSheetName, 'ROWS', (response) => BooksDialog.onBooksReceived(session, response.values));
    }

    static onBooksReceived(session, rows) {
        Logger.logger().info("BooksDialog: Books Received");
        let books = ModelBuilder.createBooksModel(rows);
        var msg = new builder.Message(session).addAttachment(new BooksView(session, books).message);
        session.endDialog(msg);
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

module.exports = BooksDialog;
