package auto_garcon.homestuff;

import android.content.Intent;
import android.graphics.BitmapFactory;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.SearchView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;
import com.google.android.material.badge.BadgeDrawable;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;
import com.squareup.seismic.ShakeDetector;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;

import auto_garcon.accountstuff.Account;
import auto_garcon.accountstuff.Settings;
import auto_garcon.cartorderhistory.CurrentOrders;
import auto_garcon.cartorderhistory.OrderHistory;
import auto_garcon.cartorderhistory.ShoppingCart;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.menustuff.Menu;
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
    RecyclerView favoritesRecyclerView;//showing a list of restaurant pages
    HomeAdapter homeAdapter;//generating a list of restaurant pages
    private ArrayList<RestaurantItem> items;//RestaurantItem generated through the database connection.
    //Here is for Search box
    //End of Search Box
    private List<String> allRestaurantNames;
    private List<Integer> allRestaurantIDs;
    AutoCompleteTextView searchBar;
    Random randomGenerator;

    /**
     * Called when the activity is starting.  This is where most initialization
     * should go
     *
     * <p><em>Derived classes must call through to the super class's
     * implementation of this method.  If they do not, an exception will be
     * thrown.</em></p>
     *
     * @param savedInstanceState If the activity is being re-initialized after
     *     previously being shut down then this Bundle contains the data it most
     *     recently supplied in {@link #onSaveInstanceState}.  <b><i>Note: Otherwise it is null.</i></b>
     *
     * @see #onStart
     * @see #onSaveInstanceState
     * @see #onRestoreInstanceState
     * @see #onPostCreate
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        pref = new SharedPreference(Home.this);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.home_main);
        Toolbar toolbar = findViewById(R.id.xml_toolbar);
        NavigationView navigationView = findViewById(R.id.navigationView);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(Home.this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);
        searchBar = findViewById(R.id.search_bar);

        TextView usernameSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_bar_name);
        usernameSideNavBar.setText(pref.getUser().getUsername());

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(Home.this);

        /**
         * It ties the bottom navigation bar xml element to a Java object and provides it with its
         * onClick functionality to other activities and sets the listener.
         */
        BottomNavigationView bottomNavigation = findViewById(R.id.bottom_navigation);
        BadgeDrawable badge = bottomNavigation.getOrCreateBadge(R.id.action_cart);
        badge.setVisible(true);
        if(pref.getShoppingCart()!=null) {
            if(pref.getShoppingCart().getCart().size()!=0){
                badge.setNumber(pref.getShoppingCart().getCart().size());
            }
        }


        //shake feature
        randomGenerator = new Random();
        SensorManager sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        ShakeDetector shakeDetector = new ShakeDetector(this);
        shakeDetector.start(sensorManager);

        items = new ArrayList<>();
        favoritesRecyclerView = findViewById(R.id.favorites_list);

        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_scan:
                                startActivity(new Intent(Home.this, QRcode.class));
                                return true;
                            case R.id.action_home:
                                startActivity(new Intent(Home.this, Home.class));
                                return true;
                            case R.id.action_cart:
                                startActivity(new Intent(Home.this, ShoppingCart.class));
                                return true;
                        }
                        return false;
                    }
                };

        bottomNavigation.setOnNavigationItemSelectedListener(navigationItemSelectedListener);

        StringRequest getRequestForFavorites = new StringRequest(Request.Method.GET, "http://50.19.176.137:8000/favorites/" + pref.getUser().getUsername(),
            new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    try {
                        JSONObject favoritesJSONObject = new JSONObject(response);
                        //parsing through json from get request to add them to menu
                        Iterator<String> keys = favoritesJSONObject.keys();
                        while(keys.hasNext()) {
                            String key = keys.next();

                            if (favoritesJSONObject.get(key) instanceof JSONObject) {
                                RestaurantItem itemToBeAdded = new RestaurantItem();
                                JSONObject item = favoritesJSONObject.getJSONObject(key);

                                itemToBeAdded.setID(Integer.parseInt(item.get("restaurant_id").toString()));
                                pref.addToFavorites(Integer.parseInt(item.get("restaurant_id").toString()));

                                itemToBeAdded.setName(item.get("restaurant_name").toString());
                                itemToBeAdded.setAddress(item.get("address").toString());
                                itemToBeAdded.setPhoneNumber(Long.parseLong(item.get("phone_number").toString()));
                                itemToBeAdded.setOpeningTime(Integer.parseInt(item.get("opening_time").toString()));
                                itemToBeAdded.setClosingTime(Integer.parseInt(item.get("closing_time").toString()));

                                JSONObject obj = item.getJSONObject("logo");
                                byte[] temp = new byte[obj.getJSONArray("data").length()];

                                for(int i = 0; i < obj.getJSONArray("data").length(); i++) {
                                    temp[i] = (byte) (((int) obj.getJSONArray("data").get(i)) & 0xFF);
                                }

                                itemToBeAdded.setImageBitmap(BitmapFactory.decodeByteArray(temp, 0, temp.length));
                                items.add(itemToBeAdded);
                            }
                        }

                        if(response.contains("Customer has no favorites")) {
                            favoritesRecyclerView.setVisibility(View.GONE);
                        }
                        else {
                            ConstraintLayout constraintLayout = findViewById(R.id.no_favorites);
                            constraintLayout.setVisibility(View.GONE);

                            favoritesRecyclerView.setLayoutManager(new LinearLayoutManager((Home.this)));
                            homeAdapter = new HomeAdapter(Home.this, items);
                            favoritesRecyclerView.setAdapter(homeAdapter);
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    if(error.networkResponse.statusCode == 500) {
                        Toast.makeText(Home.this, "Error retrieving restaurants",Toast.LENGTH_LONG).show();
                    }
                }
            }
        );

        StringRequest getRequestForSearch = new StringRequest(Request.Method.GET, "http://50.19.176.137:8000/restaurants",
            new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    try {
                        JSONObject allRestaurantsJSONObject = new JSONObject(response);
                        //parsing through json from get request to add them to menu
                        allRestaurantNames = new ArrayList<>();
                        allRestaurantIDs = new ArrayList<>();

                        Iterator<String> keys = allRestaurantsJSONObject.keys();
                        while(keys.hasNext()) {
                            String key = keys.next();

                            if (allRestaurantsJSONObject.get(key) instanceof JSONObject) {
                                JSONObject item = allRestaurantsJSONObject.getJSONObject(key);

                                allRestaurantIDs.add(Integer.parseInt(item.get("restaurant_id").toString()));
                                allRestaurantNames.add(item.get("restaurant_name").toString());
                            }
                        }
                        ArrayAdapter<String> searchAdapter = new ArrayAdapter<>(Home.this, android.R.layout.simple_list_item_1, allRestaurantNames);
                        searchBar.setAdapter(searchAdapter);
                        searchBar.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                            @Override
                            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                                Intent menu = new Intent(Home.this, Menu.class);

                                allRestaurantNames.indexOf(searchBar.getText().toString());

                                menu.putExtra("restaurant id", allRestaurantIDs.get(allRestaurantNames.indexOf(searchBar.getText().toString())));
                                startActivity(menu);
                            }
                        });
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    if(error.networkResponse.statusCode == 500) {
                        Toast.makeText(Home.this, "Error retrieving restaurants",Toast.LENGTH_LONG).show();
                    }
                }
            }
        );

        VolleySingleton.getInstance(Home.this).addToRequestQueue(getRequestForFavorites);
        VolleySingleton.getInstance(Home.this).addToRequestQueue(getRequestForSearch);
    }

    /** Called on the main thread when the device is shaken. */
    @Override
    public void hearShake(){
        allRestaurantIDs.get(randomGenerator.nextInt(allRestaurantNames.size()));
    }

    /**
     * Called when an item in the navigation menu is selected.
     *
     * @param nav_item The selected item
     * @return true to display the item as the selected item
     */
    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem nav_item){
        switch(nav_item.getItemId()){
            case R.id.account:
                startActivity(new Intent(Home.this, Account.class));
                break;
            case R.id.order_history:
                startActivity(new Intent(Home.this, OrderHistory.class));
                break;
            case R.id.current_orders:
                startActivity(new Intent(Home.this, CurrentOrders.class));
                break;
            case R.id.settings:
                startActivity(new Intent(Home.this, Settings.class));
                break;
            case R.id.log_out:
                pref.changeLogStatus(false);
                pref.logOut();

                startActivity(new Intent(Home.this, Login.class));
                break;
        }
        return false;
    }
}