DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    name varchar(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary int NOT NULL,
    department_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id int NOT NULL,
    manager_id int,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

INSERT INTO employee_db.departments (name) VALUES ("Administrative");
INSERT INTO employee_db.departments (name) VALUES ("Engineering");
INSERT INTO employee_db.departments (name) VALUES ("Design");
INSERT INTO employee_db.departments (name) VALUES ("Finance");
INSERT INTO employee_db.departments (name) VALUES ("Sales");
INSERT INTO employee_db.departments (name) VALUES ("Legal");

INSERT INTO employee_db.roles (title, salary, department_id) VALUES ("C-Suite", 100000, 1);
INSERT INTO employee_db.roles (title, salary, department_id) VALUES ("Operations", 80000, 1);
INSERT INTO employee_db.roles (title, salary, department_id) VALUES ("Lead Engineer", 80000, 2);
INSERT INTO employee_db.roles (title, salary, department_id) VALUES ("Software Engineer", 80000, 2);
INSERT INTO employee_db.roles (title, salary, department_id) VALUES ("UI/UX", 80000, 3);
INSERT INTO employee_db.roles (title, salary, department_id) VALUES ("Accountant", 80000, 4);
INSERT INTO employee_db.roles (title, salary, department_id) VALUES ("Sales Lead", 80000, 5);
INSERT INTO employee_db.roles (title, salary, department_id) VALUES ("Salesperson", 80000, 5);
INSERT INTO employee_db.roles (title, salary, department_id) VALUES ("Legal Team Lead", 80000, 6);
INSERT INTO employee_db.roles (title, salary, department_id) VALUES ("Lawyer", 80000, 6);


INSERT INTO employee_db.employees (first_name, last_name, role_id) VALUES ("Alexandra", "Adams", 1);
INSERT INTO employee_db.employees (first_name, last_name, role_id, manager_id) VALUES ("Belina", "Brian", 4, 1);
INSERT INTO employee_db.employees (first_name, last_name, role_id) VALUES ("Celia", "Cinder", 10);
INSERT INTO employee_db.employees (first_name, last_name, role_id) VALUES ("Demi", "Dower", 5);
