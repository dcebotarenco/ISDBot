class Choice {
  constructor(date, mealGroup) {
    this.date = date;
    this.mealGroup = mealGroup;
  }

  get date() {
    return this.date;
  }

  get mealGroupList() {
    return this.mealGroup;
  }
}
module.exports = Choice;
