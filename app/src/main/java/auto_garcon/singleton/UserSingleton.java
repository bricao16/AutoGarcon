package auto_garcon.singleton;

import android.graphics.Bitmap;
import android.util.Log;

/**
 * Class for holding user information
 *
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

    public UserSingleton(String firstName, String lastName, String username, String email, byte[] image){
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.changePassword = 0;
        this.image = image;

        this.restaurantID = -1;
        this.tableID = -1;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public  int getChangePassword() {
        return this.changePassword;
    }

    public void setChangePassword(int changePassword) {
        this.changePassword = changePassword;
    }
    public void setRestaurantID(int restaurantID) {
        this.restaurantID = restaurantID;
    }
    public void setTableID(int tableID) {
        this.tableID = tableID;
    }
    public int getTableID(){return this.tableID;}
    public int getRestaurantID() {
        return this.restaurantID;
    }

    public byte[] getImageBitmap() {
        return this.image;
    }

}
