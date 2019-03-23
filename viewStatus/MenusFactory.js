/**
 * Created by charea on 02.11.2016.
 */
var Menu = require('../viewStatus/Menu');
//var Menu = require('../model/Menu');
var MenusView = require('../viewStatus/MenusView');
var Logger = require('../logger/logger');
var MealGroupUtil = require('../util/MealGroupUtil');

class MenusFactory {
    static buildMenus(session, menus) {
        Logger.logger().info("Building Day Menus View");
        let menuList = [];

        menus.forEach(function (menuObj) {
            let mealGroup = [menuObj.menu._secondMeal, menuObj.menu._garnish];
            if (menuObj.menuName === 'M') mealGroup.push(menuObj.menu._firstMeal);
            let name = menuObj.menu._provider + " " + menuObj.menu._title;
            let nr = menuObj.menuNumber + menuObj.menuName;
            let title = name + " (" + nr + ")";
            /*not so nice with index, to be changed later : mealGroup[0].meals*/
            menuList.push(new Menu(session, title, menuObj.menu.name, mealGroup, menuObj.menu._menuUrl, menuObj.menu._imgUrl));
        });
        let dayMenu = new MenusView(session, menuList);
        Logger.logger().info("View of Menus created");
        return dayMenu;
    }
}

module.exports = MenusFactory;
