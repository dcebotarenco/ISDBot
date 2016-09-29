var SMealGroup = require('../lunchList/mealsGroup/SMealGroup.js');
var MMealGroup = require('../lunchList/mealsGroup/MMealGroup.js');

class MealGroupFactory {
  constructor() {}

  static getMealGroup(mealGroupClass, meals) {
    if (mealGroupClass=== "SMealGroup") {
      return new SMealGroup(meals);
    } else
    if (mealGroupClass === "MMealGroup") {
      return new MMealGroup(meals);
    } else {
      return null;
    }
  }
}
module.exports = MealGroupFactory;
