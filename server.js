const inquirer = require("inquirer");
const mysql = require("mysql");

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

function viewAll(){
    var query = connection.query(
        "SELECT * FROM employees",
        function (err, res) {
            if (err) throw err;
            console.log(" Current employee data...");
        }
    )

    runApp();
};

function viewDep(){
   
    inquirer.prompt([
        {

        }
    ])
};

function viewMan(){

};

function addEmp(){

};

function removeEmp(){

};

function updateEmp(){

};

function updateRol(){

};

function updateMan() {

};