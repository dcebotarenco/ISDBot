/**
 * Created by dcebotarenco on 9/15/2016.
 */
var builder = require('botbuilder');

class Button {

    constructor(session, menuName, menuGroupName) {
        this.session = session;
        this.menuName = menuName;
        this.menuGroupName = menuGroupName;
        this.cardAction = Button._buildCardAction();
    }

    static _buildCardAction() {
        return builder.CardAction.imBack(this.session, this.menuName, this.menuGroupName);
    }

    get action()
    {
        return this.cardAction;
    }
}
module.exports = Button;