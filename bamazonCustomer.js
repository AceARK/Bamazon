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

// Start function to display welcome message and begin
function start() {
	console.log(`
______________________________________________

     * * * Welcome to Bamazon * * *
   ----------------------------------
We make up in service, what we lack in name...
______________________________________________
	`);
	// Display products listed in db
	displayProducts();
}

// Function to display products listed in table
function displayProducts() {
	connection.query("SELECT item_id, product_name, price FROM products", function(err, data) {
		if(err) {
			console.log(err);
		}else {
			console.log("");
			// Log data in tabular format
			console.table(data);
			getUserChoice();
		}
	})
}

// Function to let user choose item and quantity to buy
function getUserChoice() {
	inquirer.prompt([
		{
			name: "id",
			message: "Enter the ID of the product you want to purchase:" 
		},
		{
			name: "quantity",
			message: "Enter the quantity you want to purchase:"
		}
	]).then(function(choice) {
		// If (select quantity from products where id = choice.id) quantity in db > choice.quantity => update in db (update products set quantity = dbquantity - userquantity where id = user.id)
		connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", [choice.id], function(err, data) {
			if(err) {
				console.log(err);
			}else {
				// Quantity of product in stock
				var stock_quantity = data[0].stock_quantity;
				// Checking if requested amount is in stock
				if(stock_quantity > choice.quantity) {
					var updatedQuantity = stock_quantity - choice.quantity;
					// Updating stock_quantity after purchase to db
					connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [updatedQuantity, choice.id], function(err, data) {
						console.log(`
-------------
Order placed successfully.
-------------`)
						// console.log("Your order has been successfully placed.");
						// Getting price of requested product from db
						connection.query("SELECT price FROM products WHERE item_id = ?", [choice.id], function(err, data) {
							if(err) {
								console.log(err);
							}else  {
								// Calculating order total from price of item and quantity requested
								var priceOfItem = data[0].price;
								var totalCost = priceOfItem * choice.quantity;
								console.log(`Order total: $${totalCost.toFixed(2)}
-------------
`);
							}
							// Ask if user wants to continue shopping
							furtherAction();
						});
					});

				}else {
					console.log(`
Insufficient quantity! 
-------------
Order cannot go through.
					`);
					// Ask if user wants to continue shopping
					furtherAction();
				}
			}
		});
	})
}

// Function to get further action from user
function furtherAction() {
	inquirer.prompt([
		{
			type: "list",
			name: "next",
			message: "Would you like to:",
			choices: ["Continue shopping?", "Exit?"] 
		}
	]).then(function(action) {
		switch(action.next) {
			case "continue shopping?":
				displayProducts();
				break;

			case "Exit?":
				console.log(`
-------------
Thank you for shopping at Bamazon!
-------------
`)
				process.exit();
		}
	})
}


