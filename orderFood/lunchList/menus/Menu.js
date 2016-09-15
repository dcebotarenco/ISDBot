/*Menu - it has a list of meals*/
class Menu {
  constructor(meals, mealGroup) {
    this.meals = meals;
    this.mealGroup = mealGroup;
  }

  get mealsList() {
    return this.meals;
  }

  get mealGroupList() {
    return this.mealGroup;
  }
}
module.exports = Menu;
