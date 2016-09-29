/*Meal- one meal from menu. ex: rice*/
class Meal {
  constructor(name) {
    this.nameVar = name;
  }

  get name() {
    return this.nameVar;
  }
}
module.exports = Meal;
