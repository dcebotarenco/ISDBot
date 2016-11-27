/**
 * Created by dcebotarenco on 10/15/2016.
 */
var Logger = require('../logger/logger');
class SheetUtil {

    static columnToLetter(column) {
        var temp, letter = '';
        while (column > 0) {
            temp = (column - 1) % 26;
            letter = String.fromCharCode(temp + 65) + letter;
            column = (column - temp - 1) / 26;
        }
        return letter;
    }

    static letterToColumn(letter) {
        var column = 0, length = letter.length;
        for (var i = 0; i < length; i++) {
            column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
        }
        return column;
    }

    static resolveMenuType(message) {
        var array = message.split('-');
        var type = array[0];
        let menuType = null;
        switch (type) {
            case 'FirstMenu':
                menuType = '1';
                break;
            case 'SecondMenu':
                menuType = '2';
                break;
            case 'PostMenu':
                menuType = '3';
                break;
            case 'DietMenu':
                menuType = '4';
                break;
        }
        return menuType + array[1];
    }

    static resolveCancelMenuType(message) {
        var array = message.split('-');
        var type = array[0];
        let menuNumber = null;
        switch (type) {
            case 'FirstMenu':
                menuNumber = '1';
                break;
            case 'SecondMenu':
                menuNumber = '2';
                break;
            case 'PostMenu':
                menuNumber = '3';
                break;
            case 'DietMenu':
                menuNumber = '4';
                break;
        }
        return {menuNumber: menuNumber, menuType: array[1]};
    }

    static resolveMenuNumber(menuNumber) {
        let menuName = null;
        switch (menuNumber) {
            case '1':
                menuName = 'FirstMenu';
                break;
            case '2':
                menuName = 'SecondMenu';
                break;
            case '3':
                menuName = 'PostMenu';
                break;
            case '4':
                menuName = 'DietMenu';
                break;
        }
        return menuName;
    }

    static getMealsByGroupName(mealGroups, groupName) {
        mealGroups.forEach(function (mealGroup) {
            if(mealGroup.groupName == groupName){
                return mealGroup.meals;
            }
        });
        Logger.logger().info("The meals where not found for group Name []", groupName);
        return null;
    }

    static allTrim(text){
        return text.replace(/\s+/g,' ').trim();
    }
}
module.exports = SheetUtil;