# Bamazon
Amazon-like MySQL database and Node.js program
------------------------------
### Three levels -
 1. Customer View
 2. Manager View
 3. Supervisor View

### Customer View:-
Run `node bamazonCustomer.js` on command prompt or terminal. 

This displays the list of products available and prompts user to purchase products using item_id and speciying quantity. MySQL queries work behind the scenes to fetch data and push data to the table. 

In case of Insufficient quantity, user is alerted, and if not, order goes through.

### Manager View:-
Run `node bamazonManager.js` on command prompt or terminal. 

Prompts user to select -
- View products
- View low inventory
- Add to inventory
- Add new product

Features -
* Contains validation to disable SQL injection and proper format of price/ quantity inputs (as does the previous level).

### Supervisor View:-
Run `node bamazonSupervisor.js` on command prompt or terminal. 

Users can choose to:
- View product sales by department
- Create a new department

Features -
* Uses aliasing to name column total_profit generated on the fly, and change name of total_sales.
* This too sports validation to avoid incorrect inputs or SQL injection.

-----------------

#### Click [here](https://youtu.be/Cg1Jx8lE3Ig) for a video walk-through of this application. ####