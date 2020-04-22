package auto_garcon.singleton;

import java.util.ArrayList;
import java.util.List;

public class UserSingleton {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private List<Integer> favorites;

    public UserSingleton(String firstName, String lastName, String username, String email){
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.favorites = new ArrayList<Integer>();
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

    public void addToFavorites(int restaurauntID) {
        favorites.add(restaurauntID);
    }

    public void removeFromFavorites(int restaurantID) {
        favorites.remove(restaurantID);
    }

    public List<Integer> getFavorites() {
        return favorites;
    }
}
