/**
 * Created by charea on 10.04.2019.
 */
var builder = require('botbuilder');
var Logger = require('../logger/logger');

class SendMenusToOrder {
    constructor() {
        Logger.logger().info("Creating SendMenusToOrder dialog");
        this.dialogs = [
            SendMenusToOrder.sendMsg
        ];
    }

    static sendMsg(session) {
        let providerToOrderFrom = session.options.dialogArgs;
        let receipts = [];
        providerToOrderFrom.forEach(function (provider) {
            let receiptItems = [];
            let receiptCard = new builder.ReceiptCard(session).title("Menus to order from " + provider.providerName).total(provider.totalNrOfMenus);
            provider.menusToOrderList.forEach(function (menusToOrder) {
                //inserting order type after order number
                var match = menusToOrder.menuName.match(/\d+/);//find first number
                var menuName = [menusToOrder.menuName.slice(0, match.index + 1), menusToOrder.orderType, menusToOrder.menuName.slice(match.index + 1)].join('');

                receiptItems.push(builder.ReceiptItem.create(session, menusToOrder.nrOfMenus, menuName))
            });
            receiptCard.items(receiptItems);
            receipts.push(receiptCard);
        });
        var msg = new builder.Message(session).attachments(receipts);
        session.endDialog(msg);
    }

    get dialog() {
        return this.dialogs;
    }

    static name() {
        return "/sendMenusToOrder";
    }

    static match() {
        return /sendMenusToOrder/i;
    }
}

module.exports = SendMenusToOrder;
