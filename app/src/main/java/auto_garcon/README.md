Files:

ExceptionHandler.java
* Handles exceptions.

NukeSSLCerts
* helps with SSL Certificates 

Preference.java
* Holds user state/date while a user is logged in

SendErrorEmail.java
* Pop up if error occurs, customer can email their problem

VolleyMultipartRequest
* Custom request to make multipart header and uplaod file.
<br />
<br />


Folders:


+accountstuff

-Account.java
* activity to change account information

-Faq.java
* Frequently Asked Question page for the user.

-PasswordChange.java
* This allows for a user to change their password

-Privacy.java
* Display the Privacy Policy

-Services.java
* This is where a customer can signal the restaurant for the bill or for assistance.

-Settings.java
* Activity for user to view information about the app.

-Terms.java
* Displays the Terms and Conditions of the app.
<br />
<br />

+cartorderhistory

-CurrentOrders.java
* Displays the current orders.

-CurrentOrdersAdapter.java
* Fills in menu of current orders.

-OrderHistory.java
* This class pulls data from the database relating to the user's past orders
 * The class is tied to the order history xml and uses nav bars to navigate other xml's
 * This class main function is to allow the user to view previous orders and also click on the previous orders if they want to order again

-OrderHistoryAdapter.java
* This is a container for history pages that the user can see.

-ShoppingCart.java
* This class is the Java code for activity_shopping_cart.xml. It displays the users
* current shopping cart and allows them to submit the order or make any modifications
* to what is currently in the cart

-ShoppingCartAdapter.java
* The class represents the format for how are our shopping list will act and work
* The class also lets the user allow change in quantity of each menu item, and remove each menu item.
<br />
<br />


+homestuff

-Home.java
* This show a list of restaurant pages, and dealing with user actions such as searching.
* This retrieve data of restaurant pages from database by using JASON with https connection.

-HomeAdapter.java
* This is a container for restaurant pages that the user can see.

-RestaurantItem.java
* This is an object of restaurant page.
<br />
<br />


+initialpages

-AccountImageSelectionRegister.java
* This is where the customer selects their image to use for their profile.

-LoadingScreen.java
* initial load up activity
* displays logo for a bit then goes to login activity

-Login.java
* activity which is the initial login page
* asks for username and password
* Gives option to create an account

-QRcode.java
* Class for Using QR code
* Gets permission for using camera
* Reads QR code and handles the request

-Register.java
* Main class for registering users and handling a user when the want to register a new account
* This classes main purpose is for registering users only
* This class is also tied with the Register xml

-TwoButtonPage.java
* activity which gives option for QR Code or restaurant main page list.
<br />
<br />


+menustuff

-ExpandableMenuAdapter.java
* This is a container for menu pages that the user can see.

-Menu.java
* activity which will populate the menu for a given restaurant

-MenuItem.java
* activity which handles menu items
<br />
<br />


+singelton

-SharedPreferences.java
* Holds current state.

-ShoppingCartSingleton.java
* Class for viewing and modifying shopping cart.

-UserSingelton.java
* Holds User information

-VolleySinglton.java
* Activity to assist with database requests.

