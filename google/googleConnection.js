var google = require('googleapis');
var Logger = require('../logger/logger');
var gserviceaccount = process.env.G_SERVICE_ACCOUNT;
var googleKeyPem = process.env.G_KEY_PEM;

var CalendarUtil = require('../util/CalendarUtil');
let MealFactory = require('../orderFood/factory/MealFactory');
let MealsGroupFactory = require('../orderFood/factory/MealsGroupFactory');
let MenuFactory = require('../orderFood/factory/MenuFactory');
let Day = require('../orderFood/lunchList/Day');
let FirstMeal = require('../orderFood/lunchList/meals/FirstMeal');
let SecondMeal = require('../orderFood/lunchList/meals/SecondMeal');
let SaladMeal = require('../orderFood/lunchList/meals/SaladMeal');
let FirstMenu = require('../orderFood/lunchList/menus/FirstMenu');
let SecondMenu = require('../orderFood/lunchList/menus/SecondMenu');
let DietMenu = require('../orderFood/lunchList/menus/DietMenu');
let PostMenu = require('../orderFood/lunchList/menus/PostMenu');

class GoogleConnection {
    constructor() {
    }

    static getConnection() {
        var jwtClient = new google.auth.JWT(
            gserviceaccount,
            null,
            googleKeyPem,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        jwtClient.authorize(function (err, tokens) {
            if (err) {
                Logger.logger().error(err);
                return;
            } else {
                Logger.logger().info("Successfully connected!");
            }
        });
        return jwtClient;
    }

    static fetchMenu(session, results, next, spreadsheetId, callback) {
        var sheets = google.sheets('v4');

        sheets.spreadsheets.values.get({
            auth: this.getConnection(),
            spreadsheetId: spreadsheetId,
            range: 'lunchList',
            majorDimension: "COLUMNS"
        }, function (err, response) {
            if (err) {
                Logger.logger().error('The API returned an error: ' + err);
                return;
            }
            let model = GoogleConnection._createModelSheet(response.values);
            callback(session, results, next, model);
        });
    }

    static _createModelSheet(columns) {
        let firstMealIndexes = [3, 7, 11, 15];
        let secondMealIndexes = [4, 8, 12, 16];
        let saladMealIndexes = [5, 9, 13, 17];
        let updateDate = columns[1][0];
        var monday = CalendarUtil.getMonday(updateDate);        

        let days = [];
        let columnsWithoutFirstColumn = columns.slice(1, 6);
        columnsWithoutFirstColumn.forEach(function (column, index) {


            let mealsPerDay = [];
            column.forEach(function (row,index ) {
                if (firstMealIndexes.filter(function(e){return e === index}).length > 0) {
                    mealsPerDay.push(MealFactory.getMeal("FirstMeal",row));
                }
                if (secondMealIndexes.filter(function(e){return e === index}).length > 0) {
                    mealsPerDay.push(MealFactory.getMeal("SecondMeal",row));
                }
                if (saladMealIndexes.filter(function(e){return e === index}).length > 0) {
                    mealsPerDay.push(MealFactory.getMeal("SaladMeal",row));
                }
            });

            let menu = [
                MenuFactory.getMenu("FirstMenu",mealsPerDay.slice(0,3)),
                MenuFactory.getMenu("SecondMenu",mealsPerDay.slice(3,6)),
                MenuFactory.getMenu("PostMenu",mealsPerDay.slice(6,9)),
                MenuFactory.getMenu("DietMenu",mealsPerDay.slice(9,12))
            ];
            let dayOfWeek = new Date(monday)
            dayOfWeek.setDate(dayOfWeek.getDate() + index);
            days.push(new Day(dayOfWeek, menu));
        });
        return days;
    }
}
module.exports = GoogleConnection;