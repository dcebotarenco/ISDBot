/*Menu - it has a list of meals*/

let MealsGroupFactory = require('../../factory/MealsGroupFactory');

class Menu {
  constructor(menuName,meals) {
    this.menuName = menuName;
    this.meals = meals;
    this.groups =[];
    this.groups.push(MealsGroupFactory.getMealGroup("MMealGroup",meals));
    this.groups.push(MealsGroupFactory.getMealGroup("SMealGroup",meals.slice(1,2)));
  }

  get mealsList() {
    return this.meals;
  }

  get mealGroups()
  {
    return this.groups;
  }

  get name()
  {
    return this.menuName;
  }
}
module.exports = Menu;
