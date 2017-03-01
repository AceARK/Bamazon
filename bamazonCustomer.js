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
______________________________________________

     * * * Welcome to Bamazon * * *
   ----------------------------------
We make up in service, what we lack in name...
______________________________________________
	`);
	displayProducts();
}

function displayProducts() {
	connection.query("SELECT item_id, product_name, price FROM products", function(err, data) {
		if(err) {
			console.log(err);
		}else {
			console.log("");
			console.table(data);
			getUserChoice();
		}
	})
}

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
			case "Continue shopping?":
				displayProducts();
				break;

			case "Exit?":
				process.exit();
		}
	})
}


