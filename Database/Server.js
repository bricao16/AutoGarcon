/*
	REST-API Server
	Tucker Urbanski
	Date Created: 3/2/2020
	Last Modified: 4/18/2020
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
	password    : process.env.DB_PASS
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

//GET request handler for menu
//Returns the menu for the restaurant with restaurant_id = id
app.get('/menu/:id', (req, res) => {
	let query = "SELECT * FROM sample.menu WHERE restaurant_id = ?";

	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error: could not retrieve data from database');
		}   //if
		else if (rows.length < 1) {
			res.status(500).send('Nothing was retrieved from database');
		}   //else if
		else {
			//Build JSON object:
			let response = {};

			for (let i=0; i<rows.length; i++) {
				response[rows[i].item_name] =   {
					'item_id': rows[i].item_id,
					'restaurant': rows[i].restaurant_id,
					'calories': rows[i].calorie_num,
					'price': rows[i].price,
					'category': rows[i].category,
					'picture': 'No picture yet',
					'in_stock': rows[i].in_stock
				};	//response[i]
			}   //for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

//GET request handler for restaurant
app.get('/restaurant/:id', (req, res) => {
	let query = "SELECT * FROM sample.restaurants NATURAL JOIN sample.menu WHERE restaurant_id = ?";

	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error: could not retrieve data from database');
		}   //if
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
			};

			//Add menu to response:
			response['menu'] = {};
			for (let i=0; i<rows.length; i++) {
				response['menu'][rows[i].item_name] =   {
					'item_id': rows[i].item_id,
					'calories': rows[i].calories,
					'price': rows[i].price,
					'category': rows[i].category,
					'picture': 'No picture yet',
					'in_stock': rows[i].in_stock
				};
			}   //for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

//GET request handler for orders
app.get('/orders/:id', (req, res) => {
	let query = 'SELECT * FROM sample.menu natural join sample.orders natural join sample.orderdetails WHERE restaurant_id = ? and order_status like "In Progress" ORDER BY order_num';

	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error: could not retrieve data from database');
		}   //if
		else if (rows.length < 1) {
			res.status(500).send('Nothing was retrieved from database');
		}   //else if
		else {
			//Build JSON object:
			let response = {};

			//Add list of orders to response:
			for (let i=0; i<rows.length; i++) {
				response[i] =   {
					'order_num': rows[i].order_num,
					'item_name': rows[i].item_name,
					'quantity': rows[i].quantity,
					'order_date': rows[i].order_date,
					'table': rows[i].table_num
				};
			}   //for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

//POST request handler for placing an order
app.post('/orders/place', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.restaurant_id && req.body.customer_id && req.body.table_num && req.body.order)) {
		res.status(500).send('Error: Missing parameter. Required parameters: restaurant_id, customer_id, table_num, order');
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
						res.status(200).send('Successfully placed order!');
					}	//else
				});	//query
			}	//if
		}   //else
	}); //db.query
});	//app.post

//GET request handler for alexa
app.get('/alexa/:id', (req, res) => {
	let query = "SELECT * FROM sample.alexas WHERE alexa_id = ?";

	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error: could not retrieve data from database');
		}   //if
		else {
			//Build JSON object:
			let response = {};

			//Add restaurant and table info to response:
			response[rows[0].alexa_id] = {
				'restaurant_id': rows[0].restaurant_id,
				'table_num': rows[0].table_num
			};

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

//GET request handler for favorites
app.get('/favorites/:id', (req, res) => {
	let query = "SELECT * FROM sample.favorites natural join sample.restaurants WHERE customer_id = ?";

	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error: could not retrieve data from database');
		}   //if
		else {
			//Build JSON object:
			let response = {};

			//Add list of favorites to response:
			for (let i=0; i<rows.length; i++) {
				response[i] =   {
					'restaurant_id': rows[i].restaurant_id,
					'restaurant_name': rows[i].restaurant_name,
					'address': rows[i].restaurant_addr,
					'phone_number': rows[i].phone_number,
					'opening_time': rows[i].opening_time,
					'closing_time': rows[i].closing_time,
					'logo': rows[i].logo
				};
			}   //for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

//POST request handler for customer login
app.post('/customer/login', (req, res) => {
	let query = 'SELECT * FROM sample.customers WHERE customer_id = ?';

	db.query(query, req.body.username, (err, rows) => {
		if (err) {
			res.status(500).send('Error: could not retrieve data from database');
		}   //if
		else if (rows.length < 1) {
			res.status(500).send('Error: no user with that username/password');
		}   //else if
		else {
			//Store user's salt
			let salt = rows[0].salt;
			//Hash supplied password
			let hashed = crypto.pbkdf2(req.body.password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					console.log(err);
				}
				else
				{
					if (derivedKey.toString('hex')  === rows[0].password) {
						//Build user object:
						let user = {
							'customer_id': rows[0].customer_id,
							'first_name': rows[0].first_name,
							'last_name': rows[0].last_name,
							'email': rows[0].email
						};  //user

						//Sign JWT and send token
						//To add expiration date: jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '<time>' }, (err, token) => ...)
						jwt.sign({user}, process.env.JWT_SECRET, (err, token) => {
							//Build response
							let response = {
								'token': token,
								user
							};  //response

							//Send Response:
							res.type('json').send(response);
						});
					}   //if
					else {
						res.status(500).send('Error: no user with that username/password');
					}   //else
				}   //else
			}); //hashed
		}   //else
	}); //db.query
}); //app.post

//POST request handler for staff login
app.post('/staff/login', (req, res) => {
	let query = 'SELECT * FROM sample.staff WHERE staff_id = ?';

	db.query(query, req.body.username, (err, rows) => {
		if (err) {
			res.status(500).send('Error: could not retrieve data from database');
		}   //if
		else if (rows.length < 1) {
			res.status(500).send('Error: no user with that username/password');
		}   //else if
		else {
			//Store user's salt
			let salt = rows[0].salt;
			//Hash supplied password
			let hashed = crypto.pbkdf2(req.body.password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					console.log(err);
				}
				else
				{
					if (derivedKey.toString('hex')  === rows[0].password) {
						//Build user object:
						let staff = {
							'staff_id': rows[0].staff_id,
							'restaurant_id': rows[0].restaurant_id,
							'first_name': rows[0].first_name,
							'last_name': rows[0].last_name,
							'contact_num': rows[0].contact_num,
							'email': rows[0].email,
							'position': rows[0].position
						};  //user

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
						});
					}   //if
					else {
						res.status(500).send('Error: no user with that username/password');
					}   //else
				}   //else
			}); //hashed
		}   //else
	}); //db.query
}); //app.post

//POST request handler for verifying token
app.post('/verify', verifyToken, (req, res) => {
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) =>{
		if (err)
		{
			res.status(403).send('Must be authorized!');
		}   //if
		else
		{
			let response = {
				'message': 'Test passed',
				auth
			};

			//Send Response:
			res.type('json').send(response);
		}   //else
	});
}); //app.post

//PUT request handler for new staff member
app.put('/staff/register', (req, res) =>
{
	//Make sure right number of parameters are entered:
	if(!(req.body.staff_id && req.body.restaurant_id && req.body.first_name && req.body.last_name && req.body.contact_num && req.body.email && req.body.position && req.body.password))
	{
		res.status(500).send('Error: Missing parameter. Required parameters: staff_id, restaurant_id, first_name, last_name, contact_num, email, position, password');
		return;
	}   //if

	//Make sure the staff_id doesn't exist:
	let query = "Select * FROM sample.staff WHERE staff_id = ?";
	db.query(query, req.body.staff_id, (err, rows) =>
	{
		if (rows.length > 0)
		{
			res.status(500).send('Error: staff_id already exists');
		}   //if
		else
		{
			//Create a new salt
			let salt = genSalt();
			//Hash supplied password with salt
			let hashed = crypto.pbkdf2(req.body.password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					console.log(err);
				}
				else
				{
					let parameters = [req.body.staff_id, req.body.restaurant_id, req.body.first_name, req.body.last_name, req.body.contact_num,req.body.email, req.body.position, salt, derivedKey.toString('hex')];

					let query = 'INSERT INTO sample.staff(staff_id, restaurant_id, first_name, last_name, contact_num, email, position, salt, password)';
					query = query + " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";

					//Add new customer to db:
					db.query(query, parameters, (err, rows) =>
					{
						if (err)
						{
							res.status(500).send('Error creating new customer');
						}   //if
						else
						{
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

//PUT request handler for new customer
app.put('/customer/register', (req, res) =>
{
	//Make sure right number of parameters are entered:
	if(!(req.body.customer_id && req.body.first_name && req.body.last_name && req.body.email && req.body.password))
	{
		res.status(500).send('Error: Missing parameter. Required parameters: customer_id, first_name, last_name, email, password');
		return;
	}   //if

	//Make sure the customer_id doesn't exist:
	let query = "Select * FROM sample.customers WHERE customer_id = ?";
	db.query(query, req.body.customer_id, (err, rows) =>
	{
		if (rows.length > 0)
		{
			res.status(500).send('Error: customer_id already exists');
		}   //if
		else
		{
			//Create a new salt
			let salt = genSalt();
			//Hash supplied password with salt
			let hashed = crypto.pbkdf2(req.body.password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					console.log(err);
				}
				else
				{
					let parameters = [req.body.customer_id, req.body.first_name, req.body.last_name, req.body.email, salt, derivedKey.toString('hex')];
					let query = 'INSERT INTO sample.customers(customer_id, first_name, last_name, email, salt, password)';
					query = query + " VALUES(?, ?, ?, ?, ?, ?)";

					//Add new customer to db:
					db.query(query, parameters, (err, rows) =>
					{
						if (err)
						{
							res.status(500).send('Error creating new customer');
						}   //if
						else
						{
							//Build user object:
							let user = {
								'customer_id': req.body.customer_id,
								'first_name': req.body.first_name,
								'last_name': req.body.last_name,
								'email': req.body.email
							};  //user

							//Sign JWT and send token
							//To add expiration date: jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '<time>' }, (err, token) => ...)
							jwt.sign({user}, process.env.JWT_SECRET, (err, token) => {
								//Build response
								let response = {
									'token': token,
									user
								};  //response

								//Send Response:
								res.type('json').send(response);
							});
						}   //else
					}); //db.query
				}   //else
			}); //hashed
		}   //else
	}); //db.query
});	//app.put

//POST request handler for updating customer information
app.post('/customer/update', verifyToken, (req, res) =>
{
	//Verify the JWT
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) =>{
		if (err)
		{
			res.status(403).send('Must be authorized!');
		}   //if
		else
		{
			if (auth.user)
			{
				//Make sure right number of parameters are entered:
				if(!(req.body.customer_id && req.body.first_name && req.body.last_name && req.body.email))
				{
					res.status(500).send('Error: Missing parameter. Required parameters: customer_id, first_name, last_name, email, password (optional)');
					return;
				}   //if

				let customer_id = auth.user.customer_id;
				let query = 'UPDATE sample.customers SET customer_id = ?, first_name = ?, last_name = ?, email = ?';

				if (req.body.password)
				{
					//Create a new salt
					let salt = genSalt();
					//Hash supplied password with salt
					let hashed = crypto.pbkdf2(req.body.password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
						if (err) {
							console.log(err);
						}
						else
						{
							query = query + ', salt = ?, password = ?';
							query = query + ' WHERE customer_id = ?';
							let parameters = [req.body.customer_id, req.body.first_name, req.body.last_name, req.body.email, salt, derivedKey.toString('hex'), customer_id];

							//Add new customer to db:
							db.query(query, parameters, (err, rows) =>
							{
								if (err)
								{
									res.status(500).send('Error updating customer info');
								}   //if
								else
								{
									//Build user object:
									let user = {
										'customer_id': req.body.customer_id,
										'first_name': req.body.first_name,
										'last_name': req.body.last_name,
										'email': req.body.email
									};  //user

									//Sign JWT and send token
									//To add expiration date: jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '<time>' }, (err, token) => ...)
									jwt.sign({user}, process.env.JWT_SECRET, (err, token) => {
										//Build response
										let response = {
											'token': token,
											user
										};  //response

										//Send Response:
										res.type('json').send(response);
									});	//sign
								}   //else
							}); //db.query
						}   //else
					}); //hashed
				}	//if

				else
				{
					query = query + ' WHERE customer_id = ?';
					let parameters = [req.body.customer_id, req.body.first_name, req.body.last_name, req.body.email, customer_id];

					//Update customer info in db:
					db.query(query, parameters, (err, rows) =>
					{
						if (err)
						{
							res.status(500).send('Error updating customer info');
						}   //if
						else
						{
							//Build user object:
							let user = {
								'customer_id': req.body.customer_id,
								'first_name': req.body.first_name,
								'last_name': req.body.last_name,
								'email': req.body.email
							};  //user

							//Sign JWT and send token
							//To add expiration date: jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '<time>' }, (err, token) => ...)
							jwt.sign({user}, process.env.JWT_SECRET, (err, token) => {
								//Build response
								let response = {
									'token': token,
									user
								};  //response

								//Send Response:
								res.type('json').send(response);
							});	//sign
						}   //else
					}); //db.query
				}	//else
			}	//if
			else
			{
				res.status(403).send('Must be signed in as a customer!');
			}	//else
		}   //else
	});	//verify
});	//app.post

//PUT request handler for adding a menu item
app.put('/menu/add', (req, res) =>
{
	//Make sure right number of parameters are entered:
	if(!(req.body.restaurant_id && req.body.item_name && req.body.calorie_num && req.body.category && req.body.price))
	{
		res.status(500).send('Error: Missing parameter. Required parameters: restaurant_id, item_name, calorie_num, category, price');
		return;
	}   //if

	//Make sure the menu item doesn't exist at the restaurant:
	let parameters = [];
	parameters = [req.body.restaurant_id, req.body.item_name]
	let query = "Select * FROM sample.menu WHERE restaurant_id = ? AND item_name = ?";
	db.query(query, parameters, (err, rows) =>
	{
		if (rows.length > 0)
		{
			res.status(500).send('Error: item already exists');
		}   //if
		else
		{
			parameters = [req.body.restaurant_id, req.body.item_name, req.body.calorie_num, req.body.category,req.body.price];
			let query = '';
			query = 'INSERT INTO sample.menu(restaurant_id, item_name, calorie_num, category, in_stock, price)';
			query = query + " VALUES (?, ?, ?, ?, 1, ?)";

			//Add new menu item to db:
			db.query(query, parameters, (err, rows) =>
			{
				if (err)
				{
					res.status(500).send('Error adding new menu item');
				}   //if
				else
				{
					res.status(200).send('Successfully added new menu item!');
				}   //else
			}); //db.query
		}   //else
	}); //db.query
});	//app.put

//POST request handler for updating menu item
app.post('/menu/update', (req, res) =>
{
	//Make sure right number of parameters are entered:
	if(!(req.body.item_id && req.body.restaurant_id && req.body.item_name && req.body.calorie_num && req.body.category && req.body.in_stock && req.body.price))
	{
		res.status(500).send('Error: Missing parameter. Required parameters: item_id, restaurant_id, item_name, calorie_num, category, in_stock, price');
		return;
	}   //if

	//Make sure the menu item exists at the restaurant:
	let parameters = [];
	parameters = [req.body.item_id, req.body.restaurant_id]
	let query = "Select * FROM sample.menu WHERE item_id = ? AND restaurant_id = ?";
	db.query(query, parameters, (err, rows) =>
	{
		if (rows.length == 0)
		{
			res.status(500).send('Error: item does not exist');
		}   //if
		else
		{
			parameters = [req.body.item_name, req.body.calorie_num, req.body.category, req.body.in_stock, req.body.price, req.body.item_id];
			let query = '';
			query = 'UPDATE sample.menu SET item_name = ?, calorie_num = ?, category = ?, in_stock = ?, price = ?';
			query = query + " WHERE item_id = ?";

			//Edit menu item in db:
			db.query(query, parameters, (err, rows) =>
			{
				if (err)
				{
					res.status(500).send('Error updating menu item');
				}   //if
				else
				{
					res.status(200).send('Successfully updated menu item!');
				}   //else
			}); //db.query
		}   //else
	}); //db.query
});	//app.post

//DELETE request handler for removing menu item
app.delete('/menu/delete', verifyToken, (req, res) =>
{
	//Make sure the menu item exists:
	let query = 'Select * FROM sample.menu WHERE item_id = ?';
	db.query(query, req.body.item_id, (err, rows) =>
	{
		if (rows.length == 0)
		{
			res.status(500).send('Error: menu item does not exist');
		}   //if
		else
		{
			//Verify that the person is a manager at the restaurant
			jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) =>{
				if (err)
				{
					res.status(403).send('Must be authorized!');
				}   //if
				else
				{
					if (auth.staff && auth.staff.position === 'manager' && auth.staff.restaurant_id === rows[0].restaurant_id)
					{
						let query = 'DELETE FROM sample.menu WHERE item_id = ?';

						//Remove menu item in db:
						db.query(query, req.body.item_id, (err, rows) =>
						{
							if (err)
							{
								res.status(500).send('Error deleting menu item');
							}   //if
							else
							{
								res.status(200).send('Successfully deleted menu item!');
							}   //else
						}); //db.query
					}	//if
					else
					{
						res.status(403).send('Must be the restaurant manager to delete menu items!');
					}	//else
				}   //else
			});	//verify
		}   //else
	}); //db.query
});	//app.delete

//PUT request handler for adding an alexa
app.put('/alexa/register', (req, res) =>
{
	//Make sure right number of parameters are entered:
	if(!(req.body.alexa_id && req.body.restaurant_id && req.body.table_num))
	{
		res.status(500).send('Error: Missing parameter. Required parameters: alexa_id, restaurant_id, table_num');
		return;
	}   //if

	//Make sure the alexa_id doesn't exist:
	let query = "Select * FROM sample.alexas WHERE alexa_id = ?";
	db.query(query, req.body.alexa_id, (err, rows) =>
	{
		if (rows.length > 0)
		{
			res.status(500).send('Error: alexa_id already exists');
		}   //if
		else
		{
			let parameters = [];
			parameters = [req.body.alexa_id, req.body.restaurant_id, req.body.table_num];
			let query = 'INSERT INTO sample.alexas(alexa_id, restaurant_id, table_num)';
			query = query + " VALUES (?, ?, ?)";

			//Add new menu item to db:
			db.query(query, parameters, (err, rows) =>
			{
				if (err)
				{
					res.status(500).send('Error adding new alexa');
				}   //if
				else
				{
					res.status(200).send('Successfully added new alexa!');
				}   //else
			}); //db.query
		}   //else
	}); //db.query
});	//app.put

//GET request handler for pending alexa order
app.get('/alexa/pending/:id', (req, res) => {
	let query = 'SELECT * FROM sample.orders WHERE customer_id = ? AND order_status like "Pending"';
	let response = {};

	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error: could not retrieve data from database');
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
				'order_num': rows.order_num
			};	//response

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

//PUT request handler for adding new alexa order
app.put('/alexa/order/new', (req, res) =>
{
	//Make sure right number of parameters are entered:
	if(!(req.body.restaurant_id && req.body.alexa_id && req.body.table_num)) {
		res.status(500).send('Error: Missing parameter. Required parameters: restaurant_id, alexa_id, table_num');
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

//PUT request handler for updating alexa order
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
			let parameters = [req.body.order_num, req.body.item, req.body.quantity];
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
		}   //else
	}); //db.query
});	//app.put

//POST request handler for updating menu item
app.post('/orders/update', (req, res) =>
{
	//Make sure right number of parameters are entered:
	if(!(req.body.order_num && req.body.order_status))
	{
		res.status(500).send('Error: Missing parameter. Required parameters: order_num, order_status');
		return;
	}   //if

	//Make sure the order exists:
	let query = 'Select * FROM sample.orders WHERE order_num = ?';
	db.query(query, req.body.order_num, (err, rows) =>
	{
		if (rows.length == 0)
		{
			res.status(500).send('Error: order does not exist');
		}   //if
		else
		{
			let parameters = [req.body.order_status, req.body.order_num];
			let query = 'UPDATE sample.orders SET order_status = ? WHERE order_num = ?';

			//Edit menu item in db:
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
		}   //else
	}); //db.query
});	//app.post

/*
	Token format:
		Authorization: Bearer <token>
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
		res.status(403).send('Authorization Required!');
	}   //else
}   //verifyToken

function genSalt() {
	//Generate random string
	return crypto.randomBytes(64).toString('hex');
}   //genSalt
