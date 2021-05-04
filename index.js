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
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    console.table(res);
  });
  init();
}

function viewAllRoles() {}

function viewEmployeesByDepartment() {}

function viewEmployeesByManager() {}

function addEmployee() {}

function removeEmployee() {}

function updateEmployeeRole() {
  let employeeChoice = [];
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    console.log(res);
    res.forEach((emp) => {
      employeeChoice.push({ name: emp.first_name, value: emp.id });
    });
  });
  console.log(employeeChoice);
  let choice = [];
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    res.forEach((role) => {
      choice.push({ name: role.title, value: role.id });
    });
  });
  inquirer
    .prompt([
      /* Pass your questions in here */
      {
        name: 'first_name',
        message: "Who's role would you like to update?",
        type: 'list',
        choices: employeeChoice
      },
      {
        name: 'role',
        message: 'What is their role?',
        type: 'list',
        choices: choice
      }
    ])
    .then((answers) => {
      console.log(answers);
      // Use user feedback for... whatever!!
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
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
