// List of options :
// - View products for sale -> select id, name, price, quantity from products; console.table(data)
// - View low inventory -> select id, name from products group by quantity where count(*) < 5
// - Add to Inventory -> show products id, name, quantity - inquirer prompt to get id of product to add, quantity to add.
// - Add new product -> inquirer prompt : name of product, price, quantity - Insert into products (name, price, quantity) Values (prompt answers) - new product added, show table

// Require dependencies
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

// Function to start program flow
function start() {
	console.log(`
 ------------
Welcome Manager
 ------------
	`);
	inquirer.prompt([
		{	
			type: "list",
			name: "choice",
			message: "Options:",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"] 
		}
	]).then(function(manager) {
		switch(manager.choice) {
			case "View Products for Sale":

				break;

			case "View Low Inventory":

				break;

			case "Add to Inventory":

				break;

			case "Add New Product":

				break;
		}
	})
	// Display products for sale
	displayProducts();
}

// Function to display products for sale
function displayProducts() {
	connection.query("SELECT item_id, product_name, price FROM products", function(err, data) {
		if(err) {
			console.log(err);
		}else {
			console.log("");
			// Log data in tabular format
			console.table(data);
			getManagerAction();
		}
	});
}

