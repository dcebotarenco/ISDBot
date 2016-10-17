/**
 * Created by dcebotarenco on 10/15/2016.
 */
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
}
module.exports = SheetUtil;