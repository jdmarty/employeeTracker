-- Select a list of all department names
SELECT name AS Department FROM department;

-- Select a list of all employee names
SELECT CONCAT(employee.first_name,' ',employee.last_name) AS employee FROM employee;

-- Select a list of all role names
SELECT title AS Role FROM role;