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
  rolesMenu,
  confirmAdd,
  addEmployeeMenu,
  addRoleMenu } = require("./util/prompts");

const Query = require("./util/Query");

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
      query = new Query().searchAll();
      runQuery(query, null, selectMenuOption);
      return;
    case "View Employees by Department":
      departmentsMenu[0].choices = currentDepartments;
      const { department } = await inquirer.prompt(departmentsMenu);
      query = new Query().searchByDepartment();
      runQuery(query, [department], selectMenuOption);
      return;
    case "View Employees by Role":
      rolesMenu[0].choices = currentRoles;
      const { role } = await inquirer.prompt(rolesMenu);
      query = new Query().searchByRole();
      runQuery(query, [role], selectMenuOption);
      return;
    case "View Employees by Manager":
      managersMenu[0].choices = currentEmployees;
      const { manager } = await inquirer.prompt(managersMenu);
      query = new Query().searchByManager();
      runQuery(query, [manager], selectMenuOption);
      return;
    case "Add an Employee":
      addEmployeeMenu[2].choices = currentRoles;
      addEmployeeMenu[3].choices = currentEmployees.concat(["None"]);
      const employeeOptions = await inquirer.prompt(addEmployeeMenu);
      const { proceed } = await inquirer.prompt(confirmAdd);
      if (!proceed) return selectMenuOption();
      query = new Query().addEmployee();
      runQuery(query, parseAddEmployee(employeeOptions), selectMenuOption);
      return;
    case "Add a Role":
      const roleOptions = await inquirer.prompt(addRoleMenu);
      query = new Query().addRole();
      const { proceed } = await inquirer.prompt(confirmAdd);
      if (!proceed) return selectMenuOption();
      runQuery(query, parseAddRole(roleOptions), selectMenuOption);
      selectMenuOption();
    default:
      connection.end();
      return;
  }
};

//function to parse addEmployee response into query for connection.query
function parseAddEmployee(source) {
    let newRoleId = currentRoles.findIndex(el => el === source.role) + 1;
    if (newRoleId === 0) newRoleId = null;
    let newManagerId = currentEmployees.findIndex(el => el === source.manager) + 1;
    return {
        first_name: source.first_name,
        last_name: source.last_name,
        role_id: newRoleId,
        manager_id: newManagerId
    };
};

//function to parse addRole response into an object for connection.query
function parseAddRole(source) {
    let newDeptId = currentDepartments.findIndex(el => el === source.role) + 1;
    if (newDeptId === 0) newDeptId = null;
    return {
        title: source.title,
        salary: source.salary,
        department_id: newDeptId
    };
};

//function to run a basic query
function runQuery(query, selector, cb) {
  connection.query(query, selector, (err, res) => {
    if (err) throw err;
    console.log(res);
    if (cb) cb();
  });
}

//function to get all employees currently in the database
function getEmployees() {
  connection.query(
    "SELECT CONCAT(employee.first_name,' ',employee.last_name) AS employee FROM employee",
    (err, res) => {
      currentEmployees = res.map((row) => row.employee);
    }
  );
}

//function to get all departments currently in the database
function getDepartments() {
  connection.query("SELECT name AS department FROM department;", (err, res) => {
    currentDepartments = res.map((row) => row.department);
  });
}

//function to get all roles currently in the database
function getRoles() {
  connection.query("SELECT title AS role FROM role;", (err, res) => {
    currentRoles = res.map((row) => row.role);
  });
}
