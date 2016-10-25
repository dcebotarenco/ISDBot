/**
 * Created by charea on 19.10.2016.
 */
var builder = require('botbuilder');

class Button {

    constructor(session, menuName, menuGroupName) {
        this.session = session;
        this.menuName = menuName;
        this.menuGroupName = menuGroupName;
        this.buttonChoice = this.menuName + "-" + this.menuGroupName;
        this.cardAction = this._buildCardAction();
    }

    _buildCardAction() {
        return builder.CardAction.imBack(this.session, this.buttonChoice, 'Cancel');
    }

    get actionCard() {
        return this.cardAction;
    }

    get choice() {
        return this.buttonChoice;
    }
}
module.exports = Button;