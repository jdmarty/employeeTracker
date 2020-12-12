//npm packages
const inquirer = require("inquirer");
const mysql = require("mysql");

//connection module
const connection = require("./config/connection");

//utilities
const { mainMenu } = require("./util/prompts");
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
    getCurrentEmployees()
});

//main menu switchboard
async function selectMenuOption() {
    const { mainSelection } = await inquirer.prompt(mainMenu);
    let query
    switch (mainSelection) {
        case "View All Employees":
            query = new Select().searchAll()
            runQuery(query, selectMenuOption);
            return;
        case "View Employees by Department":
            return;
        case "View Employees by Manager":
            return;
        default:
            connection.end();
            return;
    };
};

//function to run a basic query
function runQuery(query, cb) {
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(res);
        if (cb) cb();
    })
}






