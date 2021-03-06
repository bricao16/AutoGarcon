package auto_garcon.menustuff;

import android.app.Dialog;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ExpandableListAdapter;
import android.widget.ExpandableListView;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.res.ResourcesCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;
import com.google.android.material.badge.BadgeDrawable;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import auto_garcon.ExceptionHandler;
import auto_garcon.accountstuff.Account;
import auto_garcon.accountstuff.PasswordChange;
import auto_garcon.accountstuff.Services;
import auto_garcon.accountstuff.Settings;
import auto_garcon.cartorderhistory.CurrentOrders;
import auto_garcon.cartorderhistory.OrderHistory;
import auto_garcon.cartorderhistory.ShoppingCart;
import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.VolleySingleton;

/**
 * Class setting up the menu
 * Also sets up favorites
 */
public class Menu extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    Dialog removeFromFavoritesPopup;
    private SharedPreference pref;
    private ExpandableListView listView;
    private ExpandableListAdapter listAdapter;
    private ArrayList<String> listDataHeader;
    private HashMap<String, ArrayList<auto_garcon.menustuff.MenuItem>> listHash;
    private Button addOrRemoveFavorite;
    private ImageView restaurantLogo;
    private TextView restaurantName;

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
        Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this));//error handling for unexpected crashes

        pref = new SharedPreference(this);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);

        /**
         * Ties the side navigation bar xml elements to Java objects and setting listeners for the
         * side navigation drawer as well as the elements within it.
         */
        final DrawerLayout drawerLayout = findViewById(R.id.restaurant_main);// associating xml objects with the java Object equivalent
        Toolbar toolbar = findViewById(R.id.xml_toolbar);// associating xml objects with the java Object equivalent
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayShowTitleEnabled(false);
        NavigationView navigationView = findViewById(R.id.navigationView);// associating xml objects with the java Object equivalent
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);

        TextView usernameSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_bar_name);
        usernameSideNavBar.setText(pref.getUser().getUsername());

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);

        /**
         * It ties the bottom navigation bar xml element to a Java object and provides it with its
         * onClick functionality to other activities and sets the listener.
         */
        BottomNavigationView bottomNavigation = findViewById(R.id.bottom_navigation);
        final BadgeDrawable badge = bottomNavigation.getOrCreateBadge(R.id.action_cart);
        badge.setVisible(true);
        if (pref.getShoppingCart() != null) {
            if (pref.getShoppingCart().getCart().size() != 0) {
                badge.setNumber(pref.getShoppingCart().getCart().size());
            }
        }
        /**
         * Ties certain xml elements to Java objects and sets up things needed for expandable list
         */
        restaurantName = findViewById(R.id.restaurant_name);
        restaurantLogo = findViewById(R.id.restaurant_logo);
        listDataHeader = new ArrayList<>();
        listHash = new HashMap<>();
        addOrRemoveFavorite = findViewById(R.id.add_restaurant);

        if (pref.getFavorites().contains(getIntent().getIntExtra("restaurant id", 0))) {
            addOrRemoveFavorite.setText("Remove from Favorites");
        } else {
            addOrRemoveFavorite.setText("Add to Favorites");
        }

        /**
         * request for adding or removing the restaurant from their favorites list
         */
        addOrRemoveFavorite.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (pref.getFavorites().contains(getIntent().getIntExtra("restaurant id", 0))) {
                    pref.removeFromFavorites(getIntent().getIntExtra("restaurant id", 0));

                    removeFromFavoritesPopup = new Dialog(Menu.this);

                    removeFromFavoritesPopup.setContentView(R.layout.confirm_popup);
                    removeFromFavoritesPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                    removeFromFavoritesPopup.show();

                    TextView dynamicPopupText = removeFromFavoritesPopup.findViewById(R.id.text_confirm_popup);

                    dynamicPopupText.setText("Are you sure you want to remove from favorites?");

                    Button removeFromFavorites = removeFromFavoritesPopup.findViewById(R.id.popup_yes);
                    ImageButton confirmClose = removeFromFavoritesPopup.findViewById(R.id.confirm_close);


                    removeFromFavorites.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            addOrRemoveFavorite.setText("Add to favorites");

                            /**
                             * remove from favorites request
                             */
                            StringRequest deleteRequest = new StringRequest(Request.Method.POST, "https://50.19.176.137:8001/favorites/delete",
                                    new Response.Listener<String>() {
                                        @Override
                                        public void onResponse(String response) {
                                            Toast.makeText(Menu.this, response, Toast.LENGTH_LONG).show();
                                            removeFromFavoritesPopup.dismiss();
                                        }
                                    },
                                    new Response.ErrorListener() {
                                        @Override
                                        public void onErrorResponse(VolleyError error) {
                                            error.printStackTrace();

                                            if (error.networkResponse.statusCode == 400) {
                                                Toast.makeText(getBaseContext(), "Missing parameter", Toast.LENGTH_LONG).show();
                                            }
                                            if (error.networkResponse.statusCode == 401) {
                                                pref.changeLogStatus(false);

                                                startActivity(new Intent(getBaseContext(), Login.class));
                                                Toast.makeText(getBaseContext(), "session expired", Toast.LENGTH_LONG).show();
                                            }
                                            if (error.networkResponse.statusCode == 409) {
                                                Toast.makeText(getBaseContext(), "favorite doesn't exist", Toast.LENGTH_LONG).show();
                                            }
                                            if (error.networkResponse.statusCode == 500) {
                                                Toast.makeText(getBaseContext(), "Error deleting favorite", Toast.LENGTH_LONG).show();
                                            }
                                        }
                                    }
                            ) {
                                @Override
                                protected Map<String, String> getParams() {// inserting parameters for the put request
                                    Map<String, String> params = new HashMap<String, String>();
                                    params.put("customer_id", pref.getUser().getUsername());
                                    params.put("restaurant_id", getIntent().getIntExtra("restaurant id", 0) + "");
                                    return params;
                                }

                                @Override
                                public Map<String, String> getHeaders() throws AuthFailureError {
                                    HashMap<String, String> headers = new HashMap<String, String>();
                                    headers.put("Authorization", "Bearer " + pref.getAuth());
                                    return headers;
                                }
                            };

                            VolleySingleton.getInstance(Menu.this).addToRequestQueue(deleteRequest);// making the actual request
                        }
                    });
                    confirmClose.setOnClickListener(new View.OnClickListener() {
                        public void onClick(View v) {
                            removeFromFavoritesPopup.dismiss();
                        }
                    });
                } else {
                    /**
                     * add to favorites request
                     */
                    addOrRemoveFavorite.setText("Remove from favorites");
                    pref.addToFavorites(getIntent().getIntExtra("restaurant id", 0));

                    StringRequest putRequest = new StringRequest(Request.Method.PUT, "https://50.19.176.137:8001/favorites/add",
                            new Response.Listener<String>() {
                                @Override
                                public void onResponse(String response) {
                                    // response
                                    Toast.makeText(Menu.this, response, Toast.LENGTH_LONG).show();
                                }
                            },
                            new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    // error if the request fails
                                    error.printStackTrace();
                                    if (error.networkResponse.statusCode == 400) {
                                        Toast.makeText(getBaseContext(), "Missing parameter", Toast.LENGTH_LONG).show();
                                    }
                                    if (error.networkResponse.statusCode == 401) {
                                        pref.changeLogStatus(false);

                                        startActivity(new Intent(getBaseContext(), Login.class));
                                        Toast.makeText(getBaseContext(), "session expired", Toast.LENGTH_LONG).show();
                                    }
                                    if (error.networkResponse.statusCode == 409) {
                                        Toast.makeText(getBaseContext(), "favorite already exists", Toast.LENGTH_LONG).show();
                                    }
                                    if (error.networkResponse.statusCode == 500) {
                                        Toast.makeText(getBaseContext(), "Error adding restaurant to favorites", Toast.LENGTH_LONG).show();
                                    }
                                }
                            }
                    ) {
                        @Override
                        protected Map<String, String> getParams() {// inserting parameters for the put request
                            Map<String, String> params = new HashMap<String, String>();
                            params.put("customer_id", pref.getUser().getUsername());
                            params.put("restaurant_id", getIntent().getIntExtra("restaurant id", 0) + "");
                            return params;
                        }

                        @Override
                        public Map<String, String> getHeaders() throws AuthFailureError {//adds header to request
                            HashMap<String, String> headers = new HashMap<String, String>();
                            headers.put("Authorization", "Bearer " + pref.getAuth());
                            return headers;
                        }
                    };

                    VolleySingleton.getInstance(Menu.this).addToRequestQueue(putRequest);// making the actual request
                }
            }
        });

        /**
         * request to get restaurant data and its menu
         */
        StringRequest getRequest = new StringRequest(Request.Method.GET, "http://50.19.176.137:8000/restaurant/" + getIntent().getIntExtra("restaurant id", 0),
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject restaurantJSONObject = new JSONObject(response);

                            //parsing through json from get request to add them to menu
                            JSONObject restaurant = restaurantJSONObject.getJSONObject("restaurant");

                            int font = Menu.this.getResources().getIdentifier(restaurant.getString("font").toLowerCase().replaceAll("\\s", "") + "_regular", "font", Menu.this.getPackageName());

                            Typeface typeface = ResourcesCompat.getFont(Menu.this, font);

                            String primaryColor = restaurant.getString("primary_color");
                            String secondaryColor = restaurant.getString("secondary_color");
                            String tertiaryColor = restaurant.getString("tertiary_color");
                            String fontColor = restaurant.getString("font_color");

                            restaurantName.setText(restaurant.getString("name"));
                            restaurantName.setTextColor(Color.parseColor(fontColor));

                            restaurantName.setTypeface(typeface);
                            addOrRemoveFavorite.setTypeface(typeface);

                            restaurantName.setTextColor(Color.parseColor(fontColor));
                            addOrRemoveFavorite.setTextColor(Color.parseColor(fontColor));

                            addOrRemoveFavorite.setBackgroundColor(Color.parseColor(secondaryColor));
                            drawerLayout.setBackgroundColor(Color.parseColor(primaryColor));

                            restaurant.getString("cuisine");

                            restaurant.getString("address");
                            restaurant.getInt("phone_number");
                            restaurant.getInt("opening");
                            restaurant.getInt("closing");

                            byte[] restaurantLogoByteArray = new byte[restaurant.getJSONObject("logo").getJSONArray("data").length()];

                            for (int i = 0; i < restaurantLogoByteArray.length; i++) {
                                restaurantLogoByteArray[i] = (byte) (((int) restaurant.getJSONObject("logo").getJSONArray("data").get(i)) & 0xFF);
                            }

                            restaurantLogo.setImageBitmap(BitmapFactory.decodeByteArray(restaurantLogoByteArray, 0, restaurantLogoByteArray.length));

                            JSONObject menuItem = restaurantJSONObject.getJSONObject("menu");

                            Iterator<String> keys = menuItem.keys();
                            while (keys.hasNext()) {
                                String key = keys.next();
                                if (menuItem.get(key) instanceof JSONObject) {
                                    JSONObject menuItemCategories = menuItem.getJSONObject(key);

                                    auto_garcon.menustuff.MenuItem itemToBeAdded = creatingToBeAddedItem(menuItemCategories);
                                    itemToBeAdded.setNameOfItem(key);
                                    String whereToSendItem = menuItemCategories.getString("category");

                                    if (listDataHeader.contains(whereToSendItem)) {
                                        ArrayList<auto_garcon.menustuff.MenuItem> listOfItemsInCategory = listHash.get(whereToSendItem);

                                        listOfItemsInCategory.add(itemToBeAdded);
                                        listHash.put(whereToSendItem, listOfItemsInCategory);
                                    } else {
                                        ArrayList<auto_garcon.menustuff.MenuItem> listOfItemsInCategory = new ArrayList<>();
                                        listOfItemsInCategory.add(itemToBeAdded);
                                        listDataHeader.add(whereToSendItem);

                                        listHash.put(whereToSendItem, listOfItemsInCategory);
                                    }
                                }
                            }

                            listAdapter = new ExpandableMenuAdapater(Menu.this, listDataHeader, listHash, getIntent().getIntExtra("restaurant id", 0), font, fontColor,
                                    primaryColor, secondaryColor, tertiaryColor, restaurant.getInt("opening"), restaurant.getInt("closing"), badge);
                            listView = findViewById(R.id.menu_list);
                            listView.setAdapter(listAdapter);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        if (error.networkResponse.statusCode == 409) {
                            pref.changeLogStatus(false);

                            startActivity(new Intent(getBaseContext(), Login.class));
                            Toast.makeText(getBaseContext(), "invalid restaurant id", Toast.LENGTH_LONG).show();
                        }
                        if (error.networkResponse.statusCode == 500) {
                            Toast.makeText(getBaseContext(), "Error retrieving restaurant information", Toast.LENGTH_LONG).show();
                        }
                    }
                }
        );

        VolleySingleton.getInstance(Menu.this).addToRequestQueue(getRequest);

        /**
         * setting up onClick events for bottom navbar
         */
        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override
                    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_scan:
                                startActivity(new Intent(Menu.this, QRcode.class));
                                return true;
                            case R.id.action_home:
                                startActivity(new Intent(Menu.this, Home.class));
                                return true;
                            case R.id.action_cart:
                                startActivity(new Intent(Menu.this, ShoppingCart.class));
                                return true;
                        }
                        return false;
                    }
                };

        bottomNavigation.setOnNavigationItemSelectedListener(navigationItemSelectedListener);
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
     * The method is what filters the restaurant items that are displayed on the menu. If the
     * current menu does not have a category for the item being added it will add that category.
     * It then adds the actual item to the category it belongs in.
     *
     * @param menuItemCategories JSONObject to get the data for our MenuItem
     */

    private auto_garcon.menustuff.MenuItem creatingToBeAddedItem(JSONObject menuItemCategories) {
        auto_garcon.menustuff.MenuItem itemToBeAdded = new auto_garcon.menustuff.MenuItem();

        try {
            itemToBeAdded.setItemID(menuItemCategories.getInt("item_id"));
            itemToBeAdded.setCalories(menuItemCategories.getInt("calories"));
            itemToBeAdded.setPrice(menuItemCategories.getDouble("price"));
            itemToBeAdded.setCategory(menuItemCategories.getString("category"));

            JSONArray arrJson = menuItemCategories.getJSONArray("allergens");
            String[] arr = new String[arrJson.length()];
            for (int i = 0; i < arrJson.length(); i++) {
                arr[i] = arrJson.getString(i);
            }
            itemToBeAdded.setAllergens(arr);

            itemToBeAdded.setAmountInStock(menuItemCategories.getInt("in_stock"));
            itemToBeAdded.setDescription(menuItemCategories.getString("description"));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return itemToBeAdded;
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
            Intent intent = new Intent(Menu.this, PasswordChange.class);
            startActivity(intent);
            Toast.makeText(this, "Please Update your Password", Toast.LENGTH_LONG).show();
        }
    }
}