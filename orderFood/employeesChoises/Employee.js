class Employee {
  constructor(skypeName, fullName) {
    this.skypeNameVar = skypeName;
    this.fullNameVar = fullName;
  }

  get skypeName() {
    return this.skypeNameVar;
  }

  get fullName() {
    return this.fullNameVar;
  }
}
module.exports = Employee;