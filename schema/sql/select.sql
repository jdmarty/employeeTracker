-- Select all employees
SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, CONCAT(m.first_name,' ',m.last_name) AS Manager, role.salary AS Salary
FROM employee e
INNER JOIN role ON e.role_id = role.id
INNER JOIN department ON role.department_id = department.id
LEFT JOIN employee m ON e.manager_id = m.id

-- Select by department
SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, CONCAT(m.first_name,' ',m.last_name) AS Manager, role.salary AS Salary
FROM employee e
INNER JOIN role ON e.role_id = role.id
INNER JOIN department ON role.department_id = department.id
LEFT JOIN employee m ON e.manager_id = m.id
WHERE department.name = 'Admin'

-- Select by employee name
SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, CONCAT(m.first_name,' ',m.last_name) AS Manager, role.salary AS Salary
FROM employee e
INNER JOIN role ON e.role_id = role.id
INNER JOIN department ON role.department_id = department.id
LEFT JOIN employee m ON e.manager_id = m.id
WHERE CONCAT(m.first_name,' ',m.last_name) = 'Drew Pullman'

-- Select by role
SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, CONCAT(m.first_name,' ',m.last_name) AS Manager, role.salary AS Salary
FROM employee e
INNER JOIN role ON e.role_id = role.id
INNER JOIN department ON role.department_id = department.id
LEFT JOIN employee m ON e.manager_id = m.id
WHERE role.title = 'Line Leader'

-- Select sum of salaries by department
SELECT department.name, SUM(role.salary)
FROM employee
INNER JOIN role ON employee.role_id = role.id
INNER JOIN department ON role.department_id = department.id
WHERE department.name = "Production";
