var MealGroup = require('./MealGroup.js');
class MMealGroup extends MealGroup {
  constructor(meals) {
    super(meals);
    this.name = 'M';
  }

  get groupName()
  {
    return this.name;
  }
}
module.exports = MMealGroup;