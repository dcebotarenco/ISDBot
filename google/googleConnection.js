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
let Sheet = require('../orderFood/lunchList/Sheet');

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
            let sheet = GoogleConnection._createModelSheet(response.values);
            callback(session, results, next, sheet);
        });
    }

    static _createModelSheet(columns) {
        let firstMealIndexes = [3, 7, 11, 15];
        let secondMealIndexes = [4, 8, 12, 16];
        let saladMealIndexes = [5, 9, 13, 17];
        let firstMenuName = columns[0][2];
        let secondMenuName = columns[0][6];
        let postMenuName = columns[0][10];
        let dietMenuName = columns[0][14];

        var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        var updateDate = new Date(columns[1][0].replace(pattern,'$3-$2-$1'));

        let days = [];
        let columnsWithoutFirstColumn = columns.slice(updateDate.getDay(), 6);
        columnsWithoutFirstColumn.forEach(function (column, index) {


            let mealsPerDay = [];
            column.forEach(function (row, index) {
                if (firstMealIndexes.filter(function (e) {
                        return e === index
                    }).length > 0) {
                    mealsPerDay.push(MealFactory.getMeal("FirstMeal", row));
                }
                if (secondMealIndexes.filter(function (e) {
                        return e === index
                    }).length > 0) {
                    mealsPerDay.push(MealFactory.getMeal("SecondMeal", row));
                }
                if (saladMealIndexes.filter(function (e) {
                        return e === index
                    }).length > 0) {
                    mealsPerDay.push(MealFactory.getMeal("SaladMeal", row));
                }
            });

            let menu = [
                MenuFactory.getMenu("FirstMenu",firstMenuName, mealsPerDay.slice(0, 3)),
                MenuFactory.getMenu("SecondMenu",secondMenuName, mealsPerDay.slice(3, 6)),
                MenuFactory.getMenu("PostMenu",postMenuName, mealsPerDay.slice(6, 9)),
                MenuFactory.getMenu("DietMenu",dietMenuName, mealsPerDay.slice(9, 12))
            ];
            let dayDate = new Date(updateDate.getFullYear(), updateDate.getMonth(), updateDate.getDate()+index);
            days.push(new Day(dayDate, menu));
        });
        return new Sheet(days);
    }
}
module.exports = GoogleConnection;