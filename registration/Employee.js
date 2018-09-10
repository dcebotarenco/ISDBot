/**
 * Created by dcebotarenco on 10/7/2016.
 */
class Employee
{
    constructor(id,skypeAccount,name,initials,isAdmin,notifications, rowNumber)
    {
        this._id = id;
        this._skypeAccount= skypeAccount;
        this._name=name;
        this._initials=initials;
        this._isAdmin=isAdmin;
        this._notifications=notifications;
        this._rowNumber = rowNumber;
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
        return this._isAdmin == 'YES';
    }

    get notifications() {
        return this._notifications;
    }

    get rowNumber() {
        return this._rowNumber;
    }
}
module.exports=Employee;