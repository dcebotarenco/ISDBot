class Day {
  constructor(dateVar, menu) {
    this.dateVar = dateVar;
    this.menu = menu;
  }

  get date() {
    return this.dateVar;
  }

  get menuList() {
    return this.menu;
  }
}
module.exports = Day;

