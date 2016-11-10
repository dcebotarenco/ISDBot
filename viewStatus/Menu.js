/**
 * Created by charea on 02.11.2016.
 */
var builder = require('botbuilder');

class Menu {
    constructor(session,
                title,
                /*subtitle,*/
                type,
                mealList) {
        this.menuType = type;
        this.title = title;
        /*this.subtitle = subtitle;*/
        this.mealList = mealList;
        this.session = session;
        this.mealCard = this._buildMealCard();
    }

    _buildMealCard() {
        return new builder.HeroCard(this.session).title(this.title)/*.subtitle(this.subtitle)*/.text(this._formatMealsName())
    }

    _formatMealsName() {
        let lis = [];
        this.mealList.forEach(function (meal, index) {
            let li = "*" + meal.name + "\n";
            lis.push(li);

        });
        return lis.join('');
    }

    get card() {
        return this.mealCard;
    }


    get type() {
        return this.menuType;
    }
}
module.exports = Menu;