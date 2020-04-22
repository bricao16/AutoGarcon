package auto_garcon.homestuff;

import android.content.Intent;
import android.graphics.BitmapFactory;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.SearchView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.auto_garcon.R;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;
import com.squareup.seismic.ShakeDetector;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import auto_garcon.NukeSSLCerts;
import auto_garcon.accountstuff.*;
import auto_garcon.accountstuff.Settings;
import auto_garcon.cartorderhistory.OrderHistory;
import auto_garcon.cartorderhistory.ShoppingCart;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.VolleySingleton;
/*
This show a list of restaurant pages, and
dealing with user actions such as searching.
This retrieve data of restaurant pages from database by using JASON with https connection.
 */
public class Home extends AppCompatActivity implements ShakeDetector.Listener, NavigationView.OnNavigationItemSelectedListener {
    //data fields
    private SharedPreference pref;//a file to keep track of user data as long as it's logged in.
    RecyclerView recyclerView;//showing a list of restaurant pages
    HomeAdapter adapter;//generating a list of restaurant pages
    private ArrayList<RestaurantItem> items;//RestaurantItem generated through the database connection.
    //Here is for Search box
    SearchView searchView;//a object for searching
    ArrayList<String> search_list;//keeping restaurant page through the database connection.
    ArrayAdapter<String> list_adapter;//to check user input match items in the database.
    //End of Search Box

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        pref = new SharedPreference(Home.this);

        if(pref.getFavorites() == null || pref.getFavorites().size() == 0) {
            setContentView(R.layout.no_favorites_home);
        }
        else {
            setContentView(R.layout.activity_home);
        }


        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.home_main);
        Toolbar toolbar = findViewById(R.id.xml_toolbar);
        NavigationView navigationView = findViewById(R.id.navigationView);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(Home.this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(Home.this);

        BottomNavigationView bottomNavigation = findViewById(R.id.bottom_navigation);
        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_scan:
                                Intent QRcode = new Intent(Home.this, QRcode.class);
                                startActivity(QRcode);
                                return true;
                            case R.id.action_home:
                                Intent home = new Intent(Home.this, Home.class);
                                startActivity(home);
                                return true;
                            case R.id.action_cart:
                                Intent shoppingCart = new Intent(Home.this, ShoppingCart.class);
                                startActivity(shoppingCart);
                                return true;
                        }
                        return false;
                    }
                };

        bottomNavigation.setOnNavigationItemSelectedListener(navigationItemSelectedListener);

        //shake feature
        SensorManager sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        ShakeDetector shakeDetector = new ShakeDetector(this);
        shakeDetector.start(sensorManager);

        final String FavoritesURL = "http://50.19.176.137:8000/favorites/" + pref.getUser().getUsername();

        items = new ArrayList<>();
        recyclerView = findViewById(R.id.favorites_list);

        JsonObjectRequest getRequestForFavorites = new JsonObjectRequest(Request.Method.GET, FavoritesURL, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {

                            //parsing through json from get request to add them to menu
                            Iterator<String> keys = response.keys();
                            while(keys.hasNext()) {
                                String key = keys.next();

                                if (response.get(key) instanceof JSONObject) {

                                    RestaurantItem itemToBeAdded = new RestaurantItem();
                                    JSONObject item = response.getJSONObject(key.toString());

                                    Iterator<String> inner_keys = item.keys();
                                    while(inner_keys.hasNext()) {
                                        String inner_key = inner_keys.next();

                                        switch(inner_key){
                                            case "restaurant_id":
                                                itemToBeAdded.setID(Integer.parseInt(item.get(inner_key).toString()));
                                                pref.addToFavorites(Integer.parseInt(item.get(inner_key).toString()));
                                                break;
                                            case "restaurant_name":
                                                itemToBeAdded.setName(item.get(inner_key).toString());
                                                break;
                                            case "address":
                                                itemToBeAdded.setAddress(item.get(inner_key).toString());
                                                break;
                                            case "phone_number":
                                                itemToBeAdded.setPhoneNumber(Long.parseLong(item.get(inner_key).toString()));
                                                break;
                                            case "opening_time":
                                                itemToBeAdded.setOpeningTime(Integer.parseInt(item.get(inner_key).toString()));
                                                break;
                                            case "closing_time":
                                                itemToBeAdded.setClosingTime(Integer.parseInt(item.get(inner_key).toString()));
                                                break;
                                            case "logo":
                                                JSONObject obj = item.getJSONObject("logo");
                                                byte[] temp = new byte[obj.getJSONArray("data").length()];

                                                for(int i = 0; i < obj.getJSONArray("data").length(); i++) {
                                                    temp[i] = (byte) (((int) obj.getJSONArray("data").get(i)) & 0xFF);
                                                }

                                                itemToBeAdded.setImageBitmap(BitmapFactory.decodeByteArray(temp, 0, temp.length));
                                                break;
                                        }
                                    }

                                    items.add(itemToBeAdded);
                                    if(items.size() == 0) {
                                        setContentView(R.layout.no_favorites_home);
                                    }
                                }
                            }

                            recyclerView.setLayoutManager(new LinearLayoutManager((Home.this)));
                            adapter = new HomeAdapter(Home.this, items);
                            recyclerView.setAdapter(adapter);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(Home.this, error.toString(),Toast.LENGTH_LONG).show();
                    }
                }

        );

        VolleySingleton.getInstance(Home.this).addToRequestQueue(getRequestForFavorites);

        final String allRestaurantsURL = "http://50.19.176.137:8000/restaurants";

        JsonObjectRequest getRequestForSearch = new JsonObjectRequest(Request.Method.GET, allRestaurantsURL, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            //parsing through json from get request to add them to menu
                            HashMap<Integer, String> allRestaurantList = new HashMap<Integer, String>();

                            Iterator<String> keys = response.keys();
                            while(keys.hasNext()) {
                                String key = keys.next();

                                if (response.get(key) instanceof JSONObject) {
                                    JSONObject item = response.getJSONObject(key);

                                    int restaurantID = 0;
                                    String restaurantName = "";

                                    Iterator<String> inner_keys = item.keys();

                                    while(inner_keys.hasNext()) {
                                        String inner_key = inner_keys.next();


                                        switch(inner_key){
                                            case "restaurant_id":
                                                restaurantID = Integer.parseInt(item.get(inner_key).toString());
                                                break;
                                            case "restaurant_name":
                                                restaurantName = item.get(inner_key).toString();
                                                break;
                                        }
                                    }

                                    allRestaurantList.put(restaurantID, restaurantName);
                                }
                            }

                            Log.d("sdf", allRestaurantList.toString());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(Home.this, error.toString(),Toast.LENGTH_LONG).show();
                    }
                }

        );

        VolleySingleton.getInstance(Home.this).addToRequestQueue(getRequestForSearch);
    }

    @Override
    public void hearShake(){
        Toast.makeText(this, "HI", Toast.LENGTH_SHORT).show();
    }

    //onClick for side nav bar
    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem nav_item){
        switch(nav_item.getItemId()){
            case R.id.account:
                Intent account = new Intent(getBaseContext(),   Account.class);
                startActivity(account);
                break;
            case R.id.order_history:
                Intent orderHistory = new Intent(getBaseContext(),   OrderHistory.class);
                startActivity(orderHistory);
                break;
            case R.id.settings:
                Intent settings = new Intent(getBaseContext(),   Settings.class);
                startActivity(settings);
                break;
            case R.id.log_out:
                pref.changeLogStatus(false);
                pref.logOut();

                Intent login = new Intent(getBaseContext(),   Login.class);
                startActivity(login);
                break;
        }
        return false;
    }
}