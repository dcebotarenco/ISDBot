/**
 * Created by Alexandru on 26-Aug-17.
 */

class BooksController{

    static getUsersCurrentBook(books, user){
        var userBooks = [];
        books.forEach(function (book) {
            if(book.reader === user.initials){
                userBooks.push(book);
            }
        });
        return userBooks;
    }

    static getUsersCurrentQueueBooks(books, user){
        var userQueueBooks = [];
        books.forEach(function (book) {
            if(book.queue.includes(user.initials+","))
                userQueueBooks.push(book);
        })
        return userQueueBooks;
    }

}
module.exports = BooksController;