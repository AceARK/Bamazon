// 1. Display all the items available on Bamazon - IDs, names, prices - select id, name, price from products 

// 2.  Then prompt which product to buy
// 2 . How much of it to buy

// Check if quantity in db > quantity requested - select quantity from products where item_id = id selected, and compare
// If not, "Insufficient" message. Return to prompt 2.
// If yes, db quantity - quantity requested -> update to db - update products set quantity = calculated where item_id = id chosen
// Calculate total and display -> price of item * quantity requested - select price from products where price = 

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
	start();
});

function start() {
	console.log(`
___________________________________________________________

	  * * * Welcome to Bamazon * * *
	 --------------------------------
Where we make up in service, what's lacking in the name ...
___________________________________________________________


	`);
	displayProducts();
}

function displayProducts() {
	connection.query("SELECT item_id, product_name, price FROM products", function(err, data) {
		if(err) {
			console.log(err);
		}else {
			console.table(data);
			getUserChoice();
		}
	})
}

function getUserChoice() {
	inquirer.prompt([
		{
			name: "id",
			message: "What would you like to purchase? (Enter the product_id from the displayed list)" 
		},
		{
			name: "quantity",
			message: "How many of that item would you like to purchase?"
		}
	]).then(function(choice) {
		console.log("You want to buy ", choice.quantity, " of ", choice.id);
	})
}