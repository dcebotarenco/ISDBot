/**
 * Created by charea on 23.07.2017.
 */
class Book{
    constructor(id, title, author, publisher, year, reader, queue, urlInfo, urlImg, comments){
        this._id = id;
        this._title = title;
        this._author = author;
        this._publisher = publisher;
        this._year = year;
        this._reader = reader;
        this._queue = queue;
        this._urlInfo = urlInfo;
        this._urlImg = urlImg;
        this._comments = comments;

    }

    get id(){
        return this._id;
    }

    get title(){
        return this._title;
    }

    get author(){
        return this._author;
    }

    get publisher(){
        return this._publisher;
    }

    get year(){
        return this._year;
    }

    get reader(){
        return this._reader;
    }

    get queue(){
        return this._queue;
    }

    get urlInfo(){
        return this._urlInfo;
    }

    get urlImg(){
        return this._urlImg;
    }

    get comments(){
        return this._comments;
    }
}
module.exports = Book;