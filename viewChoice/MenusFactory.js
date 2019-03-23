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
            let mealGroup = [menuObj.menu._secondMeal, menuObj.menu._garnish];
            if (menuObj.menuName === 'M') mealGroup.push(menuObj.menu._firstMeal);
            let name = menuObj.menu._provider + " " + menuObj.menu._title;
            let nr = menuObj.menuNumber + menuObj.menuName;
            let title = name + " (" + nr + ")";
            buttonList.push(new Button(session, nr, nr));
            menuList.push(new Menu(session, title, nr, mealGroup, buttonList, menuObj.menu._menuUrl, menuObj.menu._imgUrl));
        });
        let dayMenu = new MenusView(session, menuList);
        Logger.logger().info("View of Menus created");
        return dayMenu;
    }
}

module.exports = MenusFactory;
