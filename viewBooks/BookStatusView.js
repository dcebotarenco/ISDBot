/**
 * Created by aumanet on 23.07.2017.
 */
var builder = require('botbuilder');

class BookStatusView {
    constructor(session, books) {
        this.session = session;
        this.books = books;
        this.message = this._buildMessage();
    }

    _buildMessage() {
        var message = [];
        this.books.forEach(function (book) {
            var oneBookView = BookStatusView._buildOneBookView(book);
            message.push(oneBookView);
        })
        return message;
    }

    static _buildOneBookView(book) {
        var buttonText = "Get in queue";
        if(book._reader == "")
            buttonText = "Barrow book";

        var bookView = {
            'contentType': 'application/vnd.microsoft.card.adaptive',
            'content': {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "0.5",
                "body": [
                    {
                        "type": "TextBlock",
                        "wrap": "true",
                        "text": book._title,
                        "weight": "bolder",
                        "size": "large"
                    },
                    {
                        "type": "ColumnSet",
                        "columns": [
                            {
                                "type": "Column",
                                "size": 60,
                                "items": [
                                    {
                                        "type": "FactSet",
                                        "facts": [
                                            {
                                                "title": "Author:",
                                                "value": book._author
                                            },
                                            {
                                                "title": "Year:",
                                                "value": book._year
                                            },
                                            {
                                                "title": "Publisher:",
                                                "value": book._publisher
                                            },
                                            {
                                                "title": "People in queue:",
                                                "value": book._queue
                                            },
                                            {
                                                "title": "Now reading:",
                                                "value": book._reader
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "size": 40,
                                "items": [
                                    {
                                        "type": "Image",
                                        "size": "stretch",
                                        "url": book._urlImg
                                    }
                                ],
                                "selectAction": {
                                    "type": "Action.OpenUrl",
                                    "data": book._urlInfo
                                }
                            }
                        ]
                    }
                ],
                "actions": [
                    {
                        "type": "Action.OpenUrl",
                        "title": buttonText,
                        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    }
                ]
            }
        };
        return bookView;
    }

    get msg() {
        return this.message;
    }
}

module.exports = BookStatusView;