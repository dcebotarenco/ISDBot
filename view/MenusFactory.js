/**
 * Created by dcebotarenco on 9/19/2016.
 */
var Button = require('../view/Button');
var Menu = require('../view/Menu');
var MenusView = require('../view/MenusView');
var Logger = require('../logger/logger');
var builder = require('botbuilder');

class MenusFactory {
    static buildMenus(session, day) {
        Logger.logger().info("Building Day Menus View");
        let menuList = [];
        day.menuList.forEach(function (menu) {
            let buttonList = [];
            menu.mealGroups.forEach(function (group) {
                buttonList.push(new Button(session, group.constructor.name, group.groupName));
            });
            let menuMealsWithName = menu.mealsList.filter(function (meal) {
                return meal.name.length > 0;
            });
            if (menuMealsWithName.length > 0) {
                menuList.push(new Menu(session, menu.name, menu.constructor.name, menu.mealsList, buttonList));
            }
        });
        let dayMenu = new MenusView(session, menuList);
        Logger.logger().info("View of Menus created");
        return dayMenu;
    }

    static buildMenusForDay(session, dayMenus) {
        Logger.logger().info("Building Day Menus View");
        let menuList = [];
        dayMenus.forEach(function (menu) {
            let buttonList = [];
            menu.sizes.forEach(function (size) {
                buttonList.push(builder.CardAction.imBack(session, menu.number+size, size));
                //buttonList.push(new Button(session, size, size));
            });
            let menuMealsWithName = [menu.firstMeal, menu.secondMeal, menu.garnish];
            if (menuMealsWithName.length > 0) {
                let title = menu._title;
                menuList.push(new Menu(session, menu.provider + " " + title , menuMealsWithName , menuMealsWithName, buttonList));
            }
        });
        let dayMenu = new MenusView(session, menuList);
        Logger.logger().info("View of Menus created");
        return dayMenu;
    }
}

module.exports = MenusFactory;