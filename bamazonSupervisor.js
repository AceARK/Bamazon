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
	inquirer.prompt([
		{
			name: "name",
			message: "Enter the name of the department to be added:" 
		},
		{
			name: "overHeadCosts",
			message: "Enter the overhead cost for this department:"
		},
		{
			name: "totalSales",
			message: "Enter total sales from this department(If 0, enter 0 or leave blank):"
		}
	]).then(function(department) {
		if(department.totalSales === (null || "")) {
			var total_sales = 0.00;
		}else {
			var total_sales = department.totalSales;
		}
		connection.query("INSERT INTO departments SET ?", {
			department_name: department.name,
			over_head_costs: department.overHeadCosts,
			total_sales: total_sales
			}, function(err, data) {
			if(err) {
				console.log(err);
			}else {
				console.log(`
Department added
				`);
			}
			getSupervisorAction();
		});
	})
}
