// Inquirer lists options - View product sales by department, and 
//						  - Create new department
// View product sales by department -> shows table using SELECT departments.department_id, departments.department_name, departments.over_head_costs, departments.total_sales AS product_sales, (departments.total_sales - departments.over_head_costs) AS total_profit FROM departments; (verified on mysql)
// Create new department -> INSERT INTO departments (department_name) VALUES ?, inquirer answer

// Require dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
require('console.table');

// Create a connection to bamazon db
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "robot",
	password: "password",
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
--------------
Welcome Supervisor
--------------
	`);
	// Display options and get manager's choice of action
	getSupervisorAction();
}

// Function to get supervisor's choice of action
function getSupervisorAction() {
	inquirer.prompt([
		{
			type: "list",
			name: "action",
			message: "What would you like to do?",
			choices: ["View Product Sales by Department", "Create New Department", "Exit"]
		}
	]).then(function(supervisor) {
		switch(supervisor.action) {
			case "View Product Sales by Department":
				viewProductSalesByDepartment();
				break;

			case "Create New Department":
				createNewDepartment();
				break;

			case "Exit":
				process.exit();
				break;

			default:
				// Random message (helps to check if switch cases are being met)
				console.log("Bamazon... where we make up in service, what's lacking in name.");
				break;
		}
	})
}

// Function to view product sales by department
function viewProductSalesByDepartment() {
	// Getting data from departments table and displaying using Alias
	connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, departments.total_sales AS product_sales, (departments.total_sales - departments.over_head_costs) AS total_profit FROM departments", function(err, data) {
		if(err){
			console.log(err);
		}else {
			// Create some space for better looking output
			console.log(`

`);			// Logging data in tabular format
			console.table(data);
			console.log(`
`);
		}
		// Show options again
		getSupervisorAction();
	});
}


function createNewDepartment() {
	// Get required data for new department addition
	inquirer.prompt([
		{
			name: "name",
			message: "Enter the name of the department to be added:",
			// Validation to exclude sql queries (end in ';')
			validate: function(input) {
				if(input !== "" && !input.includes(";")) {
					return true;
				}else if(input === ""){
					// Cannot add an empty department either, hence message for that
					return "Required: Department name cannot be empty"
				}else {
					return "Invalid department name"
				}
			}
		},
		{
			name: "overHeadCosts",
			message: "Enter the overhead cost for this department (format: 39.50):",
			// Validate if entered input is in proper price format
			validate: function(input) {
				// Using regex pattern for matching cost format
				var check = input.match(/^-?\d*(\.\d{2})?$/);
				if (check && input !== "" && !input.includes(";")) {
					return true;
				} else {
					return 'Incorrect overhead cost format - See format above';
				}
			}
		},
		{
			name: "totalSales",
			message: "Enter total sales from this department (Optional - can be left blank. Format: 25.67):",
			// Validate if entered input is in proper price format
			validate: function(input) {
				// Using regex pattern for matching price
				var check = input.match(/^-?\d*(\.\d{2})?$/);
				if (check && input === "" && !input.includes(";")) {
					return true;
				} else {
					return 'Incorrect sales price format - See format above';
				}
			}
		}
	]).then(function(department) {
		// If no total sales entered (as it is 0 at the time of addition of department)
		if(department.totalSales === "") {
			var total_sales = 0.00;
		}else {
			var total_sales = department.totalSales;
		}
		// Add new department to table departments
		connection.query("INSERT INTO departments SET ?", {
			department_name: department.name,
			over_head_costs: department.overHeadCosts,
			total_sales: total_sales
			}, function(err, data) {
			if(err) {
				console.log(err);
			}else {
				// Notify supervisor
				console.log(`
-------------------------
Department - '${department.name}' - added to Bamazon.
-------------------------
`);
			}
			// Display menu again
			getSupervisorAction();
		});
	})
}
