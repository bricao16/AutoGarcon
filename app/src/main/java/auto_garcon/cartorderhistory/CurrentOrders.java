package auto_garcon.cartorderhistory;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

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

import auto_garcon.NukeSSLCerts;
import auto_garcon.accountstuff.Account;
import auto_garcon.accountstuff.PasswordChange;
import auto_garcon.accountstuff.Settings;
import auto_garcon.homestuff.Home;
import auto_garcon.homestuff.HomeAdapter;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.menustuff.Menu;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;
import auto_garcon.singleton.UserSingleton;
import auto_garcon.singleton.VolleySingleton;

public class CurrentOrders extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private SharedPreference pref;

    private Map.Entry order;

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
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_current_orders);
        NukeSSLCerts.nuke();

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
        if(pref.getShoppingCart() != null) {
            if(pref.getShoppingCart().getCart().size()!=0){
                badge.setNumber(pref.getShoppingCart().getCart().size());
            }
        }

        TextView usernameSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_bar_name);
        usernameSideNavBar.setText(pref.getUser().getUsername());

        ImageView userImageSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_account_picture);
        userImageSideNavBar.setImageBitmap(BitmapFactory.decodeByteArray(pref.getUser().getImageBitmap(), 0, pref.getUser().getImageBitmap().length));

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(CurrentOrders.this);

        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override public boolean onNavigationItemSelected(@NonNull MenuItem item) {
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

        StringRequest getRequest = new StringRequest(Request.Method.GET, "https://50.19.176.137:8001/customer/inprogress/" + pref.getUser().getUsername(),
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response) {
                        ArrayList<Integer> orderNumbers = new ArrayList<>();
                        HashMap<Integer, byte[]> logos = new HashMap<>();
                        HashMap<Integer, ShoppingCartSingleton> orders = new HashMap<>();

                        // response
                        try {
                            JSONObject orderJSONObject = new JSONObject(response);

                            Iterator<String> keys = orderJSONObject.keys();
                            while(keys.hasNext()) {
                                String key = keys.next();

                                if (orderJSONObject.get(key) instanceof JSONObject) {
                                    JSONObject menuItemCategories = orderJSONObject.getJSONObject(key);

                                    if(orders.containsKey(menuItemCategories.getInt("order_num"))) {
                                        ShoppingCartSingleton oldOrder = orders.get(menuItemCategories.getInt("order_num"));

                                        oldOrder.addToCart(new auto_garcon.menustuff.MenuItem(menuItemCategories.getInt("item_id"), menuItemCategories.getString("item_name"),
                                                menuItemCategories.getDouble("price"), menuItemCategories.getInt("quantity"), menuItemCategories.getString("customization")));

                                        orders.put(menuItemCategories.getInt("order_num"), oldOrder);
                                    }
                                    else {
                                        ShoppingCartSingleton newOrder = new ShoppingCartSingleton();

                                        newOrder.addToCart(new auto_garcon.menustuff.MenuItem(menuItemCategories.getInt("item_id"), menuItemCategories.getString("item_name"),
                                                menuItemCategories.getDouble("price"), menuItemCategories.getInt("quantity"), menuItemCategories.getString("customization")));

                                        orders.put(menuItemCategories.getInt("order_num"), newOrder);
                                        orderNumbers.add(menuItemCategories.getInt("order_num"));

                                        if(!logos.containsKey(menuItemCategories.getInt("order_num"))) {
                                            byte[] restaurantLogoByteArray = new byte[menuItemCategories.getJSONObject("logo").getJSONArray("data").length()];

                                            for(int i = 0; i < restaurantLogoByteArray.length; i++) {
                                                restaurantLogoByteArray[i] = (byte) (((int) menuItemCategories.getJSONObject("logo").getJSONArray("data").get(i)) & 0xFF);
                                            }

                                            logos.put(menuItemCategories.getInt("order_num"), restaurantLogoByteArray);
                                        }
                                    }
                                }
                            }

                            if(response.contains("Customer has no favorites")) {
                               // favoritesRecyclerView.setVisibility(View.GONE);
                            }
                            else {
                                //ConstraintLayout constraintLayout = findViewById(R.id.no_favorites);
                                //constraintLayout.setVisibility(View.GONE);

                            }

                            RecyclerView currentOrdersList = findViewById(R.id.current_orders_list);
                            currentOrdersList.setLayoutManager(new LinearLayoutManager((CurrentOrders.this)));
                            currentOrdersList.setAdapter(new CurrentOrdersAdapter(CurrentOrders.this, orders, logos, orderNumbers));
                        }
                        catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {//if our put request is un-successful we want display that there was an error to the user
                        // error
                        error.printStackTrace();
                    }
                }
        ) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {//adds header to request
                HashMap<String,String> headers = new HashMap<String, String>();
                headers.put("Authorization","Bearer " + pref.getAuth());
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
     */    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem nav_item){
        switch(nav_item.getItemId()){
            case R.id.account:
                startActivity(new Intent(CurrentOrders.this, Account.class));
                break;
            case R.id.order_history:
                startActivity(new Intent(CurrentOrders.this, OrderHistory.class));
                break;
            case R.id.current_orders:
                startActivity(new Intent(CurrentOrders.this, CurrentOrders.class));
                break;
            case R.id.settings:
                startActivity(new Intent(CurrentOrders.this, Settings.class));
                break;
            case R.id.log_out:
                pref.changeLogStatus(false);
                pref.logOut();

                startActivity(new Intent(CurrentOrders.this, Login.class));
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
        if(pref.getUser().getChangePassword()==1){//check if they have updated their password
            //if not send them back to PasswordChange page and force them to update their password
            Intent intent = new Intent(CurrentOrders.this, PasswordChange.class);
            startActivity(intent);
            Toast.makeText(this,"Please Update your Password",Toast.LENGTH_LONG).show();
        }
    }
}
