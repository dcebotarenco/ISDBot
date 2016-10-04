class EmployeeChoices {
  constructor(employee, choicePerDay) {
    this.employee = employee;
    this.choicePerDay = choicePerDay;
  }

  get employeeVar() {
    return this.employee;
  }

  get choiceList() {
    return this.choicePerDay;
  }
}
module.exports = EmployeeChoices;



