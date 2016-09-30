/**
 * Created by dcebotarenco on 9/15/2016.
 */
var builder = require('botbuilder');

class Menu {
    constructor(session,
                title,
                type,
                mealList,
                buttons) {
        this.menuType = type;
        this.buttons = buttons;
        this.title = title;
        this.mealList = mealList;
        this.session = session;
        this.mealCard = this._buildMealCard();
    }

    _buildMealCard() {
        return new builder.HeroCard(this.session).title(this.title).text(this._formatMealsName()).buttons(this._getButtonsActionCards())
    }

    _formatMealsName() {
        /*let lis = [];
        this.mealList.forEach(function (meal, index) {
            let li = "*"+meal.name+"*\n";
            lis.push(li);

        });
        return lis.join('');*/
        var markdownContent = "#A heading\n";
        markdownContent += "##A subheading\n";
        markdownContent += "**something bold**\n\n";
        markdownContent += "*something italic*\n\n";
        markdownContent += "[a link!](http://robinosborne.co.uk/?s=bot)\n\n";
        markdownContent += "![AN IMAGE!](http://robinosborne.co.uk/wp-content/uploads/2016/07/robinosborne.jpg)\n";
        markdownContent += "> A quote of something interesting\n\n";
        markdownContent += "```\nvar this = \"code\";\n```\n";
        return markdownContent;
    }

    _getButtonsActionCards() {
        let array = this.buttons.map(function (button, index, array) {
            return button.actionCard;
        });
        return array;
    }

    get card() {
        return this.mealCard;
    }

    get btns() {
        return this.buttons;
    }

    get type()
    {
        return this.menuType;
    }
}
module.exports = Menu;