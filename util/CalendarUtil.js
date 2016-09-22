/**
 * Created by dcebotarenco on 9/21/2016.
 */
class CalendarUtil
{
    static getNextFriday(date) {
        var dayOfWeek = 5;
        date = new Date(date.getTime());
        date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7);
        return date;
    }
}

module.exports=CalendarUtil