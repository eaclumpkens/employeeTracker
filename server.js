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
            case "View All Employees": viewAll(); break;
            case "View All Employees by Department": viewDep(); break;
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
    const query = connection.query(
        "SELECT * FROM employees",
        function (err, res) {
            if (err) throw err;
            console.log(res);

            runApp();
        }
    );
};

// VIEW EMPLOYEES BY DEPARTMENT

function viewDep(){
    console.log("Querying departments...");

    const query = connection.query(
        "SELECT * FROM departments",
        function(err, res) {
            if (err) throw err;
            
            inquirer.prompt({
                type: "list",
                message: "Choose a department to pull up: ",
                name: "depChoice",
                choices: function() {
                    const depts = [];
                    for (var i = 0; i < res.length; i++) {
                        depts.push(res[i].name);
                    }

                    return depts;
                }
            }).then(function(choice) {
                console.log(`Fetching ${choice.depChoice} Department Data...`);
                
                var query = connection.query(
                    `SELECT * FROM employee_db.departments WHERE name = '${choice.depChoice}';`,
                    function(err, res) {

                        if (err) throw err;
                        var query = connection.query(
                            `SELECT * FROM roles WHERE department_id = '${res[0].id}';`,
                            function(err, result) {

                                if (err) throw err;
                                var query = connection.query(
                                    `SELECT * FROM employees WHERE role_id = '${result[0].id}';`,
                                    function(err, data) {
                                        if (err) throw err;
                                        console.log(data);
                                        runApp();
                                    }
                                )
                            }
                        )
                    }
                );

            });
        }
    )

};

// VIEW EMPLOYEES BY MANAGER

function viewMan(){

};

// ADD NEW EMPLOYEE

function addEmp(){
    console.log("input new employee data...")

    connection.query("SELECT * FROM roles", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "employee first name: ",
                name: "firstName"
            },
            {
                type: "input",
                message: "employee last name: ",
                name: "lastName"
            },
            {
                type: "list",
                message: "employee role : ",
                name: "roleChoice",
                choices: function() {
                    const roles = [];
                    for (var i = 0; i < res.length; i++) {
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
            


            runApp();
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