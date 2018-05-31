DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (

id INT(11) AUTO_INCREMENT NOT NULL,

product_name VARCHAR(45) NOT NULL,

department_name VARCHAR(45) ,

price DECIMAL(10,2) NULL,

stock_quantity INT(10000),

 PRIMARY KEY (id)
);