class Choice {
  /*choiceMenuName stands for 'S' or 'M'*/
  constructor(choiceMenuNumber, choiceMenuName, choiceDay, user, rowNumber) {
    this._choiceMenuNumber = choiceMenuNumber;
    this._choiceMenuName = choiceMenuName;
    this._choiceDay = choiceDay;
    this._user = user;
    this._rowNumber = rowNumber;
  }

  get choiceMenuNumber() {
    return this._choiceMenuNumber;
  }

  get choiceMenuName() {
    return this._choiceMenuName;
  }

  get choiceDay() {
    return this._choiceDay;
  }

  get user() {
    return this._user;
  }

  set user(user) {
    this._user = user;
  }

  set choiceDay(day) {
    this._choiceDay = day;
  }
}
module.exports = Choice;


