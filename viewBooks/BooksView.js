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
                        {
                            "type": "TextBlock",
                            "size": "larger",
                            "horizontalAlignment": "center",
                            "wrap": false,
                            "text": "Info",
                            "color": "accent"
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

    createColumnSet(book){
        var columnSet;
        columnSet.type = "ColumnSet";
        columnSet.column.appendChild(createColumn(60, "left", "normal", book.title));
        columnSet.column.appendChild(createColumn(60, "left", "normal", book.author));
        columnSet.column.appendChild(createColumn(60, "left", "normal", "Info"));
        return columnSet;
    }

    createColumn(size, txtAlignment, wight, text){
        column.type = "Column";
        column.size = size;
        column.itemType = "TextBlock";
        column.horizontalAlignment = txtAlignment;
        column.weight = wight;
        column.text = text;
        return column ;
    }

    get msg() {
        return this.message;
    }
}

module.exports = BooksView;