class Employee {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  get idVar() {
    return this.id;
  }

  get nameVar() {
    return this.name;
  }
}
module.exports = Employee;