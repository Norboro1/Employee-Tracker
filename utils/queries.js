const inquirer = require('inquirer');
const db = require('../db/connection');
const cTable = require('console.table');

const start = () => {
    inquirer.prompt({
        type: 'list',
        name: 'start',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'View employees by manager', 'View employees by department', 'Add a department', 'Add a role', 'Add an employee','Update an employee role', 'Delete a department', 'Delete a role', 'Delete an employee', 'View utilized budget of a department', 'Exit']
    }).then((answer) => {
        switch (answer.start) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'View employees by manager':
                viewEmployeesByManager();
                break;
            case 'View employees by department':
                viewEmployeesByDepartment();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Delete a department':
                deleteDepartment();
                break;
            case 'Delete a role':
                deleteRole();
                break;
            case 'Delete an employee':
                deleteEmployee();
                break;
            case 'View utilized budget of a department':
                ViewBudgetByDepartment();
                break;
            case 'Exit':
                db.end();
                break;
        }
    })
}

const deleteEmployee = () => {
    inquirer.prompt({
        type: 'input',
        name: 'id',
        message: 'What is the ID of the employee you would like to delete?'
    }).then((answer) => {
        db.query('DELETE FROM employee WHERE id = ?', answer.id, function (err, results) {
            if(err){
                console.log('Error deleting employee! Please ensure ID is valid.');
            } else {
                console.log('Employee deleted!');
            }
            start();
        });
    });
}

const viewDepartments = () => {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
        start();
    })
}

const deleteDepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'id',
        message: 'What is the ID of the department you would like to delete?'
    }).then((answer) => {
        db.query('DELETE FROM department WHERE id = ?', answer.id, function (err, results) {
            if(err){
                console.log(err);
            } else {
                console.log('Department deleted!');
            }
            start();
        });
    });
}

const viewRoles = () => {
    db.query('SELECT * FROM role', function (err, results) {
        console.table(results);
        start();
    })
}

const deleteRole = () => {
    inquirer.prompt({
        type: 'input',
        name: 'id',
        message: 'What is the ID of the role you would like to delete?'
    }).then((answer) => {
        db.query('DELETE FROM role WHERE id = ?', answer.id, function (err, results) {
            if(err){
                console.log('Error deleting role! Please ensure ID is valid.');
            } else {
                console.log('Role deleted!');
            }
            start();
        });
    });
}

const viewEmployees = () => {
    db.query('SELECT * FROM employee', function (err, results) {
        console.table(results);
        start();
    })
}

const viewEmployeesByManager = () => {
    inquirer.prompt({
        type: 'input',
        name: 'manager_id',
        message: 'What is the manager ID of the employees you would like to view?'
    }).then((answer) => {
        db.query('SELECT * FROM employee WHERE manager_id = ?', answer.manager_id, function (err, results) {
            console.table(results);
            start();
        });
    });
}

const viewEmployeesByDepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'department_id',
        message: 'What is the department ID of the employees you would like to view?'
    }).then((answer) => {
        db.query('SELECT employee.id, employee.first_name, employee.last_name, role_id, manager_id FROM employee JOIN role ON employee.role_id = role.id WHERE department_id = ?', answer.department_id, function (err, results) {
            console.table(results);
            start();
        });
    });
}

const addDepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'What is the name of the department you would like to add?'
    }).then((answer) => {
        db.query('INSERT INTO department (name) VALUES (?)', answer.department, function (err, results) {
            if(err){
                console.log('Error adding department! Please ensure department name is unique.');
            } else {
                console.log('Department added!');
            }
            start();
        })
    })
}

const addRole = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'role',
        message: 'What is the name of the role you would like to add?'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for this role?'
    },
    {
        type: 'input',
        name: 'department_id',
        message: 'What is the department ID for this role?'
    }]).then((answer) => {
        db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answer.role, answer.salary, answer.department_id], function (err, results) {
            if(err){
                console.log('Error adding role! Please ensure department ID is valid.');
            } else {
                console.log('Role added!');
            }
            start();
        })
    })
}

const addEmployee = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'first_name',
        message: 'What is the first name of the employee you would like to add?'
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What is the last name of the employee you would like to add?'
    },
    {
        type: 'input',
        name: 'role_id',
        message: 'What is the role ID for this employee?'
    },
    {
        type: 'input',
        name: 'manager_id',
        message: 'What is the manager ID for this employee? Simply press enter if none.'
    }]).then((answer) => {
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answer.first_name, answer.last_name, answer.role_id, answer.manager_id ? answer.manager_id : null], function (err, results) {
            if(err){
                console.log('Error adding employee! Please ensure role ID and manager ID are valid.');
            } else {
                console.log('Employee added!');
            }
            start();
        })
    })
}

const updateEmployeeRole = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'employee_id',
        message: 'What is the ID of the employee you would like to update?'
    },
    {
        type: 'input',
        name: 'role_id',
        message: 'What is the new role ID for this employee?'
    }]).then((answer) => {
        db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answer.role_id, answer.employee_id], function (err, results) {
            if(err){
                console.log('Error updating employee! Please ensure employee ID and role ID are valid.');
            } else {
                console.log('Employee updated!');
            }
            start();
        })
    })
}

const ViewBudgetByDepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'department_id',
        message: 'What is the department ID of the budget you would like to view?'
    }).then((answer) => {
        db.query('SELECT SUM(salary) AS total FROM employee INNER JOIN role ON employee.role_id = role.id WHERE department_id = ?', answer.department_id, function (err, results) {
            if(err){
                console.log('Error viewing budget! Please ensure department ID is valid.');
            } else {
                console.table(results);
            }
            start();
        });
    });
}

module.exports = { start };