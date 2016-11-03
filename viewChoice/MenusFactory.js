/**
 * Created by charea on 20.10.2016.
 */

var Button = require('../viewChoice/Button');
var Menu = require('../viewChoice/Menu');
var MenusView = require('../viewChoice/MenusView');
var Logger = require('../logger/logger');
var MealGroupUtil = require('../util/MealGroupUtil');
class MenusFactory {
    static buildMenus(session, menus) {
        Logger.logger().info("Building Day Menus View");
        let menuList = [];

        menus.forEach(function (menuObj) {
            let buttonList = [];
            let mealGroup = menuObj.menu.mealGroups.filter(function (mealGroup) {
               return mealGroup.groupName ==  menuObj.menuName;
            });
            let title = "" + menuObj.menu.name + " (" + menuObj.menuNumber + menuObj.menuName + ")";
            /*not so nice with index, to be changed later : mealGroup[0].meals*/
            buttonList.push(new Button(session, menuObj.menu.constructor.name, menuObj.menuName));
            menuList.push(new Menu(session, title, /*menuObj.menu.name, menuObj.menuNumber.concat(menuObj.menuName),*/ menuObj.menu.constructor.name, mealGroup[0].meals, buttonList));
        });
        let dayMenu = new MenusView(session, menuList);
        Logger.logger().info("View of Menus created");
        return dayMenu;
    }
}

module.exports = MenusFactory;