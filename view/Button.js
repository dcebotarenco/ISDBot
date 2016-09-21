/**
 * Created by dcebotarenco on 9/15/2016.
 */
var builder = require('botbuilder');

class Button {

    constructor(session, menuName, menuGroupName) {
        this.session = session;
        this.menuName = menuName;
        this.menuGroupName = menuGroupName;
        this.cardAction = this._buildCardAction();
    }

    _buildCardAction() {
        return builder.CardAction.imBack(this.session, this.menuName+this.menuGroupName, this.menuGroupName);
    }

    get actionCard()
    {
        return this.cardAction;
    }

    get menuname()
    {
        return this.menuName;
    }

    get menugroup()
    {
        return this.menuGroupName;
    }
}
module.exports = Button;