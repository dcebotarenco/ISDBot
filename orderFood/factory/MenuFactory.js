var FirstMenu = require('./lunchList/menus/FirstMenu.js');
var SecondMenu = require('./lunchList/menus/SecondMenu.js');
var PostMenu = require('./lunchList/menus/PostMenu.js');
var DieteMenu = require('./lunchList/menus/DieteMenu.js');

class MenuFactory {
  constructor() {}
  static getMenu(menuClass, meals, mealGroup) {
    if (menuClass instanceof FirstMenu) {
      return new FirstMenu(meals, mealGroup);
    } else
    if (menuClass instanceof SecondMenu) {
      return new SecondMenu(meals, mealGroup);
    } else
    if (menuClass instanceof PostMenu) {
      return new PostMenu(meals, mealGroup);
    } else
    if (menuClass instanceof DieteMenu) {
      return new DieteMenu(meals, mealGroup);
    } else
    {
      return null;
    }
  }
}
module.exports = MenuFactory;
