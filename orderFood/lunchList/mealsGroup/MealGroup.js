class MealGroup {
  constructor(meals) {
    this._meals = meals;
  }

  get meals() {
    return this._meals;
  }
}
module.exports = MealGroup;
