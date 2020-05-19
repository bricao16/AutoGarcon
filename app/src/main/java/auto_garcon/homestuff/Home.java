package auto_garcon.homestuff;

import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;
import com.google.android.material.badge.BadgeDrawable;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;

import auto_garcon.ExceptionHandler;
import auto_garcon.accountstuff.Account;
import auto_garcon.accountstuff.PasswordChange;
import auto_garcon.accountstuff.Services;
import auto_garcon.accountstuff.Settings;
import auto_garcon.cartorderhistory.CurrentOrders;
import auto_garcon.cartorderhistory.OrderHistory;
import auto_garcon.cartorderhistory.ShoppingCart;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.menustuff.Menu;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.VolleySingleton;

/**
 * This show a list of restaurant pages, and dealing with user actions such as searching.
 * This retrieve data of restaurant pages from database by using JASON with https connection.
 */
public class Home extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {
    AutoCompleteTextView searchBar;
    Random randomGenerator;
    //data fields
    private SharedPreference pref;//a file to keep track of user data as long as it's logged in.
    //Here is for Search box
    //End of Search Box
    private List<String> allRestaurantNames;
    private List<Integer> allRestaurantIDs;

    /**
     * Called when the activity is starting.  This is where most initialization
     * should go
     *
     * <p><em>Derived classes must call through to the super class's
     * implementation of this method.  If they do not, an exception will be
     * thrown.</em></p>
     *
     * @param savedInstanceState If the activity is being re-initialized after
     *                           previously being shut down then this Bundle contains the data it most
     *                           recently supplied in {@link #onSaveInstanceState}.  <b><i>Note: Otherwise it is null.</i></b>
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
        Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this));//error handling for unexpected crashes

        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.home_main);
        Toolbar toolbar = findViewById(R.id.xml_toolbar);
        NavigationView navigationView = findViewById(R.id.navigationView);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(Home.this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);
        searchBar = findViewById(R.id.search_bar);

        TextView usernameSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_bar_name);
        usernameSideNavBar.setText(pref.getUser().getUsername());

        ImageView userImageSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_account_picture);
        userImageSideNavBar.setImageBitmap(BitmapFactory.decodeByteArray(pref.getUser().getImageBitmap(), 0, pref.getUser().getImageBitmap().length));

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
        if (pref.getShoppingCart() != null) {
            if (pref.getShoppingCart().getCart().size() != 0) {
                badge.setNumber(pref.getShoppingCart().getCart().size());
            }
        }

        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override
                    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
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

        StringRequest getRequestForFavorites = new StringRequest(Request.Method.GET, "https://50.19.176.137:8001/favorites/" + pref.getUser().getUsername(),
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        if (response.contains("Customer has no favorites")) {
                            findViewById(R.id.no_favorites).setVisibility(View.VISIBLE);
                        } else {
                            RecyclerView favoritesRecyclerView = findViewById(R.id.favorites_list);

                            favoritesRecyclerView.setVisibility(View.VISIBLE);
                            favoritesRecyclerView.setLayoutManager(new LinearLayoutManager((Home.this)));

                            try {
                                ArrayList<RestaurantItem> favoritesList = new ArrayList<RestaurantItem>();
                                JSONObject favoritesJSONObject = new JSONObject(response);
                                //parsing through json from get request to add them to menu
                                Iterator<String> keys = favoritesJSONObject.keys();
                                while (keys.hasNext()) {
                                    String key = keys.next();

                                    if (favoritesJSONObject.get(key) instanceof JSONObject) {
                                        RestaurantItem itemToBeAdded = new RestaurantItem();
                                        JSONObject item = favoritesJSONObject.getJSONObject(key);

                                        itemToBeAdded.setID(Integer.parseInt(item.get("restaurant_id").toString()));

                                        itemToBeAdded.setName(item.get("restaurant_name").toString());
                                        itemToBeAdded.setAddress(item.get("address").toString());
                                        itemToBeAdded.setPhoneNumber(Long.parseLong(item.get("phone_number").toString()));
                                        itemToBeAdded.setOpeningTime(Integer.parseInt(item.get("opening_time").toString()));
                                        itemToBeAdded.setClosingTime(Integer.parseInt(item.get("closing_time").toString()));

                                        int font = Home.this.getResources().getIdentifier(item.get("font").toString().toLowerCase().replaceAll("\\s", "") + "_regular",
                                                "font", Home.this.getPackageName());

                                        itemToBeAdded.setFont(font);
                                        itemToBeAdded.setFontColor(item.get("font_color").toString());
                                        itemToBeAdded.setSecondaryColor(item.get("secondary_color").toString());

                                        JSONObject obj = item.getJSONObject("logo");
                                        byte[] temp = new byte[obj.getJSONArray("data").length()];

                                        for (int i = 0; i < obj.getJSONArray("data").length(); i++) {
                                            temp[i] = (byte) (((int) obj.getJSONArray("data").get(i)) & 0xFF);
                                        }

                                        itemToBeAdded.setImageBitmap(BitmapFactory.decodeByteArray(temp, 0, temp.length));
                                        favoritesList.add(itemToBeAdded);
                                    }
                                }

                                favoritesRecyclerView.setAdapter(new HomeAdapter(Home.this, favoritesList));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        if (error.networkResponse.statusCode == 401) {
                            pref.changeLogStatus(false);

                            startActivity(new Intent(getBaseContext(), Login.class));
                            Toast.makeText(getBaseContext(), "session expired", Toast.LENGTH_LONG).show();
                        }
                        if (error.networkResponse.statusCode == 500) {
                            Toast.makeText(Home.this, "Error retrieving restaurants", Toast.LENGTH_LONG).show();
                        }
                    }
                }
        ) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {//adds header to request
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Authorization", "Bearer " + pref.getAuth());
                return headers;
            }
        };

        StringRequest getRequestForSearch = new StringRequest(Request.Method.GET, "https://50.19.176.137:8001/restaurants",
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject allRestaurantsJSONObject = new JSONObject(response);
                            //parsing through json from get request to add them to menu
                            allRestaurantNames = new ArrayList<>();
                            allRestaurantIDs = new ArrayList<>();

                            Iterator<String> keys = allRestaurantsJSONObject.keys();
                            while (keys.hasNext()) {
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
                        if (error.networkResponse.statusCode == 500) {
                            Toast.makeText(Home.this, "Error retrieving restaurants", Toast.LENGTH_LONG).show();
                        }
                    }
                }
        );

        VolleySingleton.getInstance(Home.this).addToRequestQueue(getRequestForFavorites);
        VolleySingleton.getInstance(Home.this).addToRequestQueue(getRequestForSearch);
    }

    /**
     * Called when an item in the navigation menu is selected.
     *
     * @param nav_item The selected item
     * @return true to display the item as the selected item
     */
    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem nav_item) {
        switch (nav_item.getItemId()) {
            case R.id.account:
                startActivity(new Intent(getBaseContext(), Account.class));
                break;
            case R.id.order_history:
                startActivity(new Intent(getBaseContext(), OrderHistory.class));
                break;
            case R.id.current_orders:
                startActivity(new Intent(getBaseContext(), CurrentOrders.class));
                break;
            case R.id.settings:
                startActivity(new Intent(getBaseContext(), Settings.class));
                break;
            case R.id.services:
                startActivity(new Intent(getBaseContext(), Services.class));
                break;
            case R.id.log_out:
                pref.changeLogStatus(false);
                pref.logOut();

                startActivity(new Intent(getBaseContext(), Login.class));
                break;
        }
        return false;
    }

    /**
     * Called after {@link #onCreate} &mdash; or after {@link #onRestart} when
     * the activity had been stopped, but is now again being displayed to the
     * user. It will usually be followed by {@link #onResume}. This is a good place to begin
     * drawing visual elements, running animations, etc.
     *
     * <p>You can call {@link #finish} from within this function, in
     * which case {@link #onStop} will be immediately called after {@link #onStart} without the
     * lifecycle transitions in-between ({@link #onResume}, {@link #onPause}, etc) executing.
     *
     * <p><em>Derived classes must call through to the super class's
     * implementation of this method.  If they do not, an exception will be
     * thrown.</em></p>
     *
     * @see #onCreate
     * @see #onStop
     * @see #onResume
     */
    @Override
    protected void onStart() {
        super.onStart();
        if (pref.getUser().getChangePassword() == 1) {//check if they have updated their password
            //if not send them back to PasswordChange page and force them to update their password
            Intent intent = new Intent(Home.this, PasswordChange.class);
            startActivity(intent);
            Toast.makeText(this, "Please Update your Password", Toast.LENGTH_LONG).show();
        }
    }
}