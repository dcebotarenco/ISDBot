var Logger = require('../logger/logger');
let MealFactory = require('../orderFood/factory/MealFactory');
let MenuFactory = require('../orderFood/factory/MenuFactory');
let Day = require('../orderFood/lunchList/Day');
let Sheet = require('../orderFood/lunchList/Sheet');
let Employee = require('../registration/Employee.js');
let BotSettings = require('../settings/BotSettings.js');
let Choice = require('../orderFood/employeesChoises/Choice');
let WorkingDay = require('../orderFood/employeesChoises/WorkingDay');
let User = require('../orderFood/employeesChoises/User');
let ChoicesSheet = require('../orderFood/employeesChoises/ChoicesSheet');
let SheetUtil = require('../util/SheetUtil');
class ModelBuilder {
    constructor() {
    }

    /**
     * Create Menu Sheet
     * @param columns
     * @returns {Sheet}
     */
    static createMenuModelSheet(columns) {
        let firstMealIndexes = [3, 7, 11, 15];
        let secondMealIndexes = [4, 8, 12, 16];
        let saladMealIndexes = [5, 9, 13, 17];
        let firstMenuName = columns[0][2];
        let secondMenuName = columns[0][6];
        let postMenuName = columns[0][10];
        let dietMenuName = columns[0][14];
        var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        var updateDate = new Date(columns[1][0].replace(pattern, '$3-$2-$1'));
        let days = [];


        let availableColumnsBasedOnUpdateDate = columns.slice(updateDate.getDay(), 6);
        availableColumnsBasedOnUpdateDate.forEach(function (column, index) {
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
                MenuFactory.getMenu("FirstMenu", firstMenuName, mealsPerDay.slice(0, 3)),
                MenuFactory.getMenu("SecondMenu", secondMenuName, mealsPerDay.slice(3, 6)),
                MenuFactory.getMenu("PostMenu", postMenuName, mealsPerDay.slice(6, 9)),
                MenuFactory.getMenu("DietMenu", dietMenuName, mealsPerDay.slice(9, 12))
            ];
            let dayDate = new Date(updateDate.getFullYear(), updateDate.getMonth(), updateDate.getDate() + index);
            days.push(new Day(dayDate, menu));
        });
        return new Sheet(days, updateDate);
    }

    /**
     * Create Employee Choices Sheet
     * @param sheetRows
     * @returns {ChoicesSheet}
     */
    static createChoiceModelSheet(sheetRows) {
        Logger.logger().debug("Creating choice model");

        let workingDays = [];
        Logger.logger().debug("Creating WorkingDay");
        sheetRows[3].forEach(function (date, columnIndex) {
            if (ModelBuilder.isNumeric(date)) {
                let currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), parseInt(date));
                let columnLetter = SheetUtil.columnToLetter(columnIndex + 1);
                Logger.logger().debug("Created a WorkingDay for date [%s] on columns index [%d] and column letter [%s]", currentDate, columnIndex, columnLetter);
                workingDays.push(new WorkingDay(currentDate, columnIndex, columnLetter));
            }
        });

        let users = [];
        sheetRows.forEach(function (row, index, rows) {
            let doesRowExists = row.length > 0;
            if (doesRowExists) {
                Logger.logger().debug("Row Exists");
                let doesRowHaveIdWithAValue = row[0].length > 0;
                if (doesRowHaveIdWithAValue) {
                    Logger.logger().debug("Row has an Id");
                    let id = row[0];
                    let skypeAccount = row[1];
                    let fullName = row[2];
                    let skypeAccountIsValid = skypeAccount.startsWith('live:') || skypeAccount.startsWith('inther_');
                    Logger.logger().debug("Found Row with id[%s],skypeName[%s],fullname[%s]", id, skypeAccount, fullName);
                    if (skypeAccountIsValid) {
                        Logger.logger().debug("Creating user");
                        let user = ModelBuilder.createUser(row, index, rows, workingDays);
                        users.push(user);
                        Logger.logger().debug("User[%s] pushed", user.fullName);
                    } else {
                        Logger.logger().debug('Row [%d] has id but skype account[%s] is not valid', index, skypeAccount);
                    }
                } else {
                    Logger.logger().debug('Row [%d] has no id', index);
                }
            } else {
                Logger.logger().debug('Row [%d] is empty. Next user', index);
            }
        });
        return new ChoicesSheet(workingDays, users);
    }

    /**
     * Creates User
     * @param row google sheet row
     * @param index index of current row
     * @param rows array
     * @param workingWeekDays working days
     * @returns {User}
     */
    static createUser(row, index, rows, workingWeekDays) {
        let id = row[0];
        let skypeAccount = row[1];
        let fullName = row[2];
        Logger.logger().debug("Skype account is valid");
        let user = new User(id, skypeAccount, fullName);
        Logger.logger().debug("User created with id[%s],skypeName[%s],fullname[%s]", id, skypeAccount, fullName);
        Logger.logger().debug("Determining choices for user[%s]..", user.skypeName);
        workingWeekDays.forEach(function (workingDay) {
            let choices = ModelBuilder.getUserChoices(user, workingDay, row, index, rows);
            user.addListOfChoicesPerDay(workingDay, choices);
            workingDay.insertChoices(choices);
        });
        return user;
    }

    /**
     * Gets user choices per a working day, and check if there are more choices for the same user on the next row
     * @param user
     * @param workingDay
     * @param row
     * @param currentRowIndex
     * @param rows
     * @returns {Array}
     */
    static getUserChoices(user, workingDay, row, currentRowIndex, rows) {
        let choices = [];
        Logger.logger().debug("Determining choices for user[%s] for day [%s]", user.skypeName, workingDay.date);
        let firstChoice = row[workingDay.columnNumber];
        if (firstChoice) {
            let choiceMenuNumber = firstChoice.charAt(0);
            let choiceMenuName = firstChoice.charAt(1);
            let choice = new Choice(choiceMenuNumber, choiceMenuName, workingDay, user, currentRowIndex + 1);
            choices.push(choice);
        }
        else {
            let choice = new Choice("", "", workingDay, user, currentRowIndex + 1);
            choices.push(choice);
        }
        Logger.logger().debug("User has [%s] choice [%s] for [%s]", choices.length, firstChoice, workingDay.date);
        Logger.logger().debug("Check next row for new choices for user[%s] and working day[%s]", user.skypeName, workingDay.date);
        for (let nextRowIndex = currentRowIndex + 1; nextRowIndex < rows.length; nextRowIndex++) {
            let isNextRowANewUser = rows[nextRowIndex][2] && rows[nextRowIndex][2].length > 0;
            let isNextRowATotal = rows[nextRowIndex][2] && rows[nextRowIndex][2].includes("Total Main");
            if (!isNextRowANewUser) {
                Logger.logger().debug("Next row is not a new user");
                if (!isNextRowATotal) {
                    Logger.logger().debug("Next row is not totals");
                    let nextChoiceValue = rows[nextRowIndex][workingDay.columnNumber];
                    let nextChoice = null;
                    if (nextChoiceValue) {
                        Logger.logger().debug('Next choice exists in row');
                        let nextChoiceMenuNumber = nextChoiceValue.charAt(0);
                        let nextChoiceMenuName = nextChoiceValue.charAt(1);
                        nextChoice = new Choice(nextChoiceMenuNumber, nextChoiceMenuName, workingDay, user, nextRowIndex + 1)
                        Logger.logger().debug("User has [%s] choice [%s] for [%s]", choices.length, nextChoiceValue, workingDay.date);
                    } else {
                        Logger.logger().debug('Next choice does not exists in row.Creating a dummy empty choice');
                        let nextChoiceMenuNumber = "";
                        let nextChoiceMenuName = "";
                        nextChoice = new Choice(nextChoiceMenuNumber, nextChoiceMenuName, workingDay, user, nextRowIndex + 1)
                    }
                    choices.push(nextChoice);
                } else {
                    Logger.logger().debug('On the next row a totals');
                    break;
                }
            } else {
                Logger.logger().debug('On the next row is a new skype account[%s]. Taking next day for [%s]', rows[nextRowIndex][2], user.skypeName);
                break;
            }
        }
        return choices;
    }

    static  isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    static createRegisteredEmployees(rows) {
        return rows.filter(function (row) {
            return row.length != 0;
        }).map(function (row) {
            return new Employee(row[0], row[1], row[2]);
        }).filter(function (employee) {
            return employee.skypeAccount.startsWith('inther_') || employee.skypeAccount.startsWith('live:')
        });
    }

    static createBotSettings(rows) {
        let settingsMap = new Map();
        rows.filter(function (row) {
            return row.length != 0;
        }).forEach(function (row) {
            settingsMap.set(row[0], row[1]);
        });
        return new BotSettings(settingsMap);
    }
}

module.exports = ModelBuilder;
