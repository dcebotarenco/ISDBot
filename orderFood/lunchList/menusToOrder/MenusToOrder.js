class MenusToOrder {
    constructor(menuName, orderType, nrOfMenus) {
        this._menuName = menuName;
        this._orderType = orderType;
        this._nrOfMenus = nrOfMenus;
    }

    get menuName() {
        return this._menuName;
    }

    get orderType() {
        return this._orderType;
    }

    get nrOfMenus() {
        return this._nrOfMenus;
    }
}
module.exports = MenusToOrder;