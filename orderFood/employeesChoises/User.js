class User {
  constructor(id, skypeName, fullName) {
    this._id = id;
    this._skypeName = skypeName;
    this._fullName = fullName;
    this._dayChoiceMap = new Map();
  }

  get id() {
    return this._id;
  }

  get skypeName() {
    return this._skypeName;
  }
  get fullName() {
    return this._fullName;
  }

  get dayChoiceMap() {
    return this._dayChoiceMap;
  }

  addListOfChoicesPerDay(dayChoice, choices) {
    this._dayChoiceMap.set(dayChoice, choices);
  }

  getChoiceMapByDayChoice(dayChoice) {
    return this._dayChoiceMap.get[dayChoice];
  }
}
module.exports = User;