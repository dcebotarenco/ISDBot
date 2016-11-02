/**
 * Created by charea on 02.11.2016.
 */
var Menu = require('../viewStatus/Menu');
var MenusView = require('../viewStatus/MenusView');
var Logger = require('../logger/logger');
var MealGroupUtil = require('../util/MealGroupUtil');
class MenusFactory {
    static buildMenus(session, menus) {
        Logger.logger().info("Building Day Menus View");
        let menuList = [];

        menus.forEach(function (menuObj) {
            let mealGroup = menuObj.menu.mealGroups.filter(function (mealGroup) {
                return mealGroup.groupName ==  menuObj.menuName;
            });
            /*not so nice with index, to be changed later : mealGroup[0].meals*/
            menuList.push(new Menu(session, menuObj.menu.name, menuObj.menuNumber.concat(menuObj.menuName), menuObj.menu.constructor.name, mealGroup[0].meals));
        });
        let dayMenu = new MenusView(session, menuList);
        Logger.logger().info("View of Menus created");
        return dayMenu;
    }
}

module.exports = MenusFactory;