class ChoicePerDay {
  constructor(date, menu) {
    this.dateVar = date;
    this.menuVar = menu;
  }

  get date() {
    return this.dateVar;
  }
  
  get menu() {
    return this.menuVar;
  }
}
module.exports = ChoicePerDay;
