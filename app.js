//npm packages
const inquirer = require("inquirer");
const mysql = require("mysql");

//connection module
const connection = require("./config/connection");

//utilities
const Prompt = require("./util/prompts");

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
  updateApp();
});

//main menu switchboard
async function selectMenuOption() {
  //update app state
  // getEmployees();
  // getDepartments();
  // getRoles();
  //create Menus and Query classes
  const Menus = new Prompt(currentEmployees, currentDepartments, currentRoles);
  const Queries = new Query();
  //Pull out the menu selection for switchboard
  const { main } = await inquirer.prompt(Menus.mainMenu());
  //Switchboard for main menu
  switch (main) {
    case "View All Employees":
      query = Queries.searchAll();
      runQuery(query, null, updateApp);
      return;
    case "View Employees by Department":
      const { department } = await inquirer.prompt(Menus.departmentsMenu());
      query = Queries.searchByDepartment();
      runQuery(query, [department], updateApp);
      return;
    case "View Employees by Role":
      const { role } = await inquirer.prompt(Menus.rolesMenu());
      query = Queries.searchByRole();
      runQuery(query, [role], updateApp);
      return;
    case "View Employees by Manager":
      const { manager } = await inquirer.prompt(Menus.managersMenu());
      query = Queries.searchByManager();
      runQuery(query, [manager], updateApp);
      return;
    case "Add an Employee":
      const employeeOptions = await inquirer.prompt(Menus.addEmployee());
      const { proceed: goAddEmp } = await inquirer.prompt(Menus.confirmAdd());
      if (!goAddEmp) {
        return selectMenuOption();
      }
      query = Queries.addEmployee();
      runQuery(query, parseAddEmployee(employeeOptions), updateApp);
      return;
    case "Add a Role":
      const roleOptions = await inquirer.prompt(Menus.addRole());
      query = Queries.addRole();
      const { proceed: goAddRole } = await inquirer.prompt(Menus.confirmAdd());
      if (!goAddRole) {
        return selectMenuOption();
      }
      runQuery(query, parseAddRole(roleOptions), updateApp);
      selectMenuOption();
      return;
    case "Add a Department":
      const deptOptions = await inquirer.prompt(Menus.addDepartment());
      query = Queries.addDepartment();
      const { proceed: goAddDept } = await inquirer.prompt(Menus.confirmAdd());
      if (!goAddDept) {
        return selectMenuOption();
      }
      runQuery(query, deptOptions, updateApp);
      return
    default:
      connection.end();
      return;
  }
}

//function to parse addEmployee response into query for connection.query
function parseAddEmployee(source) {
  //find the matching id for the selected role
  let newRoleId = currentRoles.find((el) => el.role === source.role).roleId;
  if (!newRoleId) newRoleId = null;
  //find matching id for selected manager
  let newManagerId = currentEmployees.find((el) => el.employee === source.manager).employeeId;
  if (!newManagerId) newManagerId = null;
  //return object to be used as selector in connection.query
  return {
    first_name: source.first_name,
    last_name: source.last_name,
    role_id: newRoleId,
    manager_id: newManagerId,
  };
}

//function to parse addRole response into an object for connection.query
function parseAddRole(source) {
  //find the matching id for the selected department
  let newDeptId = currentDepartments.findIndex((el) => el === source.department) + 1;
  if (newDeptId === 0) newDeptId = null;
  //return object to be used as selector in connection.query
  return {
    title: source.title,
    salary: source.salary,
    department_id: newDeptId,
  };
}

//function to run a basic query
function runQuery(query, selector, cb) {
  connection.query(query, selector, (err, res) => {
    if (err) throw err;
    console.log(res);
    if (cb) cb();
  });
}

//UPDATE APP CHAIN
//function to update app state to current database
function updateApp() {
  getEmployees()
}

//function to get all employees currently in the database
function getEmployees() {
  connection.query(
    "SELECT CONCAT(first_name,' ',last_name) AS employee, id AS employeeId FROM employee",
    (err, res) => {
      currentEmployees = res;
      getDepartments()
    }
  );
}

//function to get all departments currently in the database
function getDepartments() {
  connection.query(
    "SELECT name AS department, id AS departmentId FROM department;",
    (err, res) => {
      currentDepartments = res;
      getRoles()
    }
  );
}

//function to get all roles currently in the database
function getRoles() {
  connection.query(
    "SELECT title AS role, id AS roleId FROM role;",
    (err, res) => {
      currentRoles = res;
      selectMenuOption()
    }
  );
}

