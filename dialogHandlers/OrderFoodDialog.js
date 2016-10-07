var builder = require('botbuilder');
var Logger = require('../logger/logger');
var google = require('../google/googleConnection');
var CalendarUtil = require('../util/CalendarUtil');
var spreadsheetId = process.env.G_SPREADSHEET_ID;

var Button = require('../view/Button');
var Menu = require('../view/Menu');
var Day = require('../view/Day');
var DayFactory = require('../view/DayFactory');
var month = new Date().toLocaleString("en-us", {month: "long"});
var year = new Date().getFullYear();
var menuSheetName = 'Lunch Menu';
var choiceSheetName = month + " " + year;
var ModelBuilder = require('../modelBuilder/ModelBuilder');
var rowsMajorDimension = 'ROWS';
var columnsMajorDimension = 'COLUMNS';
class OrderFoodDialog {

    constructor() {
        Logger.logger().info("Creating OrderFood Dialog");
        this.dialogs = [
            OrderFoodDialog.isUserRegistered,
            OrderFoodDialog.fetchMenu,
            OrderFoodDialog.fetchEmployeeChoises,
            OrderFoodDialog.askUserForMeal,
            OrderFoodDialog.handleUserReplayOnMenuNotUpToDate
        ];
    }

    static isUserRegistered(session, results, next) {
        google.fetchRegisteredEmployees(session, results, next, OrderFoodDialog.onEmployeesFetched);
    }

    static onEmployeesFetched(session, results, next, rows) {
        let employeeList = ModelBuilder.createRegisteredEmployees(rows);
        if (employeeList.filter(function (employee) {
                return session.message.address.user.id === employee.id;
            }).length === 0) {
            session.endDialog("Sorry. You are not registered. Contact Administrator")
        }
        next();
    }

    static reply(session, results, next) {
        Logger.logger().info("Reply");
    }

    static askUserForMeal(session, results, next) {
        let day = DayFactory.buildDay(session, session.dialogData.sheet.getDayByDate(new Date()));
        builder.Prompts.choice(session, day.msg, day.choises);
    }

    static isMenuUpToDate(session, results, next) {
        Logger.logger().info("Checking update date");
        google.fetchUpdateDate(session, next, spreadsheetId, OrderFoodDialog.onMenuFetched);
    }

    static onMenuFetched(session, next, menuDate) {
        session.dialogData.updateDate = menuDate;
        Logger.logger().info('Menu Date %s', menuDate);
        var nextFriday = CalendarUtil.getNextFriday(menuDate);
        Logger.logger().info('Next Friday %s', nextFriday);
        var today = new Date(new Date().getYear(), new Date().getMonth(), new Date().getDate());
        Logger.logger().info('Today: %s', today);
        if (menuDate <= today && today < nextFriday) {
            OrderFoodDialog.handleMenuUpToDate(session, next);
        } else {
            OrderFoodDialog.handleMenuNotUpToDate(session);
        }
    }

    static handleMenuNotUpToDate(session, next) {
        Logger.logger().info('Update date is OK!');
        session.dialogData.upToDate = true;
        next();
    }

    static handleMenuUpToDate(session) {
        Logger.logger().warn('Update date is not in interval!');
        session.dialogData.upToDate = false;
        session.send("Seems that the lunch list was not updated yet");
        builder.Prompts.confirm(session, "Are you sure you wish to order anyway?");
    }

    static handleUserReplayOnMenuNotUpToDate(session, results, next) {
        if (!OrderFoodDialog.isMenuUpToDate(session)) {
            Logger.logger().info("User chose '%s'", results.response);
            if (results.response) {
                next();
            } else {
                Logger.logger().info('OrderFoodDialog ended.');
                session.endDialog();
            }
        } else {
            next();
        }
    }

    static isMenuUpToDate(session) {
        return session.dialogData.upToDate;
    }

    static fetchMenu(session, results, next) {
        Logger.logger().info("Gather all data from [%s]", menuSheetName);
        google.fetchGoogleSheet(session, results, next, spreadsheetId, menuSheetName, columnsMajorDimension, OrderFoodDialog.onMenuReceived);
    }

    static onMenuReceived(session, results, next, columns) {
        //create Model
        // save(session,days,false);
        //add Model to Session
        let sheet = ModelBuilder.createMenuModelSheet(columns);
        session.dialogData.sheet = sheet;
        next();
    }

    static fetchEmployeeChoises(session, results, next) {
        Logger.logger().info("Gather all data from [%s]", choiceSheetName);
        google.fetchGoogleSheet(session, results, next, spreadsheetId, choiceSheetName, rowsMajorDimension, OrderFoodDialog.onChoiceReceived);
    }

    static onChoiceReceived(session, results, next, rows) {
        Logger.logger().info("OrderFoodDialog.onChoiceReceived");
        let choises = ModelBuilder.createChoiceModelSheet(rows, session);
        session.dialogData.choises = choises;
        next();
    }

    get dialog() {
        return this.dialogs;
    }

    static name() {
        return "/orderfood";
    }

    static match() {
        return /!orderfood/i;
    }
}
module.exports = OrderFoodDialog;