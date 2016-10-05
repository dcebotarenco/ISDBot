var Logger = require('../logger/logger');
let MealFactory = require('../orderFood/factory/MealFactory');
let MenuFactory = require('../orderFood/factory/MenuFactory');
let Day = require('../orderFood/lunchList/Day');
let Sheet = require('../orderFood/lunchList/Sheet');
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
        MenuFactory.getMenu("FirstMenu", firstMenuName, mealsPerDay.slice(0, 3)),
        MenuFactory.getMenu("SecondMenu", secondMenuName, mealsPerDay.slice(3, 6)),
        MenuFactory.getMenu("PostMenu", postMenuName, mealsPerDay.slice(6, 9)),
        MenuFactory.getMenu("DietMenu", dietMenuName, mealsPerDay.slice(9, 12))
      ];
      let dayDate = new Date(updateDate.getFullYear(), updateDate.getMonth(), updateDate.getDate() + index);
      days.push(new Day(dayDate, menu));
    });
    return new Sheet(days);
  }

  static createChoiceModelSheet(rows, session) {
    /*still working here 20161004 09:30*/
    Logger.logger().info("Creating choice model");
    let employeeSkypeName = session.message.address.user.name;
    let rowNumberForEmployee;
    let employeeChoisesList = [];
    let daysofMonthWithChoises = [];
    let indexOfFirstDayOfCurrentWeek;
    /*check the position of the employee*/
    rows.forEach(function (row, index) {
      if (row[0] == employeeSkypeName) {
        rowNumberForEmployee = index;
        return true;//exit from forEach
      }
    });
    if (rowNumberForEmployee === undefined) {
      Logger.logger().error("Employee [%s] was not found in the list", employeeSkypeName);
      return null;//exit from method
    }

//    employeeChoisesList =  rows[rowNumberForEmployee].slice(3, rows[rowNumberForEmployee].length);//get list of choises for employee

    rows.forEach(function (row, indexExt) {
      if (indexExt == 3) {//row with dates
        row.forEach(function (day, indexInt) {
          if (ModelBuilder.isNumeric(day)) {//check if it's a number
            if (session.dialogData.sheet.dayList[0].date.getDate() == parseInt(day)) {
              indexOfFirstDayOfCurrentWeek = indexInt;
              return true; //exit from method
            }
            daysofMonthWithChoises.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(day)));
          }
        });
      }

      if (indexOfFirstDayOfCurrentWeek === undefined) {
        Logger.logger().error("Day of month [%d] was not found in the list", session.dialogData.sheet.dayList[0].date.getDate());
        return null;//exit from method
      }

      if (indexExt == rowNumberForEmployee) {//row with employee choice
        row.forEach(function (item, indexInt) {
          if (indexInt >= 3) {//choises starts with column 4(D)

          }
        });
      }
    });
    return null;
  }

  static  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}

module.exports = ModelBuilder;
