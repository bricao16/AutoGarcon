package auto_garcon.cartorderhistory;

import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
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
import java.util.Map;

import auto_garcon.ExceptionHandler;
import auto_garcon.accountstuff.Account;
import auto_garcon.accountstuff.PasswordChange;
import auto_garcon.accountstuff.Services;
import auto_garcon.accountstuff.Settings;
import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;
import auto_garcon.singleton.VolleySingleton;

public class CurrentOrders extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private SharedPreference pref;

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
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_current_orders);
        Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this));//error handling for unexpected crashes


        pref = new SharedPreference(CurrentOrders.this);
        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.current_orders_main);// associating xml objects with the java Object equivalent
        Toolbar toolbar = findViewById(R.id.xml_toolbar);// associating xml objects with the java Object equivalent
        NavigationView navigationView = findViewById(R.id.navigationView);// associating xml objects with the java Object equivalent
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(CurrentOrders.this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);
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

        /**
         * ties xml elements to Java objects and dynamically sets them
         */
        TextView usernameSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_bar_name);
        usernameSideNavBar.setText(pref.getUser().getUsername());

        ImageView userImageSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_account_picture);
        userImageSideNavBar.setImageBitmap(BitmapFactory.decodeByteArray(pref.getUser().getImageBitmap(), 0, pref.getUser().getImageBitmap().length));

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(CurrentOrders.this);

        /**
         * onClick for bottom navbar
         */
        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override
                    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_scan:
                                startActivity(new Intent(CurrentOrders.this, QRcode.class));
                                return true;
                            case R.id.action_home:
                                startActivity(new Intent(CurrentOrders.this, Home.class));
                                return true;
                            case R.id.action_cart:
                                startActivity(new Intent(CurrentOrders.this, ShoppingCart.class));
                                return true;
                        }
                        return false;
                    }
                };

        bottomNavigation.setOnNavigationItemSelectedListener(navigationItemSelectedListener);

        /**
         * volley request to get current orders for specified user
         */
        StringRequest getRequest = new StringRequest(Request.Method.GET, "https://50.19.176.137:8001/customer/inprogress/" + pref.getUser().getUsername(),
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        if (response.equals("No order history for this customer")) {
                            findViewById(R.id.no_current_orders).setVisibility(View.VISIBLE);
                        } else {
                            RecyclerView currentOrdersList = findViewById(R.id.current_orders_list);

                            currentOrdersList.setVisibility(View.VISIBLE);
                            currentOrdersList.setLayoutManager(new LinearLayoutManager((CurrentOrders.this)));

                            ArrayList<Integer> orderNumbers = new ArrayList<>();
                            HashMap<Integer, byte[]> logos = new HashMap<>();
                            HashMap<Integer, ShoppingCartSingleton> orders = new HashMap<>();
                            HashMap<Integer, String> restaurantNames = new HashMap<>();

                            // response
                            try {
                                JSONObject orderJSONObject = new JSONObject(response);

                                Iterator<String> keys = orderJSONObject.keys();
                                while (keys.hasNext()) {
                                    String key = keys.next();

                                    if (orderJSONObject.get(key) instanceof JSONObject) {
                                        JSONObject menuItemCategories = orderJSONObject.getJSONObject(key);

                                        if (orders.containsKey(menuItemCategories.getInt("order_num"))) {
                                            ShoppingCartSingleton oldOrder = orders.get(menuItemCategories.getInt("order_num"));

                                            oldOrder.addToCart(new auto_garcon.menustuff.MenuItem(menuItemCategories.getInt("item_id"), menuItemCategories.getString("item_name"),
                                                    menuItemCategories.getDouble("price"), menuItemCategories.getInt("quantity"), menuItemCategories.getString("customization")));

                                            orders.put(menuItemCategories.getInt("order_num"), oldOrder);
                                        } else {
                                            int font = CurrentOrders.this.getResources().getIdentifier(menuItemCategories.getString("font").toLowerCase().replaceAll("\\s", "") + "_regular", "font", CurrentOrders.this.getPackageName());

                                            ShoppingCartSingleton newOrder = new ShoppingCartSingleton(menuItemCategories.getString("restaurant_name"), menuItemCategories.getInt("restaurant_id"), font, menuItemCategories.getString("font_color"),
                                                    menuItemCategories.getString("primary_color"), menuItemCategories.getString("secondary_color"), menuItemCategories.getString("tertiary_color"));

                                            newOrder.addToCart(new auto_garcon.menustuff.MenuItem(menuItemCategories.getInt("item_id"), menuItemCategories.getString("item_name"),
                                                    menuItemCategories.getDouble("price"), menuItemCategories.getInt("quantity"), menuItemCategories.getString("customization")));

                                            orders.put(menuItemCategories.getInt("order_num"), newOrder);
                                            orderNumbers.add(menuItemCategories.getInt("order_num"));

                                            if (!logos.containsKey(menuItemCategories.getInt("order_num"))) {
                                                byte[] restaurantLogoByteArray = new byte[menuItemCategories.getJSONObject("logo").getJSONArray("data").length()];

                                                for (int i = 0; i < restaurantLogoByteArray.length; i++) {
                                                    restaurantLogoByteArray[i] = (byte) (((int) menuItemCategories.getJSONObject("logo").getJSONArray("data").get(i)) & 0xFF);
                                                }

                                                restaurantNames.put(menuItemCategories.getInt("order_num"), menuItemCategories.getString("restaurant_name"));
                                                logos.put(menuItemCategories.getInt("order_num"), restaurantLogoByteArray);
                                            }
                                        }
                                    }
                                }

                                currentOrdersList.setAdapter(new CurrentOrdersAdapter(CurrentOrders.this, orders, logos, orderNumbers, restaurantNames));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {//if our put request is un-successful we want display that there was an error to the user
                        if (error.networkResponse.statusCode == 401) {
                            pref.changeLogStatus(false);

                            startActivity(new Intent(getBaseContext(), Login.class));
                            Toast.makeText(getBaseContext(), "session expired", Toast.LENGTH_LONG).show();
                        }
                        if (error.networkResponse.statusCode == 500) {
                            Toast.makeText(getBaseContext(), "Error retrieving current orders", Toast.LENGTH_LONG).show();
                        }
                        error.printStackTrace();
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
        VolleySingleton.getInstance(CurrentOrders.this).addToRequestQueue(getRequest);// sending the request to the database
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
     * <p>
     * This is used to force the user to change their password when they open up this activity
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
            Intent intent = new Intent(CurrentOrders.this, PasswordChange.class);
            startActivity(intent);
            Toast.makeText(this, "Please Update your Password", Toast.LENGTH_LONG).show();
        }
    }
}
