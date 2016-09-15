/**
 * Created by dcebotarenco on 9/15/2016.
 */
var builder = require('botbuilder');

class Menu {
    constructor(title,
                mealList,
                buttons,
                session) {
        this.buttons = buttons;
        this.title = title;
        this.mealList = mealList;
        this.session = session;
        this.mealCard = Menu._buildMealCard();
    }

    static _buildMealCard() {
        new builder.HeroCard(this.session).title(this.title).text(Menu._formatMealsName()).buttons(Menu._getButtonsActionCards())
    }

    static _formatMealsName() {
        return this.mealList.join();
    }

    static _getButtonsActionCards() {
        return buttons.map(function (button) {
            button.action;
        })
    }

    get card() {
        return this.mealCard;
    }
}
module.exports = Menu;