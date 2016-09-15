var MealGroup = require('./MealGroup.js');
class MMealGroup extends MealGroup {
  constructor(meals) {
    super(meals);
    this.name = 'M';
  }
}
module.exports = MMealGroup;