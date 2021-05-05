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
    'SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id AS manager, role.title, role.salary, department.name AS department FROM ((employee  INNER JOIN role ON employee.role_id = role.id) INNER JOIN department ON role.department_id = department.id);',
    (err, res) => {
      if (err) throw err;
      console.log('******\n********\n******');
      console.table(res);
    }
  );
  init();
}

function viewAllRoles() {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    console.log('******\n********\n******');
    console.table(res);
  });
  init();
}

function viewEmployeesByDepartment() {}

function viewEmployeesByManager() {}

function addEmployee() {}

function removeEmployee() {}

function updateEmployeeRole() {
  const employeeChoices = [];
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    res.forEach((employee) => {
      employeeChoices.push({ name: employee.first_name, value: employee.id });
    });
    console.log('Employee Choices', employeeChoices);
  });
  const roleChoice = [];
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    res.forEach((role) => {
      roleChoice.push({ name: role.title, value: role.id });
    });
    console.log('Role Choices', roleChoice);
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
        console.log(employeeid, roleid);
        // Use user feedback for... whatever!!
        connection.query(
          'UPDATE employee SET role_id=? WHERE id=?',
          [roleid, employeeid],
          (err, res) => {
            if (err) throw err;
            console.log(res);
          }
        );
        init();
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else went wrong
        }
      });
  }, 1000);
}

function updateEmployeeManager() {}

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
          'View employees by Department',
          'View employees by Manager',
          'Add Employee',
          'Remove Employee',
          'Update Employee Role',
          'Update Employee Manager'
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
        case 'View employees by Department':
          viewEmployeesByDepartment();
          break;
        case 'View employees by Manager':
          viewEmployeesByManager();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Remove Employee':
          removeEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'Update Employee Manager':
          updateEmployeeManager();
          break;
        default:
          connection.end();
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
}
init();
