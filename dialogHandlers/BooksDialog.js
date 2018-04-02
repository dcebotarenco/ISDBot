/**
 * Created by charea on 23.07.2017.
 */

var builder = require('botbuilder');
var Logger = require('../logger/logger');
var request = require('request');
var BookView = require('../viewBooks/BookView');
var BooksView = require('../viewBooks/BooksView');
var BookStatusView = require('../viewBooks/BookStatusView');
var BooksController = require('../google/BooksController');
var UsersController = require('../google/UsersController');
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
        if(session.message.text.match(/books status/i)){
            BooksDialog.showBooksForCurrentUser(session);
        }else if(session.message.text.match(/books[\d]+/i)){
            BooksDialog.showBook(session);
        }else if (session.message.text.match(/books/i)){
            BooksDialog.showAllBooks(session);
        }
    }

    static showAllBooks(session) {
        var msg = new builder.Message(session).addAttachment(new BooksView(session, session.userData.books).message);
        session.endDialog(msg);
    }

    static showBooksForCurrentUser(session) {
        var user = UsersController.getUserById(session.userData.users, session.message.user.id);
        var userBooks = BooksController.getUsersCurrentBook(session.userData.books, user);
        var userQueueBooks = BooksController.getUsersCurrentQueueBooks(session.userData.books, user);
        var cards = new BookStatusView(session, userBooks).message;
        var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);
        session.endDialog(msg);
    }

    static showBook(session) {
        let bookId = session.message.text.substr(5);
        let book = session.userData.books[bookId-1];
        let msg = new builder.Message(session).addAttachment(new BookView(session, book).message);
        session.endDialog(msg);
    }

    static isUserRegistered(session, results, next) {
        google.fetchRegisteredEmployees((response) => BooksDialog.onEmployeesFetched(session, results, next, response.values));
    }

    static onEmployeesFetched(session, results, next, rows) {
        let employeeList = ModelBuilder.createRegisteredEmployees(rows);
        session.userData = {'users': employeeList};
        if (employeeList.filter(function (employee) {
                return session.message.address.user.id === employee.id;
            }).length === 0) {
            session.endDialog("Sorry. You are not registered. Contact Administrator")
        }
        next();
    }

    static booksFetch(session, results, next) {
        google.fetchGoogleSheet(process.env.G_SPREADSHEET_ID, booksSheetName, 'ROWS', (response) => BooksDialog.onBooksReceived(session, next, response.values));
    }

    static onBooksReceived(session, next, rows){
        Logger.logger().info("BooksDialog: Books Received");
        let books = ModelBuilder.createBooksModel(rows);
        session.userData.books = books;
        next();
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
