/**
 * Created by charea on 20.10.2016.
 */

var builder = require('botbuilder');
var SheetUtil = require('../util/SheetUtil');

class Menu {
    constructor(session, title, type, mealList, buttons, menuUrl, imgUrl) {
        this.menuType = type;
        this.buttons = buttons;
        this.title = title;
        this.mealList = mealList;
        this.session = session;
        this.menuUrl = menuUrl;
        this.imgUrl = imgUrl;
        this.mealCard = this._buildMealCard();
    }

    _buildMealCard() {
        return new builder.HeroCard(this.session).title(this.title).text(this._formatMealsName())
            .tap(builder.CardAction.openUrl(this.session, this.menuUrl, 'menuUrl'))
            .images([
                builder.CardImage.create(this.session, this.imgUrl)
            ])
            .buttons(this._getButtonsActionCards())
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

    _getButtonsActionCards() {
        let array = this.buttons.map(function (button) {
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

    get type() {
        return this.menuType;
    }
}

module.exports = Menu;
