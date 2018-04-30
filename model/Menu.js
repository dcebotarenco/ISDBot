var Logger = require('../logger/logger');
var builder = require('botbuilder');
/**
 * Created by aumanet on 23/03/2018.
 */

class Menu{
    //title --1,2,3,post,dieta...
    //provider -- bistro, don taco ...
    //sizes -- [s],[m],[s,m] ...
    //firstMeal
    //secondMeal
    //garnish --garnitura
    //number 1...10


    constructor(title, provider, sizes, firstMeal, secondMeal, garnish, date, number) {
        this.title = title;
        this.provider = provider;
        this.sizes = sizes;
        this.firstMeal = firstMeal;
        this.secondMeal = secondMeal;
        this.garnish = garnish;
        this.date = date;
        this.number = number;
    }

    set session(session){
        this._session = session;
    }

    set title(title){
        this._title = title;
    }

    set provider(provider){
        this._provider = provider;
    }

    set sizes(sizes){
        this._sizes = sizes;
    }

    set firstMeal(firstMeal){
        this._firstMeal = firstMeal;
    }

    set secondMeal(secondMeal){
        this._secondMeal = secondMeal;
    }

    set garnish(garnish){
        this._garnish = garnish;
    }

    set date(date){
        this._date = date;
    }

    set number(number){
        this._number = number;
    }

    get session(){
        return this._session;
    }

    get title(){
        return this._title;
    }

    get provider(){
        return this._provider;
    }

    get sizes(){
        return this._sizes;
    }

    get firstMeal(){
        return this._firstMeal;
    }

    get secondMeal(){
        return this._secondMeal;
    }

    get garnish(){
        return this._garnish;
    }

    get number(){
        return this._number;
    }

}
module.exports = Menu;