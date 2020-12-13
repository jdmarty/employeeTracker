class Query {
  constructor() {
    this.selectAll =
      "SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, CONCAT(m.first_name,' ',m.last_name) AS Manager, role.salary AS Salary " +
      "FROM employee e " +
      "INNER JOIN role ON e.role_id = role.id " +
      "INNER JOIN department ON role.department_id = department.id " +
      "LEFT JOIN employee m ON e.manager_id = m.id "
  }
  searchAll() {
    return this.selectAll + 'ORDER BY department.name'
  }

  searchBy(column) {
    return this.selectAll + ` WHERE ${column} = ? ORDER BY department.name`;
  }

  add(table) {
    return `INSERT INTO ${table} SET ?`
  }

  removeEmployee() {
    return "DELETE FROM employee WHERE id = ?";
  }

  updateEmployee(column) {
    return `UPDATE employee SET ${column} = ? WHERE id = ?`
  }

  getDepartmentBudget() {
    return (
      "SELECT department.name, SUM(role.salary) AS utilizedBudget " +
      "FROM employee " +
      "INNER JOIN role ON employee.role_id = role.id " +
      "INNER JOIN department ON role.department_id = department.id " +
      "WHERE department.name = ? "
    );
  }
}

module.exports = Query;
