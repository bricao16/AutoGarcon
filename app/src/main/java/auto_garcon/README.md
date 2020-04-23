Files Descriptions

Account.java
* activity to change account information

ExpandableMenuAdapter.java
* activity for menu nav bar

Home.java
* This show a list of restaurant pages, and dealing with user actions such as searching.
* This retrieve data of restaurant pages from database by using JASON with https connection.

HomeAdapter.java
*This is a container for restaurant pages that the user can see.

LoadingScreen.java
* initial load up activity
* displays logo for a bit then goes to login activity

Login.java
* activity which is the initial login page
* asks for username and password
* Gives option to create an account

Menu.java
* activity which will populate the menu for a given restaurant

MenuItem.java
* activity which handles menu items

OrderHistory.java
* This class pulls data from the database relating to the user's past orders
 * The class is tied to the order history xml and uses nav bars to navigate other xml's
 * This class main function is to allow the user to view previous orders and also click on the previous orders if they want to order again

OrderHistoryAdapter.java
* This is a container for history pages that the user can see.

Popup.java
Aitivity for displaying pop up

Preference.java
* Holds user state/date while a user is logged in

QRcode.java
* Class for Using QR code
* Gets permission for using camera
* Reads QR code and handles the request

Register.java
* Main class for registering users and handling a user when the want to register a new account
* This classes main purpose is for registering users only
* This class is also tied with the Register xml

RestaurantItem.java
* This is an object of restaurant page.

Settings.java
* Activity for user to customize their view of the app.

ShoppingCart.java
* This class is the Java code for activity_shopping_cart.xml. It displays the users
* current shopping cart and allows them to submit the order or make any modifications
* to what is currently in the cart

ShoppingCartAdapter.java
* The class represents the format for how are our shopping list will act and work
* The class also lets the user allow change in quantity of each menu item, and remove each menu item.
 
VolleySinglton.java
* Activity to assist with GET requests.

twoButtonPage.java
* activity which gives option for QR Code or restaurant main page list.
