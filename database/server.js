/*
        REST-API Server
        Tucker Urbanski
        Date: 3/2/2020
*/

// Built-in Node.js modules
var fs = require('fs');
var path = require('path');
var cors = require('cors');

// NPM modules
var express = require('express');
var bodyParser = require('body-parser');
var js2xmlparser = require('js2xmlparser');
var mysql = require('mysql');
var dotenv = require('dotenv');

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
}); //createConnection

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
app.get('/menu', (req, res) => 
{
    let query = "SELECT * FROM test_schema.main_menu";

    db.query(query, (err, rows) =>
    {
        if (err) {
            res.status(500).send('Error: could not retrieve data from database');
        }   //if
        else {
            console.log(rows);
            
        	//Build JSON object:
        	let response = {};

			for (let i=0; i<rows.length; i++) {
                response[i] =   {
                    'dish_name': rows[i].dish_name,
                    'restaurant': rows[i].restaurant,
                    'calories': rows[i].calories,
                    'price': rows[i].price,
                    'tax': rows[i].tax,
                    'options': rows[i].customer,
                    'category': rows[i].category,
                    'breakfast': rows[i].breakfast,
                    'lunch': rows[i].lunch,
                    'dinner': rows[i].dinner,
                    'picture': 'No picture yet',
                    'in_stock': rows[i].in_stock
                };
            }   //for
        	
        	//Send Response:
			res.type('json').send(response);
        }	//else
    });	//db.query
});	//app.get