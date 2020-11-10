const { readFileSync } = require("fs");
const inquirer = require("inquirer");
const mysql = require("mysql");
// const { allowedNodeEnvironmentFlags } = require("process");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: " ",
    database: "employee_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log(`connected as id ${connection.thread}`);
    runApp();
});

// RUN APP

function runApp() {
    console.log("running app...")
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "userRequest",
        choices: [
            "View All Employees", 
            "View All Employees by Department", 
            "View All Employees by Manager", 
            "Add Employee", 
            "Remove Employee", 
            "Update Employee", 
            "Update Employee Role", 
            "Update Employee Manager"
        ]
    }).then(function(choice) {
        switch (choice.userRequest) {
            case "View All Employees": viewAll();
            case "View All Employess by Department": viewDep(); break;
            case "View All Employees by Manager": viewMan(); break;
            case "Add Employee": addEmp(); break;
            case "Remove Employee": removeEmp(); break;
            case "Update Employee": updateEmp(); break;
            case "Update Employee Role": updateRol(); break;
            case "Update Employee Manager": updateMan(); break;
        }
    });
};

// VIEW ALL EMPLOYEES

function viewAll(){
    var query = connection.query(
        "SELECT * FROM employees",
        function (err, res) {
            if (err) throw err;
            console.log(" Current employee data...");
        }
    );

    runApp();
};

// VIEW EMPLOYEES BY DEPARTMENT

// function viewDep(){

//     inquirer.prompt({
//             type: "list",
//             message: "Which department's employees would you like to view?",
//             name: "deptChoice",
//             choices: ["Administrative", "Engineering", "Design", "Finance", "Sales", "Legal"]
//         }).then(function(choice){
//             var query = connection.query(
//                 `SELECT * FROM employees WHERE department_id.name = ${choice.deptChoice}`,
//                 function (err, res) {
//                     if (err) throw err;
//                     console.log(`${choice.deptChoice} department data...`)
//                     return res;
//             }
//         );

//         runApp();
//     })

// };

// VIEW EMPLOYEES BY MANAGER

function viewMan(){

};

// ADD NEW EMPLOYEE

function addEmp(){
    console.log("input new employee data...")

    connection.query("Select * FROM roles", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                messages: "first name: ",
                name: "firstName"
            },
            {
                type: "input",
                messages: "last name: ",
                name: "lastName"
            },
            {
                type: "list",
                message: "employee role : ",
                name: "roleChoice",
                choices: function() {
                    const roles = [];
                    for (var i = 0; i < res.role; i++) {
                        roles.push(res[i].title);
                    }

                    return roles;
                }
            },
            {
                type: "input",
                message: "employee salary : ",
                name: "salaryChoice",
            }
        ]).then(function(choice) {
    
            var query = connection.query(
                `INSERT INTO employee_db.role (title, salary, department_id) 
                SELECT '${choice.roleChoice}', '${choice.salaryChoice}', '${choice.depChoice}', name FROM employee_db.department LIMIT 1;`
            )
    
    
        });

    })

};

function removeEmp(){

};

function updateEmp(){

};

function updateRol(){

};

function updateMan() {

};