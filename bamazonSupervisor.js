// Inquirer lists options - View product sales by department, and 
//						  - Create new department
// View product sales by department -> shows table using SELECT departments.department_id, departments.department_name, departments.over_head_costs, departments.total_sales AS product_sales, (departments.total_sales - departments.over_head_costs) AS total_profit FROM departments; (verified on mysql)
// Create new department -> INSERT INTO departments (department_name) VALUES ?, inquirer answer