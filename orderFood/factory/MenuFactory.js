var FirstMenu = require('../lunchList/menus/FirstMenu.js');
var SecondMenu = require('../lunchList/menus/SecondMenu.js');
var PostMenu = require('../lunchList/menus/PostMenu.js');
var DietMenu = require('../lunchList/menus/DietMenu.js');

class MenuFactory {
  constructor() {}
  static getMenu(menuClass, meals) {
    if (menuClass === "FirstMenu") {
      return new FirstMenu(meals);
    } else
    if (menuClass ===  "SecondMenu") {
      return new SecondMenu(meals);
    } else
    if (menuClass === "PostMenu") {
      return new PostMenu(meals);
    } else
    if (menuClass ===  "DietMenu") {
      return new DietMenu(meals);
    } else
    {
      return null;
    }
  }
}
module.exports = MenuFactory;
