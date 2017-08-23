/**
 * Created by charea on 16.08.2017.
 */

class Notifications
{
    constructor(foodNotification, jokeNotification)
    {
        this._foodNotification = foodNotification;
        this._jokeNotification = jokeNotification;
    }

    get foodNotification() {
        return this._foodNotification;
    }

    get jokeNotification() {
        return this._jokeNotification;
    }
}
module.exports=Notifications;
