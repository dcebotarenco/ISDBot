var Menu = require('./Menu.js');
class DietMenu extends Menu {
  constructor(menuName,meals) {
    super(menuName,meals);
  }
}
module.exports = DietMenu;
