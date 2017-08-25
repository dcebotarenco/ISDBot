/**
 * Created by aumanet on 23.07.2017.
 */
var builder = require('botbuilder');

class BooksView {
    constructor(session, bookList) {
        this.session = session;
        this.bookList = bookList;
        this.message = this._buildBooks();
    }

    _buildBooks() {
        var message = {
            'contentType': 'application/vnd.microsoft.card.adaptive',
            'content': {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "0.5",
                "body" : [
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
                                        "weight": "bolder",
                                        "size": "medium",
                                        "text": "Title",
                                        "separation": "strong"
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
                                        "weight": "bolder",
                                        "size": "medium",
                                        "text": "Year",
                                        "separation": "strong"
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
                                        "weight": "bolder",
                                        "size": "medium",
                                        "text": "Action",
                                        "separation": "strong"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        };

        this.bookList.forEach(function(book){
            var color = "http://i.imgur.com/gDRUIPN.jpg";//"warning";
            if(book.reader == "") {
                color = "http://i.imgur.com/AzVUbUD.jpg";//"accent";
            }

            var bookRow = {
                "type": "ColumnSet",//--------------------
                "columns": [
                {
                    "type": "Column",
                    "size": "60",
                    "items": [
                        {
                            "type": "TextBlock",
                            "wrap": false,
                            "text": book.title,
                            "horizontalAlignment": "left"
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
                            "text": book.year
                        }
                    ]
                },
                {
                    "type": "Column",
                    "size": "10",
                    "items": [
                        /*{
                            "type": "TextBlock",
                            "size": "larger",
                            "horizontalAlignment": "center",
                            "wrap": false,
                            "text": "Info",
                            "color": color
                        }*/
                        {
                            "type": "Image",
                            "size": "auto",
                            "url": color//"http://www.downloadclipart.net/svg/16146-yellow-rectangle-button-svg.svg"
                        }
                    ],
                    "selectAction": {
                        "type": "Action.Submit",
                        "data": "book"+book.id
                    }
                }
            ]
            };
            message.content.body.push(bookRow);
        });
        return message;
    }

    get msg() {
        return this.message;
    }
}

module.exports = BooksView;