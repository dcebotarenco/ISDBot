/**
 * Created by dcebotarenco on 9/28/2016.
 */
class Sheet {
    constructor(days, updateDate) {
        if(arguments.length == 1) {
            this.days = days.days;
            this._updateDate = days.updateDate;
        } else {
            this.days = days;
            this._updateDate = updateDate
        }
    }

    get dayList() {
        return this.days;
    }

    get updateDate()
    {
        return this._updateDate;
    }


    getDayByDate(date) {
        return this.days.filter(function (day) {
            let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return day.date.getTime() === today.getTime()
        })[0];
    }

    getMenusForDate(date){
        return this.days.filter(function(menu){
            let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return (new Date(menu._date)).getTime() == today.getTime();
        });
    }
}
module.exports = Sheet;

