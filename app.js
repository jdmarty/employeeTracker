//npm packages
const inquirer = require("inquirer");
const chalk = require("chalk");

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
  console.log("\nWelcome to Node Employee Tracking");
  updateApp();
});

//MAIN MENU SWITCHBOARD---------------------------------------------------------
async function selectMenuOption() {
  //create Menus and Query classes
  const Menus = new Prompt(currentEmployees, currentDepartments, currentRoles);
  const Queries = new Query();
  console.log("\n");
  //Pull out the menu selection for switchboard
  const { main } = await inquirer.prompt(Menus.mainMenu());
  let query, selections, proceed, message
  //Switchboard for main menu
  switch (main) {
    case "View All Employees":
      //generate and run query
      query = Queries.searchAll();
      runQuery(query, null, selectMenuOption);
      return;
    case "View Employees by Department":
      //pull out the department from the prompt response
      const { department } = await inquirer.prompt(Menus.departmentsMenu());
      query = Queries.searchBy("department.name");
      //generate and run query
      runQuery(query, [department], selectMenuOption);
      return;
    case "View Employees by Role":
      //pull out the role from the prompt response
      const { role } = await inquirer.prompt(Menus.rolesMenu());
      //generate and run query
      query = Queries.searchBy("role.title");
      runQuery(query, [role], selectMenuOption);
      return;
    case "View Employees by Manager":
      //pull out the role from the prompt response
      const { manager } = await inquirer.prompt(Menus.managersMenu());
      //generate and run query
      query = Queries.searchBy("CONCAT(m.first_name,' ',m.last_name)");
      runQuery(query, [manager], selectMenuOption);
      return;
    case "Add an Employee":
      //get user input
      selections = await inquirer.prompt(Menus.addEmployee());
      //wait for user to confirm
        proceed = await confirm(Menus);
        if (!proceed) return selectMenuOption();
      //generate message/query and run query with parsed selections
      query = Queries.add("employee");
      message = `Added employee ${selections.first_name} ${selections.last_name}`;
      runQuery(query, parseAddEmployee(selections), updateApp, message);
      return;
    case "Add a Role":
      //get user input
      selections = await inquirer.prompt(Menus.addRole());
      //wait for user to confirm
        proceed = await confirm(Menus);
        if (!proceed) return selectMenuOption();
      //generate message/query and run query with parsed selections
      query = Queries.add("role");
      message = `Added role ${selections.title}`;
      runQuery(query, parseAddRole(selections), updateApp, message);
      return;
    case "Add a Department":
      //get user input
      selections = await inquirer.prompt(Menus.addDepartment());
      //wait for user to confirm
        proceed = await confirm(Menus);
        if (!proceed) return selectMenuOption();
      //generate message/query and run query with parsed selections
      query = Queries.add("department");
      message = `Added department ${selections.name}`;
      runQuery(query, selections, updateApp, message);
      return;
    case "Remove an Employee":
      //get user input
      selections = await inquirer.prompt(Menus.employeesMenu());
      //wait for user to confirm
        proceed = await confirm(Menus);
        if (!proceed) return selectMenuOption();
      //generate message/query and run query with parsed selections
      query = Queries.removeEmployee();
      message = `Removed employee ${selections.employee}`;
      runQuery(query, parseRemoveEmployee(selections), updateApp, message);
      return;
    case "Update Employee Role":
      //get user input
      selections = await inquirer.prompt(Menus.updateEmployeeRole());
      //wait for user to confirm
        proceed = await confirm(Menus);
        if (!proceed) return selectMenuOption();
      //generate message/query and run query with parsed selections
      query = Queries.updateEmployee("role_id");
      message = `Updated employee ${selections.employee} with new role ${selections.role}`;
      runQuery(query, parseUpdateEmployeeRole(selections), updateApp, message);
      return;
    case "Update Employee Manager":
      //get user input
      selections = await inquirer.prompt(Menus.updateEmployeeManager());
      //wait for user to confirm
        proceed = await confirm(Menus);
        if (!proceed) return selectMenuOption();
      //generate message/query and run query with parsed selections
      query = Queries.updateEmployee("manager_id");
      message = `Updated employee ${selections.employee} with new manager ${selections.manager}`;
      runQuery(query, parseUpdateEmployeeManager(selections), updateApp, message);
      return;
    case "View Utilized Budget by Department":
      //pull out department from the prompt response
      const { department: utilDepartment } = await inquirer.prompt(Menus.departmentsMenu());
      //generate and run query
      query = Queries.getDepartmentBudget();
      runQuery(query, [utilDepartment], selectMenuOption);
      return;
    default:
      //clear console and close selection
      console.clear();
      connection.end();
      return;
  }
}
//------------------------------------------------------------------

//function to run a query
function runQuery(query, selector, cb, log) {
  connection.query(query, selector, (err, res) => {
    //Log error message
    if (err) console.log(chalk.red('\n'+err.sqlMessage));
    else {
      //Generate a table if an array is sent
      if (res.length) console.table(res);
      //log message if one is provided
      if (log) console.log(chalk.green('\n'+log));
    }
    // run the call back message if one is provided
    if (cb) cb();
  });
};

//run a confirm prompt
function confirm(Menus) {
  return inquirer.prompt(Menus.confirm()).then(res => res.proceed);
};

//ID Finders---------------------------------------------------------
//find an employee id from the selected name
function getEmployeeId(name) {
  return currentEmployees.find(el => el.employee === name).id;
};

//find a role id from the selected name
function getRoleId(name) {
  return currentRoles.find(el => el.role === name).id;
};

//find a department id from the selected name
function getDeptId(name) {
  return currentDepartments.find(el => el.department === name).id;
};

//find a manager id from the selected name
function getManagerId(name) {
  const manager = currentEmployees.find((el) => el.employee === name);
  return manager ? manager.id : null;
};
//-------------------------------------------------------------------

//SELECTOR PARSERS---------------------------------------------------
//parse add('employee') response into query for connection.query
function parseAddEmployee(source) {
  //find the matching id for the selected role
  const newRoleId = getRoleId(source.role)
  //find the matching id for the selected manager
  const newManagerId = getManagerId(source.manager);
  //return object to be used as selector in connection.query
  return {
    first_name: source.first_name,
    last_name: source.last_name,
    role_id: newRoleId,
    manager_id: newManagerId,
  };
};

//parse add('role') response into an object for connection.query
function parseAddRole(source) {
  //find the matching id for the selected department
  const newDeptId = getDeptId(source.department)
  //return object to be used as selector in connection.query
  return {
    title: source.title,
    salary: source.salary,
    department_id: newDeptId,
  };
};

//parse removeEmployee response into a selector for connection.query
function parseRemoveEmployee(source) {
  //find the matching id for the selected employee
  const targetEmployeeId = getEmployeeId(source.employee);
  return [targetEmployeeId];
};

//parse updateEmployee('role_id') response into a selector for connection.query
function parseUpdateEmployeeRole(source) {
  //find the matching id for the selected employee
  const targetEmployeeId = getEmployeeId(source.employee);
  //find the matching id for the selected role
  const newRoleId = getRoleId(source.role);
  return [newRoleId, targetEmployeeId];
};

//parse updateEmployee('manager_id) response into a selector for connection.query
function parseUpdateEmployeeManager(source) {
  //find the matching id for the selected employee
  const targetEmployeeId = getEmployeeId(source.employee);
  //find the matching id for the selected manager
  const newManagerId = getManagerId(source.manager);
  return [newManagerId, targetEmployeeId];
};
//------------------------------------------------------------------------

//UPDATE APP CHAIN--------------------------------------------------------
//function to update app state to current database
function updateApp() {
  getEmployees();
};

//function to get all employees currently in the database
function getEmployees() {
  connection.query(
    "SELECT CONCAT(first_name,' ',last_name) AS employee, id FROM employee",
    (err, res) => {
      if (err) throw err;
      currentEmployees = res;
      getDepartments();
    });
};

//function to get all departments currently in the database
function getDepartments() {
  connection.query(
    "SELECT name AS department, id FROM department;",
    (err, res) => {
      if (err) throw err;
      currentDepartments = res;
      getRoles();
    });
};

//function to get all roles currently in the database
function getRoles() {
  connection.query(
    "SELECT title AS role, id FROM role;",
    (err, res) => {
      if (err) throw err;
      currentRoles = res;
      selectMenuOption();
    });
};
//------------------------------------------------------------------------

