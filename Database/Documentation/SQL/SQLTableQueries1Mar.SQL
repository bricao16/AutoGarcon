/* The below code was developed in order to query all the tables and get the data for each one. In MySQL Workbench this allows to look
at the data in separate tabs per table and allows for easy modification of table data directly by clicking on data you wish to change.
NOTE: must have a key assigned in each table in order to modify data. */
use sample;

SELECT *
FROM sample.alexas;

SELECT *
FROM sample.availability;

SELECT *
FROM sample.customers;

SELECT *
FROM sample.employees;

SELECT *
FROM sample.favorites;

SELECT *
FROM sample.menu;

SELECT *
FROM sample.orderdetails;

SELECT *
FROM sample.orders;

SELECT *
FROM sample.restaurants;

SELECT *
FROM sample.services;

SELECT *
FROM sample.staff;

SELECT *
FROM sample.times;
