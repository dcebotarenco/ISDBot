/**
 * Created by dcebotarenco on 10/15/2016.
 */
class ChoicesSheet {
    constructor(workingDays,employees)
    {
        this._workingDays = workingDays;
        this._employees = employees;
    }

    get employees()
    {
        return this._employees;
    }

    get workingDays()
    {
        return this._workingDays;
    }
}
module.exports = ChoicesSheet;