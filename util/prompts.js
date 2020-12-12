const mainMenu = [
  {
    name: "mainSelection",
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
      "EXIT"
    ],
  },
];

const departmentsMenu = [
  {
    name: "department",
    type: "list",
    message: "Select a department",
    choices: null
  }
];

const managersMenu = [
  {
    name: "manager",
    type: "list",
    message: "Select a manager",
    choices: null
  }
];

const rolesMenu = [
  {
    name: "role",
    type: "list",
    message: "Select a role",
    choices: null
  }
];

const confirmAdd = [
  {
    name: "proceed",
    type: "confirm",
    message: "Does the above information look correct?"
  }
]

const addEmployeeMenu = [
  {
    name: "first_name",
    type: "input",
    message: "Enter employee first name"
  },
  {
    name: "last_name",
    type: "input",
    message: "Enter employee last name"
  },
  {
    name: "role",
    type: "list",
    message: "Select a role",
    choices: null
  },
  {
    name: "manager",
    type: "list",
    message: "Select a manager",
    choices: null
  }
];

const addRoleMenu = [
  {
    name: "title",
    type: "input",
    message: "Enter new role title"
  },
  {
    name: "salary",
    type: "input",
    message: "Enter salary for this position",
    validate: val => parseFloat(val) !== NaN
  },
  {
    name: "department",
    type: "list",
    message: "Select a department",
    choices: null
  }
];

module.exports = {
  mainMenu,
  departmentsMenu,
  managersMenu,
  rolesMenu,
  confirmAdd,
  addEmployeeMenu,
  addRoleMenu
};
