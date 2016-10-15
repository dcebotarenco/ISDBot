class User {
    constructor(id, skypeName, fullName) {
        this._id = id;
        this._skypeName = skypeName;
        this._fullName = fullName;
        this._dayChoiceMap = new Map();
    }

    get id() {
        return this._id;
    }

    get skypeName() {
        return this._skypeName;
    }

    get fullName() {
        return this._fullName;
    }

    get dayChoiceMap() {
        return this._dayChoiceMap;
    }

    addListOfChoicesPerDay(dayChoice, choices) {
        let obj =
        {
            day: dayChoice,
            choices: choices
        };
        let key = '' + dayChoice.date.getFullYear() + dayChoice.date.getMonth() + dayChoice.date.getDate();
        this._dayChoiceMap.set(key, obj);
    }

    getChoicesByDate(date) {
        let key = '' + date.getFullYear() + date.getMonth() + date.getDate();
        return this._dayChoiceMap.get(key);
    }
}
module.exports = User;