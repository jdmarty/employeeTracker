class Select {
  constructor() {
    (this.byDepartment = "department.name"),
      (this.byRole = "role.title"),
      (this.byManager = "CONCAT(m.first_name,' ',m.last_name)");
  }
  searchAll() {
    return (
      "SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, CONCAT(m.first_name,' ',m.last_name) AS Manager, role.salary AS Salary " +
      "FROM employee e " +
      "INNER JOIN role ON e.role_id = role.id " +
      "INNER JOIN department ON role.department_id = department.id " +
      "LEFT JOIN employee m ON e.manager_id = m.id"
    );
  }

  searchByDepartment(selector) {
    return this.all() + ` WHERE ${this.byDepartment} = '${selector}'`;
  }

  searchByManager(selector) {
    return this.all() + ` WHERE ${this.byManager} = '${selector}'`;
  }
}

module.exports = Select