class WorkingDay {
  constructor(date, columnNumber) {
    this._date = date;
    this._columnNumber = columnNumber;
    this._choices = [];
  }
  get date() {
    return this._date;
  }

  get columnNumber() {
    return this._columnNumber;
  }

  get choicesList() {
    return this._choices;
  }

  insertChoices(choiceList) {
    this._choices.push.apply(this._choices, choiceList);
  }
}
module.exports = WorkingDay;


