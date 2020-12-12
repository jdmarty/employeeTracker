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

module.exports = {
  mainMenu,
};
