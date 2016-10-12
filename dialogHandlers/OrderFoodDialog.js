var builder = require('botbuilder');
var Logger = require('../logger/logger');
var google = require('../google/googleConnection');
var CalendarUtil = require('../util/CalendarUtil');
var DayFactory = require('../view/DayFactory');
var ModelBuilder = require('../modelBuilder/ModelBuilder');
var menuSheetName = 'Lunch Menu';
class OrderFoodDialog {

    constructor() {
        Logger.logger().info("Creating OrderFood Dialog");
        this.dialogs = [
            OrderFoodDialog.isUserRegistered,
            OrderFoodDialog.fetchMenu,
            OrderFoodDialog.fetchEmployeeChoices,
            OrderFoodDialog.askUserForMeal
        ];
    }

    static isUserRegistered(session, results, next) {
        google.fetchRegisteredEmployees((response) => OrderFoodDialog.onEmployeesFetched(session, results, next, response.values));
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

    static fetchMenu(session, results, next) {
        Logger.logger().info("Gather all data from [%s]", menuSheetName);
        google.fetchGoogleSheet(process.env.G_SPREADSHEET_ID, menuSheetName, 'COLUMNS', (response) => OrderFoodDialog.onMenuReceived(session, results, next, response.values));
    }

    static onMenuReceived(session, results, next, columns) {
        //create Model
        // save(session,days,false);
        //add Model to Session
        let sheet = ModelBuilder.createMenuModelSheet(columns);
        session.dialogData.sheet = sheet;
        var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        Logger.logger().info('Today: %s', today);

        if (sheet.updateDate.getWeek() === today.getWeek()) {
            Logger.logger().info('Sheet week[%s] is in today week[%s]', sheet.updateDate.getWeek(), today.getWeek());
            session.dialogData.upToDate = true;
            Logger.logger().info('Update date is OK!');
        } else {
            Logger.logger().info('Sheet week[%s] is not in today week[%s]', sheet.updateDate.getWeek(), today.getWeek());
            session.dialogData.upToDate = false;
            Logger.logger().warn('Update date is not in interval!');
            session.endDialog("Seems that the lunch list was not updated yet");
        }
        next();
    }

    static askUserForMeal(session, results, next) {
        let day = DayFactory.buildDay(session, session.dialogData.sheet.getDayByDate(new Date()));
        builder.Prompts.choice(session, day.msg, day.choises);
    }

    static fetchEmployeeChoices(session, results, next) {
        var month = new Date().toLocaleString("en-us", {month: "long"});
        var year = new Date().getFullYear();
        var choiceSheetName = month + " " + year;
        Logger.logger().info("Gather all data from [%s]", choiceSheetName);
        google.fetchGoogleSheet(process.env.G_SPREADSHEET_ID, menuSheetName, 'ROWS', (response) => OrderFoodDialog.onChoicesReceived(session, results, next, response.values));
    }

    static onChoicesReceived(session, results, next, rows) {
        Logger.logger().info("OrderFoodDialog.onChoiceReceived");
        let choices = ModelBuilder.createChoiceModelSheet(rows, session);
        session.dialogData.choices = choices;
        next();
    }

    get dialog() {
        return this.dialogs;
    }

    static name() {
        return "/orderfood";
    }

    static match() {
        return /!(!orderfood cancel (mo|tu|we|th|fr))|(!orderfood (mo|tu|we|th|fr))|(!orderfood)/i;
    }
}
module.exports = OrderFoodDialog;