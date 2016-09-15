/*Meal- one meal from menu. ex: rice*/
class Meal {
  constructor(name) {
    this.name = name;
  }

  get nameVar() {
    return this.name;
  }
}
module.exports = Meal;
