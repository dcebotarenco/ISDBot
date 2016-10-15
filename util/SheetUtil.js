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
}
module.exports = SheetUtil;