var FirstMeal = require('../lunchList/meals/FirstMeal.js');
var SecondMeal = require('../lunchList/meals/SecondMeal.js');
var SaladMeal = require('../lunchList/meals/SaladMeal.js');

class MealFactory {
  constructor() {}
  static getMeal(mealClass, mealName) {
    if (mealClass === "FirstMeal") {
      return new FirstMeal(mealName);
    } else
    if (mealClass ===  "SecondMeal") {
      return new SecondMeal(mealName);
    } else
    if (mealClass ===  "SaladMeal") {
      return new SaladMeal(mealName);
    } else {
      return null;
    }
  }
}
module.exports = MealFactory;
