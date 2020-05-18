/*
	AutoGarcon API
	Tucker Urbanski
	Contributors: PJ Cappitelli, Emma Sinn, Brandon Tran
	Date Created: 3/2/2020
	Last Modified: 5/18/2020
*/

// Built-in Node.js modules
var fs = require('fs');
var path = require('path');
var cors = require('cors');
var crypto = require('crypto');
var https = require('https');

// NPM modules
var express = require('express');
var bodyParser = require('body-parser');
var js2xmlparser = require('js2xmlparser');
var mysql = require('mysql');
var dotenv = require('dotenv');
var jwt = require('jsonwebtoken');
var luxon = require('luxon');
var multer = require('multer');
var nodemailer = require('nodemailer');
var generator = require('generate-password');

var key_filename = path.join(__dirname, 'key.pem');
var cert_filename = path.join(__dirname, 'cert.pem');

var app = express();
var upload = multer();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
dotenv.config();

//Configure nodemailer
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
	user: process.env.EMAIL_USER,
	pass: process.env.EMAIL_PASS
  }
});

//Create db connection
var db = mysql.createConnection({
	host        : process.env.DB_HOST,
	port        : process.env.DB_PORT,
	user        : process.env.DB_USER,
	password    : process.env.DB_PASS,
	multipleStatements: true
});

//HTTPS Options
var options = {
	key: fs.readFileSync(key_filename),
	cert: fs.readFileSync(cert_filename),
	passphrase: process.env.SSL_PASSPHRASE
}

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
//var server = app.listen(8000);
https.createServer(options, app).listen(8001);
console.log('Now listening on port 8001');


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
					email,
					opening,
					closing,
					font,
					font_color,
					primary_color,
					secondary_color,
					tertiary_color,
					logo,
					cuisine,
					greeting
				}
				menu: {
					dish_name: {
						calories,
						price,
						category,
						in_stock,
						description,
						allergens
					}
				}
			}
		On error:
			Error retrieving restaurant information
*/
app.get('/restaurant/:id', (req, res) => {
	let query = 'SELECT * FROM sample.restaurants WHERE restaurant_id = ?; SELECT * FROM sample.menu WHERE restaurant_id = ?';

	//Query database:
	db.query(query, [req.params.id, req.params.id], (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving restaurant information');
		}   //if
		else if (rows[0].length < 1) {
			res.status(409).send('Invalid restaurant_id');
		}	//else if
		else {
			//Build JSON object:
			let response = {};

			//Add restaurant info to response:
			response['restaurant'] = {
				'name': rows[0][0].restaurant_name,
				'address': rows[0][0].restaurant_addr,
				'phone_number': rows[0][0].phone_number,
				'email': rows[0][0].email,
				'opening': rows[0][0].opening_time,
				'closing': rows[0][0].closing_time,
				'font': rows[0][0].font,
				'font_color': rows[0][0].font_color,
				'primary_color': rows[0][0].primary_color,
				'secondary_color': rows[0][0].secondary_color,
				'tertiary_color': rows[0][0].tertiary_color,
				'logo': rows[0][0].logo,
				'cuisine': rows[0][0].cuisine,
				'greeting': rows[0][0].alexa_greeting
			};	//response

			//Add menu to response:
			response['menu'] = {};
			//If the restaurant has no menu items:
			if (rows[1].length < 1) {
				res.type('json').send(response);
			}	//if
			else {
				for (let i=0; i<rows[1].length; i++) {
					//Add each menu item to response:
					response['menu'][rows[1][i].item_name] =   {
						'item_id': rows[1][i].item_id,
						'calories': rows[1][i].calorie_num,
						'price': rows[1][i].price,
						'category': rows[1][i].category,
						'in_stock': rows[1][i].in_stock,
						'description': rows[1][i].description,
						'allergens': []
					};	//response
				}   //for

				//Add allergens:
				query = 'SELECT * FROM sample.menu NATURAL JOIN sample.allergens WHERE restaurant_id = ? ORDER BY item_id';
				db.query(query, req.params.id, (err, rows) => {
					if (err) {
						res.status(500).send('Error retrieving menu');
					}	//if
					else {
						for (let i=0; i<rows.length; i++) {
							response['menu'][rows[i].item_name].allergens.push(rows[i].allergen_name);
						}	//for

						//Send Response:
						res.type('json').send(response);
					}	//else
				});	//db.query
			}	//else
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
	Inputs: restaurant_id, name, address, phone, email, opening, closing, JWT
	Outputs:
		On success:
			Successfully updated restaurant information!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: restaurant_id, name, address, phone, email, opening, closing, cuisine
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
	if(!(req.body.restaurant_id !== undefined && req.body.name !== undefined && req.body.address !== undefined && req.body.phone !== undefined && req.body.email !== undefined && req.body.opening !== undefined && req.body.closing !== undefined && req.body.cuisine !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: restaurant_id, name, address, phone, email, opening, closing, cuisine');
		return;
	}   //if

	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Make sure the restaurant exists:
			let query = 'Select * FROM sample.restaurants WHERE restaurant_id = ?';
			db.query(query, req.body.restaurant_id, (err, rows) => {
				if (rows.length == 0) {
					res.status(409).send('Error: restaurant does not exist');
				}   //if
				else {
					//Check to make sure person is a manager at the restaurant:
					if (auth.staff && auth.staff.position === 'manager' && auth.staff.restaurant_id === rows[0].restaurant_id) {
						//Build query and parameters:
						query = 'UPDATE sample.restaurants SET restaurant_name = ?, restaurant_addr = ?, phone_number = ?, email = ?, opening_time = ?, closing_time = ?, cuisine = ?';
						query = query + ' WHERE restaurant_id = ?';
						let parameters = [req.body.name, req.body.address, req.body.phone, req.body.email, req.body.opening, req.body.closing, req.body.cuisine, req.body.restaurant_id];

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
			}); //db.query
		}	//else
	});	//verify
});	//app.post

/*
	Returns font options
	Inputs: none
	Outputs:
		On success:
			{
				i:
				{
					font_id,
					font_name
				}
			}
		On error:
			Error retrieving fonts
*/
app.get('/fonts', (req, res) => {
	let query = 'SELECT * FROM sample.fonts';

	//Query database:
	db.query(query, (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving fonts');
		}   //if
		else {
			//Build JSON object:
			let response = {};

			//Loop through each row returned from query:
			for (let i=0; i<rows.length; i++) {
				//Add font info to response:
				response[i] = {
					'font_id': rows[i].font_id,
					'font_name': rows[i].font_name
				};	//response
			}	//for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

/*
	Updates restaurant customization
	Inputs: restaurant_id, primary_color, secondary_color, tertiary_color, font, font_color, greeting, logo (optional)
	Outputs:
		On success:
			Successfully updated restaurant customization!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: restaurant_id, primary_color, secondary_color, tertiary_color, font, font_color, greeting, logo (optional)
		If restaurant does not exist:
			Error: restaurant does not exist
		If logo is not an image file:
			Error: invalid image format. Accepted formats: png, jpg, jpeg
		If JWT is not valid:
			Must be authorized!
		If JWT is not a manager token for the restaurant of the item:
			Must be the restaurant manager to update restaurant information!
		On error: 
			Error updating restaurant customization
*/
app.post('/restaurant/customization', verifyToken, upload.single('logo'), (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.restaurant_id !== undefined && req.body.primary_color !== undefined && req.body.secondary_color !== undefined && req.body.tertiary_color !== undefined && req.body.font !== undefined && req.body.font_color !== undefined && req.body.greeting !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: restaurant_id, primary_color, secondary_color, tertiary_color, font, font_color, greeting, logo (optional)');
		return;
	}   //if

	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Make sure the restaurant exists:
			let query = 'Select * FROM sample.restaurants WHERE restaurant_id = ?';
			db.query(query, req.body.restaurant_id, (err, rows) => {
				if (rows.length == 0) {
					res.status(409).send('Error: restaurant does not exist');
				}   //if
				else {
					//Check to make sure person is a manager at the restaurant:
					if (auth.staff && auth.staff.position === 'manager' && parseInt(auth.staff.restaurant_id) === parseInt(req.body.restaurant_id)) {
						//If a logo is supplied:
						if (req.file !== undefined) {
							//If not an image file:
							if (!(req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg' || req.file.mimetype === 'image/jpeg')) {
								res.status(409).send('Error: invalid image format. Accepted formats: png, jpg, jpeg');
								return;
							}	//if
							//Build query and parameters:
							query = 'UPDATE sample.restaurants SET primary_color = ?, secondary_color = ?, tertiary_color = ?, font = ?, font_color = ?, logo = ?, alexa_greeting = ?';
							query = query + ' WHERE restaurant_id = ?';
							let parameters = [req.body.primary_color, req.body.secondary_color, req.body.tertiary_color, req.body.font, req.body.font_color, req.file.buffer, req.body.greeting, req.body.restaurant_id];

							//Update restaurant information in db:
							db.query(query, parameters, (err, rows) => {
								if (err) {
									res.status(500).send('Error updating restaurant customization');
								}	//if
								else {
									res.status(200).send('Successfully updated restaurant customization!');
								}   //else
							});	//db.query
						}	//if
						//If no logo is supplied:
						else {
							//Build query and parameters:
							query = 'UPDATE sample.restaurants SET primary_color = ?, secondary_color = ?, tertiary_color = ?, font = ?, font_color = ?, alexa_greeting = ?';
							query = query + ' WHERE restaurant_id = ?';
							let parameters = [req.body.primary_color, req.body.secondary_color, req.body.tertiary_color, req.body.font, req.body.font_color, req.body.greeting, req.body.restaurant_id];

							//Update restaurant information in db:
							db.query(query, parameters, (err, rows) => {
								if (err) {
									res.status(500).send('Error updating restaurant customization');
								}	//if
								else {
									res.status(200).send('Successfully updated restaurant customization!');
								}   //else
							});	//db.query
						}	//else
					}	//if
					else {
						res.status(401).send('Must be the restaurant manager to update restaurant customization!');
					}	//else
				}	//else
			}); //db.query
		}	//else
	});	//verify
});	//app.post

/*
	Creates a new restaurant
	Inputs: restaurant_name, restaurant_addr, phone_number, email, opening_time, closing_time, cuisine
	Outputs:
		On success:
			Successfully added new resaturant! restaurant_id = <restaurant_id>
		If any inputs are missing:
			Error: Missing parameter. Required parameters: restaurant_name, restaurant_addr, phone_number, email, opening_time, closing_time, cuisine
		If restaurant already exists:
			Error: resatuarnt_name already exists
		On error:
			Error adding new restaurant
*/
app.put('/restaurant/new', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.restaurant_name !== undefined && req.body.restaurant_addr !== undefined && req.body.phone_number !== undefined && req.body.email !== undefined && req.body.opening_time !== undefined && req.body.closing_time !== undefined && req.body.cuisine !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: restaurant_name, restaurant_addr, phone_number, email, opening_time, closing_time, cuisine');
		return;
	}   //if

	//Make sure the restaurant doesn't exist:
	let query = 'Select * FROM sample.restaurants WHERE restaurant_name = ?';
	db.query(query, req.body.restaurant_name, (err, rows) => {
		if (rows.length > 0) {
			res.status(409).send('Error: resatuarnt_name already exists');
		}   //if
		else {
			//Build query and parameters:
			query = 'INSERT INTO sample.restaurants (restaurant_name, restaurant_addr, phone_number, email, opening_time, closing_time, cuisine)';
			query = query + ' VALUES (?, ?, ?, ?, ?, ?, ?)';
			let parameters = [req.body.restaurant_name, req.body.restaurant_addr, req.body.phone_number, req.body.email, req.body.opening_time, req.body.closing_time, req.body.cuisine];

			//Add restaurant in db and get restaurant_id:
			db.query(query, parameters, (err, rows) => {
				if (err) {
					res.status(500).send('Error adding new restaurant');
				}	//if
				else {
					//Get restaurant_id of new restaurant
					let restaurant_id = rows.insertId;
					res.status(200).send('Successfully added new resaturant! restaurant_id = ' + restaurant_id);
				}   //else
			});	//db.query
		}	//else
	});	//db.query
});	//app.put


//==================================================================================//
//							ENDPOINTS RELATING TO ORDERS 							//
//==================================================================================//

/*
	Returns in progress orders for restaurant with restaurant_id = id
	Inputs: restaurant_id, JWT
	Outputs:
		On success:
			{
				i: {
					order_num,
					item_name,
					quantity,
					order_date,
					table_num,
					customization,
					category
				}
			}
		If no in progress orders exist:
			No in progress orders
		If JWT is not valid:
			Must be authorized!
		If JWT is not for a staff member at the restaurant:
			Must be a staff member to view orders!
		On error:
			Error retrieving orders
*/
app.get('/orders/:id', verifyToken, (req, res) => {
	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			if (auth.staff && parseInt(auth.staff.restaurant_id) === parseInt(req.params.id)) {
				//Build query:
				let query = 'SELECT * FROM sample.menu NATURAL JOIN sample.orders NATURAL JOIN sample.orderdetails WHERE restaurant_id = ? AND order_status LIKE "In Progress" ORDER BY order_num';

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
								'table': rows[i].table_num,
								'customization': rows[i].customization,
								'category': rows[i].category
							};	//response
						}   //for

						//Send Response:
						res.type('json').send(response);
					}   //else
				}); //db.query
			}	//if
			else {
				res.status(401).send('Must be a staff member to view orders!');
			}	//else
		}	//else
	});	//verify
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
					table_num,
					customization,
					category
				}
			}
		If no complete orders exist:
			No completed orders
		If JWT is not valid:
			Must be authorized!
		If JWT is not for a staff member at the restaurant:
			Must be a staff member to view orders!
		On error:
			Error retrieving orders
*/
app.get('/orders/complete/:id', verifyToken, (req, res) => {
	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			if (auth.staff && parseInt(auth.staff.restaurant_id) === parseInt(req.params.id)) {
				//Build query:
				let query = 'SELECT * FROM sample.menu NATURAL JOIN sample.orders NATURAL JOIN sample.orderdetails WHERE restaurant_id = ? AND order_status LIKE "Complete" ORDER BY order_date desc';

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
								'table': rows[i].table_num,
								'customization': rows[i].customization,
								'category': rows[i].category
							};	//response
						}   //for

						//Send Response:
						res.type('json').send(response);
					}   //else
				}); //db.query
			}	//if
			else {
				res.status(401).send('Must be a staff member to view orders!');
			}	//else
		}	//else
	});	//verify
}); //app.get

/*
	Places a new order
	Inputs: restaurant_id, customer_id, table_num, order, JWT
	Outputs:
		On success:
			Successfully placed order!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: restaurant_id, customer_id, table_num, order
		If JWT is not valid or not supplied: 
			Must be authorized!
		If JWT is for another customer:
			Can't order with a different customer's id!
		On error:
			Error placing order
*/
app.put('/orders/place', verifyToken, (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.restaurant_id !== undefined && req.body.customer_id !== undefined && req.body.table_num !== undefined && req.body.order !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: restaurant_id, customer_id, table_num, order');
		return;
	}   //if

	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Make sure person isn't ordering with a different customer_id:
			if (auth.customer && auth.customer.customer_id === req.body.customer_id) {
				//Create timestamp
				let date = luxon.DateTime.local().setZone('America/Chicago');
				let timestamp = date.toString();

				let parameters = [req.body.restaurant_id, req.body.customer_id, 'In Progress', timestamp, req.body.table_num];

				//Query to add order to orders table and retrieve the order_num
				let query = ' INSERT INTO sample.orders (restaurant_id, customer_id, order_status, order_date, table_num)';
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
							query = 'INSERT INTO sample.orderdetails (order_num, item_id, quantity, customization)';
							query = query + ' VALUES';

							//Loop through all items in order:
							for (let key in req.body.order) {
								if (req.body.order.hasOwnProperty(key)) {
									parameters.push(order_num);
									parameters.push(req.body.order[key].item);
									parameters.push(req.body.order[key].quantity);
									parameters.push(req.body.order[key].customization);

									//Check if it is the last item for formatting
									if (key === Object.keys(req.body.order)[Object.keys(req.body.order).length-1]) {
										query = query + ' (?, ?, ?, ?);';
									}	//if
									else {
										query = query + ' (?, ?, ?, ?),';
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
			}	//if
			else {
				res.status(401).send('Can\'t order with a different customer\'s id!');
			}	//else
		}	//else
	});	//verify
});	//app.put

/*
	Updates the status of an order
	Inputs: order_num, order_status
	Outputs:
		On success:
			Successfully updated order!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: order_num, order_status
		If invalid status is entered:
			Error: Invalid status. Valid statuses: Complete, In Progress, Pending, Cancelled
		If the order doesn't exist:
			Error: order does not exist
		On error:
			Error updating order
*/
app.post('/orders/update', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.order_num !== undefined && req.body.order_status !== undefined)) {
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

			//Edit order in db:
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

/*
	Returns the service status of all the tables at the restaurant with restaurant_id = id
	Inputs: restaurant_id, JWT
	Outputs:
		On success:
			{
				i: {
					table_num,
					status
				}
			}
		If no tables exist:
			No tables exist
		If JWT is not valid:
			Must be authorized!
		If JWT is not for a staff member at the restaurant:
			Must be a staff member to view table statuses!
		On error:
			Error retrieving statuses
*/
app.get('/services/:id', verifyToken, (req, res) => {
	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			if (auth.staff && parseInt(auth.staff.restaurant_id) === parseInt(req.params.id)) {
				//Build query:
				let query = 'SELECT * FROM sample.services WHERE restaurant_id = ?';

				//Query database:
				db.query(query, req.params.id, (err, rows) => {
					if (err) {
						res.status(500).send('Error retrieving statuses');
					}   //if
					else if (rows.length < 1) {
						res.status(200).send('No tables exist');
					}   //else if
					else {
						//Build JSON object:
						let response = {};

						//Loop through each row returned from query:
						for (let i=0; i<rows.length; i++) {
							//Add each part of every order to response:
							response[i] =   {
								'table_num': rows[i].table_num,
								'status': rows[i].service_status
							};	//response
						}   //for

						//Send Response:
						res.type('json').send(response);
					}   //else
				}); //db.query
			}	//if
			else {
				res.status(401).send('Must be a staff member to view table statuses!');
			}	//else
		}	//else
	});	//verify
}); //app.get

/*
	Updates the service status of a table
	Inputs: restaurant_id, table_num, status
	Outputs:
		On success:
			Successfully updated status!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: restaurant_id, order_num, order_status
		If the restaurant/table doesn't exist:
			Error: table does not exist at restaurant
		If invalid status is entered:
			Error: Invalid status. Valid statuses: Good, Help, Bill
		On error:
			Error updating status
*/
app.post('/services/update', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.restaurant_id !== undefined && req.body.table_num !== undefined && req.body.status !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: restaurant_id, table_num, status');
		return;
	}   //if

	//Make sure the restaurant and table exists:
	let query = 'Select * FROM sample.services WHERE restaurant_id = ? AND table_num = ?';
	let parameters = [req.body.restaurant_id, req.body.table_num];
	db.query(query, parameters, (err, rows) => {
		if (rows.length == 0) {
			res.status(409).send('Error: table does not exist at restaurant');
		}   //if
		else {
			//Make sure valid status is entered:
			if (!(req.body.status === 'Good' || req.body.status === 'Help' || req.body.status === 'Bill')) {
				res.status(409).send('Error: Invalid status. Valid statuses: Good, Help, Bill');
				return;
			}	//if

			query = 'UPDATE sample.services SET service_status = ? WHERE restaurant_id = ? AND table_num = ?';
			parameters = [req.body.status, req.body.restaurant_id, req.body.table_num];

			//Edit status in db:
			db.query(query, parameters, (err, rows) => {
				if (err) {
					res.status(500).send('Error updating status');
				}   //if
				else {
					res.status(200).send('Successfully updated status!');
				}   //else
			}); //db.query
		}   //else
	}); //db.query
});	//app.post

/*
	Adds a new table to the services table
	Inputs: restaurant_id, table_num, JWT
	Outputs:
		On success:
			Successfully added new table!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: restaurant_id, table_num
		If the restaurant doesn't exist:
			Error: restaurant does not exist
		If JWT is not valid or not supplied: 
			Must be authorized!
		If JWT is not a manager token for the restaurant supplied:
			Must be the restaurant manager to add a new table!
		On error:
			Error adding table
*/
app.put('/services/new', verifyToken, (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.restaurant_id !== undefined && req.body.table_num !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: restaurant_id, table_num');
		return;
	}   //if

	//Verify that the person is a manager at the restaurant
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Check to make sure person is a manager at the restaurant:
			if (auth.staff && auth.staff.position === 'manager' && auth.staff.restaurant_id === req.body.restaurant_id) {
				//Make sure the restaurant exists:
				let query = 'Select * FROM sample.restaurants WHERE restaurant_id = ?';
				db.query(query, req.body.restaurant_id, (err, rows) => {
					if (rows.length == 0) {
						res.status(409).send('Error: restaurant does not exist');
					}   //if
					else {
						//Build query and parameters:
						query = 'INSERT INTO sample.services (restaurant_id, table_num, service_status)';
						query = query + ' VALUES (?, ?, ?);';
						let parameters = [req.body.restaurant_id, req.body.table_num, 'Good'];

						//Add table in db:
						db.query(query, parameters, (err, rows) => {
							if (err) {
								res.status(500).send('Error adding table');
							}   //if
							else {
								res.status(200).send('Successfully added new table!');
							}   //else
						}); //db.query
					}   //else
				}); //db.query
			}	//if
			else {
				res.status(401).send('Must be the restaurant manager to add a new table!');
			}	//else
		}	//else
	});	//verify
});	//app.put


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
					font,
					font_color,
					primary_color,
					secondary_color,
					tertiary_color,
					logo
				}
			}
		If customer has no favorites:
			Customer has no favorites
		If JWT is not valid or not supplied: 
			Must be authorized!
		If JWT is for another customer:
			Can't view other customer's favorites!
		On error:
			Error retrieving favorites
*/
app.get('/favorites/:id', verifyToken, (req, res) => {
	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Make sure person isn't viewing another customer's favorites:
			if (auth.customer && auth.customer.customer_id === req.params.id) {
				//Build query:
				let query = 'SELECT * FROM sample.favorites NATURAL JOIN sample.restaurants WHERE customer_id = ?';

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
								'font': rows[i].font,
								'font_color': rows[i].font_color,
								'primary_color': rows[i].primary_color,
								'secondary_color': rows[i].secondary_color,
								'tertiary_color': rows[i].tertiary_color,
								'logo': rows[i].logo
							};	//response
						}   //for

						//Send Response:
						res.type('json').send(response);
					}   //else
				}); //db.query
			}	//if
			else {
				res.status(401).send('Can\'t view other customer\'s favorites!');
			}	//else
		}	//else
	});	//verify
}); //app.get

/*
	Adds a restaurant to a customer's favorites
	Inputs: customer_id, restaurant_id, JWT
	Outputs:
		On success:
			Succesfully added restaurant to favorites!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: customer_id, restaurant_id
		If favorite already exists:
			Favorite already exists
		If JWT is not valid or not supplied: 
			Must be authorized!
		If JWT is for another customer:
			Can't add to other customer's favorites!
		On error:
			Error adding restaurant to favorites
*/
app.put('/favorites/add', verifyToken, (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.customer_id !== undefined && req.body.restaurant_id !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: customer_id, restaurant_id');
		return;
	}   //if

	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Make sure person isn't adding to another customer's favorites:
			if (auth.customer && auth.customer.customer_id === req.body.customer_id) {
				//Make sure the favorite does not exist:
				let query = 'SELECT * FROM sample.favorites WHERE customer_id = ? AND restaurant_id = ?'
				let parameters = [req.body.customer_id, req.body.restaurant_id];
				db.query(query, parameters, (err, rows) => {
					if (err) {
						res.status(500).send('Error adding restaurant to favorites');
					}   //if
					else if (rows.length > 0) {
						res.status(409).send('Favorite already exists');
					}	//else if
					else {
						//Add to favorites:
						query = 'INSERT INTO sample.favorites (customer_id, restaurant_id)';
						query = query + ' VALUES (?, ?)';
						db.query(query, parameters, (err, rows) => {
							if (err) {
								res.status(500).send('Error adding restaurant to favorites');
							}   //if
							else {
								//Send Response:
								res.status(200).send('Successfully added restaurant to favorites!');
							}   //else
						}); //db.query
					}   //else
				}); //db.query
			}	//if
			else {
				res.status(401).send('Can\'t add to other customer\'s favorites!');
			}	//else
		}	//else
	});	//verify
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
	if(!(req.body.customer_id !== undefined && req.body.restaurant_id !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: customer_id, restaurant_id');
		return;
	}   //if

	//Verify that the person is the customer with the favorite
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
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
					res.status(409).send('Error: favorite does not exist');
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
			res.status(401).send('Can\'t delete other customer\'s favorites!');
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
					position,
					temp_password
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
						//If a manager token:
						if (staff.position === 'manager') {
							jwt.sign({staff}, process.env.JWT_SECRET, {expiresIn: '1h'}, (err, token) => {
								//Add temp password flag to staff
								staff['temp_password'] = rows[0].temp_password;
								//Build response
								let response = {
									'token': token,
									staff
								};  //response

								//Send Response:
								res.type('json').send(response);
							});	//sign
						}	//if
						//If a cook token:
						else {
							jwt.sign({staff}, process.env.JWT_SECRET, {expiresIn: '12h'}, (err, token) => {
								//Add temp password flag to staff
								staff['temp_password'] = rows[0].temp_password;
								//Build response
								let response = {
									'token': token,
									staff
								};  //response

								//Send Response:
								res.type('json').send(response);
							});	//sign
						}	//else
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
		If any inputs are missing:
			Error: Missing parameter. Required parameters: staff_id, restaurant_id, first_name, last_name, contact_num, email, position, password
		If staff_id and email already exist:
			Error: staff_id and email already exist
		If staff_id already exists:
			Error: staff_id already exists
		If email already exists:
			Error: email already exists
		On error:
			Error creating new staff member
*/
app.put('/staff/register', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.staff_id !== undefined && req.body.restaurant_id !== undefined && req.body.first_name !== undefined && req.body.last_name !== undefined && req.body.contact_num !== undefined && req.body.email !== undefined && req.body.position !== undefined && req.body.password !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: staff_id, restaurant_id, first_name, last_name, contact_num, email, position, password');
		return;
	}   //if

	//Make sure the staff_id and email don't exist:
	let query = 'SELECT * FROM sample.staff WHERE staff_id = ?; SELECT * FROM sample.staff WHERE email = ?';
	db.query(query, [req.body.staff_id, req.body.email], (err, rows) => {
		if (rows[0].length > 0 && rows[1].length > 0) {
			res.status(409).send('Error: staff_id and email already exist');
		}   //if
		else if (rows[0].length > 0) {
			res.status(409).send('Error: staff_id already exists');
		}	//else if
		else if (rows[1].length > 0) {
			res.status(409).send('Error: email already exists');
		}	//else if
		else {
			let temp_password = rows[0].temp_password;
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
					let query = 'INSERT INTO sample.staff (staff_id, restaurant_id, first_name, last_name, contact_num, email, position, salt, password)';
					query = query + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

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
							//If a manager token:
							if (staff.position === 'manager') {
								jwt.sign({staff}, process.env.JWT_SECRET, {expiresIn: '1h'}, (err, token) => {
									//Add temp password flag to staff
									staff['temp_password'] = temp_password;
									//Build response
									let response = {
										'token': token,
										staff
									};  //response

									//Send Response:
									res.type('json').send(response);
								});	//sign
							}	//if
							//If a cook token:
							else {
								jwt.sign({staff}, process.env.JWT_SECRET, {expiresIn: '12h'}, (err, token) => {
									//Add temp password flag to staff
									staff['temp_password'] = temp_password;
									//Build response
									let response = {
										'token': token,
										staff
									};  //response

									//Send Response:
									res.type('json').send(response);
								});	//sign
							}	//else
						}   //else
					}); //db.query
				}   //else
			}); //hashed
		}   //else
	}); //db.query
});	//app.put

/*
	Updates staff info including staff_id, first_name, last_name, contact_num, email
	Inputs: staff_id, first_name, last_name, contact_num, email, JWT
	Outputs:
		On success:
			{
				token:
				{
					token
				}
				staff:
				{
					staff_id,
					first_name,
					last_name,
					contact_num,
					email,
					position
				}
			}
		If JWT is not valid or not supplied:
			Must be authorized!
		If JWT is not a staff token:
			Must be signed in as a staff member!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: staff_id, first_name, last_name, contact_num, email
		If staff_id and email already exist:
			Error: staff_id and email already exist
		If staff_id already exists:
			Error: staff_id already exists
		If email already exists:
			Error: email already exists
		On error:
			Error updating staff info
*/
app.post('/staff/update', verifyToken, (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.staff_id !== undefined && req.body.first_name !== undefined && req.body.last_name !== undefined && req.body.contact_num !== undefined && req.body.email !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: staff_id, first_name, last_name, contact_num, email)');
		return;
	}   //if

	//Verify the JWT
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Make sure the JWT is for a staff member:
			if (auth.staff) {
				//Make sure the supplied staff_id and email are unique:
				let query = 'SELECT * FROM sample.staff WHERE staff_id = ?; SELECT * FROM sample.staff WHERE email = ?';
				db.query(query, [req.body.staff_id, req.body.email], (err, rows) => {
					if (err) {
						res.status(500).send('Error updating staff info');
					}	//if
					else if ((rows[0].length > 0 && (req.body.staff_id !== auth.staff.staff_id)) && (rows[1].length > 0 && (req.body.email !== auth.staff.email))) {
						res.status(409).send('Error: staff_id and email already exist');
					}   //else if
					else if (rows[0].length > 0 && (req.body.staff_id !== auth.staff.staff_id)) {
						res.status(409).send('Error: staff_id already exists');
					}	//else if
					else if (rows[1].length > 0 && (req.body.email !== auth.staff.email)) {
						res.status(409).send('Error: email already exists');
					}	//else if
					else {
						//Build query and store staff_id:
						let staff_id = auth.staff.staff_id;
						let temp_password = rows[0].temp_password;
						let query = 'UPDATE sample.staff SET staff_id = ?, first_name = ?, last_name = ?, contact_num = ?, email = ?';
						query = query + ' WHERE staff_id = ?';
						let parameters = [req.body.staff_id, req.body.first_name, req.body.last_name, req.body.contact_num, req.body.email, staff_id];
						//Update staff info in db:
						db.query(query, parameters, (err, rows) => {
							if (err) {
								res.status(500).send('Error updating staff info');
							}   //if
							else {
								//Build user object:
								let staff = {
									'staff_id': req.body.staff_id,
									'first_name': req.body.first_name,
									'last_name': req.body.last_name,
									'contact_num': req.body.contact_num,
									'email': req.body.email,
									'position': auth.staff.position
								};  //staff

								//Sign JWT and send token
								//To add expiration date: jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '<time>' }, (err, token) => ...)
								//If a manager token:
								if (staff.position === 'manager') {
									jwt.sign({staff}, process.env.JWT_SECRET, {expiresIn: '1h'}, (err, token) => {
										//Add temp password flag to staff
										staff['temp_password'] = temp_password;
										//Build response
										let response = {
											'token': token,
											staff
										};  //response
										//Send Response:
										res.type('json').send(response);
									});	//sign
								}	//if
								//If a cook token:
								else {
									jwt.sign({staff}, process.env.JWT_SECRET, {expiresIn: '12h'}, (err, token) => {
										//Add temp password flag to staff
										staff['temp_password'] = temp_password;
										//Build response
										let response = {
											'token': token,
											staff
										};  //response

										//Send Response:
										res.type('json').send(response);
									});	//sign
								}	//else
							}   //else
						}); //db.query
					}	//else
				});	//db.query
			}	//if
			//If JWT is not for a staff member:
			else {
				res.status(401).send('Must be signed in as a staff member!');
			}	//else
		}   //else
	});	//verify
});	//app.post

/*
	Resets a forgotten password for a staff member
	Inputs: staff_id
	Outputs:
		On success:
			Sent an email with instructions for resetting password
		If any inputs are missing:
			Error: Missing parameter. Required parameters: staff_id
		On error:
			Error recovering password
*/
app.post('/staff/password/forgot', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.staff_id !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: staff_id');
		return;
	}   //if

	//Make sure the staff_id exists:
	let query = 'SELECT * FROM sample.staff WHERE staff_id = ?';
	db.query(query, req.body.staff_id, (err, rows) => {
		if (rows.length < 1) {
			res.status(200).send('Sent an email with instructions for resetting password');
		}   //if
		else {
			//Save email
			let email = rows[0].email;

			//Create a new salt
			let salt = genSalt();

			//Generate temporary password
			var password = generator.generate({
				length: 10,
				numbers: true,
				symbols: true,
				lowercase: true,
				uppercase: true
			});	//password

			//Hash password with salt
			let hashed = crypto.pbkdf2(password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					res.status(500).send('Error recovering password');
				}	//if
				else {
					//Build query and parameters:
					let parameters = [salt, derivedKey.toString('hex'), '1', req.body.staff_id];
					let query = 'UPDATE sample.staff SET salt = ?, password = ?, temp_password = ? WHERE staff_id = ?';

					//Add new temp password to db:
					db.query(query, parameters, (err, rows) => {
						if (err) {
							res.status(500).send('Error recovering password');
						}   //if
						else {
							//Send email with temp password
							let mailOptions = {
								from: process.env.EMAIL_USER,
								to: email,
								subject: 'Autogarcon Password Recovery',
								text: 'Your password has been reset! Use this temporary password to login: ' + password
							};	//mailOptions

							transporter.sendMail(mailOptions, (err, info) => {
								if (err) {
									res.status(500).send('Error recovering password');
								}	//if
								else {
									res.status(200).send('Sent an email with instructions for resetting password');
								}	//else
							});	//sendMail
						}   //else
					}); //db.query
				}   //else
			}); //hashed
		}   //else
	}); //db.query
});	//app.post

/*
	Updates a staff member's password
	Inputs: staff_id, current_password, new_password, JWT
	Outputs:
		On success:
			Successfully updated password!
		If JWT is not valid or not supplied:
			Must be authorized!
		If JWT is not for staff member trying to change password:
			Can't change other people's passwords!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: staff_id, current_password, new_password
		If staff_id/password is wrong:
			No staff member with that username/password
		On error:
			Error updating password
*/
app.post('/staff/password/update', verifyToken, (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.staff_id !== undefined && req.body.current_password !== undefined && req.body.new_password !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: staff_id, current_password, new_password');
		return;
	}   //if

	//Verify the JWT
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Make sure the JWT is for the staff member trying to change password:
			if (auth.staff && auth.staff.staff_id === req.body.staff_id) {
				//Make sure current_password is correct:
				let query = 'SELECT * FROM sample.staff WHERE staff_id = ?';

				db.query(query, req.body.staff_id, (err, rows) => {
					if (err) {
						res.status(500).send('Error updating password');
					}   //if
					else if (rows.length < 1) {
						res.status(401).send('No staff member with that username/password');
					}   //else if
					else {
						//Store user's salt
						let salt = rows[0].salt;
						//Hash supplied password
						let hashed = crypto.pbkdf2(req.body.current_password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
							if (err) {
								res.status(500).send('Error updating password');
							}	//if
							else {
								if (derivedKey.toString('hex') === rows[0].password) {
									//Change password to new_password and set temp_password to false:
									//Create a new salt
									let newSalt = genSalt();
									//Hash supplied password with salt
									let hashed = crypto.pbkdf2(req.body.new_password, newSalt, 50000, 64, 'sha512', (err, derivedKey) => {
										if (err) {
											res.status(500).send('Error updating password');
										}	//if
										else {
											//Build query and parameters:
											query = 'UPDATE sample.staff SET salt = ?, password = ?, temp_password = ?';
											query = query + ' WHERE staff_id = ?';
											let parameters = [newSalt, derivedKey.toString('hex'), '0', req.body.staff_id];

											//Update password in db:
											db.query(query, parameters, (err, rows) => {
												if (err) {
													res.status(500).send('Error updating password');
												}   //if
												else {
													//Send Response:
													res.status(200).send('Successfully updated password!');
												}   //else
											}); //db.query
										}   //else
									}); //hashed
								}   //if
								else {
									res.status(401).send('No staff member with that username/password');
								}   //else
							}   //else
						}); //hashed
					}   //else
				}); //db.query
			}	//if
			//If JWT is not for staff member trying to change password:
			else {
				res.status(401).send('Can\'t change other people\'s passwords!');
			}	//else
		}   //else
	});	//verify
});	//app.post

/*
	Updates a staff member's position
	Inputs: staff_id, position, JWT
	Outputs:
		On success:
			Successfully updated staff member's position!
		If JWT is not valid or not supplied:
			Must be authorized!
		If JWT is not a manager token:
			Must be signed in as a manager!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: staff_id, position
		If staff_id is not at managers restaurant:
			There is no staff member with that staff_id at your restaurant
		On error:
			Error updating staff member's position
*/
app.post('/staff/position/update', verifyToken, (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.staff_id !== undefined && req.body.position !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: staff_id, position)');
		return;
	}   //if

	//Verify the JWT
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Make sure the JWT is for a manager:
			if (auth.staff && auth.staff.position === 'manager') {
				//Make sure the staff_id exists at the manager's restaurant:
				let query = 'SELECT * FROM sample.staff WHERE staff_id = ? AND restaurant_id = ?';
				let parameters = [req.body.staff_id, auth.staff.restaurant_id];
				db.query(query, parameters, (err, rows) => {
					if (err) {
						res.status(500).send('Error updating staff member\'s position');
					}   //if
					else if (rows.length < 1) {
						res.status(409).send('There is no staff member with that staff_id at your restaurant');
					}	//else if
					else {
						//Build query and parameters:
						query = 'UPDATE sample.staff SET position = ? WHERE staff_id = ?';
						parameters = [req.body.position, req.body.staff_id];

						//Update staff position in db:
						db.query(query, parameters, (err, rows) => {
							if (err) {
								res.status(500).send('Error updating staff member\'s position');
							}   //if
							else {
								res.status(200).send('Successfully updated staff member\'s position!');
							}	//else
						}); //db.query
					}	//else
				});	//db.query
			}	//if
			//If JWT is not for a staff member:
			else {
				res.status(401).send('Must be signed in as a manager!');
			}	//else
		}   //else
	});	//verify
});	//app.post


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
					email,
					temp_password,
					image
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
						//To add expiration date: jwt.sign({customer}, process.env.JWT_SECRET, { expiresIn: '<time>' }, (err, token) => ...)
						jwt.sign({customer}, process.env.JWT_SECRET, {expiresIn: '7d'}, (err, token) => {
							//Add temp password flag and image to customer
							customer['temp_password'] = rows[0].temp_password;
							customer['image'] = rows[0].image;
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
	Inputs: customer_id, first_name, last_name, email, password, image (optional)
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
					email,
					image
				}
			}
		If customer_id and email already exist:
			Error: customer_id and email already exist
		If customer_id already exists:
			Error: customer_id already exists
		If email already exists:
			Error: email already exists
		If image is not an image file:
			Error: invalid image format. Accepted formats: png, jpg, jpeg
		If any inputs are missing:
			Error: Missing parameter. Required parameters: customer_id, first_name, last_name, email, password, image (optional)
		On error:
			Error creating new customer
*/
app.put('/customer/register', upload.single('image'), (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.customer_id !== undefined && req.body.first_name !== undefined && req.body.last_name !== undefined && req.body.email !== undefined && req.body.password !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: customer_id, first_name, last_name, email, password, image (optional)');
		return;
	}   //if

	//Make sure the customer_id and email don't exist:
	let query = 'SELECT * FROM sample.customers WHERE customer_id = ?; SELECT * FROM sample.customers WHERE email = ?';
	db.query(query, [req.body.customer_id, req.body.email], (err, rows) => {
		if (rows[0].length > 0 && rows[1].length > 0) {
			res.status(409).send('Error: customer_id and email already exist');
		}   //if
		else if (rows[0].length > 0) {
			res.status(409).send('Error: customer_id already exists');
		}	//else if
		else if (rows[1].length > 0) {
			res.status(409).send('Error: email already exists');
		}	//else if
		else {
			//Create a new salt
			let salt = genSalt();
			//Hash supplied password with salt
			let hashed = crypto.pbkdf2(req.body.password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					res.status(500).send('Error creating new customer');
				}	//if
				else {
					let image = null;
					//If an image is supplied:
					if (req.file !== undefined) {
						//If not an image file:
						if (!(req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg' || req.file.mimetype === 'image/jpeg')) {
							res.status(409).send('Error: invalid image format. Accepted formats: png, jpg, jpeg');
							return;
						}	//if
						//Build query and parameters:
						parameters = [req.body.customer_id, req.body.first_name, req.body.last_name, req.body.email, salt, derivedKey.toString('hex'), req.file.buffer];
						query = 'INSERT INTO sample.customers (customer_id, first_name, last_name, email, salt, password, image)';
						query = query + " VALUES (?, ?, ?, ?, ?, ?, ?)";
						image = req.file.buffer;
					}	//if
					//If no image is supplied:
					else {
						//Build query and parameters:
						parameters = [req.body.customer_id, req.body.first_name, req.body.last_name, req.body.email, salt, derivedKey.toString('hex')];
						query = 'INSERT INTO sample.customers (customer_id, first_name, last_name, email, salt, password)';
						query = query + " VALUES (?, ?, ?, ?, ?, ?)";

					}	//else

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
							jwt.sign({customer}, process.env.JWT_SECRET, {expiresIn: '7d'}, (err, token) => {
								//Add image to customer:
								customer['image'] = image;
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
	Updates customer info including customer_id, first_name, last_name, email, image (optional)
	Inputs: customer_id, first_name, last_name, email, image (optional), JWT
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
					email,
					image
				}
			}
		If JWT is not valid or not supplied:
			Must be authorized!
		If JWT is not a customer token:
			Must be signed in as a customer!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: customer_id, first_name, last_name, email, image (optional)
		If customer_id and email already exist:
			Error: customer_id and email already exist
		If customer_id already exists:
			Error: customer_id already exists
		If email already exists:
			Error: email already exists
		If image is not an image file:
			Error: invalid image format. Accepted formats: png, jpg, jpeg
		On error:
			Error updating customer info
*/
app.post('/customer/update', verifyToken, upload.single('image'), (req, res) => {
	console.log(req);
	//Make sure right number of parameters are entered:
	if(!(req.body.customer_id !== undefined && req.body.first_name !== undefined && req.body.last_name !== undefined && req.body.email !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: customer_id, first_name, last_name, email, logo (optional)');
		return;
	}   //if

	//Verify the JWT
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Make sure the JWT is for a customer:
			if (auth.customer) {
				//Make sure the supplied customer_id and email are unique:
				let query = 'SELECT * FROM sample.customers WHERE customer_id = ?; SELECT * FROM sample.customers WHERE email = ?';
				db.query(query, [req.body.customer_id, req.body.email], (err, rows) => {
					if (err) {
						res.status(500).send('Error updating customer info');
					}	//if
					else if ((rows[0].length > 0 && (req.body.customer_id !== auth.customer.customer_id)) && (rows[1].length > 0 && (req.body.email !== auth.customer.email))) {
						res.status(409).send('Error: customer_id and email already exist');
					}   //else if
					else if (rows[0].length > 0 && (req.body.customer_id !== auth.customer.customer_id)) {
						res.status(409).send('Error: customer_id already exists');
					}	//else if
					else if (rows[1].length > 0 && (req.body.email !== auth.customer.email)) {
						res.status(409).send('Error: email already exists');
					}	//else if
					else {
						let image = null;
						let parameters = [];
						//If an image is supplied:
						if (req.file !== undefined) {
							//If not an image file:
							if (!(req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg' || req.file.mimetype === 'image/jpeg')) {
								res.status(409).send('Error: invalid image format. Accepted formats: png, jpg, jpeg');
								return;
							}	//if
							//Build query and store customer_id:
							let customer_id = auth.customer.customer_id;
							query = 'UPDATE sample.customers SET customer_id = ?, first_name = ?, last_name = ?, email = ?, image = ?';
							query = query + ' WHERE customer_id = ?';
							parameters = [req.body.customer_id, req.body.first_name, req.body.last_name, req.body.email, req.file.buffer, customer_id];
							image = req.file.buffer;
						}	//if
						//If no image is supplied:
						else {
							//Build query and store customer_id:
							let customer_id = auth.customer.customer_id;
							query = 'UPDATE sample.customers SET customer_id = ?, first_name = ?, last_name = ?, email = ?';
							query = query + ' WHERE customer_id = ?';
							parameters = [req.body.customer_id, req.body.first_name, req.body.last_name, req.body.email, customer_id];
						}	//else

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
								jwt.sign({customer}, process.env.JWT_SECRET, {expiresIn: '7d'}, (err, token) => {
									customer['image'] = image;
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
				});	//db.query
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
	Inputs: customer_id, JWT
	Outputs:
		On success:
			{
				i =   {
					order_num,
					restaurant_id,
					restaurant_name,
					font,
					font_color,
					primary_color,
					secondary_color,
					tertiary_color,
					item_id,
					item_name,
					price,
					quantity,
					order_date,
					table_num,
					customization
				}
			}
		If a user has no history:
			No order history for this customer
		If JWT is not valid or not supplied: 
			Must be authorized!
		If JWT is for another customer:
			Can't view other customer's history!
		On error:
			Error retrieving order history
*/
app.get('/customer/history/:id', verifyToken, (req, res) => {
	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Make sure person isn't viewing another customer's history:
			if (auth.customer && auth.customer.customer_id === req.params.id) {
				//Build query:
				let query = 'SELECT * FROM sample.menu NATURAL JOIN sample.orders NATURAL JOIN sample.orderdetails NATURAL JOIN sample.restaurants WHERE customer_id = ? AND order_status LIKE "Complete" ORDER BY order_date desc';

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
								'restaurant_name': rows[i].restaurant_name,
								'font': rows[i].font,
								'font_color': rows[i].font_color,
								'primary_color': rows[i].primary_color,
								'secondary_color': rows[i].secondary_color,
								'tertiary_color': rows[i].tertiary_color,
								'logo': rows[i].logo,
								'item_id': rows[i].item_id,
								'item_name': rows[i].item_name,
								'price': rows[i].price,
								'quantity': rows[i].quantity,
								'order_date': rows[i].order_date,
								'table': rows[i].table_num,
								'customization': rows[i].customization
							};	//response
						}   //for

						//Send Response:
						res.type('json').send(response);
					}   //else
				}); //db.query
			}	//if
			else {
				res.status(401).send('Can\'t view other customer\'s history!');
			}	//else
		}	//else
	});	//verify
}); //app.get

/*
	Retrieves a customer's in progress orders
	Inputs: customer_id, JWT
	Outputs:
		On success:
			{
				i =   {
					order_num,
					restaurant_id,
					restaurant_name,
					item_id,
					item_name,
					price,
					quantity,
					order_date,
					table_num,
					customization
				}
			}
		If a user has no in progress orders:
			This customer has no in progress orders
		If JWT is not valid or not supplied: 
			Must be authorized!
		If JWT is for a different customer:
			Can't retrieve other customer's favorites!
		On error:
			Error retrieving in progress orders
*/
app.get('/customer/inprogress/:id', verifyToken, (req, res) => {
	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Check to make sure customer_id is same as the customer_id in JWT:
			if (auth.customer && auth.customer.customer_id === req.params.id) {
				//Build query:
				let query = 'SELECT * FROM sample.menu NATURAL JOIN sample.orders NATURAL JOIN sample.orderdetails NATURAL JOIN sample.restaurants WHERE customer_id = ? AND order_status LIKE "In Progress" ORDER BY order_date desc';

				//Query database:
				db.query(query, req.params.id, (err, rows) => {
					if (err) {
						res.status(500).send('Error retrieving in progress orders');
					}   //if
					else if (rows.length < 1) {
						res.status(200).send('This customer has no in progress orders');
					}   //else if
					else {
						//Build JSON object:
						let response = {};

						//Add list of orders to response:
						for (let i=0; i<rows.length; i++) {
							response[i] =   {
								'order_num': rows[i].order_num,
								'restaurant_id': rows[i].restaurant_id,
								'restaurant_name': rows[i].restaurant_name,
								'font': rows[i].font,
								'font_color': rows[i].font_color,
								'primary_color': rows[i].primary_color,
								'secondary_color': rows[i].secondary_color,
								'tertiary_color': rows[i].tertiary_color,
								'logo': rows[i].logo,
								'item_id': rows[i].item_id,
								'item_name': rows[i].item_name,
								'price': rows[i].price,
								'quantity': rows[i].quantity,
								'order_date': rows[i].order_date,
								'table_num': rows[i].table_num,
								'customization': rows[i].customization
							};	//response
						}   //for

						//Send Response:
						res.type('json').send(response);
					}   //else
				}); //db.query
			}	//if
			else {
				res.status(401).send('Can\'t retrieve other customer\'s favorites!');
			}	//else
		}	//else
	});	//verify
}); //app.get

/*
	Resets a forgotten password for a customer
	Inputs: customer_id
	Outputs:
		On success:
			Sent an email with instructions for resetting password
		If any inputs are missing:
			Error: Missing parameter. Required parameters: customer_id
		On error:
			Error recovering password
*/
app.post('/customer/password/forgot', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.customer_id !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: customer_id');
		return;
	}   //if

	//Make sure the staff_id exists:
	let query = 'SELECT * FROM sample.customers WHERE customer_id = ?';
	db.query(query, req.body.customer_id, (err, rows) => {
		if (rows.length < 1) {
			res.status(200).send('Sent an email with instructions for resetting password');
		}   //if
		else {
			//Save email
			let email = rows[0].email;

			//Create a new salt
			let salt = genSalt();

			//Generate temporary password
			var password = generator.generate({
				length: 10,
				numbers: true,
				symbols: true,
				lowercase: true,
				uppercase: true
			});	//password

			//Hash password with salt
			let hashed = crypto.pbkdf2(password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					res.status(500).send('Error recovering password');
				}	//if
				else {
					//Build query and parameters:
					let parameters = [salt, derivedKey.toString('hex'), '1', req.body.customer_id];
					let query = 'UPDATE sample.customers SET salt = ?, password = ?, temp_password = ? WHERE customer_id = ?';

					//Add new temp password to db:
					db.query(query, parameters, (err, rows) => {
						if (err) {
							res.status(500).send('Error recovering password');
						}   //if
						else {
							//Send email with temp password
							let mailOptions = {
								from: process.env.EMAIL_USER,
								to: email,
								subject: 'Autogarcon Password Recovery',
								text: 'Your password has been reset! Use this temporary password to login: ' + password
							};	//mailOptions

							transporter.sendMail(mailOptions, (err, info) => {
								if (err) {
									res.status(500).send('Error recovering password');
								}	//if
								else {
									res.status(200).send('Sent an email with instructions for resetting password');
								}	//else
							});	//sendMail
						}   //else
					}); //db.query
				}   //else
			}); //hashed
		}   //else
	}); //db.query
});	//app.post

/*
	Updates a customers password
	Inputs: customer_id, current_password, new_password, JWT
	Outputs:
		On success:
			Successfully updated password!
		If JWT is not valid or not supplied:
			Must be authorized!
		If JWT is not for customer trying to change password:
			Can't change other people's passwords!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: customer_id, current_password, new_password
		If customer_id/password is wrong:
			No customer with that username/password
		On error:
			Error updating password
*/
app.post('/customer/password/update', verifyToken, (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.customer_id !== undefined && req.body.current_password !== undefined && req.body.new_password !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: customer_id, current_password, new_password');
		return;
	}   //if

	//Verify the JWT
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Make sure the JWT is for the customer trying to change password:
			if (auth.customer && auth.customer.customer_id === req.body.customer_id) {
				//Make sure current_password is correct:
				let query = 'SELECT * FROM sample.customers WHERE customer_id = ?';

				db.query(query, req.body.customer_id, (err, rows) => {
					if (err) {
						res.status(500).send('Error updating password');
					}   //if
					else if (rows.length < 1) {
						res.status(401).send('No customer with that username/password');
					}   //else if
					else {
						//Store user's salt
						let salt = rows[0].salt;
						//Hash supplied password
						let hashed = crypto.pbkdf2(req.body.current_password, salt, 50000, 64, 'sha512', (err, derivedKey) => {
							if (err) {
								res.status(500).send('Error updating password');
							}	//if
							else {
								if (derivedKey.toString('hex') === rows[0].password) {
									//Change password to new_password and set temp_password to false:
									//Create a new salt
									let newSalt = genSalt();
									//Hash supplied password with salt
									let hashed = crypto.pbkdf2(req.body.new_password, newSalt, 50000, 64, 'sha512', (err, derivedKey) => {
										if (err) {
											res.status(500).send('Error updating password');
										}	//if
										else {
											//Build query and parameters:
											query = 'UPDATE sample.customers SET salt = ?, password = ?, temp_password = ?';
											query = query + ' WHERE customer_id = ?';
											let parameters = [newSalt, derivedKey.toString('hex'), '0', req.body.customer_id];

											//Update password in db:
											db.query(query, parameters, (err, rows) => {
												if (err) {
													res.status(500).send('Error updating password');
												}   //if
												else {
													//Send Response:
													res.status(200).send('Successfully updated password!');
												}   //else
											}); //db.query
										}   //else
									}); //hashed
								}   //if
								else {
									res.status(401).send('No customer with that username/password');
								}   //else
							}   //else
						}); //hashed
					}   //else
				}); //db.query
			}	//if
			//If JWT is not for customer trying to change password:
			else {
				res.status(401).send('Can\'t change other people\'s passwords!');
			}	//else
		}   //else
	});	//verify
});	//app.post


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
					item_id,
					restaurant,
					calories,
					price,
					category,
					in_stock,
					description,
					allergens
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
					'in_stock': rows[i].in_stock,
					'description': rows[i].description,
					'allergens': []
				};	//response
			}   //for

			//Add allergens:
			query = 'SELECT * FROM sample.menu natural join sample.allergens WHERE restaurant_id = ? ORDER BY item_id';
			db.query(query, req.params.id, (err, rows) => {
				if (err) {
					res.status(500).send('Error retrieving menu');
				}	//if
				else {
					for (let i=0; i<rows.length; i++) {
						response[rows[i].item_name].allergens.push(rows[i].allergen_name);
					}	//for

					//Send Response:
					res.type('json').send(response);
				}	//else
			});	//db.query
		}   //else
	}); //db.query
}); //app.get

/*
	Adds a new item to the menu
	Inputs: restaurant_id, item_name, calorie_num, category, price, description, image (optional), JWT
	Outputs:
		On success:
			Successfully added new menu item!
		If item_name and restaurant_id exists already:
			Error: item already exists
		If any inputs are missing:
			Error: Missing parameter. Required parameters: restaurant_id, item_name, calorie_num, category, price, description, image (optional)
		If image is not an image file:
			Error: invalid image format. Accepted formats: png, jpg, jpeg
		If JWT is not valid:
			Must be authorized!
		If JWT is not a manager token for the restaurant of the new item:
			Must be the restaurant manager to add menu items!
		On error:
			Error adding new menu item
*/
app.put('/menu/add', verifyToken, upload.single('image'), (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.restaurant_id !== undefined && req.body.item_name !== undefined && req.body.calorie_num !== undefined && req.body.category !== undefined && req.body.price !== undefined && req.body.description !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: restaurant_id, item_name, calorie_num, category, price, description, image (optional)');
		return;
	}   //if

	//Verify that the person is a manager at the restaurant
	jwt.verify(req.token, process.env.JWT_SECRET, upload.single('image'), (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Check to make sure person is a manager at the restaurant:
			if (auth.staff && auth.staff.position === 'manager' && parseInt(auth.staff.restaurant_id) === parseInt(req.body.restaurant_id)) {
				//Make sure the menu item doesn't exist at the restaurant:
				let parameters = [req.body.restaurant_id, req.body.item_name, req.body.category]
				let query = 'SELECT * FROM sample.menu WHERE restaurant_id = ? AND item_name = ?; SELECT * FROM sample.categories WHERE category_name = ?';
				db.query(query, parameters, (err, rows) => {
					if (rows[0].length > 0) {
						res.status(409).send('Error: item already exists');
					}   //if
					else {
						//If an image is supplied:
						if (req.file !== undefined) {
							//If not an image file:
							if (!(req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg' || req.file.mimetype === 'image/jpeg')) {
								res.status(409).send('Error: invalid image format. Accepted formats: png, jpg, jpeg');
								return;
							}	//if
							//Build query and parameters:
							parameters = [req.body.restaurant_id, req.body.item_name, req.body.calorie_num, req.body.category, req.body.price, req.body.description, req.file.buffer];
							query = 'INSERT INTO sample.menu (restaurant_id, item_name, calorie_num, category, in_stock, price, description, image)';
							query = query + ' VALUES (?, ?, ?, ?, 1, ?, ?, ?)';
						}	//if
						//If no image is supplied:
						else {
							//Build query and parameters:
							parameters = [req.body.restaurant_id, req.body.item_name, req.body.calorie_num, req.body.category, req.body.price, req.body.description];
							query = 'INSERT INTO sample.menu (restaurant_id, item_name, calorie_num, category, in_stock, price, description)';
							query = query + ' VALUES (?, ?, ?, ?, 1, ?, ?)';
						}	//else

						//If category is new:
						if (rows[1].length < 1) {
							query = query + '; INSERT INTO sample.categories (category_name)';
							query = query + ' VALUES (?)';
							parameters.push(req.body.category);
						}	//if

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
			}	//if
			else {
				res.status(401).send('Must be the restaurant manager to add menu items!');
			}	//else
		}   //else
	});	//verify
});	//app.put

/*
	Updates an existing menu item
	Inputs: item_id, restaurant_id, item_name, calorie_num, category, in_stock, price, description, image (optional), JWT
	Outputs:
		On success:
			Successfully updated menu item!
		If item does not exist at the restaurant:
			Error: item does not exist
		If any inputs are missing:
			Error: Missing parameter. Required parameters: item_id, restaurant_id, item_name, calorie_num, category, in_stock, price, description, image (optional)
		If image is not an image file:
			Error: invalid image format. Accepted formats: png, jpg, jpeg
		If JWT is not valid:
			Must be authorized!
		If JWT is not a manager token for the restaurant of the item:
			Must be the restaurant manager to update menu items!
		On error:
			Error updating menu item
*/
app.post('/menu/update', verifyToken, upload.single('image'), (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.item_id !== undefined && req.body.restaurant_id !== undefined && req.body.item_name !== undefined && req.body.calorie_num !== undefined && req.body.category !== undefined && req.body.in_stock !== undefined && req.body.price !== undefined && req.body.description !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: item_id, restaurant_id, item_name, calorie_num, category, in_stock, price, description, image (optional)');
		return;
	}   //if

	//Verify that the person is a manager at the restaurant
	jwt.verify(req.token, process.env.JWT_SECRET, upload.single('image'), (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Check to make sure person is a manager at the restaurant:
			if (auth.staff && auth.staff.position === 'manager' && parseInt(auth.staff.restaurant_id) === parseInt(req.body.restaurant_id)) {
				//Make sure the menu item exists at the restaurant:
				let parameters = [req.body.item_id, req.body.restaurant_id]
				let query = 'Select * FROM sample.menu WHERE item_id = ? AND restaurant_id = ?';
				db.query(query, parameters, (err, rows) => {
					if (rows.length === 0) {
						res.status(409).send('Error: item does not exist');
					}   //if
					else {
						//If an image is supplied:
						if (req.file !== undefined) {
							//If not an image file:
							if (!(req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg' || req.file.mimetype === 'image/jpeg')) {
								res.status(409).send('Error: invalid image format. Accepted formats: png, jpg, jpeg');
								return;
							}	//if
							//Build query and parameters:
							parameters = [req.body.item_name, req.body.calorie_num, req.body.category, req.body.in_stock, req.body.price, req.body.description, req.file.buffer, req.body.item_id];
							query = 'UPDATE sample.menu SET item_name = ?, calorie_num = ?, category = ?, in_stock = ?, price = ?, description = ?, image = ?';
							query = query + ' WHERE item_id = ?';
						}	//if
						//If no image is supplied:
						else {
							//Build query and parameters:
							parameters = [req.body.item_name, req.body.calorie_num, req.body.category, req.body.in_stock, req.body.price, req.body.description, req.body.item_id];
							query = 'UPDATE sample.menu SET item_name = ?, calorie_num = ?, category = ?, in_stock = ?, price = ?, description = ?';
							query = query + ' WHERE item_id = ?';
						}	//else

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
			}	//if
			else {
				res.status(401).send('Must be the restaurant manager to update menu items!');
			}	//else
		}   //else
	});	//verify
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

/*
	Returns sides for an item with item_id = id
	Inputs: item_id
	Outputs:
		On success:
			{
				i:
				{
					item_id,
					item_name,
					calories,
					picture,
					in_stock,
					description
				}
			}
		If item has no menu sides:
			This item has no sides
		On error:
			Error retrieving sides
*/
app.get('/menu/sides/:id', (req, res) => {
	let query = 'SELECT * FROM sample.menu join sample.sides on sample.menu.item_id=sample.sides.side_dish_id WHERE main_dish_id = ?';

	//Query database:
	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving sides');
		}   //if
		else if (rows.length < 1) {
			res.status(200).send('This item has no sides');
		}   //else if
		else {
			//Build JSON object:
			let response = {};

			//Loop through each row returned from query:
			for (let i=0; i<rows.length; i++) {
				response[i] = {
					'item_id': rows[i].item_id,
					'item_name': rows[i].item_name,
					'calories': rows[i].calorie_num,
					'picture': 'No picture yet',
					'in_stock': rows[i].in_stock,
					'description': rows[i].description
				};	//response
			}   //for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

/*
	Returns the image for the menu item with item_id = id
	Inputs: item_id
	Outputs:
		On success:
			{
				item_id,
				image
			}
		If the item does not exist:
			This item does not exist
		On error:
			Error retrieving image
*/
app.get('/menu/image/:id', (req, res) => {
	let query = 'SELECT * FROM sample.menu WHERE item_id = ?';

	//Query database:
	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving image');
		}   //if
		else if (rows.length < 1) {
			res.status(409).send('This item does not exist');
		}   //else if
		else {
			//Build JSON object:
			let response = {
				'item_id': rows[0].item_id,
				'image': rows[0].image
			};

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

/*
	Adds a new allergen for a menu item
	Inputs: item_id, allergen, JWT
	Outputs:
		On success:
			Successfully added new allergen!
		If item_id does not exist:
			Error: item does not exist
		If any inputs are missing:
			Error: Missing parameter. Required parameters: item_id, allergen
		If JWT is not valid:
			Must be authorized!
		If JWT is not a manager token for the restaurant they are adding an allergen to:
			Must be the restaurant manager to add a new allergen!
		On error:
			Error adding new allergen
*/
app.put('/menu/allergens/add', verifyToken, (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.item_id !== undefined && req.body.allergen !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: item_id, allergen');
		return;
	}   //if

	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Make sure item exists:
			let query = 'Select * FROM sample.menu WHERE item_id = ?';
			db.query(query, req.body.item_id, (err, rows) => {
				if (err) {
					res.status(500).send('Error adding new allergen');
				}	//if
				else {
					//Check to make sure person is a manager at the restaurant:
					if (auth.staff && auth.staff.position === 'manager' && parseInt(auth.staff.restaurant_id) === parseInt(rows[0].restaurant_id)) {
						if (rows.length < 1) {
							res.status(409).send('Error: item does not exist');
						}	//if
						else {
							//Build query and parameters:
							query = 'INSERT INTO sample.allergens (item_id, allergen_name)';
							query = query + ' VALUES (?, ?)';
							let parameters = [req.body.item_id, req.body.allergen];

							//Add allergen:
							db.query(query, parameters, (err, rows) => {
								if (err) {
									res.status(500).send('Error adding new allergen');
								}   //if
								else {
									res.status(200).send('Successfully added new allergen!');
								}	//else
							});	//db.query
						}	//else
					}	//if
					else {
						res.status(401).send('Must be the restaurant manager to add a new allergen!');
					}	//else
				}	//else
			});	//db.query
		}	//else
	});	//verify
});	//app.put

/*
	Returns categories
	Inputs: none
	Outputs:
		On success:
			{
				i:
				{
					category_id,
					category_name
				}
			}
		On error:
			Error retrieving categories
*/
app.get('/categories', (req, res) => {
	let query = 'SELECT * FROM sample.categories';

	//Query database:
	db.query(query, (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving categories');
		}   //if
		else {
			//Build JSON object:
			let response = {};

			//Loop through each row returned from query:
			for (let i=0; i<rows.length; i++) {
				//Add each category to response:
				response[i] = {
					'category_id': rows[i].category_id,
					'category_name': rows[i].category_name
				};	//response
			}	//for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

/*
	Creates a new category
	Inputs: category_name, JWT
	Outputs:
		On success:
			Successfully added new category!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: category_name
		If the category already exists:
			Error: category already exists
		If JWT is not valid:
			Must be authorized!
		If JWT is not a manager token:
			Must be a manager to add a new category!
		On error:
			Error adding new category
*/
app.put('/categories/new', verifyToken, (req, res) => {
	//Make sure right number of parameters are entered:
	if (!(req.body.category_name !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: category_name');
		return;
	}	//if

	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Check to make sure person is a manager:
			if (auth.staff && auth.staff.position === 'manager') {
				//Check if the category already exists:
				let query = 'SELECT * FROM sample.categories WHERE category_name = ?';
				db.query(query, req.body.category_name, (err, rows) => {
					if (rows.length > 0) {
						res.status(409).send('Error: category already exists');
					}	//if
					else {
						//Build query:
						query = 'INSERT INTO sample.categories (category_name)';
						query = query + ' VALUES (?)';

						//Query database:
						db.query(query, req.body.category_name, (err, rows) => {
							if (err) {
								res.status(500).send('Error adding new category');
							}   //if
							else {
								//Send Response:
								res.status(200).send('Successfully added new category!');
							}   //else
						}); //db.query
					}	//else
				});	//db.query	
			}	//if
			else {
				res.status(401).send('Must be a manager to add a new category!');
			}	//else
		}	//else
	});	//verify
}); //app.put

/*
	Removes a category
	Inputs: category_name, JWT
	Outputs:
		On success:
			Successfully removed category!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: category_name
		If the category doesn't exist:
			Error: category doesn't exist
		If JWT is not valid:
			Must be authorized!
		If JWT is not a manager token:
			Must be a manager to remove a category!
		On error:
			Error removing category
*/
app.post('/categories/remove', verifyToken, (req, res) => {
	//Make sure right number of parameters are entered:
	if (!(req.body.category_name !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: category_name');
		return;
	}	//if

	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Check to make sure person is a manager:
			if (auth.staff && auth.staff.position === 'manager') {
				//Check if the category exists:
				let query = 'SELECT * FROM sample.categories WHERE category_name = ?';
				db.query(query, req.body.category_name, (err, rows) => {
					if (rows.length < 1) {
						res.status(409).send('Error: category doesn\'t exist');
					}	//if
					else {
						//Build query:
						query = 'DELETE FROM sample.categories WHERE category_name = ?';

						//Query database:
						db.query(query, req.body.category_name, (err, rows) => {
							if (err) {
								res.status(500).send('Error removing category');
							}   //if
							else {
								//Send Response:
								res.status(200).send('Successfully removed category!');
							}   //else
						}); //db.query
					}	//else
				});	//db.query	
			}	//if
			else {
				res.status(401).send('Must be a manager to remove a category!');
			}	//else
		}	//else
	});	//verify
}); //app.post


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
					table_num,
					greeting
				}
			}
		On error:
			Error retrieving alexa information
		If alexa doesn't exist:
			This alexa does not exist
*/
app.get('/alexa/:id', (req, res) => {
	let query = 'SELECT * FROM sample.alexas NATURAL JOIN sample.restaurants WHERE alexa_id = ?';

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
				'table_num': rows[0].table_num,
				'greeting': rows[0].alexa_greeting
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
	if(!(req.body.alexa_id !== undefined && req.body.restaurant_id !== undefined && req.body.table_num !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: alexa_id, restaurant_id, table_num');
		return;
	}   //if

	//Make sure the alexa_id doesn't exist and check if the table is in the services table:
	let query = 'SELECT * FROM sample.alexas WHERE alexa_id = ?; SELECT * FROM sample.services WHERE table_num = ?';
	db.query(query, [req.body.alexa_id, req.body.table_num], (err, rows) => {
		if (rows[0].length > 0) {
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
					query = 'INSERT INTO sample.alexas (alexa_id, restaurant_id, table_num)';
					query = query + ' VALUES (?, ?, ?)';
					query = query + '; INSERT INTO sample.customers (customer_id, first_name, last_name, email, salt, password)';
					query = query + ' VALUES (?, ?, ?, ?, ?, ?)';

					//Add table to services table if it doesn't exist:
					if (rows[1].length < 1) {
						query = query + '; INSERT INTO sample.services (restaurant_id, table_num, service_status)';
						query = query + ' VALUES (?, ?, ?)';
						parameters.push(req.body.restaurant_id, req.body.table_num, 'Good');
					}	//if

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
	let query = 'SELECT * FROM sample.orders WHERE customer_id = ? AND order_status LIKE "Pending"';
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
	if(!(req.body.restaurant_id !== undefined && req.body.alexa_id !== undefined && req.body.table_num !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: restaurant_id, alexa_id, table_num');
		return;
	}   //if

	//Create timestamp
	let date = luxon.DateTime.local().setZone('America/Chicago');
	let timestamp = date.toString();

	let parameters = [req.body.restaurant_id, req.body.alexa_id, 'Pending', timestamp, req.body.table_num];

	//Query to add order to orders table and retrieve the order_num
	let query = ' INSERT INTO sample.orders (restaurant_id, customer_id, order_status, order_date, table_num)';
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
	Inputs: order_num, item_id, quantity, customization
	Outputs:
		On sucess:
			Successfully updated order!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: order_num, item_id, quantity, customization
		If order_num does not exist:
			Error: order does not exist or is not pending
		On error:
			Error updating order
*/
app.put('/alexa/order/update', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.order_num !== undefined && req.body.item_id !== undefined && req.body.quantity !== undefined && req.body.customization !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: order_num, item_id, quantity, customization');
		return;
	}   //if

	//Make sure the order exists:
	let query = 'Select * FROM sample.orders WHERE order_num = ? AND order_status LIKE "Pending"';
	db.query(query, req.body.order_num, (err, rows) => {
		if (rows.length == 0) {
			res.status(409).send('Error: order does not exist or is not pending');
		}   //if
		else {
			//Check to see if that item is already in the order:
			query = 'Select * FROM sample.orderdetails WHERE order_num = ? AND item_id = ?';
			let parameters = [req.body.order_num, req.body.item_id];
			db.query(query, parameters, (err, rows) => {
				//Item does not exist in order:
				if (rows.length < 1) {
					parameters = [req.body.order_num, req.body.item_id, req.body.quantity, req.body.customization];
					query = 'INSERT INTO sample.orderdetails (order_num, item_id, quantity, customization)';
					query = query + ' VALUES (?, ?, ?, ?)'

					//Update order in db:
					db.query(query, parameters, (err, rows) => {
						if (err) {
							res.status(500).send('Error updating order');
						}   //if
						else {
							res.status(200).send('Successfully updated order!');
						}   //else
					}); //db.query
				}	//if
				//Item exists in order:
				else {
					//Updated quantity:
					let quantity = parseInt(rows[0].quantity);
					let updated = quantity + parseInt(req.body.quantity);
					let customization = rows[0].customization;
					if (customization !== '') {
						customization = customization + '; ' + req.body.customization;
					}	//if
					else {
						customization = req.body.customization;
					}	//else

					//Build query and parameters:
					query = 'UPDATE sample.orderdetails SET quantity = ?, customization = ?';
					query = query + ' WHERE order_num = ? AND item_id = ?';
					parameters = [updated, customization, req.body.order_num, req.body.item_id];

					//Update quantity in db:
					db.query(query, parameters, (err, rows) => {
						if (err) {
							res.status(500).send('Error updating order');
						}   //if
						else {
							res.status(200).send('Successfully updated order!');
						}   //else
					}); //db.query
				}	//else
			});	//db.query
		}   //else
	}); //db.query
});	//app.put

/*
	Updates the quantity of an item in an alexa order
	Inputs: order_num, item_id, quantity
	Outputs:
		On sucess:
			Successfully updated order!
		If any inputs are missing:
			Error: Missing parameter. Required parameters: order_num, item_id, quantity (new quantity)
		If order_num and item_id does not exist:
			Error: item does not exist in the order
		If quantity is negative:
			Quantity can't be negative
		On error:
			Error updating order
*/
//POST request handler for removing items in an alexa order
app.post('/alexa/order/remove', (req, res) => {
	//Make sure right number of parameters are entered:
	if(!(req.body.order_num !== undefined && req.body.item_id !== undefined && req.body.quantity !== undefined)) {
		res.status(400).send('Error: Missing parameter. Required parameters: order_num, item_id, quantity');
		return;
	}   //if

	//Make sure the order exists and the item is in the order:
	let query = 'Select * FROM sample.orderdetails WHERE order_num = ? AND item_id = ?';
	let parameters = [req.body.order_num, req.body.item_id];
	db.query(query, parameters, (err, rows) => {
		if (rows.length == 0) {
			res.status(409).send('Error: item does not exist in the order');
		}   //if
		else {
			//If new quantity is 0:
			if (parseInt(req.body.quantity) === 0) {
				parameters = [req.body.order_num, req.body.item_id, req.body.quantity];
				query = 'DELETE FROM sample.menu WHERE item_id = ?';

				//Remove item from order:
				db.query(query, req.body.item_id, (err, rows) => {
					if (err) {
						res.status(500).send('Error updating order');
					}   //if
					else {
						res.status(200).send('Successfully updated order!');
					}   //else
				}); //db.query
			}	//if
			//If new quantity is greater than 0:
			else if (parseInt(req.body.quantity) > 0){
				//Build query and parameters:
				query = 'UPDATE sample.orderdetails SET quantity = ?';
				query = query + ' WHERE order_num = ? AND item_id = ?';
				parameters = [req.body.quantity, req.body.order_num, req.body.item_id];

				//Update quantity in db:
				db.query(query, parameters, (err, rows) => {
					if (err) {
						res.status(500).send('Error updating order');
					}   //if
					else {
						res.status(200).send('Successfully updated order!');
					}   //else
				}); //db.query
			}	//else if
			//If new quantity is less than 0:
			else {
				res.status(409).send('Quantity can\'t be negative');
			}	//else
		}   //else
	}); //db.query
});	//app.post

/*
	Returns items in a pending alexa order
	Inputs: alexa_id
	Outputs:
		On success:
			{
				i: {
					order_num,
					item_id,
					item_name,
					quantity,
					order_date,
					table_num,
					customization
				}
			}
		If no in progress orders exist:
			No pending order
		On error:
			Error retrieving order
*/
app.get('/alexa/order/:id', (req, res) => {
	let query = 'SELECT * FROM sample.menu NATURAL JOIN sample.orders NATURAL JOIN sample.orderdetails WHERE customer_id = ? AND order_status LIKE "Pending" ORDER BY order_num';

	//Query database:
	db.query(query, req.params.id, (err, rows) => {
		if (err) {
			res.status(500).send('Error retrieving order');
		}   //if
		else if (rows.length < 1) {
			res.status(200).send('No pending order');
		}   //else if
		else {
			//Build JSON object:
			let response = {};

			//Loop through each row returned from query:
			for (let i=0; i<rows.length; i++) {
				//Add each item to response:
				response[i] =   {
					'order_num': rows[i].order_num,
					'item_id': rows[i].item_id,
					'item_name': rows[i].item_name,
					'quantity': rows[i].quantity,
					'order_date': rows[i].order_date,
					'table': rows[i].table_num,
					'customization': rows[i].customization
				};	//response
			}   //for

			//Send Response:
			res.type('json').send(response);
		}   //else
	}); //db.query
}); //app.get

//==========================================================================//
//							MISCELLANEOUS ENDPOINTS 						//
//==========================================================================//

/*
	Verifies a JSON Web Token and checks if it is for a manager
	Inputs: JWT
	Outputs:
		On success:
			Valid manager token
		If JWT is not for a manager:
			Not a manager
		On error/invalid token:
			Must be authorized!
*/
app.post('/verify', verifyToken, (req, res) => {
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			if (auth.staff && auth.staff.position === 'manager') {
				res.status(200).send('Valid manager token');
			}	//if
			else {
				res.status(401).send('Not a manger');
			}	//else
		}   //else
	});	//verify
}); //app.post

/*
	Returns stats on which things were ordered the most per category at each restaurant
	Inputs: restaurant_id, JWT
	Outputs:
		On success:
			{
				i: {
					restaurant_id
					category
					item_name
					item_id
					total_ordered
				}
			}
		If no items ordered:
			Restaurant has no orders
		If JWT is not valid:
			Must be authorized!
		If JWT is not a manager token for the restaurant:
			Must be the restaurant manager to view stats!
		On error:
			Error retrieving stats
*/
app.get('/orderstats/highestsellingcat/:id', verifyToken, (req, res) => {
	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Check to make sure person is a manager at the restaurant:
			if (auth.staff && auth.staff.position === 'manager' && parseInt(auth.staff.restaurant_id) === parseInt(req.params.id)) {
				//Build query:
				let query = 'CALL sample.GetHighestSellingCategory(?)';
	
				//Query database:
				db.query(query, req.params.id, (err, rows) => {
					if (err) {
						res.status(500).send('Error retrieving stats');
					}   //if
					else if (rows.length < 1) {
						res.status(200).send('This restaurant has no orders');
					}   //else if
					else {
						//Build JSON object:
						let response = {};

						//Loop through each row returned from query:
						for (let i=0; i<rows[0].length; i++) {
							response[i] = {
								'restaurant_id': rows[0][i].restaurant_id,
								'category': rows[0][i].category,
								'item_name': rows[0][i].item_name,
								'item_id': rows[0][i].item_id,
								'total_ordered': rows[0][i].total_ordered
							};	//response
						}   //for

						//Send Response:
						res.type('json').send(response);
					}   //else
				}); //db.query
			}	//if
			else {
				res.status(401).send('Must be the restaurant manager to view stats!');
			}	//else
		}	//else
	}); //verify
}); //app.get

/*
	Returns stats on number of orders by the hour
	Inputs: restaurant_id, JWT
	Outputs:
		On success:
			{
				i: {
					restaurant_id
					hour
					num_orders
				}
			}
		If no items ordered:
			Restaurant has no orders
		If JWT is not valid:
			Must be authorized!
		If JWT is not a manager token for the restaurant:
			Must be the restaurant manager to view stats!
		On error:
			Error retrieving stats
*/
app.get('/orderstats/ordersbyhour/:id', verifyToken, (req, res) => {
	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Check to make sure person is a manager at the restaurant:
			if (auth.staff && auth.staff.position === 'manager' && parseInt(auth.staff.restaurant_id) === parseInt(req.params.id)) {
				//Build query:
				let query = 'CALL sample.GetOrdersByHour(?)';
				
				//Query database:
				db.query(query, req.params.id, (err, rows) => {
					if (err) {		
						res.status(500).send('Error retrieving stats');		
					}   //if
					else if (rows.length < 1) {
						res.status(200).send('This restaurant has no orders');
					}   //else if
					else {
						//Build JSON object:
						let response = {};

						//Loop through each row returned from query:
						for (let i=0; i<rows[0].length; i++) {
							response[i] = {
								'restaurant_id': rows[0][i].restaurant_id,
								'hour': rows[0][i].hour,
								'num_orders': rows[0][i].num_orders,
							};	//response
						}   //for

						//Send Response:
						res.type('json').send(response);
					}   //else
				}); //db.query
			}	//if
			else {
				res.status(401).send('Must be the restaurant manager to view stats!');
			}	//else
		}	//else
	});	//verify
}); //app.get

/*
	Returns stats on number of orders by the day
	Inputs: restaurant_id, JWT
	Outputs:
		On success:
			{
				i: {
					restaurant_id
					day
					num_orders
				}
			}
		If no items ordered:
			Restaurant has no orders
		If JWT is not valid:
			Must be authorized!
		If JWT is not a manager token for the restaurant:
			Must be the restaurant manager to view stats!
		On error:
			Error retrieving stats
*/
app.get('/orderstats/ordersbyday/:id', verifyToken, (req, res) => {
	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Check to make sure person is a manager at the restaurant:
			if (auth.staff && auth.staff.position === 'manager' && parseInt(auth.staff.restaurant_id) === parseInt(req.params.id)) {
				//Build query:
				let query = 'CALL sample.GetOrdersByDay(?)';
				
				//Query database:
				db.query(query, req.params.id, (err, rows) => {
					if (err) {		
						res.status(500).send('Error retrieving stats');		
					}   //if
					else if (rows.length < 1) {
						res.status(200).send('This restaurant has no orders');
					}   //else if
					else {
						//Build JSON object:
						let response = {};

						//Loop through each row returned from query:
						for (let i=0; i<rows[0].length; i++) {
							response[i] = {
								'restaurant_id': rows[0][i].restaurant_id,
								'day': rows[0][i].day,
								'num_orders': rows[0][i].num_orders,
							};	//response
						}   //for

						//Send Response:
						res.type('json').send(response);
					}   //else
				}); //db.query
			}	//if
			else {
				res.status(401).send('Must be the restaurant manager to view stats!');
			}	//else
		}	//else
	});	//verify
}); //app.get

/*
	Returns stats on number of orders by the month
	Inputs: restaurant_id, JWT
	Outputs:
		On success:
			{
				i: {
					restaurant_id
					month
					num_orders
				}
			}
		If no items ordered:
			Restaurant has no orders
		If JWT is not valid:
			Must be authorized!
		If JWT is not a manager token for the restaurant:
			Must be the restaurant manager to view stats!
		On error:
			Error retrieving stats
*/
app.get('/orderstats/ordersbymonth/:id', verifyToken, (req, res) => {
	//Verify that the JWT is valid:
	jwt.verify(req.token, process.env.JWT_SECRET, (err, auth) => {
		if (err) {
			res.status(401).send('Must be authorized!');
		}   //if
		else {
			//Check to make sure person is a manager at the restaurant:
			if (auth.staff && auth.staff.position === 'manager' && parseInt(auth.staff.restaurant_id) === parseInt(req.params.id)) {
				//Build query:
				let query = 'CALL sample.GetOrdersByMonth(?)';
				
				//Query database:
				db.query(query, req.params.id, (err, rows) => {
					if (err) {		
						res.status(500).send('Error retrieving stats');		
					}   //if
					else if (rows.length < 1) {
						res.status(200).send('This restaurant has no orders');
					}   //else if
					else {
						//Build JSON object:
						let response = {};

						//Loop through each row returned from query:
						for (let i=0; i<rows[0].length; i++) {
							response[i] = {
								'restaurant_id': rows[0][i].restaurant_id,
								'month': rows[0][i].month,
								'num_orders': rows[0][i].num_orders,
							};	//response
						}   //for

						//Send Response:
						res.type('json').send(response);
					}   //else
				}); //db.query
			}	//if
			else {
				res.status(401).send('Must be the restaurant manager to view stats!');
			}	//else
		}	//else
	});	//verify
}); //app.get

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