/**
 * Created by dcebotarenco on 9/21/2016.
 */
let moment = require('moment');
class CalendarUtil {
    static getNextFriday(date) {
        var dayOfWeek = 5;
        date = new Date(date.getTime());
        date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7);
        return date;
    }

    /*static  getNextDay(){
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate()+1);
        return tomorrow;
    }*/
    static getNextWorkingDay(date) {
        // Copy date so don't affect original
        date = new Date(+date);
        // Add days until get not Sat or Sun
        do {
            date.setDate(date.getDate() + 1);
        } while (!(date.getDay() % 6));
        return date;
    }

    static resolveDate(userChoice)
    {
        //mo|tu|we|th|fr|today
        let weekNumber;
        switch (userChoice)
        {
            case 'mo':
                weekNumber = 1;
                break;
            case 'tu':
                weekNumber = 2;
                break;
            case 'we':
                weekNumber = 3;
                break;
            case 'th':
                weekNumber = 4;
                break;
            case 'fr':
                weekNumber = 5;
                break;
            case 'today':
                return moment();
                break;
        }
        let ret = moment().day(weekNumber);
        return ret;
    }


    // Validates that the input string is a valid date formatted as "dd.mm.yyyy"
    static isValidDate(dateString)
{
    // First check for the pattern
    if(!/^\d{1,2}.\d{1,2}.\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split(".");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};
}

// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

module.exports = CalendarUtil;