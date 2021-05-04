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

function viewAllEmployees() {}

function viewAllRoles() {}

function viewEmployeesByDepartment() {}

function viewEmployeesByManager() {}

function addEmployee() {}

function removeEmployee() {}

function updateEmployeeRole() {}

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
      console.log(answer.initialSearch);
      //   Use user feedback for... whatever!!
      switch (answer.initialSearch) {
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
