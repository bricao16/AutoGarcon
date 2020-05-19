package auto_garcon.singleton;

import android.content.Context;
import android.content.SharedPreferences;

import com.example.auto_garcon.R;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

/**
 * This class Holds users current state and all information about the user
 * The class uses shared prefrence and writes the data into the app's memory as key value pair
 */
public class SharedPreference {
    private SharedPreferences sharedPreferences;
    private Context context;

    /**
     * This constructor intializes the sharedPrefrence object using the context passed
     *
     * @param context the context represents the current state of the object
     */
    public SharedPreference(Context context) {
        this.context = context;
        sharedPreferences = context.getSharedPreferences(context.getString(R.string.pref_file), Context.MODE_PRIVATE);
    }

    /**
     * This method sets our users log status to true or false based on the boolean passed in
     *
     * @param status this represents weather the user is logged in or not as either a true or false
     */
    public void changeLogStatus(boolean status) {
        SharedPreferences.Editor editor = sharedPreferences.edit();

        //editing preference file and changing login status to either false or true
        editor.putBoolean(context.getString(R.string.pref_login_status), status);
        //how you save???
        editor.apply();
    }

    /**
     * This methods will represent logging out a user by clearing the sharedPrefrence file and all info we store from the users interaction on the app
     */
    public void logOut() {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.clear().apply();
    }

    /**
     * This method gets the users Login status using the key com.example_preference_login_status
     *
     * @return
     */
    public boolean getLoginStatus() {
        // gets the login status from preference file
        return sharedPreferences.getBoolean(context.getString(R.string.pref_login_status), false);
    }

    public UserSingleton getUser() {
        // this gson object will be used to convert our json string into a java object
        Gson gson = new Gson();
        //here we extract the json String from our sharedPreference file
        String stringJson = sharedPreferences.getString("UserSingleton", null);

        //here we convert the json String to our Java Object
        return gson.fromJson(stringJson, UserSingleton.class);
    }

    /**
     * This method stores the users inoformation which is passed in as user Object in our sharedPrefrence file
     *
     * @param user represents a user info and data
     */
    public void setUser(UserSingleton user) {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        //this gson object is used to convert our java object into a json String
        Gson gson = new Gson();

        String stringJson = gson.toJson(user);

        // here we write the json object that represents our java object into our shared preference file
        editor.putString("UserSingleton", stringJson);
        //save edits
        editor.apply();
    }

    /**
     * this method returns the authorization token of the user stored within the sharedPreference file
     */
    public String getAuth() {
        return sharedPreferences.getString(context.getString(R.string.pref_auth_token), "Token");
    }

    /**
     * this method takes in a string value and stores it within the sharedPreference file
     * @param authToken the token represents the value that will be stored
     */
    public void setAuthToken(String authToken) {
        SharedPreferences.Editor editor = sharedPreferences.edit();

        editor.putString(context.getString(R.string.pref_auth_token), authToken);
        editor.commit();
    }


    /**
     * this method returns a shopping cart that is storend within the sharedPreference file
     */
    public ShoppingCartSingleton getShoppingCart() {
        // this gson object will be used to convert our json string into a java object
        Gson gson = new Gson();
        //here we extract the json String from our sharedPreference file
        String stringJson = sharedPreferences.getString("ShoppingCartSingleton", null);
        if (stringJson == null) {
            return new ShoppingCartSingleton();
        }

        //here we convert the json String to our Java Object
        return gson.fromJson(stringJson, ShoppingCartSingleton.class);
    }

    /**
     * this method stores the shopping cart object passed in our sharedPreference file
     * @param shoppingCart this represents the shoppingCartSingleton that will be stored
     */
    public void setShoppingCart(ShoppingCartSingleton shoppingCart) {
        SharedPreferences.Editor editor = sharedPreferences.edit();

        //this gson object is used to convert our java object into a json String
        Gson gson = new Gson();

        String stringJson = gson.toJson(shoppingCart);

        // here we write the json object that represents our java object into our shared preference file
        editor.putString("ShoppingCartSingleton", stringJson);
        //save edits
        editor.apply();
    }

    /**
     * This returns an arraylist of all the favorite restaurants id
     * @return
     */
    public List<Integer> getFavorites() {
        Gson gson = new Gson();
        String stringJson = sharedPreferences.getString("favorite restaurants", null);
        List<Integer> toBeReturned;
        if (stringJson == null) {
            toBeReturned = new ArrayList<Integer>();
        } else {
            Type type = new TypeToken<List<Integer>>() {
            }.getType();
            toBeReturned = gson.fromJson(stringJson, type);
        }
        return toBeReturned;
    }

    /**
     * this method removes the restaurant id from the arraylist of favorite restaurants ids
     * @param oldFavorite the resturant id to be removed
     */
    public void removeFromFavorites(int oldFavorite) {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        Gson gson = new Gson();
        String stringJson = sharedPreferences.getString("favorite restaurants", null);

        Type type = new TypeToken<List<Integer>>() {
        }.getType();
        List<Integer> converter = gson.fromJson(stringJson, type);

        if (converter.contains(oldFavorite)) {
            converter.remove((Integer) oldFavorite);
        }

        String returnJSONString = gson.toJson(converter);

        editor.putString("favorite restaurants", returnJSONString);
        editor.apply();
    }

    /**
     * this method adds the resturant id of the users favorites restaurant into an arraylist in sharedPreference
     * @param newFavorite this represents the resutrant of id of the favorite restaurant
     */
    public void addToFavorites(int newFavorite) {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        Gson gson = new Gson();
        List<Integer> converter;
        String stringJson = sharedPreferences.getString("favorite restaurants", null);

        if (stringJson == null) {
            converter = new ArrayList<Integer>();
        } else {
            Type type = new TypeToken<List<Integer>>() {
            }.getType();
            converter = gson.fromJson(stringJson, type);
        }

        if (!converter.contains(newFavorite)) {
            converter.add(newFavorite);
        }

        String returnJSONString = gson.toJson(converter);

        editor.putString("favorite restaurants", returnJSONString);
        editor.apply();
    }

    /**
     * This method returns the timeStamp which is saved within the sharedPreference file if there is none we return the current time
     */
    public Calendar getTimeStamp() {
        Gson gson = new Gson();
        String stringJson = sharedPreferences.getString("timeStamp", null);

        if (stringJson == null) {
            return Calendar.getInstance();
        } else {
            return gson.fromJson(stringJson, Calendar.class);
        }

    }

    /**
     * this method sets the timestamp to the current time and saves it within in our sharedPreference file
     */
    public void SetTimeStamp() {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        Gson gson = new Gson();
        String stringJson = gson.toJson(Calendar.getInstance());
        editor.putString("timeStamp", stringJson);
        editor.apply();
    }
}