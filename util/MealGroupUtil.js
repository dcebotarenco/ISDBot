/**
 * Created by charea on 20.10.2016.
 */
var Logger = require('../logger/logger');
class MealGroupUtil {

    static getMealsByGroupName(mealGroups, groupName) {
        let meals;
        mealGroups.forEach(function (mealGroup) {
            if (mealGroup.groupName == groupName) {
                meals = mealGroup.meals;
            }
        });
        return meals;
    }
}
module.exports = MealGroupUtil;