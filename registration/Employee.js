/**
 * Created by dcebotarenco on 10/7/2016.
 */
class Employee
{
    constructor(id,skypeAccount,name)
    {
        this._id = id;
        this._skypeAccount= skypeAccount
        this._name=name;
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
}
module.exports=Employee;