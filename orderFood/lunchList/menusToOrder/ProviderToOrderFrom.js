class ProviderToOrderFrom {
    constructor(providerName, menusToOrderList, totalNrOfMenus) {
        this._providerName = providerName;
        this._menusToOrderList = menusToOrderList;
        this._totalNrOfMenus = totalNrOfMenus;
    }

    get providerName() {
        return this._providerName;
    }

    get menusToOrderList() {
        return this._menusToOrderList;
    }

    get totalNrOfMenus() {
        return this._totalNrOfMenus;
    }
}
module.exports = ProviderToOrderFrom;