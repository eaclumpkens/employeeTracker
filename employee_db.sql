DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name varchar(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary int NOT NULL,
    department_id int NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id int NOT NULL,
    manager_id int,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

INSERT INTO employee_db.department (name) VALUES ("Administrative");
INSERT INTO employee_db.department (name) VALUES ("Engineering");
INSERT INTO employee_db.department (name) VALUES ("Design");
INSERT INTO employee_db.department (name) VALUES ("Finance");
INSERT INTO employee_db.department (name) VALUES ("Sales");
INSERT INTO employee_db.department (name) VALUES ("Legal");


