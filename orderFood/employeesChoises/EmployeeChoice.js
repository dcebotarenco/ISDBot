class EmployeeChoice {
  constructor(employee, choice) {
    this.employee = employee;
    this.choice = choice;
  }

  get employeeVar() {
    return this.employee;
  }

  get choiceList() {
    return this.choice;
  }
}
module.exports = EmployeeChoice;



