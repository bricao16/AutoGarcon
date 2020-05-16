package auto_garcon.cartorderhistory;

import android.app.Dialog;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
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
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;
import com.google.android.material.badge.BadgeDrawable;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.TimeZone;

import auto_garcon.NukeSSLCerts;
import auto_garcon.ExceptionHandler;
import auto_garcon.accountstuff.Account;

import auto_garcon.accountstuff.PasswordChange;
import auto_garcon.accountstuff.Settings;
import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.menustuff.Menu;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;
import auto_garcon.singleton.VolleySingleton;

/**
    * This class is the Java code for activity_shopping_cart.xml. It displays the users
    * current shopping cart and allows them to submit the order or make any modifications
    * to what is currently in the cart
    */

public class ShoppingCart extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private JSONObject obj;
    private SharedPreference pref;//saving user transaction data such as food item chosen by the user.
    private ShoppingCartSingleton shoppingCart;//keeping food item chosen by the user.
    private RecyclerView recyclerView;//generating a list of restaurant

    private ShoppingCartAdapter adapter;
    private StringRequest putRequest;
    private Dialog confirmPopup;
    private Dialog goToQRScannerPopup;
    private Dialog clearCartPopup;
    DrawerLayout drawerLayout;
    Toolbar toolbar;
    NavigationView navigationView;
    ActionBarDrawerToggle toggle;
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
        Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this));//error handling for unexpected crashes
        NukeSSLCerts.nuke();

        /**
         *  Get the current shopping cart from what is currently being stored in shared
         *  preferences, otherwise it will create a new empty cart. Sets layout depending on if
         *  the cart is empty or not.
         */
        pref = new SharedPreference(this);
        setContentView(R.layout.activity_shopping_cart);

        recyclerView = findViewById(R.id.shopping_cart_list);
        shoppingCart = pref.getShoppingCart();

        /**
         * Ties the side navigation bar xml elements to Java objects and setting listeners for the
         * side navigation drawer as well as the elements within it.
         */
        if(shoppingCart.getCart().size() == 0 || shoppingCart.getCart() == null) {
            recyclerView.setVisibility(View.GONE);
            findViewById(R.id.btn_placeorder).setVisibility(View.GONE);
            findViewById(R.id.btn_cancel).setVisibility(View.GONE);
        }
        else{
            findViewById(R.id.no_items_in_cart).setVisibility(View.GONE);
        }

        drawerLayout = findViewById(R.id.shopping_cart_main);
        toolbar = findViewById(R.id.xml_toolbar);
        navigationView = findViewById(R.id.navigationView);
        toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);

        TextView usernameSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_bar_name);
        usernameSideNavBar.setText(pref.getUser().getUsername());

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);

        try {
            drawerLayout.setBackgroundColor(Color.parseColor(pref.getShoppingCart().getTertiaryColor()));
        }catch(NullPointerException e)
        {
            System.out.print("NullPointerException Caught");
        }


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

        /**
         * Ties the cart xml to a Java object and sets the adapter, which will manage each
         * individual item in the cart.
         */
        adapter = new ShoppingCartAdapter(this,shoppingCart.getCart());
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        Button PlaceOrderButton = findViewById(R.id.btn_placeorder);

        PlaceOrderButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(pref.getShoppingCart().getStartingHour() > Calendar.getInstance(TimeZone.getTimeZone("America/Chicago")).get(Calendar.HOUR) && Calendar.getInstance(TimeZone.getTimeZone("America/Chicago")).get(Calendar.HOUR) < pref.getShoppingCart().getEndingHour()){
                    Toast.makeText(ShoppingCart.this,"The restaurant is currently closed.",Toast.LENGTH_LONG).show();
                }
                else if(pref.getUser().getRestaurantID() != pref.getShoppingCart().getRestaurantID()){
                    goToQRScannerPopup = new Dialog(ShoppingCart.this);
                    goToQRScannerPopup.setContentView(R.layout.confirm_popup);
                    goToQRScannerPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                    goToQRScannerPopup.show();

                    Button confirmYes = goToQRScannerPopup.findViewById(R.id.popup_yes);
                    Button confirmClose = goToQRScannerPopup.findViewById(R.id.confirm_close);

                    TextView dynamicPopupText = goToQRScannerPopup.findViewById(R.id.text_confirm_popup);

                    dynamicPopupText.setText("Restaurant code has not been scanned, go to scanner page?");

                    confirmYes.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            //Clear the order

                            Intent QRcode = new Intent(ShoppingCart.this, QRcode.class);
                            QRcode.putExtra("is from cart activity", true);

                            startActivity(QRcode);
                            goToQRScannerPopup.dismiss();
                        }
                    });

                    confirmClose.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            goToQRScannerPopup.dismiss();
                        }
                    });
                }
                else {
                    confirmPopup = new Dialog(ShoppingCart.this);
                    confirmPopup.setContentView(R.layout.confirm_popup);
                    confirmPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                    confirmPopup.show();
                    Button confirmYes = confirmPopup.findViewById(R.id.popup_yes);
                    Button confirmClose = confirmPopup.findViewById(R.id.confirm_close);

                    TextView dynamicPopupText = confirmPopup.findViewById(R.id.text_confirm_popup);

                    dynamicPopupText.setText("Confirm Order?");

                    confirmYes.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            /** Where the put request starts to get created. */
                            obj = new JSONObject();

                            /** Creates and builds the JSON object that will eventually be sent to the database. */
                            try {
                                JSONObject order = new JSONObject();
                                for (int i = 0; i < shoppingCart.getCart().size(); i++) {
                                    JSONObject item = new JSONObject();

                                    item.put("item", Integer.toString(shoppingCart.getCart().get(i).getItemID()));
                                    item.put("quantity", Integer.toString(shoppingCart.getCart().get(i).getQuantity()));
                                    order.put(Integer.toString(i), item);
                                }

                                obj.put("restaurant_id", Integer.toString(shoppingCart.getRestaurantID()));
                                obj.put("customer_id", pref.getUser().getUsername());
                                obj.put("table_num", 6);
                                obj.put("order", order);
                            } catch (JSONException e) {
                                //TODO figure out how to handle this other than stack trace
                                e.printStackTrace();
                                Toast.makeText(ShoppingCart.this, "Error occured", Toast.LENGTH_LONG).show();
                            }

                            /**
                             * Builds the StringRequest that will be sent to the database. As well as
                             * overriding the onResponse and onErrorResponse for our own use.
                             */
                            putRequest = new StringRequest(Request.Method.PUT, "https://50.19.176.137:8001/orders/place",
                                    new Response.Listener<String>() {
                                        @Override
                                        public void onResponse(String response) {
                                            Toast.makeText(ShoppingCart.this, response, Toast.LENGTH_LONG).show();
                                        }
                                    },
                                    new Response.ErrorListener() {
                                        @Override
                                        public void onErrorResponse(VolleyError error) {
                                            error.printStackTrace();
                                            Toast.makeText(ShoppingCart.this, error.toString(), Toast.LENGTH_LONG).show();
                                        }
                                    }
                            );

                            VolleySingleton.getInstance(ShoppingCart.this).addToRequestQueue(putRequest);

                            Toast.makeText(ShoppingCart.this, "Your order has been placed",Toast.LENGTH_LONG).show();

                            //Clear the order
                            shoppingCart = new ShoppingCartSingleton();
                            findViewById(R.id.shopping_cart_list).setVisibility(View.GONE);
                            findViewById(R.id.btn_placeorder).setVisibility(View.GONE);
                            findViewById(R.id.btn_cancel).setVisibility(View.GONE);
                            findViewById(R.id.no_items_in_cart).setVisibility(View.VISIBLE);
                            confirmPopup.dismiss();
                        }
                    });

                    confirmClose.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            confirmPopup.dismiss();
                        }
                    });
                }
            }
        });

        //Cancel Button: reset cart
        Button ClearCartPopup = findViewById(R.id.btn_cancel);
        ClearCartPopup.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                clearCartPopup = new Dialog(ShoppingCart.this);
                clearCartPopup.setContentView(R.layout.confirm_popup);
                clearCartPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                clearCartPopup.show();
                Button confirmYes = clearCartPopup.findViewById(R.id.popup_yes);
                Button confirmClose = clearCartPopup.findViewById(R.id.confirm_close);

                TextView dynamicPopupText = clearCartPopup.findViewById(R.id.text_confirm_popup);

                dynamicPopupText.setText("Are you sure you want to clear your cart?");

                confirmYes.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        Toast.makeText(ShoppingCart.this, "Cart has been cleared",Toast.LENGTH_LONG).show();
                        //Clear the order
                        shoppingCart = new ShoppingCartSingleton();
                        pref.setShoppingCart(shoppingCart);

                        findViewById(R.id.shopping_cart_list).setVisibility(View.GONE);
                        findViewById(R.id.btn_placeorder).setVisibility(View.GONE);
                        findViewById(R.id.btn_cancel).setVisibility(View.GONE);
                        findViewById(R.id.no_items_in_cart).setVisibility(View.VISIBLE);
                        clearCartPopup.dismiss();
                    }
                });

                confirmClose.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        clearCartPopup.dismiss();
                    }
                });
            }
        });

        try{
        PlaceOrderButton.setBackgroundColor(Color.parseColor(pref.getShoppingCart().getSecondaryColor()));
        ClearCartPopup.setBackgroundColor(Color.parseColor(pref.getShoppingCart().getSecondaryColor()));
        }catch(NullPointerException e)
        {
            System.out.print("NullPointerException Caught");
        }
        /**
         * Ties xml element to a Java object and where to onClick functionality is provided,
         * which allows the order to be placed through a put request
         */

        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_scan:
                                Intent QRcode = new Intent(getBaseContext(), QRcode.class);
                                startActivity(QRcode);
                                return true;
                            case R.id.action_home:
                                Intent home = new Intent(getBaseContext(), Home.class);
                                startActivity(home);
                                return true;
                            case R.id.action_cart:
                                Intent shoppingCart = new Intent(getBaseContext(), ShoppingCart.class);
                                startActivity(shoppingCart);
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
    public boolean onNavigationItemSelected(@NonNull MenuItem nav_item){
        switch(nav_item.getItemId()){
            case R.id.account:
                startActivity(new Intent(ShoppingCart.this, Account.class));
                break;
            case R.id.order_history:
                startActivity(new Intent(ShoppingCart.this, OrderHistory.class));
                break;
            case R.id.current_orders:
                startActivity(new Intent(ShoppingCart.this, CurrentOrders.class));
                break;
            case R.id.settings:
                startActivity(new Intent(ShoppingCart.this, Settings.class));
                break;
            case R.id.log_out:
                pref.changeLogStatus(false);
                pref.logOut();

                startActivity(new Intent(ShoppingCart.this, Login.class));
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
            Intent intent = new Intent(ShoppingCart.this, PasswordChange.class);
            startActivity(intent);
            Toast.makeText(this,"Please Update your Password",Toast.LENGTH_LONG).show();
        }
    }
}