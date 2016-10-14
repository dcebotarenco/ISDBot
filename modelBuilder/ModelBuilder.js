var Logger = require('../logger/logger');
let MealFactory = require('../orderFood/factory/MealFactory');
let MenuFactory = require('../orderFood/factory/MenuFactory');
let Day = require('../orderFood/lunchList/Day');
let Sheet = require('../orderFood/lunchList/Sheet');
let Employee = require('../registration/Employee.js');
let BotSettings = require('../settings/BotSettings.js');
let Choice = require('../orderFood/employeesChoises/Choice');
let ChoiceDay = require('../orderFood/employeesChoises/ChoiceDay');
let User = require('../orderFood/employeesChoises/User');
class ModelBuilder {
    constructor() {
    }

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

    static createChoiceModelSheet(rows) {
        Logger.logger().info("Creating choice model");
        let rowIndent = 4;
        let datesAndOtherStuff = rows[3].slice(rowIndent, rows[3].length);
        let choiceDays = [];


        Logger.logger().info("Creating ChoiceDay");
        datesAndOtherStuff.forEach(function (day, index) {
            if (ModelBuilder.isNumeric(day)) {
                let currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), parseInt(day));
                Logger.logger().info("Created a ChoiceDay for date [%s] in position [%d]", currentDate, index + rowIndent);
                choiceDays.push(new ChoiceDay(currentDate, index + rowIndent));
            }
        });


        let users = [];
        rows.forEach(function (row, index, rows) {
            let doesRowExists = row.length > 0;
            if (doesRowExists) {
                Logger.logger().info("Row Exists");
                let doesRowHaveIdWithAValue = row[0].length > 0;
                if (doesRowHaveIdWithAValue) {
                    Logger.logger().info("Row has an Id");
                    let id = row[0];
                    let skypeAccount = row[1];
                    let fullName = row[2];
                    let skypeAccountIsValid = skypeAccount.startsWith('live:') || skypeAccount.startsWith('inther_');
                    Logger.logger().info("Found Row with id[%s],skypeName[%s],fullname[%s]", id, skypeAccount, fullName);
                    if (skypeAccountIsValid) {
                        Logger.logger().info("Skype account is valid");
                        let user = new User(id, skypeAccount, fullName);
                        Logger.logger().info("User created with id[%s],skypeName[%s],fullname[%s]", id, skypeAccount, fullName);
                        Logger.logger().info("Determining choices for user[%s]..", user.skypeName);
                        choiceDays.forEach(function (day) {
                            let choices = [];
                            Logger.logger().info("Determining choices for user[%s] for day [%s]", user.skypeName, day.date);
                            let firstChoice = row[day.columnNumber];
                            let choiceMenuNumber = firstChoice.charAt(0);
                            let choiceMenuName = firstChoice.charAt(1);
                            let choice = new Choice(choiceMenuNumber, choiceMenuName, day, user, index + 1);
                            choices.push(choice);
                            Logger.logger().info("User has [%s] choice [%s] for [%s]", choices.length, firstChoice, day.date);
                            Logger.logger().info("Check next row for new choices for user[%s] and day[%s]", user.skypeName, day.date);
                            for (let nextIndex = index + 1; nextIndex < rows.length; nextIndex++) {
                                let nextRowExists = rows[nextIndex].length > 0;
                                if (nextRowExists) {
                                    Logger.logger().info("Next row exists");
                                    let isNextRowANewUser = rows[nextIndex][1].length > 0;
                                    let isNextRowATotal = rows[nextIndex][2].includes("Total Main");
                                    if (!isNextRowANewUser) {
                                        Logger.logger().info("Next row is not a new user");
                                        if (!isNextRowATotal) {
                                            Logger.logger().info("Next row is not totals");
                                            let nextChoiceValue = rows[nextIndex][day.columnNumber];
                                            let nextChoiceMenuNumber = nextChoiceValue.charAt(0);
                                            let nextChoiceMenuName = nextChoiceValue.charAt(1);
                                            let nextChoice = new Choice(nextChoiceMenuNumber, nextChoiceMenuName, day, user, nextIndex + 1);
                                            choices.push(nextChoice);
                                            Logger.logger().info("User has [%s] choice [%s] for [%s]", choices.length, nextChoiceValue, day.date);
                                        } else {
                                            Logger.logger().info('On the next row a totals');
                                            break;
                                        }
                                    } else {
                                        Logger.logger().info('On the next row is a new skype account[%s]. Taking next day for [%s]', rows[nextIndex][1], user.skypeName);
                                        break;
                                    }

                                } else {
                                    Logger.logger().info('Next Row [%d] is empty. Next user', nextIndex);
                                    break;
                                }
                            }
                            user.addListOfChoicesPerDay(day, choices);
                            day.insertChoices(choices);
                        });
                        users.push(user);
                    } else {
                        Logger.logger().info('Row [%d] has id but skype account[%s] is not valid', index, skypeAccount);
                    }
                } else {
                    Logger.logger().info('Row [%d] has no id', index);
                }
            } else {
                Logger.logger().info('Row [%d] is empty. Next user', index);
            }
        });

        return users;
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
