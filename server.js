const figlet = require("figlet");
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

    figlet('Employee Tracker', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        runApp();
    });
 
});

// RUN APP

function runApp() {
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "userRequest",
        choices: [
            "View All Employees", 
            "View Departments",
            "View Roles",
            "View All Employees by Department", 
            "View All Employees by Manager", 
            "Add Employee", 
            "Edit Employee Information",
            "Remove Employee", 
            "Edit Departments",
            // "Edit Roles",
            "EXIT"
        ]
    }).then(function(choice) {

        switch (choice.userRequest) {
            case "View All Employees": viewAll(); break;
            case "View Departments": viewDepts(); break;
            case "View Roles": viewRoles(); break;
            case "View All Employees by Department": byDepts(); break;
            case "View All Employees by Manager": byMans(); break;
            case "Add Employee": addEmp(); break;
            case "Edit Employee Information": editEmp(); break;
            case "Remove Employee": removeEmp(); break;
            case "Edit Departments": editDepts(); break;
            case "Edit Roles": editRoles(); break;
            case "EXIT": connection.end(); break;
        }
    });
};

// VIEW DATA

function viewAll(){
    figlet('All Employees', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
    });

    var query = connection.query(
        "SELECT * FROM employees",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            runApp();
        }
    );
};

function viewDepts() {

    figlet('Departments', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
    });

    var query = connection.query(
        "SELECT * FROM departments",
        function(err, res) {
            if (err) throw err;
            console.table(res);
            runApp();
        }
    )
};

function viewRoles() {

    figlet('Roles', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
    });

    var query = connection.query(
        "SELECT * FROM roles",
        function(err, res) {
            if (err) throw err;
            console.table(res);
            runApp();
        }
    )
};

// VIEW EMPLOYEES BY DEPARTMENT

function byDepts(){
    console.log("Querying departments...");

    const query = connection.query(
        "SELECT * FROM departments",
        function(err, res) {
            if (err) throw err;
            inquirer.prompt({
                type: "list",
                message: "Choose a department to pull up: ",
                name: "deptChoice",
                choices: function() {
                    const depts = [];
                    for (var i = 0; i < res.length; i++) {
                        depts.push(res[i].name);
                    }

                    return depts;
                }
            }).then(function(choice) {
                connection.query (
                    `SELECT * FROM roles WHERE department_id = (SELECT id FROM departments WHERE name = '${choice.deptChoice}');`,
                    function(err, result) {
                        if (err) throw err;
                        for (var i = 0; i < result.length; i++) {
                            connection.query(
                                `SELECT * FROM employees WHERE role_id = ${result[i].id}`,
                                function(err, response) {
                                    if (err) throw err;
                                    
                                    for (var j = 0; j < response.length; j++) {
                                        console.log("\n");
                                        console.table(response[j]);
                                    }
                                }
                            ) 
                        }

                        runApp();
                    }
                )
            })
        }
    )
};

// VIEW EMPLOYEES BY MANAGER

function byMans(){
    
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
                    var employees = ["GO BACK"];
                    for (var i = 0; i < res.length; i++) {
                        employees.push(res[i].first_name + " " + res[i].last_name);
                    }

                    return employees;
                }
            }).then(function(choice) {
                var nameArray = choice.remEmp.split(" ");
                var firstName = nameArray[0];
                var lastName = nameArray[1];

                if (choice.remEmp === "GO BACK") {
                    runApp();
                } else {
                    console.log(`Removing ${choice.remEmp} as an employee...`);
                    var query = connection.query(
                        `DELETE FROM employees WHERE first_name = '${firstName}' AND last_name = '${lastName}';`,
                        function (err) {
                            if (err) throw err;
                            console.log("Employee deleted.");
                            runApp();
                        }
                    );
                }
            });
        }
    )
};

function editEmp(){

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
                            employees.push(res[i].id + " " + res[i].first_name + " " + res[i].last_name);
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
                        "role"
                    ]
                }
            ]).then(function(choice) {
                var nameArray = choice.selEmp.split(" ");
                var id = nameArray[0];

                // UPDATE NAME
                if (choice.info === "first_name" || choice.info === "last_name") {
                    inquirer.prompt({
                        type: "input",
                        message: `Input new ${choice.info}: `,
                        name: "newName"
                    }).then(function(name) {
                        var query = connection.query(
                            `UPDATE employees SET ${choice.info} = '${name.newName}' WHERE id = ${id};`,
                            function(err) {
                                if (err) throw err;
                                console.log("Employee name succesfully updated.");
                                runApp();
                            }
                        )
                    });
                } 

                // UPDATE MANAGER
                else if (choice.info === "manager") {
                    var query = connection.query(
                        "SELECT * FROM employees INNER JOIN roles ON roles.id = employees.role_id WHERE roles.manager = 1;",
                        function(err, res) {
                            if (err) throw err;
                            inquirer.prompt({
                                type: "list",
                                message: "Choose new manager: ",
                                name: "newMan",
                                choices: function() {
                                    const managers = [];
                                    for (var i = 0; i < res.length; i++) {
                                        managers.push(res[i].first_name + " " + res[i].last_name);
                                    }
                
                                    return managers;
                                } 
                            }).then(function(manager) {
                                var query = connection.query(
                                    `UPDATE employees SET manager = '${manager.newMan}' WHERE id = ${id};`,
                                    function(err) {
                                        if (err) throw (err);
                                        console.log("Employee's manager succesfully updated.");
                                        runApp();
                                    }
                                )
                            })
                        }
                    )
                } 
                
                // UPDATE ROLE
                else {
                    var query = connection.query(
                        "SELECT * FROM roles",
                        function(err, res) {
                            if (err) throw err;
                            inquirer.prompt({
                                type: "list",
                                message: "Select new role: ",
                                name: "newRole",
                                choices: function() {
                                    var roles = [];
                                    for (var i = 0; i < res.length; i++) {
                                        roles.push(res[i].title);
                                    }
                                    
                                    return roles;
                                }
                            }).then(function(role) {
                                
                                var query = connection.query(
                                    `UPDATE employees SET role_id = (SELECT id FROM roles WHERE title = '${role.newRole}') WHERE id = ${id};`,
                                    function (err) {
                                        if (err) throw err;
                                        console.log("Employee role successfully updated.");
                                        runApp();
                                    }
                                )
                            })

                        }
                    )

                } 
            });
        }
    ); 
};  


// EDIT DEPARTMENTS

function editDepts() {
   
    inquirer.prompt({
            type: "list",
            message: "What would you like to do?",
            name: "deptQuery",
            choices: [
                "New Department",
                "Edit Department",
                "Delete Department"
            ]
    }).then(function(choice){

        // NEW DEPARTMENT
        if (choice.deptQuery === "New Department") {
            
            inquirer.prompt({
                type: "input",
                message: "New Department Name: ",
                name: "newDept"
            }).then(function(selection){

                var query = connection.query(
                    `INSERT INTO departments SET name = '${selection.newDept}'`,
                    function(err) {
                        if (err) throw err;
                        console.log("Succesfully added new department.");
                        runApp();
                    }
                )

            }) 

        } 
        
        // EDIT DEPARTMENT
        else if (choice.deptQuery === "Edit Department") {

            var query = connection.query(
                "SELECT * FROM departments",
                function(err, res) {
                    if (err) throw  err;
                    inquirer.prompt({
                        type: "list",
                        message: "Which department would you like to edit?",
                        name: "deptEdit",
                        choices: function() {
                            var depts = [];
                            for (var i = 0; i < res.length; i++) {
                                depts.push(res[i].id + " " + res[i].name);
                            }

                            return depts;
                        }
                    }).then(function(department) {
                        var deptArray = department.deptEdit.split(" ");
                        var id = deptArray[0];
                        
                        inquirer.prompt({
                            type: "input",
                            message: "Input new department name: ",
                            name: "deptTitle"
                        }).then(function(choice){
                            var query = connection.query(
                                `UPDATE departments SET name = '${choice.deptTitle}' WHERE id = '${id}';`,
                                function(err) {
                                    if (err) throw err;
                                    console.log(`\n \nDepartment succesfully updated.`);
                                    runApp();
                                }
                            )
                        })
                    })

                }
            )


        } else {
            var query = connection.query(
                "SELECT * FROM departments",
                function(err, res) {
                    if (err) throw  err;
                    inquirer.prompt({
                        type: "list",
                        message: "Which department would you like to delete?",
                        name: "deptDelete",
                        choices: function() {
                            var depts = [];
                            for (var i = 0; i < res.length; i++) {
                                depts.push(res[i].id + " " + res[i].name);
                            }

                            return depts;
                        }
                    }).then(function(department) {
                        var deptArray = department.deptDelete.split(" ");
                        var id = deptArray[0];
                        var query = connection.query(
                            `DELETE FROM departments WHERE id = ${id}`,
                            function(err){
                                if (err)throw err;
                                console.log(`\n \nDepartment succesfully deleted.`);
                                runApp();
                            }
                        )
                        
                    })
                }
            )
        }
    })   
}

// EDIT ROLES


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
