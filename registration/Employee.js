/**
 * Created by dcebotarenco on 10/7/2016.
 */
class Employee
{
    constructor(id,skypeAccount,name,initials,isAdmin,notifications)
    {
        this._id = id;
        this._skypeAccount= skypeAccount
        this._name=name;
        this._initials=initials;
        this._isAdmin=isAdmin;
        this._notifications=notifications;
    }

    get id()
    {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get skypeAccount()
    {
        return this._skypeAccount;
    }

    get initials() {
        return this._initials;
    }

    get isAdmin() {
        return this._isAdmin;
    }

    get notifications() {
        return this._notifications;
    }
}
module.exports=Employee;