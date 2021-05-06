const mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  password: 'password',
  database: 'business_db'
});

function viewAllEmployees() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title,  department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id",
    (err, res) => {
      if (err) throw err;
      console.log('\n******\n******\n');
      console.table(res);
      init();
    }
  );
}

function viewAllRoles() {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    console.log('******\n********\n******');
    console.table(res);
    init();
  });
}

function viewDepartments() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.log('******\n********\n******');
    console.table(res);
    init();
  });
}

function addEmployee() {
  let roleChoices = [];
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    res.forEach((role) => {
      roleChoices.push({ name: role.title, value: role.id });
    });
  });
  let managerChoices = [];
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    res.forEach((potentialManager) => {
      managerChoices.push({
        name: potentialManager.first_name + ' ' + potentialManager.last_name,
        value: potentialManager.id
      });
    });
  });
  managerChoices.push('None');
  inquirer
    .prompt([
      {
        name: 'first_name',
        message: 'What is the first name of the employee?',
        type: 'input'
      },
      {
        name: 'last_name',
        message: 'What is the last name of the employee?',
        type: 'input'
      },
      {
        name: 'role_id',
        message: 'What role will this employee have?',
        type: 'list',
        choices: roleChoices
      },
      {
        name: 'manager_id',
        message: "Select Employee's Manager",
        type: 'list',
        choices: managerChoices
      }
    ])
    .then((answer) => {
      // Use user feedback for... whatever!!
      if (answer.manager_id === 'None') {
        connection.query(
          `INSERT INTO employee (first_name, last_name, role_id) VALUES ("${answer.first_name}", "${answer.last_name}", "${answer.role_id}")`,
          (err, res) => {
            if (err) throw err;
            viewAllEmployees();
          }
        );
      } else {
        connection.query(
          `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.first_name}", "${answer.last_name}", "${answer.role_id}", "${answer.manager_id}")`,
          (err, res) => {
            if (err) throw err;
            viewAllEmployees();
          }
        );
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        console.log(error);
      } else {
        init();
      }
    });
}

function addRole() {
  let departmentChoices = [];
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    res.forEach((department) => {
      departmentChoices.push({ name: department.name, value: department.id });
    });
  });
  inquirer
    .prompt([
      {
        name: 'title',
        message: 'What is the title of your role?',
        type: 'input'
      },
      {
        name: 'salary',
        message: 'What is the salary of this role?',
        type: 'input'
      },
      {
        name: 'deptChoice',
        message: 'What is the department that this role falls under?',
        type: 'list',
        choices: departmentChoices
      }
    ])
    .then((answer) => {
      // Use user feedback for... whatever!!
      connection.query(
        `INSERT INTO role (title, salary, department_id) VALUES ("${answer.title}", "${answer.salary}", "${answer.deptChoice}")`,
        (err, res) => {
          if (err) throw err;
          viewAllRoles();
        }
      );
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        console.log(error);
      } else {
        init();
      }
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: 'deptName',
        message: 'What is the name of the Department you wish to add?',
        type: 'input'
      }
    ])
    .then((answer) => {
      // Use user feedback for... whatever!!
      connection.query(
        `INSERT INTO department (name) VALUES ("${answer.deptName}")`,
        (err, res) => {
          if (err) throw err;
          viewDepartments();
        }
      );
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log(error);
        // Prompt couldn't be rendered in the current environment
      } else {
        init();
      }
    });
}

function updateEmployeeRole() {
  connection.query(
    'SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id AS manager, role.title, role.salary, department.name AS department FROM ((employee  INNER JOIN role ON employee.role_id = role.id) INNER JOIN department ON role.department_id = department.id);',
    (err, res) => {
      if (err) throw err;
      console.log('******\n********\n******');
      console.table(res);
    }
  );
  const employeeChoices = [];
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    res.forEach((employee) => {
      employeeChoices.push({
        name: employee.first_name + ' ' + employee.last_name,
        value: employee.id
      });
    });
  });
  const roleChoice = [];
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    res.forEach((role) => {
      roleChoice.push({ name: role.title, value: role.id });
    });
  });
  setTimeout(function () {
    inquirer
      .prompt([
        {
          name: 'employeeid',
          message: "Who's role would you like to update?",
          type: 'list',
          choices: employeeChoices
        },
        {
          name: 'roleid',
          message: 'What is their new role?',
          type: 'list',
          choices: roleChoice
        }
      ])
      .then(({ employeeid, roleid }) => {
        // Use user feedback for... whatever!!
        connection.query(
          'UPDATE employee SET role_id=? WHERE id=?',
          [roleid, employeeid],
          (err, res) => {
            if (err) throw err;
            viewAllEmployees();
          }
        );
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
          console.log(error);
        } else {
          init();
        }
      });
  }, 1000);
}

function init() {
  inquirer
    .prompt([
      /* Pass your questions in here */
      {
        name: 'initialSelection',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all Employees',
          'View all Roles',
          'View all Departments',
          'Add Employee',
          'Add Role',
          'Add Department',
          'Update Employee Role',
          'QUIT'
        ]
      }
    ])
    .then((answer) => {
      // Use user feedback for... whatever!!
      console.log(answer.initialSelection);
      //   Use user feedback for... whatever!!
      switch (answer.initialSelection) {
        case 'View all Employees':
          viewAllEmployees();
          break;
        case 'View all Roles':
          viewAllRoles();
          break;
        case 'View all Departments':
          viewDepartments();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        default:
          process.exit();
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        console.log(error);
      }
    });
}
init();
