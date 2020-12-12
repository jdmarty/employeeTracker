//npm packages
const inquirer = require("inquirer");
const mysql = require("mysql");

//connection module
const connection = require("./config/connection");

//utilities
const { 
    mainMenu, 
    departmentsMenu, 
    managersMenu, 
    rolesMenu } = require("./util/prompts");
const Select = require("./util/queryClasses/selectQuery")

//current employees, departments, and roles
let currentEmployees = [];
let currentDepartments = [];
let currentRoles = [];

//On connection run the function to bring up the main menu
connection.connect((err) => {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
    console.log("\nWelcome to Node Employee Tracking\n");
    selectMenuOption();
});

//main menu switchboard
async function selectMenuOption() {
    getEmployees();
    getDepartments();
    getRoles();
    const { mainSelection } = await inquirer.prompt(mainMenu);
    let query
    switch (mainSelection) {
        case "View All Employees":
            query = new Select().searchAll()
            runQuery(query, null, selectMenuOption);
            return;
        case "View Employees by Department":
            departmentsMenu[0].choices = currentDepartments;
            const { department } = await inquirer.prompt(departmentsMenu);
            query = new Select().searchByDepartment();
            runQuery(query, [department], selectMenuOption);
            return;
        case "View Employees by Role":
            rolesMenu[0].choices = currentRoles;
            const { role } = await inquirer.prompt(rolesMenu);
            query = new Select().searchByRole();
            runQuery(query, [role], selectMenuOption);
            return;
        case "View Employees by Manager":
            managersMenu[0].choices = currentEmployees;
            const { manager } = await inquirer.prompt(managersMenu);
            query = new Select().searchByManager();
            runQuery(query, [manager], selectMenuOption);
            return;
        default:
            connection.end();
            return;
    };
};

//function to run a basic query
function runQuery(query, selector, cb) {
    connection.query(query, selector, (err, res) => {
        if (err) throw err;
        console.log(res);
        if (cb) cb();
    })
}

//function to get all employees currently in the database
function getEmployees() {
    connection.query(
      "SELECT CONCAT(employee.first_name,' ',employee.last_name) AS employee FROM employee",
      (err, res) => {
          currentEmployees = res.map(row => row.employee)
      }
    );
}

//function to get all departments currently in the database
function getDepartments() {
  connection.query(
    "SELECT name AS department FROM department;",
    (err, res) => {
      currentDepartments = res.map((row) => row.department);
    }
  );
};

//function to get all roles currently in the database
function getRoles() {
  connection.query(
    "SELECT title AS role FROM role;", 
    (err, res) => {
        currentRoles = res.map((row) => row.role);
    });
};






