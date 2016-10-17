let GoogleConnection = require('../../google/googleConnection');
let Logger = require('../../logger/logger');

class Choice {
    /*choiceMenuName stands for 'S' or 'M'*/
    constructor(choiceMenuNumber, choiceMenuName, choiceDay, user, rowNumber) {
        this._choiceMenuNumber = choiceMenuNumber;
        this._choiceMenuName = choiceMenuName;
        this._choiceDay = choiceDay;
        this._user = user;
        this._rowNumber = rowNumber;
        this._numberOfUpdates = 0;
    }

    get choiceMenuNumber() {
        return this._choiceMenuNumber;
    }

    get choiceMenuName() {
        return this._choiceMenuName;
    }

    get choiceDay() {
        return this._choiceDay;
    }

    get user() {
        return this._user;
    }

    get numberOfUpdates() {
        return this._numberOfUpdates;
    }

    update(value) {
        var month = new Date().toLocaleString("en-us", {month: "long"});
        var year = new Date().getFullYear();
        var choiceSheetName = month + " " + year;
        GoogleConnection.updateValue(this._choiceDay.columnLetter, this._rowNumber, value, choiceSheetName, function (response) {
            Logger.logger().info("Choice updated");
        });
        this._numberOfUpdates++;
    }
}
module.exports = Choice;


