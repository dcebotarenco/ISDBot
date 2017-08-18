/**
 * Created by charea on 23.07.2017.
 */
var book = require('../viewBooks/Book');
var bookView = require('../viewBooks/BookView');
var builder = require('botbuilder');
var Logger = require('../logger/logger');
var request = require('request');
var ModelBuilder = require('../modelBuilder/ModelBuilder');
var google = require('../google/googleConnection');

class BookDialog {
    constructor() {
        Logger.logger().info("Creating Books Dialog");
        this.dialogs = [
            BookDialog.showBook
        ];
    }

    static showBook(session, results, next) {
        var bookId = session.message.text;
        bookId = bookId.substr(4);
        var msg = new builder.Message(session).addAttachment(new bookView(session, bookId).message);
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
}

module.exports = BookDialog;


//book view
/*var card = {
    'contentType': 'application/vnd.microsoft.card.adaptive',
    'content': {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "0.5",
        "body": [
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "size": 2,
                        "items": [
                            {
                                "type": "TextBlock",
                                "wrap": "true",
                                "text": "Warehouse Management: A Complete Guide to Improving Efficiency and Minimizing Costs in the Modern Warehouse 2nd Edition",
                                "weight": "bolder",
                                "size": "extraLarge"
                            },
                            {
                                "type": "FactSet",
                                "speak": "It has been assigned to: David Claux",
                                "facts": [
                                    {
                                        "title": "Author:",
                                        "value": "Gwynne Richards"
                                    },
                                    {
                                        "title": "Year:",
                                        "value": "2014"
                                    },
                                    {
                                        "title": "Publisher:",
                                        "value": "Kogan Page"
                                    },
                                    {
                                        "title": "People in queue:",
                                        "value": "6"
                                    },
                                    {
                                        "title": "Now reading:",
                                        "value": "AUm"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "size": 1,
                        "items": [
                            {
                                "type": "Image",
                                "size": "large",
                                "url": "https://images-na.ssl-images-amazon.com/images/I/51r21QCL5AL._SX330_BO1,204,203,200_.jpg"
                            }
                        ]
                    }
                ]
            }
        ],
        "actions": [
            {
                "type": "Action.OpenUrl",
                "title": "Borrow Book",
                "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            }
        ]
    }
};*/