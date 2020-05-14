package auto_garcon.singleton;
/**
 * Class for holding user information
 *
 */
public class UserSingleton {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private int restaurantID;
    private int changePassword;

    public UserSingleton(String firstName, String lastName, String username, String email){
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.restaurantID = -1;
        this.changePassword=0;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public  int getChangePassword(){return this.changePassword;}

    public void setChangePassword(int changePassword){this.changePassword=changePassword;}
    public void setRestaurantID(int restaurantID) {
        this.restaurantID = restaurantID;
    }

    public int getRestaurantID() {
        return this.restaurantID;
    }
}
