class Query {
  constructor() {}
  searchAll() {
    return (
      "SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, CONCAT(m.first_name,' ',m.last_name) AS Manager, role.salary AS Salary " +
      "FROM employee e " +
      "INNER JOIN role ON e.role_id = role.id " +
      "INNER JOIN department ON role.department_id = department.id " +
      "LEFT JOIN employee m ON e.manager_id = m.id"
    );
  }

  searchByDepartment() {
    return this.searchAll() + " WHERE department.name = ?";
  }

  searchByRole() {
    return this.searchAll() + " WHERE role.title = ?";
  }

  searchByManager() {
    return this.searchAll() + " WHERE CONCAT(m.first_name,' ',m.last_name) = ?";
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
      "SELECT SUM(role.salary) AS utilizedBudget " +
      "FROM employee " +
      "INNER JOIN role ON employee.role_id = role.id " +
      "INNER JOIN department ON role.department_id = department.id " +
      "WHERE department.name = ? "
    );
  }
}

module.exports = Query;
