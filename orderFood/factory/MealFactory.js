var FirstMeal = require('./lunchList/meals/FirstMeal.js');
var SecondMeal = require('./lunchList/meals/SecondMeal.js');
var SaladMeal = require('./lunchList/meals/SaladMeal.js');

class MealFactory {
  constructor() {}
  static getMeal(mealClass, mealName) {
    if (mealClass instanceof FirstMeal) {
      return new FirstMeal(mealName);
    } else
    if (mealClass instanceof SecondMeal) {
      return new SecondMeal(mealName);
    } else
    if (mealClass instanceof SaladMeal) {
      return new SaladMeal(mealName);
    } else {
      return null;
    }
  }
}
module.exports = MealFactory;
