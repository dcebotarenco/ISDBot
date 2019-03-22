/**
 * Created by dcebotarenco on 9/15/2016.
 */
var builder = require('botbuilder');
var SheetUtil = require('../util/SheetUtil');

class Menu {
    constructor(session, title, mealList, buttons, url) {
        this.buttons = buttons;
        this.title = title;
        this.mealList = mealList;
        this.session = session;
        this.url = url;
        this.mealCard = this._buildMealCard();
    }

    _buildMealCard() {
        return new builder.HeroCard(this.session).title(this.title).text(this._formatMealsName())
            .tap(builder.CardAction.openUrl(this.session, this.url, 'menuUrl'))
            .buttons(this.buttons);
    }

    _formatMealsName() {
        let lis = [];
        this.mealList.forEach(function (meal) {
            let li;
            let newMeal = SheetUtil.allTrim(meal);
            if (lis.length == 0) {
                li = newMeal;
            } else {
                li = "\n" + newMeal;
            }
            lis.push(li);
        });
        return lis.join('');
    }

    get card() {
        return this.mealCard;
    }

    get btns() {
        return this.buttons;
    }
}
module.exports = Menu;
