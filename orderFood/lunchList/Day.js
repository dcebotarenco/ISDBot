class Day {
  constructor(date, menu) {
    this.date = date;
    this.menu = menu;
  }

  get dateVar() {
    return this.date;
  }

  get menuList() {
    return this.menu;
  }
}
module.exports = Day;

