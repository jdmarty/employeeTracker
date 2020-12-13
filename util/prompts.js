class Prompt {
  constructor(employees, departments, roles) {
    this.employees = employees;
    this.departments = departments;
    this.roles = roles;
  }

  mainMenu() {
    return [
      {
        name: "main",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View Employees by Department",
          "View Employees by Role",
          "View Employees by Manager",
          "Add an Employee",
          "Add a Role",
          "Add a Department",
          "Remove an Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "View Utilized Budget by Department",
          "EXIT",
        ],
      },
    ];
  }

  departmentsMenu() {
    return [
      {
        name: "department",
        type: "list",
        message: "Select a department",
        choices: this.departments,
      },
    ];
  }

  managersMenu() {
    return [
      {
        name: "manager",
        type: "list",
        message: "Select a manager",
        choices: this.employees,
      },
    ];
  }

  rolesMenu() {
    return [
      {
        name: "role",
        type: "list",
        message: "Select a role",
        choices: this.roles,
      },
    ];
  }

  confirmAdd() {
    return [
      {
        name: "proceed",
        type: "confirm",
        message: "Does the above information look correct?",
      },
    ];
  }

  addEmployee() {
    return [
      {
        name: "first_name",
        type: "input",
        message: "Enter employee first name",
      },
      {
        name: "last_name",
        type: "input",
        message: "Enter employee last name",
      },
      {
        name: "role",
        type: "list",
        message: "Select a role",
        choices: this.roles,
      },
      {
        name: "manager",
        type: "list",
        message: "Select a manager",
        choices: this.employees,
      },
    ];
  }

  addRole() {
    return [
      {
        name: "title",
        type: "input",
        message: "Enter new role title",
      },
      {
        name: "salary",
        type: "input",
        message: "Enter salary for this position",
        validate: (val) => parseFloat(val) !== NaN,
      },
      {
        name: "department",
        type: "list",
        message: "Select a department",
        choices: this.departments,
      },
    ];
  }
}

module.exports = Prompt;
