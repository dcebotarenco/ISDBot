class ChoisesSheet {
  constructor(month, employeeChoice) {
    this.month = month;
    this.employeeChoice = employeeChoice;
  }

  get monthVar() {
    return this.month;
  }

  get employeeChoiceList() {
    return this.employeeChoice;
  }
}
module.exports = ChoisesSheet;
