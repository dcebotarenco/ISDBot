/**
 * Created by charea on 16.08.2017.
 */

class Notifications
{
    constructor(foodNotification, startDate, jokeNotification)
    {
        this._foodNotification = foodNotification;
        this._startDate = startDate;
        this._jokeNotification = jokeNotification;
    }

    get foodNotification() {
        return this._foodNotification;
    }

    get jokeNotification() {
        return this._jokeNotification;
    }

    get startDate() {
        return this._startDate;
    }
}
module.exports=Notifications;
