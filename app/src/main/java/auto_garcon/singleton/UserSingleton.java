package auto_garcon.singleton;

import android.util.Log;

import java.util.ArrayList;
import java.util.List;

public class UserSingleton {
    private String firstName;
    private String lastName;
    private String username;
    private String email;

    public UserSingleton(String firstName, String lastName, String username, String email){
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
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
}
