# Node Employee Tracker
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
## Links
- [Respository](https://github.com/jdmarty/employeeTracker)
- [Demonstration](https://drive.google.com/file/d/1E-85fHsOSyAot6CCjN1YBDAZ50Ncp7BX/view?usp=sharing)

![Employee Tracker App](https://github.com/jdmarty/employeeTracker/blob/main/Assets/finishedgif.gif)

## Description

This node based command line application connects to a database of employees, departments, and roles and allows the user to view employees by department, role, and manager, add new employees, roles, and departments, update employees, remove employees, and view budget utilization metrics

## Notes
- Run this application in a full screen command line for optimal presentation

## Installation
1. Clone the github repo from the following link [Repo](https://github.com/jdmarty/employeeTracker).
2. Update the .env.EXAMPLE file with the username and password for your desired database.
3. Remove the .EXAMPLE extension from the .env file.
4. Run the code in employeeTracker_db.sql file in a SQL workbench to create the database that will be connected based on the information in the .env file
5. If you would like to see how the app works, import the csv files from the seeds folder into the appropriate tables in the employeetracker_db database.
6. Open a command line in the root folder and run "node app.js"

## Usage 
### View Employees
- Select View all Employees, View Employees by Department, View Employees by Deparment, or View Employees by Manager to print a table of employees.
- If you select and option other than View All Employees, you will be asked to select another property by which employees will be sorted. Once this property is selected, a table will be printed showing employees that match the supplied criteria

### Add 
- Select Add an Employee, Add a Department, or Add a Role to insert new data into the database
- Answer all provided prompts then confirm your selection to add information to the database
- A message will be printed in green if data is successfully added to the database

### Remove
- Select Remove an Employee to remove data from the employee table
- Choose the name of the employee you want to remove from the list then confirm to delete this employee
- A message will be printed in green if the data is successfully deleted

### Update
- Select Update Employee Role or Update Employee Manager to update an existing entry in the employees table
- Select an employee name from the provided list to choose an employee to update
- Select a new role or manager for this employee to update their entry
- A message will be printed in green if the data is successfully updated

### View Budget
- Select View Utilized Budget by Department to see the combined salaries of all employees in that department
- Select a department from the provided list to print a table showing the utilized budget for that department

### License
This project uses the ISC license
---------------------------------------------------------------------------
