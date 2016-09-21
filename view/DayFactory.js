/**
 * Created by dcebotarenco on 9/19/2016.
 */
var Button = require('../view/Button');
var Menu = require('../view/Menu');
var Day = require('../view/Day');
var Logger = require('../logger/logger');

class DayFactory {
    static buildDay(session) {
        Logger.logger().info("Building Day Menus");


        let menuName = 'Diet';
        let dietMealList = [];
        dietMealList.push("Meal A");
        dietMealList.push("Meal B");
        dietMealList.push("Meal C");

        let buttonList = [];
        buttonList.push(new Button(session, '4', "S"));
        buttonList.push(new Button(session, '4', "M"));
        let menuList = [];
        menuList.push(new Menu(session, menuName, dietMealList, buttonList));
        let dayMenu = new Day(session, menuList);


        Logger.logger().info("Building Day Menus Done");
        return dayMenu;
    }
}

module.exports = DayFactory