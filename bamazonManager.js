// List of options :
// - View products for sale -> select id, name, price, quantity from products; console.table(data)
// - View low inventory -> select id, name from products group by quantity where count(*) < 5
// - Add to Inventory -> show products id, name, quantity - inquirer prompt to get id of product to add, quantity to add.
// - Add new product -> inquirer prompt : name of product, price, quantity - Insert into products (name, price, quantity) Values (prompt answers) - new product added, show table

var mysql = require("mysql");
var inquirer = require("inquirer");
require('console.table');

// Create a connection to bamazon db
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "admin",
	database: "Bamazon"
});

// Connect to Bamazon db
connection.connect(function(err) {
	if(err) throw err;
	// Start program
	start();
});