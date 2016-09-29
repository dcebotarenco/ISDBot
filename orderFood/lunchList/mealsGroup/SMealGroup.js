var MealGroup = require('./MealGroup.js');
class SMealGroup extends MealGroup{
  constructor(meals) {
    super(meals);
    this.name = 'S';
  }

  get groupName()
  {
    return this.name;
  }
}
module.exports = SMealGroup;
