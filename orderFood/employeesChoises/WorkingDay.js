class WorkingDay {
    constructor(date, columnNumber, columnLetter) {
        this._date = date;
        this._columnNumber = columnNumber;
        this._columnLetter = columnLetter;
        this._choices = [];
    }

    get date() {
        return this._date;
    }

    get columnNumber() {
        return this._columnNumber;
    }

    get columnLetter() {
        return this._columnLetter;
    }

    get choicesList() {
        return this._choices;
    }

    insertChoices(choiceList) {
        this._choices.push.apply(this._choices, choiceList);
    }
}
module.exports = WorkingDay;


