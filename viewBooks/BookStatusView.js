/**
 * Created by aumanet on 23.07.2017.
 */
let BookView = require('./BookView');

class BookStatusView {
    constructor(session, readingBooks) {
        this.session = session;
        this.readingBooks = readingBooks;
        this.message = this._buildMessage();
    }

    _buildMessage() {
        var message = [];
        this.readingBooks.forEach(function (book) {
            var oneBookView = BookStatusView._buildOneBookView(book);
            message.push(oneBookView);
        });
        return message;
    }

    static _buildOneBookView(book) {
        return new BookView(this.session, book).message;
    }

    get msg() {
        return this.message;
    }
}

module.exports = BookStatusView;