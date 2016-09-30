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
  module.exports = ModelBuilder;
