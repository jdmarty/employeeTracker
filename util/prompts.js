class Prompt {
  constructor(employees, departments, roles) {
    this.employees = employees.map(row => row.employee);
    this.departments = departments.map(row => row.department);
    this.roles = roles.map(row => row.role);
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
        choices: this.employees.concat(['None']),
      },
    ];
  }

  employeesMenu() {
    return [
      {
        name: "employee",
        type: "list",
        message: "Select an employee",
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

  confirm() {
    return [
      {
        name: "proceed",
        type: "confirm",
        message: "\nDoes the above information look correct?",
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
      this.rolesMenu()[0],
      this.managersMenu([0]),
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
        type: "number",
        message: "Enter salary for this position",
      },
      this.departmentsMenu()[0],
    ];
  }

  addDepartment() {
    return [
      {
        name: "name",
        type: "input",
        message: "Enter new department name"
      },
    ]
  }

  updateEmployeeRole() {
    return [
      this.employeesMenu()[0],
      this.rolesMenu()[0]
    ];
  }

  updateEmployeeManager() {
    return [
      this.employeesMenu()[0],
      this.managersMenu()[0],
    ];
  }

}

module.exports = Prompt;
