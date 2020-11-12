const util = require("util");
const fs = require("fs");
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
            "Update Employee Information"
        ]
    }).then(function(choice) {

        switch (choice.userRequest) {
            case "View All Employees": viewAll(); break;
            case "View All Employees by Department": viewDep(); break;
            case "View All Employees by Manager": viewMan(); break;
            case "Add Employee": addEmp(); break;
            case "Remove Employee": removeEmp(); break;
            case "Update Employee Information": updateEmp(); break;
        }
    });
};

// VIEW ALL EMPLOYEE DATA

function viewAll(){

    var query = connection.query(
        "SELECT * FROM employees",
        function (err, res) {
            if (err) throw err;
            console.log("Rendering employees...");
            console.table(res);
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
                var query = connection.query(
                    `SELECT * FROM departments WHERE name = '${choice.depChoice}';`,
                    function(err, res) {
                        if (err) throw err;
                        var query = connection.query(
                            `SELECT * FROM roles WHERE department_id = '${res[0].id}';`,
                            function(err, result) {
                                if (err) throw err;
                                console.log(`Fetching ${choice.depChoice} Department Data...`);
                                for (var i = 0; i < result.length; i++) {
                                    var query = connection.query(
                                        `SELECT * FROM employees WHERE role_id = '${result[i].id}';`,
                                        function(err, data) {
                                            if (err) throw err;
                                            console.table(data)
                                        }
                                    )
                                }
                            }
                        )
                    }      
                ); 
            });
        }
    )


    runApp();
};

// VIEW EMPLOYEES BY MANAGER

function viewMan(){
    
    var query = connection.query(
        "SELECT * FROM employees INNER JOIN roles ON roles.id = employees.role_id WHERE roles.manager = 1;",
        function(err, res) {
            if (err) throw err;
            inquirer.prompt({
                type: "list",
                message: "Select a manager: ",
                name: "manChoice",
                choices: function() {
                    const managers = [];
                    for (var i = 0; i < res.length; i++) {
                        managers.push(res[i].first_name + " " + res[i].last_name);
                    }

                    return managers;
                } 
            }).then(function(choice) {
                
                var query = connection.query(
                    `SELECT * FROM employees WHERE manager = '${choice.manChoice}';`,
                    function(err, result) {
                        if (err) throw (err);
                        console.table(result);
                        runApp();
                    }
                )
            })

        }
    )

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
                message: "employee role: ",
                name: "roleChoice",
                choices: function() {   
                    console.log(res.length);
                    const roles = [];
                    for (var i = 0; i < res.length; i++) {
                        roles.push(res[i].title);
                    }
                    
                    return roles;
                }
            },
            {
                type: "list",
                message: "employee manager: ",
                name: "manChoice",
                choices: pullManagers()
            }
        ]).then(function(choice) {
    
            var query = connection.query(
                `INSERT INTO employees (first_name, last_name, role_id, manager)
                VALUES ('${choice.firstName}', '${choice.lastName}', (SELECT id FROM roles WHERE title = '${choice.roleChoice}'), '${choice.manChoice}');`,
                function(err) {
                    if (err) throw err;
                    console.log(`${choice.firstName} ${choice.lastName} added to employee database...`)
                    runApp();
                }
            )
        });

    })
};

function removeEmp(){

    var query = connection.query(
        "SELECT * FROM employees",
        function (err, res) {
            if (err) throw err;

            inquirer.prompt({
                type: "list",
                message: "Choose employee to remove: ",
                name: "remEmp",
                choices: function() {
                    var employees = [];
                    for (var i = 0; i < res.length; i++) {
                        employees.push(res[i].first_name + " " + res[i].last_name);
                    }

                    return employees;
                }
            }).then(function(choice) {
                console.log(`Removing ${choice.remEmp} as an employee...`);
                var nameArray = choice.remEmp.split(" ");
                var firstName = nameArray[0];
                var lastName = nameArray[1];

                var query = connection.query(
                    `DELETE FROM employees WHERE first_name = '${firstName}' AND last_name = '${lastName}';`,
                    function (err) {
                        if (err) throw err;
                        console.log("Employee deleted.");
                        runApp();
                    }
                );
            });
        }
    )
};

function updateEmp(){

    var query = connection.query(
        "SELECT * FROM employees",
        function (err, res) {
            if (err) throw err;

            inquirer.prompt([
                {
                    type: "list",
                    message: "Which employee's information would you like to edit?",
                    name: "selEmp",
                    choices: function() {
                        var employees = [];
                        for (var i = 0; i < res.length; i++) {
                            employees.push(res[i].first_name + " " + res[i].last_name);
                        }
                        return employees;
                    }   
                },
                {
                    type: "list",
                    message: "Which of their information would you like to edit?",
                    name: "info",
                    choices: [
                        "first_name",
                        "last_name",
                        "manager",
                        "role_id",
                        "salary"
                    ]
                }
            ]).then(function(choice) {
                var nameArray = choice.selEmp.split(" ");
                var firstName = nameArray[0];
                var lastName = nameArray[1];

                // NEW NAME
                if (choice.info === "first_name" || "last_name") {
                    inquirer.prompt({
                        type: "input",
                        message: `Input new ${choice.info}: `,
                        name: "newName"
                    }).then(function(name) {
                        var query = connection.query(
                            `UPDATE employees SET ${choice.info} = '${name.newName}' WHERE first_name = '${firstName}' AND last_name = '${lastName}';`,
                            function(err) {
                                if (err) throw err;
                                console.log("Employee name succesfully updated.");
                                runApp();
                            }
                        )
                    })
                } 
            });
        }
    );

    
};  

// OTHERS

function pullManagers() {

    var managerArray= ["None"];
    connection.query("SELECT * FROM employees INNER JOIN roles ON roles.id = employees.role_id WHERE roles.manager = 1;", (err, data) => {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {
            managerArray.push(data[i].first_name + " " + data[i].last_name);
        }

        return managerArray;
    });

    return managerArray;
};
