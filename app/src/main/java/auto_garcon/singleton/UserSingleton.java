package auto_garcon.singleton;

import android.graphics.Bitmap;
import android.util.Log;

/**
 * Class for holding user information
 *as well as information about what resturant the user is at and table
 */
public class UserSingleton {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private int tableID;
    private byte[] image;
    private int restaurantID;
    private int changePassword;

    /**
     * This constructor initalizes all of our instance variables to the parameter passed and the resturantId and tableId to negative 1
     *
     * @param firstName this represents the user firstname that will be set to our first name instance variable
     * @param lastName this represents the user lastname that will be set to our last name instance variable
     * @param username this represent the username that will be set to our username
     * @param email this represents the email that will be set to our email instance variable
     * @param image this represents the image that is a byte array and will be set to our instance variable byte array
     */
    public UserSingleton(String firstName, String lastName, String username, String email, byte[] image){
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.changePassword = 0;
        this.image = image;

        this.restaurantID = -1;// set to negative 1 for error checks
        this.tableID = -1;//set to negative 1 for error checks
    }

    /**
     * This method returns the users first name
     */
    public String getFirstName() {
        return firstName;
    }
    /**
     * This method returns the users last name
     */
    public String getLastName() {
        return lastName;
    }
    /**
     * This method returns the usersname of the user
     */
    public String getUsername() {
        return username;
    }
    /**
     * This method returns the users email
     */
    public String getEmail() {
        return email;
    }
    /**
     * This method returns an int thats used to check if the user needs to change their password
     */
    public  int getChangePassword() {
        return this.changePassword;
    }
    /**
     * This method changes the change password instance variable
     */
    public void setChangePassword(int changePassword) {
        this.changePassword = changePassword;
    }
    /**
     * This method changes the restaurantID instance variable
     */
    public void setRestaurantID(int restaurantID) {
        this.restaurantID = restaurantID;
    }
    /**
     * This method changes the tableID instance variable
     */
    public void setTableID(int tableID) {
        this.tableID = tableID;
    }
    /**
     * This method gets the tableID instance variable
     */
    public int getTableID(){return this.tableID;}
    /**
     * This method gets the restaurantID instance variable
     */
    public int getRestaurantID() {
        return this.restaurantID;
    }
    /**
     * This method gets the byte array instance variable of the user
     */
    public byte[] getImageBitmap() {
        return this.image;
    }

}
