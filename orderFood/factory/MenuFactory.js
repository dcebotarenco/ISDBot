var FirstMenu = require('../lunchList/menus/FirstMenu.js');
var SecondMenu = require('../lunchList/menus/SecondMenu.js');
var PostMenu = require('../lunchList/menus/PostMenu.js');
var DietMenu = require('../lunchList/menus/DietMenu.js');

class MenuFactory {
    constructor() {
    }

    static getMenu(menuClass, menuName, meals) {
        if (menuClass === "FirstMenu") {
            return new FirstMenu(menuName, meals);
        } else if (menuClass === "SecondMenu") {
            return new SecondMenu(menuName, meals);
        } else if (menuClass === "PostMenu") {
            return new PostMenu(menuName, meals);
        } else if (menuClass === "DietMenu") {
            return new DietMenu(menuName, meals);
        } else {
            return null;
        }
    }
}
module.exports = MenuFactory;
