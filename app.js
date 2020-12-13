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
  //create Menus and Query classes
  const Menus = new Prompt(currentEmployees, currentDepartments, currentRoles);
  const Queries = new Query();
  //Pull out the menu selection for switchboard
  const { main } = await inquirer.prompt(Menus.mainMenu());
  //Switchboard for main menu
  switch (main) {
    case "View All Employees":
      query = Queries.searchAll();
      runQuery(query, null, selectMenuOption);
      return;
    case "View Employees by Department":
      const { department } = await inquirer.prompt(Menus.departmentsMenu());
      query = Queries.searchByDepartment();
      runQuery(query, [department], selectMenuOption);
      return;
    case "View Employees by Role":
      const { role } = await inquirer.prompt(Menus.rolesMenu());
      query = Queries.searchByRole();
      runQuery(query, [role], selectMenuOption);
      return;
    case "View Employees by Manager":
      const { manager } = await inquirer.prompt(Menus.managersMenu());
      query = Queries.searchByManager();
      runQuery(query, [manager], updateApp);
      return;
    case "Add an Employee":
      const employeeOptions = await inquirer.prompt(Menus.addEmployee());
      const { proceed: goAddEmp } = await inquirer.prompt(Menus.confirm());
      if (!goAddEmp) {
        return selectMenuOption();
      }
      query = Queries.addEmployee();
      runQuery(query, parseAddEmployee(employeeOptions), updateApp);
      return;
    case "Add a Role":
      const roleOptions = await inquirer.prompt(Menus.addRole());
      query = Queries.addRole();
      const { proceed: goAddRole } = await inquirer.prompt(Menus.confirm());
      if (!goAddRole) {
        return selectMenuOption();
      }
      runQuery(query, parseAddRole(roleOptions), updateApp);
      return;
    case "Add a Department":
      const deptOptions = await inquirer.prompt(Menus.addDepartment());
      query = Queries.addDepartment();
      const { proceed: goAddDept } = await inquirer.prompt(Menus.confirm());
      if (!goAddDept) {
        return selectMenuOption();
      }
      runQuery(query, deptOptions, updateApp);
      return
    case "Remove an Employee":
      const { employee } = await inquirer.prompt(Menus.removeEmployee());
      query = Queries.removeEmployee();
      const { proceed: goRemoveEmp } = await inquirer.prompt(Menus.confirm());
      if (!goRemoveEmp) {
        return selectMenuOption();
      }
      runQuery(query, parseRemoveEmployee(employee), updateApp)
    default:
      connection.end();
      return;
  }
}

//function to parse addEmployee response into query for connection.query
function parseAddEmployee(source) {
  //find the matching id for the selected role
  const newRole = currentRoles.find((el) => el.role === source.role);
  const newRoleId = newRole ? newRole.id : null;
  //find matching id for selected manager
  const newManager = currentEmployees.find((el) => el.employee === source.manager);
  const newManagerId = newManager ? newManager.id : null;
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
  const newDept = currentDepartments.find((el) => el.department === source.department);
  const newDeptId = newDept ? newDept.id : null;
  //return object to be used as selector in connection.query
  return {
    title: source.title,
    salary: source.salary,
    department_id: newDeptId,
  };
}

//function to parse removeEmployee response in an selector for connection.query
function parseRemoveEmployee(source) {
  const targetEmployeeId = currentEmployees.find(el => el.employee === source.employee).id;
  return [targetEmployeeId];
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
    "SELECT CONCAT(first_name,' ',last_name) AS employee, id FROM employee",
    (err, res) => {
      currentEmployees = res;
      getDepartments()
    }
  );
}

//function to get all departments currently in the database
function getDepartments() {
  connection.query(
    "SELECT name AS department, id FROM department;",
    (err, res) => {
      currentDepartments = res;
      getRoles()
    }
  );
}

//function to get all roles currently in the database
function getRoles() {
  connection.query(
    "SELECT title AS role, id FROM role;",
    (err, res) => {
      currentRoles = res;
      selectMenuOption()
    }
  );
}
//----------------------------------------------------

