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
            BooksDialog.isUserRegistered,
            BooksDialog.booksFetch,
            BooksDialog.resolveAction
        ];
    }

    static resolveAction(session){
        Logger.logger().info("Resolving BooksDialog Dialog");
        if (session.message.text.match(/books/i)){
            BooksDialog.showAllBooks(session);
        }else if(session.message.text.match(/books status/i)){

        }

    }

    static isUserRegistered(session, results, next) {
        google.fetchRegisteredEmployees((response) => BooksDialog.onEmployeesFetched(session, results, next, response.values));
    }

    static onEmployeesFetched(session, next, rows) {
        let employeeList = ModelBuilder.createRegisteredEmployees(rows);
        if (employeeList.filter(function (employee) {
                return session.message.address.user.id === employee.id;
            }).length === 0) {
            session.endDialog("Sorry. You are not registered. Contact Administrator")
        }
        next();
    }

    static booksFetch(session, next) {
        google.fetchGoogleSheet(process.env.G_SPREADSHEET_ID, booksSheetName, 'ROWS', (response) => BooksDialog.saveBooksInSession(session, next));
    }

    static saveBooksInSession(session, next){
        Logger.logger().info("BooksDialog: Books Received");
        let books = ModelBuilder.createBooksModel(rows);
        session.userData = {'books': books};
        next();
    }

    static showAllBooks(session, rows) {
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
        return /books| (books[\d]+) | (books status)/i;
    }
}

module.exports = BooksDialog;
