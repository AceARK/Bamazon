// List of options :
// - View products for sale -> select id, name, price, quantity from products; console.table(data)
// - View low inventory -> select id, name from products group by quantity having count(*) < 5
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
----------
Welcome Manager
----------
	`);
	// Display options and get manager's choice of action
	getManagerAction();
}

// Function to get manager's choice of action and route to appropriate functions
function getManagerAction() {
	inquirer.prompt([
		{	
			type: "list",
			name: "choice",
			message: "What would you like to do?",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"] 
		}
	]).then(function(manager) {
		switch(manager.choice) {
			case "View Products for Sale":
				displayProducts();
				break;

			case "View Low Inventory":
				displayLowInventory();
				break;

			case "Add to Inventory":
				addToInventory();
				break;

			case "Add New Product":
				addNewProduct();
				break;

			case "Exit":
				process.exit();
				break;

			default: 
				console.log("It's a beautiful day today!");
				break;
		}
	});
}

// Function to display products for sale
function displayProducts() {
	connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, data) {
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

// Function to display products with stock_quantity < 5
function displayLowInventory() {
	connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function(err, data) {
		if(err) {
			console.log(err);
		}else {
			console.table(data);
		}
		getManagerAction();
	});
}

// Function to add to inventory
function addToInventory() {
	inquirer.prompt([
		{
			name: "id",
			message: "ID of item to add:" 
		},
		{
			name: "quantity",
			message: "How much would you like to add?"
		}
	]).then(function(input) {
		connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", [input.id], function(err, data) {
			if(err) {
				console.log(err);
			}else {
				var currentQuantity = parseFloat(data[0].stock_quantity);
				var quantityToBeUpdated = currentQuantity + parseFloat(input.quantity);
				connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [quantityToBeUpdated, input.id], function(err, data) {
					if(err) {
						console.log(err);
					}else {
						console.log("Stock quantity added to inventory");
					}
					getManagerAction();
				});
			}
		});
	});
}


function addNewProduct() {
	connection.query("SELECT department_name FROM products GROUP BY department_name HAVING COUNT(*) >= 1", function(err, data) {
		var departmentNames = data.map(item => item.department_name);
		inquirer.prompt([
			{
				name: "name",
				message: "Enter the name of the product:"
			},
			{
				name: "price",
				message: "Enter it's selling price:"
			},
			{
				type: "list",
				name: "department",
				message: "Choose the appropriate department it belongs to:",
				choices: departmentNames
			},
			{
				name: "quantity",
				message: "Enter how much of it to stock in inventory:"
			}
		]).then(function(product) {
			connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?", [product.name, product.department, product.price, product.quantity], function(err, data) {
				if(err) {
					console.log(err);
				}else {
					console.log("New product added to Bamazon!");
				}
				getManagerAction();
			});
		});
	});
}


