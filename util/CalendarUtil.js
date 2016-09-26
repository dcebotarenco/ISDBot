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

  static getMonday(date) {
    var a = date.split('.');
    var updateDate = new Date(a[2], a[1] - 1, a[0]);
    var day = updateDate.getDay();
    var diff = updateDate.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is Sunday(su=0, mo=1, tu=2...sa=6)
    return new Date(updateDate.setDate(diff));
  }
}

module.exports = CalendarUtil