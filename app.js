//npm packages
const inquirer = require("inquirer");

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
  let query, selections, proceed
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
      runQuery(query, [manager], selectMenuOption);
      return;
    case "Add an Employee":
      selections = await inquirer.prompt(Menus.addEmployee());
      proceed = await confirm(Menus);
      if (!proceed) {
        return selectMenuOption();
      }
      query = Queries.add('employee');
      runQuery(query, parseAddEmployee(selections), updateApp);
      return;
    case "Add a Role":
      selections = await inquirer.prompt(Menus.addRole());
      proceed = await confirm(Menus);
      if (!proceed) {
        return selectMenuOption();
      }
      query = Queries.add('role');
      runQuery(query, parseAddRole(selections), updateApp);
      return;
    case "Add a Department":
      selections = await inquirer.prompt(Menus.addDepartment());
      proceed = await confirm(Menus);
      if (!proceed) {
        return selectMenuOption();
      }
      query = Queries.add('department');
      runQuery(query, selections, updateApp);
      return;
    case "Remove an Employee":
      selection = await inquirer.prompt(Menus.employeesMenu());
      proceed = await confirm(Menus);
      if (!proceed) {
        return selectMenuOption();
      }
      query = Queries.removeEmployee();
      runQuery(query, parseRemoveEmployee(selection), updateApp);
      return;
    case "Update Employee Role":
      selections = await inquirer.prompt(Menus.updateEmployeeRole());
      proceed = await confirm(Menus);
      if (!proceed) {
        return selectMenuOption();
      }
      query = Queries.updateEmployee('role_id');
      runQuery(query, parseUpdateEmployeeRole(selections), updateApp);
      return;
    case "Update Employee Manager":
      selections = await inquirer.prompt(Menus.updateEmployeeManager());
      proceed = await confirm(Menus);
      if (!proceed) {
        return selectMenuOption();
      }
      query = Queries.updateEmployee('manager_id');
      runQuery(query, parseUpdateEmployeeManager(selections), updateApp);
      return;
    case "View Utilized Budget by Department":
      const { department: utilDepartment } = await inquirer.prompt(Menus.departmentsMenu());
      query = Queries.getDepartmentBudget();
      runQuery(query, [utilDepartment], selectMenuOption);
      return;
    default:
      console.clear();
      connection.end();
      return;
  }
}

//function to run a query
function runQuery(query, selector, cb) {
  connection.query(query, selector, (err, res) => {
    if (err) console.log(err.sqlMessage);
    if (res.length) console.table(res);
    if (cb) cb();
  });
};

//run a confirm prompt
function confirm(Menus) {
  return inquirer.prompt(Menus.confirm()).then(res => res.proceed);
};

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

//parse updateEmployeeRole response into a selector for connection.query
function parseUpdateEmployeeRole(source) {
  //find the matching id for the selected employee
  const targetEmployeeId = getEmployeeId(source.employee);
  //find the matching id for the selected role
  const newRoleId = getRoleId(source.role);
  return [newRoleId, targetEmployeeId];
};

//parse updateEmployeeManager response into a selector for connection.query
function parseUpdateEmployeeManager(source) {
  //find the matching id for the selected employee
  const targetEmployeeId = getEmployeeId(source.employee);
  //find the matching id for the selected manager
  const newManagerId = getManagerId(source.manager);
  return [newManagerId, targetEmployeeId];
};

//UPDATE APP CHAIN--------------------------------------------
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
//---------------------------------------------------------

