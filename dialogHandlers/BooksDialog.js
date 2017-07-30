/**
 * Created by charea on 23.07.2017.
 */

var builder = require('botbuilder');
var Logger = require('../logger/logger');
var request = require('request');
<<<<<<< HEAD
class Books {
    constructor() {
        Logger.logger().info("Creating Books Dialog");
        this.dialogs = [
            Books.showBooks
        ];
    }

    static showMsg(session){
        session.send("test");
    }

    static showBooks(session){
        var card = {
            'contentType': 'application/vnd.microsoft.card.adaptive',
            'content': {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "0.5",
                "body": [
                    {
                        "type": "ColumnSet",//table header column
                        "columns": [
                            {
                                "type": "Column",
                                "size": "60",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "horizontalAlignment": "center",
                                        "wrap": false,
                                        "weight":"bolder",
                                        "size":"medium",
                                        "text": "Title",
                                        "separation":"strong"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "size": "10",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "horizontalAlignment": "center",
                                        "wrap": false,
                                        "weight":"bolder",
                                        "size":"medium",
                                        "text": "Year",
                                        "separation":"strong"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "size": "10",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "horizontalAlignment": "center",
                                        "wrap": false,
                                        "weight":"bolder",
                                        "size":"medium",
                                        "text": "Action",
                                        "separation":"strong"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "ColumnSet",//--------------------
                        "columns": [
                            {
                                "type": "Column",
                                "size": "60",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "wrap": false,
                                        "text": "Warehouse Management: A Complete Guide to Improving Efficiency and Minimizing Costs in the Modern Warehouse 2nd Edition",
                                        "horizontalAlignment":"left"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "size": "10",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "horizontalAlignment": "center",
                                        "wrap": false,
                                        "text": "2014"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "size": "10",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "size": "larger",
                                        "horizontalAlignment": "center",
                                        "wrap": false,
                                        "text": "Info",
                                        "color" : "accent"
                                    }
                                ],
                                "selectAction": {
                                    "type": "Action.OpenUrl",
                                    "url": "http://www.microsoft1122.com"
                                }
                            }
                        ]
                    },
                    {
                        "type": "ColumnSet",//--------------------
                        "columns": [
                            {
                                "type": "Column",
                                "size": "60",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "wrap": false,
                                        "text": "Test-Driven Development",
                                        "horizontalAlignment":"left"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "size": "10",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "horizontalAlignment": "center",
                                        "wrap": false,
                                        "text": "2014"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "size": "10",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "size": "larger",
                                        "horizontalAlignment": "center",
                                        "wrap": false,
                                        "text": "Info",
                                        "color" : "accent"
                                    }
                                ],
                                "selectAction": {
                                    "type": "Action.OpenUrl",
                                    "url": "http://www.microsoft1122.com"
                                }
                            }
                        ]
                    }
                ]
            }
        };

        //book view
        var card = {
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
        };

        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
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
