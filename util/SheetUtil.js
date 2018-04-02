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
            case 'Bistro1':
                menuType = '1';
                break;
            case 'Bistro2':
                menuType = '2';
                break;
            case 'Bistropost':
                menuType = '3';
                break;
            case 'Bistrodieta':
                menuType = '4';
                break;
            case 'Don Taco1':
                menuType = '5';
                break;
            case 'Don Taco2':
                menuType = '6';
                break;
            case 'Don Taco3':
                menuType = '7';
                break;
            case 'Don Taco4':
                menuType = '8';
                break;
            case 'Don Taco5':
                menuType = '9';
                break;
            case 'Don Taco6':
                menuType = '10';
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
        if (typeof text !== 'undefined'){
            return text.replace(/\s+/g,' ').trim();
        }else{
            return "";
        }
    }

    static splitDigitsFromString(item) {
        return (item.replace(/\'/g, '').split(/(\d+)/).filter(Boolean));
    }

    static contains(list, item) {
        var i = list.length;
        while (i--) {
            if (list[i] === item) {
                return true;
            }
        }
        return false;
    }
}
module.exports = SheetUtil;