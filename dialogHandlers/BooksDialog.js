/**
 * Created by charea on 23.07.2017.
 */

var builder = require('botbuilder');
var Logger = require('../logger/logger');
var request = require('request');
var google = require('../google/googleConnection');
var ModelBuilder = require('../modelBuilder/ModelBuilder');
var booksSheetName = "Physical library";
class BooksDialog {
    constructor() {
        Logger.logger().info("Creating BooksDialog Dialog");
        this.dialogs = [
            BooksDialog.fetchBooks
        ];
    }

    static fetchBooks(session, results, next) {
        Logger.logger().info("BooksDialog: Gather all data from [%s]", booksSheetName);
        google.fetchGoogleSheet(process.env.G_SPREADSHEET_ID, booksSheetName, 'ROWS', (response) => BooksDialog.onBooksReceived(session, results, next, response.values));
    }

    static onBooksReceived(session, results, next, rows) {
        Logger.logger().info("BooksDialog: Books Received");
        let choicesSheet = ModelBuilder.createBooksModelSheet(rows);
        // session.dialogData.choicesSheet = choicesSheet;

        // next();
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