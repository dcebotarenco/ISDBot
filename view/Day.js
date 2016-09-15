/**
 * Created by dcebotarenco on 9/15/2016.
 */
var builder = require('botbuilder');

class Day {
    constructor(session, menuList) {
        this.session = session;
        this.menuList = menuList;
        this.message = Day._buildDay();
    }

    static _buildDay() {
        new builder.Message(this.session)
            .textFormat(builder.TextFormat.markdown)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(Day._getMenuCards());
    }

    static _getMenuCards()
    {
        return this.menuList.map(function(val){val.card});
    }

    get menus()
    {
        return this.message;
    }
}

module.exports = Day;