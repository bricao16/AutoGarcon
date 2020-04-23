/*
	REST-API Server
	Tucker Urbanski
	Date Created: 3/2/2020
	Last Modified: 4/20/2020
*/

// Built-in Node.js modules
var fs = require('fs');
var path = require('path');
var cors = require('cors');
var crypto = require('crypto');

// NPM modules
var express = require('express');
var bodyParser = require('body-parser');
var js2xmlparser = require('js2xmlparser');
var mysql = require('mysql');
var dotenv = require('dotenv');
var jwt = require('jsonwebtoken');
var luxon = require('luxon');

var app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
dotenv.config();

//Create db connection
var db = mysql.createConnection({
	host        : process.env.DB_HOST,
	port        : process.env.DB_PORT,
	user        : process.env.DB_USER,
	password    : process.env.DB_PASS,
	multipleStatements: true
});

//Connect to db
db.connect((err) => {
	if (err) {
		throw err;
	}   //if
	else {
		console.log('Connected to database');
	}   //else
}); //db.connect

//Start server
var server = app.listen(8000);
console.log('Now listening on port 8000');


//======================================================================================//
//							ENDPOINTS RELATING TO RESTAURANTS 							//
//======================================================================================//

/*
	Returns restaurant information and menu information for restaurant with restaurant_id = id
	Inputs: restaurant_id
	Outputs:
		On success:
			{
				restaurant: {
					name,
					address,
					phone_number,
					opening,
					closing,
					font,
					primary_color,
					secondary_color,
					tertiary_color,
					logo
				}
				menu: {
					dish_name: {
						calories,
						price,
						category,
						picture,
						in_stock
					}
				}
			}
		On error:
			Error retrieving restaurant information
*/
app.get('/restaurant/:id', (req, res) => {
	let query = 'SELECT * FROM sample.restaurants NATURAL JOIN sample.menu WHERE restaurant_id = ?';

	//Query database:
	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving restaurant information');
		}   //if
		else if (rows.length < 1) {
			res.status(409).send('Invalid restaurant_id');
		}	//else if
		else {
			//Build JSON object:
			let response = {};

			//Add restaurant info to response:
			response['restaurant'] = {
				'name': rows[0].restaurant_name,
				'address': rows[0].restaurant_addr,
				'phone_number': rows[0].phone_number,
				'opening': rows[0].opening_time,
				'closing': rows[0].closing_time,
				'font': rows[0].font,
				'primary_color': rows[0].primary_color,
				'secondary_color': rows[0].secondary_color,
				'tertiary_color': rows[0].tertiary_color,
				'logo': rows[0].logo
			};	//response

			//Add menu to response:
			response['menu'] = {};
			for (let i=0; i<rows.length; i++) {
				//Add each menu item to response:
				response['menu'][rows[i].item_name] =   {
					'item_id': rows[i].item_id,
					'calories': rows[i].calorie_num,
					'price': rows[i].price,
					'category': rows[i].category,
					'picture': 'No picture yet',
					'in_stock': rows[i].in_stock
				};	//response
			}   //for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

/*
	Returns restaurant_id and restaurant_name of all restaurants
	Inputs: none
	Outputs:
		On success:
			{
				i:
				{
					restaurant_id,
					restaurant_name
				}
			}
		On error:
			Error retrieving restaurants
*/
app.get('/restaurants', (req, res) => {
	let query = 'SELECT restaurant_id, restaurant_name FROM sample.restaurants';

	//Query database:
	db.query(query, (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving restaurants');
		}   //if
		else {
			//Build JSON object:
			let response = {};

			//Loop through each row returned from query:
			for (let i=0; i<rows.length; i++) {
				//Add restaurant info to response:
				response[i] = {
					'restaurant_id': rows[i].restaurant_id,
					'restaurant_name': rows[i].restaurant_name
				};	//response
			}	//for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

/*
	Updates restaurant information
	Inputs: restaurant_id, name, address, phone, opening, closing, JWT
	Outputs:
		On success:
			Successfully updated restaurant information!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: restaurant_id, name, address, phone, opening, closing
		If restaurant does not exist:
			Error: restaurant does not exist
		If JWT is not valid:
			Must be authorized!
		If JWT is not a manager token for the restaurant of the item:
			Must be the restaurant manager to update restaurant information!
		On error: 
			Error updating restaurant information
*/
app.post('/restaurant/update', verifyToken, (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.restaurant_id && req.body.name && req.body.address && req.body.phone && req.body.opening && req.body.closing)) {
		res.status(400).send('Error: Missing parameter. Required parameters: restaurant_id, name, address, phone, opening, closing');
		return;
	}   //if

	//Make sure the restaurant exists:
	let query = 'Select * FROM sample.restaurants WHERE restaurant_id = ?';
	db.query(query, req.body.restaurant_id, (err, rows) => {
		if (rows.length == 0) {
			res.status(409).send('Error: restaurant does not exist');
		}   //if
		else {
			//Verify that the person is a manager at the restaurant
			jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
				if (err) {
					res.status(401).send('Must be authorized!');
				}   //if
				else {
					//Check to make sure person is a manager at the restaurant:
					if (auth.staff && auth.staff.position === 'manager' && auth.staff.restaurant_id === rows[0].restaurant_id) {
						//Build query and parameters:
						query = 'UPDATE sample.restaurants SET restaurant_name = ?, restaurant_addr = ?, phone_number = ?, opening_time = ?, closing_time = ?';
						query = query + ' WHERE restaurant_id = ?';
						let parameters = [req.body.name, req.body.address, req.body.phone, req.body.opening, req.body.closing, req.body.restaurant_id];

						//Update restaurant information in db:
						db.query(query, parameters, (err, rows) => {
							if (err) {
								res.status(500).send('Error updating restaurant information');
							}	//if
							else {
								res.status(200).send('Successfully updated restaurant information!');
							}   //else
						});	//db.query
					}	//if
					else {
						res.status(401).send('Must be the restaurant manager to update restaurant information!');
					}	//else
				}	//else
			});	//verify
		}   //else
	}); //db.query
});	//app.post


//==================================================================================//
//							ENDPOINTS RELATING TO ORDERS 							//
//==================================================================================//

/*
	Returns in progress orders for restaurant with restaurant_id = id
	Inputs: restaurant_id
	Outputs:
		On success:
			{
				i: {
					order_num,
					item_name,
					quantity,
					order_date,
					table_num
				}
			}
		If no in progress orders exist:
			No in progress orders
		On error:
			Error retrieving orders
*/
app.get('/orders/:id', (req, res) => {
	let query = 'SELECT * FROM sample.menu natural join sample.orders natural join sample.orderdetails WHERE restaurant_id = ? and order_status like "In Progress" ORDER BY order_num';

	//Query database:
	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving orders');
		}   //if
		else if (rows.length < 1) {
			res.status(200).send('No in progress orders');
		}   //else if
		else {
			//Build JSON object:
			let response = {};

			//Loop through each row returned from query:
			for (let i=0; i<rows.length; i++) {
				//Add each part of every order to response:
				response[i] =   {
					'order_num': rows[i].order_num,
					'item_name': rows[i].item_name,
					'quantity': rows[i].quantity,
					'order_date': rows[i].order_date,
					'table': rows[i].table_num
				};	//response
			}   //for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

/*
	Returns complete orders for restaurant with restaurant_id = id
	Inputs: restaurant_id
	Outputs:
		On success:
			{
				i: {
					order_num,
					item_name,
					quantity,
					order_date,
					table_num
				}
			}
		If no complete orders exist:
			No completed orders
		On error:
			Error retrieving orders
*/
app.get('/orders/complete/:id', (req, res) => {
	let query = 'SELECT * FROM sample.menu natural join sample.orders natural join sample.orderdetails WHERE restaurant_id = ? and order_status like "Complete" ORDER BY order_date desc';

	//Query database:
	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving orders');
		}   //if
		else if (rows.length < 1) {
			res.status(200).send('No completed orders');
		}   //else if
		else {
			//Build JSON object:
			let response = {};

			//Loop through each row returned from query:
			for (let i=0; i<rows.length; i++) {
				//Add each part of every order to response:
				response[i] =   {
					'order_num': rows[i].order_num,
					'item_name': rows[i].item_name,
					'quantity': rows[i].quantity,
					'order_date': rows[i].order_date,
					'table': rows[i].table_num
				};	//response
			}   //for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

/*
	Places a new order
	Inputs: restaurant_id, customer_id, table_num, order
	Outputs:
		On success:
			Successfully placed order!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: restaurant_id, customer_id, table_num, order
		On error:
			Error placing order
*/
app.put('/orders/place', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.restaurant_id && req.body.customer_id && req.body.table_num && req.body.order)) {
		res.status(400).send('Error: Missing parameter. Required parameters: restaurant_id, customer_id, table_num, order');
		return;
	}   //if

	//Create timestamp
	let date = luxon.DateTime.local().setZone('America/Chicago');
	let timestamp = date.toString();

	let parameters = [req.body.restaurant_id, req.body.customer_id, 'In Progress', timestamp, req.body.table_num];

	//Query to add order to orders table and retrieve the order_num
	let query = ' INSERT INTO sample.orders(restaurant_id, customer_id, order_status, order_date, table_num)';
	query = query + ' VALUES (?, ?, ?, ?, ?);';

	//Add order to orders table in db:
	db.query(query, parameters, (err, rows) => {
		if (err) {
			res.status(500).send('Error placing order');
		}   //if
		else {
			//Check to make sure there are items in the order (Necessary for new Alexa orders)
			if (!isEmptyObject(req.body.order)) {
				let order_num = rows.insertId;
				parameters = [];
				query = 'INSERT INTO sample.orderdetails(order_num, item_id, quantity)';
				query = query + ' VALUES';

				//Loop through all items in order:
				for (let key in req.body.order) {
					if (req.body.order.hasOwnProperty(key)) {
						parameters.push(order_num);
						parameters.push(req.body.order[key].item);
						parameters.push(req.body.order[key].quantity);

						//Check if it is the last item for formatting
						if (key === Object.keys(req.body.order)[Object.keys(req.body.order).length-1]) {
							query = query + ' (?,?,?);';
						}	//if
						else {
							query = query + ' (?,?,?),';
						}	//else]
					}	//if
				}	//for

				//Add to orderdetails table
				db.query(query, parameters, (err, rows) => {
					if (err) {
						res.status(500).send('Error placing order');
					}	//if
					else {
						res.status(201).send('Successfully placed order!');
					}	//else
				});	//query
			}	//if
		}   //else
	}); //db.query
});	//app.put

/*
	Updates the status of an order
	Inputs: order_num, order_status
	Outputs:
		On success:
			Successfully updated order!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: order_num, order_status
		If the order doesn't exist:
			Error: order does not exist
		On error:
			Error updating order
*/
app.post('/orders/update', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.order_num && req.body.order_status)) {
		res.status(400).send('Error: Missing parameter. Required parameters: order_num, order_status');
		return;
	}   //if

	//Make sure the order exists:
	let query = 'Select * FROM sample.orders WHERE order_num = ?';
	db.query(query, req.body.order_num, (err, rows) => {
		if (rows.length == 0) {
			res.status(409).send('Error: order does not exist');
		}   //if
		else {
			//Make sure valid status is entered:
			if (!(req.body.order_status === 'Complete' || req.body.order_status === 'In Progress' || req.body.order_status === 'Pending' || req.body.order_status === 'Cancelled')) {
				res.status(409).send('Error: Invalid status. Valid statuses: Complete, In Progress, Pending, Cancelled');
				return;
			}	//if
			let parameters = [req.body.order_status, req.body.order_num];
			query = 'UPDATE sample.orders SET order_status = ? WHERE order_num = ?';

			//Edit menu item in db:
			db.query(query, parameters, (err, rows) => {
				if (err) {
					res.status(500).send('Error updating order');
				}   //if
				else {
					res.status(200).send('Successfully updated order!');
				}   //else
			}); //db.query
		}   //else
	}); //db.query
});	//app.post


//==================================================================================//
//							ENDPOINTS RELATING TO FAVORITES 						//
//==================================================================================//

/*
	Returns information about a customer's favorite restaurants
	Inputs: restaurant_id
	Outputs:
		On success:
			{
				i: {
					restaurant_id,
					restaurant_name,
					address,
					phone_number,
					opening_time,
					closing_time,
					logo
				}
			}
		If customer has no favorites:
			Customer has no favorites
		On error:
			Error retrieving favorites
*/
app.get('/favorites/:id', (req, res) => {
	let query = 'SELECT * FROM sample.favorites natural join sample.restaurants WHERE customer_id = ?';

	//Query database:
	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving favorites');
		}   //if
		else if (rows.length < 1) {
			res.status(200).send('Customer has no favorites');
		}	//else if
		else {
			//Build JSON object:
			let response = {};

			//Loop through each row returned from query:
			for (let i=0; i<rows.length; i++) {
				//Add each restaurant's info to response:
				response[i] =   {
					'restaurant_id': rows[i].restaurant_id,
					'restaurant_name': rows[i].restaurant_name,
					'address': rows[i].restaurant_addr,
					'phone_number': rows[i].phone_number,
					'opening_time': rows[i].opening_time,
					'closing_time': rows[i].closing_time,
					'logo': rows[i].logo
				};	//response
			}   //for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

/*
	Adds a restaurant to a customer's favorites
	Inputs: customer_id, restaurant_id
	Outputs:
		If any inputs are missing:
			Error: Missing parameter. Required parameters: customer_id, restaurant_id
		On success:
			Succesfully added restaurant to favorites!
		On error:
			Error adding restaurant to favorites
*/
app.put('/favorites/add', (req, res) => {
	let query = 'INSERT INTO sample.favorites (customer_id, restaurant_id)';
	query = query + ' VALUES(?,?)';
	let parameters = [req.body.customer_id, req.body.restaurant_id];

	//Make sure right number of parameters are entered:
	if(!(req.body.customer_id && req.body.restaurant_id))
	{
		res.status(500).send('Error: Missing parameter. Required parameters: customer_id, restaurant_id');
		return;
	}   //if

	db.query(query, parameters, (err, rows) => {
		if (err) {
			res.status(500).send('Error adding restaurant to favorites');
		}   //if
		else {
			//Send Response:
			res.status(201).send('Successfully added restaurant to favorites!');
		}   //else
	}); //db.query
}); //app.put

/*
	Deletes a restaurant from a customer's favorites
	Inputs: customer_id, restaurant_id, JWT
	Outputs:
		On success:
			Successfully deleted favorite!
		If JWT is not valid or not supplied: 
			Must be authorized!
		If JWT is for a different customer:
			Can't delete other customer's favorites!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: customer_id, restaurant_id
		If favorite does not exist:
			Error: favorite does not exist
		On error:
			Error deleting favorite
*/
app.post('/favorites/delete', verifyToken, (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.customer_id && req.body.restaurant_id)) {
		res.status(400).send('Error: Missing parameter. Required parameters: customer_id, restaurant_id');
		return;
	}   //if

	//Verify that the person is the customer with the favorite
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(403).send('Must be authorized!');
		}   //if
		else if (auth.customer && auth.customer.customer_id === req.body.customer_id) {
			//Make sure the favorite exists:
			let query = 'Select * FROM sample.favorites WHERE customer_id = ? AND restaurant_id = ?';
			let parameters = [req.body.customer_id, req.body.restaurant_id];
			db.query(query, parameters, (err, rows) => {
				if (err) {
					res.status(500).send('Error deleting favorite')
				}	//if
				else if (rows.length == 0) {
					res.status(500).send('Error: favorite does not exist');
				}   //else if
				else {
					let query = 'DELETE FROM sample.favorites WHERE customer_id = ? AND restaurant_id = ?';

					//Remove favorite in db:
					db.query(query, parameters, (err, rows) => {
						if (err) {
							res.status(500).send('Error deleting favorite');
						}   //if
						else {
							res.status(200).send('Successfully deleted favorite!');
						}   //else
					}); //db.query
				}	//else
			}); //db.query
		}	//else if
		else {
			res.status(403).send('Can\'t delete other customer\'s favorites!');
		}	//else
	});	//verify
});	//app.post


//==============================================================================//
//							ENDPOINTS RELATING TO STAFF 						//
//==============================================================================//

/*
	Logs a staff member in and returns a signed JWT and staff member's information
	Inputs (in body of request): username and password
	Outputs:
		On success:
			{
				token: {
					token
				}
				staff: {
					staff_id,
					restaurant_id,
					first_name,
					last_name,
					contact_num,
					email,
					position
				}
			}
		On error:
			Error logging in
		If username/password is wrong:
			No user with that username/password
*/
app.post('/staff/login', (req, res) => {
	let query = 'SELECT * FROM sample.staff WHERE staff_id = ?';

	db.query(query, req.body.username, (err, rows) => {
		if (err) {
			res.status(500).send('Error logging in');
		}   //if
		else if (rows.length < 1) {
			res.status(401).send('No user with that username/password');
		}   //else if
		else {
			//Store user's salt
			let salt = rows[0].salt;
			//Hash supplied password
			let hashed = crypto.pbkdf2(req.body.password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					res.status(500).send('Error logging in');
				}	//if
				else {
					if (derivedKey.toString('hex') === rows[0].password) {
						//Build staff object:
						let staff = {
							'staff_id': rows[0].staff_id,
							'restaurant_id': rows[0].restaurant_id,
							'first_name': rows[0].first_name,
							'last_name': rows[0].last_name,
							'contact_num': rows[0].contact_num,
							'email': rows[0].email,
							'position': rows[0].position
						};  //staff

						//Sign JWT and send token
						//To add expiration date: jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '<time>' }, (err, token) => ...)
						jwt.sign({staff}, process.env.JWT_SECRET, (err, token) => {
							//Build response
							let response = {
								'token': token,
								staff
							};  //response

							//Send Response:
							res.type('json').send(response);
						});	//sign
					}   //if
					else {
						res.status(401).send('No user with that username/password');
					}   //else
				}   //else
			}); //hashed
		}   //else
	}); //db.query
}); //app.post

/*
	Creates a new staff member
	Inputs: staff_id, restaurant_id, first_name, last_name, contact_num, email, position, password
	Outputs:
		On success:
			{
				token: {
					token
				}
				staff: {
					staff_id,
					restaurant_id,
					first_name,
					last_name,
					contact_num,
					email,
					position
				}
			}
		If staff_id exists already:
			Error: staff_id already exists
		If any inputs are missing:
			Error: Missing parameter. Required parameters: staff_id, restaurant_id, first_name, last_name, contact_num, email, position, password
		On error:
			Error creating new staff member
*/
app.put('/staff/register', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.staff_id && req.body.restaurant_id && req.body.first_name && req.body.last_name && req.body.contact_num && req.body.email && req.body.position && req.body.password)) {
		res.status(400).send('Error: Missing parameter. Required parameters: staff_id, restaurant_id, first_name, last_name, contact_num, email, position, password');
		return;
	}   //if

	//Make sure the staff_id doesn't exist:
	let query = 'Select * FROM sample.staff WHERE staff_id = ?';

	//Query database:
	db.query(query, req.body.staff_id, (err, rows) => {
		if (rows.length > 0) {
			res.status(409).send('Error: staff_id already exists');
		}   //if
		else {
			//Create a new salt
			let salt = genSalt();
			//Hash supplied password with salt
			let hashed = crypto.pbkdf2(req.body.password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					res.status(500).send('Error creating new staff member');
				}	//if
				else {
					//Build query and parameters:
					let parameters = [req.body.staff_id, req.body.restaurant_id, req.body.first_name, req.body.last_name, req.body.contact_num,req.body.email, req.body.position, salt, derivedKey.toString('hex')];
					let query = 'INSERT INTO sample.staff(staff_id, restaurant_id, first_name, last_name, contact_num, email, position, salt, password)';
					query = query + " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";

					//Add new staff member to db:
					db.query(query, parameters, (err, rows) => {
						if (err) {
							res.status(500).send('Error creating new staff member');
						}   //if
						else {
							//Build staff object:
							let staff = {
								'staff_id': req.body.staff_id,
								'restaurant_id': req.body.restaurant_id,
								'first_name': req.body.first_name,
								'last_name': req.body.last_name,
								'contact_num': req.body.contact_num,
								'email': req.body.email,
								'position': req.body.position
							};  //staff

							//Sign JWT and send token
							//To add expiration date: jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '<time>' }, (err, token) => ...)
							jwt.sign({staff}, process.env.JWT_SECRET, (err, token) => {
								//Build response
								let response = {
									'token': token,
									staff
								};  //response

								//Send Response:
								res.type('json').send(response);
							});	//sign
						}   //else
					}); //db.query
				}   //else
			}); //hashed
		}   //else
	}); //db.query
});	//app.put


//==================================================================================//
//							ENDPOINTS RELATING TO CUSTOMERS 						//
//==================================================================================//

/*
	Logs a customer in and returns a signed JWT and customer's information
	Inputs: customer_id and password
	Outputs:
		On success:
			{
				token: {
					token
				}
				customer: {
					customer_id,
					first_name,
					last_name,
					email
				}
			}
		On error:
			Error logging in
		If username/password is wrong:
			No user with that username/password
*/
app.post('/customer/login', (req, res) => {
	let query = 'SELECT * FROM sample.customers WHERE customer_id = ?';

	db.query(query, req.body.username, (err, rows) => {
		if (err) {
			res.status(500).send('Error logging in');
		}   //if
		else if (rows.length < 1) {
			res.status(401).send('No customer with that username/password');
		}   //else if
		else {
			//Store user's salt
			let salt = rows[0].salt;
			//Hash supplied password
			let hashed = crypto.pbkdf2(req.body.password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					res.status(500).send('Error logging in');
				}	//if
				else {
					if (derivedKey.toString('hex') === rows[0].password) {
						//Build customer object:
						let customer = {
							'customer_id': rows[0].customer_id,
							'first_name': rows[0].first_name,
							'last_name': rows[0].last_name,
							'email': rows[0].email
						};  //user

						//Sign JWT and send token
						//To add expiration date: jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '<time>' }, (err, token) => ...)
						jwt.sign({customer}, process.env.JWT_SECRET, (err, token) => {
							//Build response
							let response = {
								'token': token,
								customer
							};  //response

							//Send Response:
							res.type('json').send(response);
						});	//sign
					}   //if
					else {
						res.status(401).send('No customer with that username/password');
					}   //else
				}   //else
			}); //hashed
		}   //else
	}); //db.query
}); //app.post

/*
	Creates a new customer
	Inputs (in body of request): customer_id, first_name, last_name, email, password
	Outputs:
		On success:
			{
				token: {
					token
				}
				customer: {
					customer_id,
					first_name,
					last_name,
					email
				}
			}
		If customer_id exists already:
			Error: customer_id already exists
		If any inputs are missing:
			Error: Missing parameter. Required parameters: customer_id, first_name, last_name, email, password
		On error:
			Error creating new customer
*/
app.put('/customer/register', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.customer_id && req.body.first_name && req.body.last_name && req.body.email && req.body.password)) {
		res.status(400).send('Error: Missing parameter. Required parameters: customer_id, first_name, last_name, email, password');
		return;
	}   //if

	//Make sure the customer_id doesn't exist:
	let query = 'Select * FROM sample.customers WHERE customer_id = ?';
	db.query(query, req.body.customer_id, (err, rows) => {
		if (rows.length > 0) {
			res.status(409).send('Error: customer_id already exists');
		}   //if
		else {
			//Create a new salt
			let salt = genSalt();
			//Hash supplied password with salt
			let hashed = crypto.pbkdf2(req.body.password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					res.status(500).send('Error creating new customer');
				}	//if
				else {
					//Build query and parameters
					let parameters = [req.body.customer_id, req.body.first_name, req.body.last_name, req.body.email, salt, derivedKey.toString('hex')];
					let query = 'INSERT INTO sample.customers(customer_id, first_name, last_name, email, salt, password)';
					query = query + " VALUES(?, ?, ?, ?, ?, ?)";

					//Add new customer to db:
					db.query(query, parameters, (err, rows) => {
						if (err) {
							res.status(500).send('Error creating new customer');
						}   //if
						else {
							//Build user object:
							let customer = {
								'customer_id': req.body.customer_id,
								'first_name': req.body.first_name,
								'last_name': req.body.last_name,
								'email': req.body.email
							};  //customer

							//Sign JWT and send token
							//To add expiration date: jwt.sign({customer}, process.env.JWT_SECRET, { expiresIn: '<time>' }, (err, token) => ...)
							jwt.sign({customer}, process.env.JWT_SECRET, (err, token) => {
								//Build response
								let response = {
									'token': token,
									customer
								};  //response

								//Send Response:
								res.type('json').send(response);
							});	//sign
						}   //else
					}); //db.query
				}   //else
			}); //hashed
		}   //else
	}); //db.query
});	//app.put

/*
	Updates customer info including customer_id, first_name, last_name, email, password
	Inputs: customer_id, first_name, last_name, email, password (optional), JWT
	Outputs:
		On success:
			{
				token:
				{
					token
				}
				customer:
				{
					customer_id,
					first_name,
					last_name,
					email
				}
			}
		If JWT is not valid or not supplied:
			Must be authorized!
		If JWT is not a customer token:
			Must be signed in as a customer!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: customer_id, first_name, last_name, email, password (optional)
		On error:
			Error updating customer info
*/
app.post('/customer/update', verifyToken, (req, res) => {
	//Verify the JWT
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Make sure the JWT is for a customer:
			if (auth.customer) {
				//Make sure right number of parameters are entered:
				if(!(req.body.customer_id && req.body.first_name && req.body.last_name && req.body.email)) {
					res.status(500).send('Error: Missing parameter. Required parameters: customer_id, first_name, last_name, email, password (optional)');
					return;
				}   //if

				//Build query and store customer_id:
				let customer_id = auth.customer.customer_id;
				let query = 'UPDATE sample.customers SET customer_id = ?, first_name = ?, last_name = ?, email = ?';

				//Check if the user wants to change their password:
				if (req.body.password) {
					//Create a new salt
					let salt = genSalt();
					//Hash supplied password with salt
					let hashed = crypto.pbkdf2(req.body.password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
						if (err) {
							res.status(500).send('Error updating customer info');
						}	//if
						else {
							//Build query and parameters:
							query = query + ', salt = ?, password = ?';
							query = query + ' WHERE customer_id = ?';
							let parameters = [req.body.customer_id, req.body.first_name, req.body.last_name, req.body.email, salt, derivedKey.toString('hex'), customer_id];

							//Add new customer to db:
							db.query(query, parameters, (err, rows) => {
								if (err) {
									res.status(500).send('Error updating customer info');
								}   //if
								else {
									//Build user object:
									let customer = {
										'customer_id': req.body.customer_id,
										'first_name': req.body.first_name,
										'last_name': req.body.last_name,
										'email': req.body.email
									};  //customer

									//Sign JWT and send token
									//To add expiration date: jwt.sign({customer}, process.env.JWT_SECRET, { expiresIn: '<time>' }, (err, token) => ...)
									jwt.sign({customer}, process.env.JWT_SECRET, (err, token) => {
										//Build response
										let response = {
											'token': token,
											customer
										};  //response

										//Send Response:
										res.type('json').send(response);
									});	//sign
								}   //else
							}); //db.query
						}   //else
					}); //hashed
				}	//if

				//If customer doesn't want to change password:
				else {
					//Build query and parameters:
					query = query + ' WHERE customer_id = ?';
					let parameters = [req.body.customer_id, req.body.first_name, req.body.last_name, req.body.email, customer_id];

					//Update customer info in db:
					db.query(query, parameters, (err, rows) => {
						if (err) {
							res.status(500).send('Error updating customer info');
						}   //if
						else {
							//Build user object:
							let customer = {
								'customer_id': req.body.customer_id,
								'first_name': req.body.first_name,
								'last_name': req.body.last_name,
								'email': req.body.email
							};  //customer

							//Sign JWT and send token
							//To add expiration date: jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '<time>' }, (err, token) => ...)
							jwt.sign({customer}, process.env.JWT_SECRET, (err, token) => {
								//Build response
								let response = {
									'token': token,
									customer
								};  //response

								//Send Response:
								res.type('json').send(response);
							});	//sign
						}   //else
					}); //db.query
				}	//else
			}	//if
			//If JWT is not for a customer:
			else {
				res.status(401).send('Must be signed in as a customer!');
			}	//else
		}   //else
	});	//verify
});	//app.post

/*
	Retrieves a customer's order history
	Inputs: customer_id
	Outputs:
		On success:
			{
				i =   {
					order_num,
					restaurant_id,
					item_name,
					quantity,
					order_date,
					table_num
				}
			}
		If a user has no history:
			No order history for this customer
		On error:
			Error retrieving order history
*/
app.get('/customer/history/:id', (req, res) => {
	let query = 'SELECT * FROM sample.menu natural join sample.orders natural join sample.orderdetails natural join sample.restaurants WHERE customer_id = ? and order_status like "Complete" ORDER BY order_date desc';

	//Query database:
	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving order history');
		}   //if
		else if (rows.length < 1) {
			res.status(200).send('No order history for this customer');
		}   //else if
		else {
			//Build JSON object:
			let response = {};

			//Add list of orders to response:
			for (let i=0; i<rows.length; i++) {
				response[i] =   {
					'order_num': rows[i].order_num,
					'restaurant_id': rows[i].restaurant_id,
					'logo': rows[i].logo,
					'item_name': rows[i].item_name,
					'quantity': rows[i].quantity,
					'order_date': rows[i].order_date,
					'table': rows[i].table_num
				};	//response
			}   //for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get


//==============================================================================//
//							ENDPOINTS RELATING TO MENU 							//
//==============================================================================//

/*
	Returns menu information for restaurant with restaurant_id = id
	Inputs: restaurant_id
	Outputs:
		On success:
			{
				dish_name:
				{
					restaurant,
					calories,
					price,
					category,
					picture,
					in_stock
				}
			}
		If restaurant has no menu items:
			This restaurant has no menu items
		On error:
			Error retrieving menu
*/
app.get('/menu/:id', (req, res) => {
	let query = 'SELECT * FROM sample.menu WHERE restaurant_id = ?';

	//Query database:
	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving menu');
		}   //if
		else if (rows.length < 1) {
			res.status(200).send('This restaurant has no menu items');
		}   //else if
		else {
			//Build JSON object:
			let response = {};

			//Loop through each row returned from query:
			for (let i=0; i<rows.length; i++) {
				response[rows[i].item_name] = {
					'item_id': rows[i].item_id,
					'restaurant': rows[i].restaurant_id,
					'calories': rows[i].calorie_num,
					'price': rows[i].price,
					'category': rows[i].category,
					'picture': 'No picture yet',
					'in_stock': rows[i].in_stock
				};	//response
			}   //for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

/*
	Adds a new item to the menu
	Inputs: restaurant_id, item_name, calorie_num, category, price
	Outputs:
		On success:
			Successfully added new menu item!
		If item_name and restaurant_id exists already:
			Error: item already exists
		If any inputs are missing:
			Error: Missing parameter. Required parameters: restaurant_id, item_name, calorie_num, category, price
		On error:
			Error adding new menu item
*/
app.put('/menu/add', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.restaurant_id && req.body.item_name && req.body.calorie_num && req.body.category && req.body.price)) {
		res.status(400).send('Error: Missing parameter. Required parameters: restaurant_id, item_name, calorie_num, category, price');
		return;
	}   //if

	//Make sure the menu item doesn't exist at the restaurant:
	let parameters = [req.body.restaurant_id, req.body.item_name]
	let query = 'Select * FROM sample.menu WHERE restaurant_id = ? AND item_name = ?';
	db.query(query, parameters, (err, rows) => {
		if (rows.length > 0) {
			res.status(409).send('Error: item already exists');
		}   //if
		else {
			//Build query and parameters:
			parameters = []
			parameters = [req.body.restaurant_id, req.body.item_name, req.body.calorie_num, req.body.category,req.body.price];
			query = '';
			query = 'INSERT INTO sample.menu(restaurant_id, item_name, calorie_num, category, in_stock, price)';
			query = query + " VALUES (?, ?, ?, ?, 1, ?)";

			//Add new menu item to db:
			db.query(query, parameters, (err, rows) =>
			{
				if (err) {
					res.status(500).send('Error adding new menu item');
				}   //if
				else {
					res.status(200).send('Successfully added new menu item!');
				}   //else
			}); //db.query
		}   //else
	}); //db.query
});	//app.put

/*
	Updates an existing menu item
	Inputs: item_id, restaurant_id, item_name, calorie_num, category, in_stock, price
	Outputs:
		On success:
			Successfully updated menu item!
		If item does not exist at the restaurant:
			Error: item does not exist
		If any inputs are missing:
			Error: Missing parameter. Required parameters: item_id, restaurant_id, item_name, calorie_num, category, in_stock, price
		On error:
			Error updating menu item
*/
app.post('/menu/update', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.item_id && req.body.restaurant_id && req.body.item_name && req.body.calorie_num && req.body.category && req.body.in_stock && req.body.price)) {
		res.status(400).send('Error: Missing parameter. Required parameters: item_id, restaurant_id, item_name, calorie_num, category, in_stock, price');
		return;
	}   //if

	//Make sure the menu item exists at the restaurant:
	let parameters = [req.body.item_id, req.body.restaurant_id]
	let query = 'Select * FROM sample.menu WHERE item_id = ? AND restaurant_id = ?';
	db.query(query, parameters, (err, rows) => {
		if (rows.length === 0) {
			res.status(409).send('Error: item does not exist');
		}   //if
		else {
			//Build query and parameters:
			parameters = [req.body.item_name, req.body.calorie_num, req.body.category, req.body.in_stock, req.body.price, req.body.item_id];
			let query = '';
			query = 'UPDATE sample.menu SET item_name = ?, calorie_num = ?, category = ?, in_stock = ?, price = ?';
			query = query + ' WHERE item_id = ?';

			//Edit menu item in db:
			db.query(query, parameters, (err, rows) => {
				if (err) {
					res.status(500).send('Error updating menu item');
				}   //if
				else {
					res.status(200).send('Successfully updated menu item!');
				}   //else
			}); //db.query
		}   //else
	}); //db.query
});	//app.post

/*
	Deletes a menu item
	Inputs: item_id, JWT
	Outputs:
		On success:
			Successfully deleted menu item!
		If menu item does not exist:
			Error: menu item does not exist
		If JWT is not valid:
			Must be authorized!
		If JWT is not a manager token for the restaurant of the item:
			Must be the restaurant manager to delete menu items!
		On error: 
			Error deleting menu item
*/
app.delete('/menu/delete', verifyToken, (req, res) => {
	//Make sure the menu item exists:
	let query = 'Select * FROM sample.menu WHERE item_id = ?';
	db.query(query, req.body.item_id, (err, rows) => {
		if (rows.length == 0) {
			res.status(409).send('Error: menu item does not exist');
		}   //if
		else {
			//Verify that the person is a manager at the restaurant
			jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
				if (err) {
					res.status(401).send('Must be authorized!');
				}   //if
				else {
					//Check to make sure person is a manager at the restaurant:
					if (auth.staff && auth.staff.position === 'manager' && auth.staff.restaurant_id === rows[0].restaurant_id) {
						let query = 'DELETE FROM sample.menu WHERE item_id = ?';

						//Remove menu item in db:
						db.query(query, req.body.item_id, (err, rows) => {
							if (err) {
								res.status(500).send('Error deleting menu item');
							}   //if
							else {
								res.status(200).send('Successfully deleted menu item!');
							}   //else
						}); //db.query
					}	//if
					else {
						res.status(401).send('Must be the restaurant manager to delete menu items!');
					}	//else
				}   //else
			});	//verify
		}   //else
	}); //db.query
});	//app.delete


//==================================================================================//
//							ENDPOINTS RELATING TO ALEXAS							//
//==================================================================================//

/*
	Returns information associated with the alexa with alexa_id = id
	Inputs: alexa_id
	Outputs:
		On success:
			{
				alexa_id: {
					restaurant_id,
					table_num
				}
			}
		On error:
			Error retrieving alexa information
		If alexa doesn't exist:
			This alexa does not exist
*/
app.get('/alexa/:id', (req, res) => {
	let query = 'SELECT * FROM sample.alexas WHERE alexa_id = ?';

	//Query database:
	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving alexa information');
		}   //if
		else if (rows.length < 1) {
			res.status(200).send('This alexa does not exist');
		}	//else if
		else {
			//Build JSON object:
			let response = {};

			//Add restaurant and table info to response:
			response[rows[0].alexa_id] = {
				'restaurant_id': rows[0].restaurant_id,
				'table_num': rows[0].table_num
			};	//response

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

/*
	Registers a new alexa
	Inputs: alexa_id, restaurant_id, table_num
	Outputs:
		On success:
			Successfully added new alexa!
		If the alexa_id already exists:
			Error: alexa_id already exists
		If any inputs are missing:
			Error: Missing parameter. Required parameters: alexa_id, restaurant_id, table_num
		On error:
			Error adding new alexa
*/
app.put('/alexa/register', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.alexa_id && req.body.restaurant_id && req.body.table_num)) {
		res.status(400).send('Error: Missing parameter. Required parameters: alexa_id, restaurant_id, table_num');
		return;
	}   //if

	//Make sure the alexa_id doesn't exist:
	let query = 'Select * FROM sample.alexas WHERE alexa_id = ?';
	db.query(query, req.body.alexa_id, (err, rows) => {
		if (rows.length > 0) {
			res.status(409).send('Error: alexa_id already exists');
		}   //if
		else {
			//Create a new salt
			let salt = genSalt();
			//Hash supplied password with salt
			let hashed = crypto.pbkdf2(req.body.alexa_id, salt, 50000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					res.status(500).send('Error adding new alexa');
				}
				else
				{
					//Build query and parameters:
					let parameters = [req.body.alexa_id, req.body.restaurant_id, req.body.table_num, req.body.alexa_id, 'Alexa', 'Alexa', 'alexa@autogarcon.com', salt, derivedKey.toString('hex')];
					query = 'INSERT INTO sample.alexas(alexa_id, restaurant_id, table_num)';
					query = query + ' VALUES (?, ?, ?)';
					query = query + '; INSERT INTO sample.customers(customer_id, first_name, last_name, email, salt, password)';
					query = query + ' VALUES(?, ?, ?, ?, ?, ?)';

					//Add new alexa to db:
					db.query(query, parameters, (err, rows) => {
						if (err) {
							res.status(500).send('Error adding new alexa');
						}   //if
						else {
							res.status(200).send('Successfully added new alexa!');
						}   //else
					}); //db.query
				}   //else
			}); //hashed
		}   //else
	}); //db.query
});	//app.put

/*
	Checks to see if an alexa has a pending order
	Inputs: alexa_id
	Outputs:
		If there is a pending order:
			{
				'message': 'Pending order exists',
				'order_num': order_num
			}
		If there is not a pending order:
			{
				'message': 'No pending order exists'
			}
		On error:
			Error retrieving pending order
*/
app.get('/alexa/pending/:id', (req, res) => {
	let query = 'SELECT * FROM sample.orders WHERE customer_id = ? AND order_status like "Pending"';
	let response = {};

	//Query database:
	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving pending order');
		}   //if
		//No pending orders
		else if (rows.length < 1) {
			response = {
				'message': 'No pending order exists'
			};	//response

			//Send Response:
			res.type('json').send(response);
		}   //else if
		//Pending order exists
		else {
			//Send order_num of existing pending order
			response = {
				'message': 'Pending order exists',
				'order_num': rows[0].order_num
			};	//response

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

/*
	Creates a new pending order for an alexa
	Inputs: restaurant_id, alexa_id, table_num
	Outputs:
		On success:
			{
				'message': 'Order created',
				'order_num': order_num
			}
		If any inputs are missing:
			Error: Missing parameter. Required parameters: restaurant_id, alexa_id, table_num
		On error:
			Error placing order
*/
app.put('/alexa/order/new', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.restaurant_id && req.body.alexa_id && req.body.table_num)) {
		res.status(400).send('Error: Missing parameter. Required parameters: restaurant_id, alexa_id, table_num');
		return;
	}   //if

	//Create timestamp
	let date = luxon.DateTime.local().setZone('America/Chicago');
	let timestamp = date.toString();

	let parameters = [req.body.restaurant_id, req.body.alexa_id, 'Pending', timestamp, req.body.table_num];

	//Query to add order to orders table and retrieve the order_num
	let query = ' INSERT INTO sample.orders(restaurant_id, customer_id, order_status, order_date, table_num)';
	query = query + ' VALUES (?, ?, ?, ?, ?);';

	//Add order to orders table in db:
	db.query(query, parameters, (err, rows) => {
		if (err) {
			res.status(500).send('Error placing order');
		}   //if
		else {
			let order_num = rows.insertId;
			let response = {};

			//Send order_num of new order
			response = {
				'message': 'Order created',
				'order_num': order_num
			};	//response

			//Send Response:
			res.type('json').send(response);
		}	//else
	});	//db.query
});	//app.put

/*
	Updates an existing pending order for an alexa
	Inputs: order_num, item, quantity
	Outputs:
		On sucess:
			Successfully updated order!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: order_num, item, quantity
		If order_num does not exist:
			Error: order does not exist or is not pending
		On error:
			Error updating order
*/
app.put('/alexa/order/update', (req, res) =>
{
	//Make sure right number of parameters are entered:
	if(!(req.body.order_num && req.body.item && req.body.quantity))
	{
		res.status(500).send('Error: Missing parameter. Required parameters: order_num, item, quantity');
		return;
	}   //if

	//Make sure the order exists:
	let query = 'Select * FROM sample.orders WHERE order_num = ? AND order_status like "Pending"';
	db.query(query, req.body.order_num, (err, rows) =>
	{
		if (rows.length == 0)
		{
			res.status(500).send('Error: order does not exist or is not pending');
		}   //if
		else
		{
			//Check to see if that item is already in the order:
			query = 'Select * FROM sample.orderdetails WHERE order_num = ? AND item_id = ?';
			let parameters = [req.body.order_num, req.body.item];
			db.query(query, parameters, (err, rows) => {
				//Item does not exist in order:
				if (rows.length < 1) {
					parameters = [req.body.order_num, req.body.item, req.body.quantity];
					query = 'INSERT INTO sample.orderdetails (order_num, item_id, quantity)';
					query = query + ' VALUES (?,?,?)'

					//Update order in db:
					db.query(query, parameters, (err, rows) =>
					{
						if (err)
						{
							res.status(500).send('Error updating order');
						}   //if
						else
						{
							res.status(200).send('Successfully updated order!');
						}   //else
					}); //db.query
				}	//if
				//Item exists in order:
				else {
					//Updated quantity:
					let quantity = parseInt(rows[0].quantity);
					let updated = quantity + parseInt(req.body.quantity);

					//Build query and parameters:
					query = 'UPDATE sample.orderdetails SET quantity = ?';
					query = query + ' WHERE order_num = ? AND item_id = ?';
					parameters = [updated, req.body.order_num, req.body.item];

					//Update quantity in db:
					db.query(query, parameters, (err, rows) =>
					{
						if (err)
						{
							res.status(500).send('Error updating order');
						}   //if
						else
						{
							res.status(200).send('Successfully updated order!');
						}   //else
					}); //db.query
				}	//else
			});	//db.query
		}   //else
	}); //db.query
});	//app.put

//==========================================================================//
//							MISCELLANEOUS ENDPOINTS 						//
//==========================================================================//

/*
	Verifies a JSON Web Token
	Inputs: JWT
	Outputs:
		On success:
			{
				'message': 'Test Passed'
			}
		On error/invalid token:
			Must be authorized!
*/
app.post('/verify', verifyToken, (req, res) => {
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			let response = {
				'message': 'Test passed',
				auth
			};	//response

			//Send Response:
			res.type('json').send(response);
		}   //else
	});	//verify
}); //app.post

/*
	Token format:
		Authorization: Bearer <token>
*/

/*
	Helper function used to verify a JWT
	Inputs: req, res, next
	Outputs:
		If the token does not verify:
			Authorization Required!
*/
function verifyToken(req, res, next)
{
	let header = req.headers['authorization'];

	if (header != null)
	{
		let bearer = header.split(' ');
		token = bearer[1];
		req.token = token;
		next();
	}   //if
	else
	{
		//Don't allow
		res.status(401).send('Authorization Required!');
	}   //else
}   //verifyToken

/*
	Helper function used to generate a new salt
	Outputs:
		Salt with length of 64 bytes
*/
function genSalt() {
	//Generate random string
	return crypto.randomBytes(64).toString('hex');
}   //genSalt

/*
	Helper function used to see if an object is empty
	Inputs: object
	Outputs:
		If object is empty:
			true
		If object is not empty:
			false
*/
function isEmptyObject(obj) {
	for (let key in obj)
	{
		if (obj.hasOwnProperty(key))
		{
			return false;
		}	//if
	}	//for
	return true;
}	//isEmptyObject
