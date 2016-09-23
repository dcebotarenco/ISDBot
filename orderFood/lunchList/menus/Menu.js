/*Menu - it has a list of meals*/
class Menu {
  constructor(meals) {
    this.meals = meals;
  }

  get mealsList() {
    return this.meals;
  }
}
module.exports = Menu;
