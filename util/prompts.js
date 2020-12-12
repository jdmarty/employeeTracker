const connection = require("../config/connection");

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

const addEmployee = [
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
    choices: ['None']
  }
]



module.exports = {
  mainMenu,
  departmentsMenu,
  managersMenu,
  rolesMenu,
  addEmployee
};
