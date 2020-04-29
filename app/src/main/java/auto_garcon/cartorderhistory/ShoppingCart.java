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

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

import org.json.JSONException;
import org.json.JSONObject;

import auto_garcon.accountstuff.Account;

import auto_garcon.accountstuff.Settings;
import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.initialpages.TwoButtonPage;
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
    private Dialog clearCartPopup;
    /**
     * This method ties the xml elements to Java objects and sets onClick listeners for side
     * side navigation bar elements and the place order button which will send the put request
     * to the database.
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        /**
         *  Get the current shopping cart from what is currently being stored in shared
         *  preferences, otherwise it will create a new empty cart. Sets layout depending on if
         *  the cart is empty or not.
         */
        pref = new SharedPreference(this);

        if(pref.getShoppingCart().getCart().size() == 0) {
            setContentView(R.layout.empty_shopping_cart);
            shoppingCart = pref.getShoppingCart();
        }
        else if(pref.getShoppingCart() == null){
            shoppingCart = new ShoppingCartSingleton();
            setContentView(R.layout.empty_shopping_cart);
            pref.setShoppingCart(shoppingCart);
        }
        else {
            setContentView(R.layout.activity_shopping_cart);
            shoppingCart = pref.getShoppingCart();

            /**
             * Ties the cart xml to a Java object and sets the adapter, which will manage each
             * individual item in the cart.
             */
            recyclerView = findViewById(R.id.list);
            adapter = new ShoppingCartAdapter(this,shoppingCart.getCart());
            recyclerView.setAdapter(adapter);
            recyclerView.setLayoutManager(new LinearLayoutManager(this));

            Button PlaceOrderButton = findViewById(R.id.btn_placeorder);
            putRequest = null;
            PlaceOrderButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    /** Where the put request starts to get created. */
                    String url = "http://50.19.176.137:8000/orders/place";
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
                    }

                    /**
                     * Builds the StringRequest that will be sent to the database. As well as
                     * overriding the onResponse and onErrorResponse for our own use.
                     */
                    putRequest = new StringRequest(Request.Method.PUT, url,
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
                    ) {
                        /**
                         * How the JSON object we created earlier gets passed to the server.
                         */
                        @Override
                        public byte[] getBody() throws AuthFailureError {
                            return obj.toString().getBytes();
                        }

                        /**
                         * Specifying that we will be passing a JSON object.
                         */
                        @Override
                        public String getBodyContentType() {
                            return "application/json";
                        }
                    };

                    confirmPopup = new Dialog(ShoppingCart.this);
                    confirmPopup.setContentView(R.layout.confirm2_popup);
                    confirmPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                    confirmPopup.show();
                    Button confirmYes = confirmPopup.findViewById(R.id.confirm_yes);
                    Button confirmNo = confirmPopup.findViewById(R.id.confirm_not);

                    confirmYes.setOnClickListener(new View.OnClickListener() {
                        public void onClick(View v) {
                            Toast.makeText(ShoppingCart.this, "Yes Confirmed",Toast.LENGTH_LONG).show();

                            /** Sending the actual putRequest. */
                            VolleySingleton.getInstance(ShoppingCart.this).addToRequestQueue(putRequest);

                            //Clear the order
                            shoppingCart = new ShoppingCartSingleton();
                            pref.setShoppingCart(shoppingCart);
                            startActivity(new Intent(ShoppingCart.this, ShoppingCart.class));

                            confirmPopup.dismiss();
                        }
                    });

                    confirmNo.setOnClickListener(new View.OnClickListener() {
                        public void onClick(View v) {
                            Toast.makeText(ShoppingCart.this, "Not Confirmed yet",Toast.LENGTH_LONG).show();
                            confirmPopup.dismiss();
                        }
                    });
                }
            });

            //Cancel Button: reset cart
            Button ClearCartPopup = findViewById(R.id.btn_cancel);
            ClearCartPopup.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    clearCartPopup = new Dialog(ShoppingCart.this);
                    clearCartPopup.setContentView(R.layout.clear_cart_popup);
                    clearCartPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                    clearCartPopup.show();
                    Button confirmYes = clearCartPopup.findViewById(R.id.confirm_yes);
                    Button confirmNo = clearCartPopup.findViewById(R.id.confirm_no);

                    confirmYes.setOnClickListener(new View.OnClickListener() {
                        public void onClick(View v) {
                            Toast.makeText(ShoppingCart.this, "Yes Confirmed",Toast.LENGTH_LONG).show();
                            //Clear the order
                            shoppingCart = new ShoppingCartSingleton();
                            pref.setShoppingCart(shoppingCart);

                            startActivity(new Intent(ShoppingCart.this, ShoppingCart.class));

                            clearCartPopup.dismiss();
                        }
                    });

                    confirmNo.setOnClickListener(new View.OnClickListener() {
                        public void onClick(View v) {
                            Toast.makeText(ShoppingCart.this, "Not Confirmed yet",Toast.LENGTH_LONG).show();
                            clearCartPopup.dismiss();
                        }
                    });
                }
            });
        }

        /**
         * Ties the side navigation bar xml elements to Java objects and setting listeners for the
         * side navigation drawer as well as the elements within it.
         */
        DrawerLayout drawerLayout = findViewById(R.id.shopping_cart_main);
        Toolbar toolbar = findViewById(R.id.xml_toolbar);
        NavigationView navigationView = findViewById(R.id.navigationView);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);

        drawerLayout.setBackgroundColor(Color.parseColor(pref.getShoppingCart().getTertiaryColor()));


        /**
         * Ties xml element to a Java object and where to onClick functionality is provided,
         * which allows the order to be placed through a put request
         */


        /**
         * It ties the bottom navigation bar xml element to a Java object and provides it with its
         * onClick functionality to other activities and sets the listener.
         */
        BottomNavigationView bottomNavigation = findViewById(R.id.bottom_navigation);
        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_scan:
                                Intent QRcode = new Intent(getBaseContext(), QRcode.class);
                                startActivity(QRcode);
                                return true;
                            case R.id.action_home:
                                Intent home = new Intent(getBaseContext(),Home.class);
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
     * This method is what provides the side navigation bar with its onClick functionality to
     * other activities.
     */
    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem nav_item){
        switch(nav_item.getItemId()){
            case R.id.account://switch to account page
                Intent account = new Intent(getBaseContext(),   Account.class);
                startActivity(account);
                break;
            case R.id.order_history://switch to order history
                Intent orderHistory = new Intent(getBaseContext(),   OrderHistory.class);
                startActivity(orderHistory);
                break;
            case R.id.settings://switch to settings page
                Intent settings = new Intent(getBaseContext(),   Settings.class);
                startActivity(settings);
                break;
            case R.id.log_out://logs user out
                pref.changeLogStatus(false);
                pref.logOut();

                Intent login = new Intent(getBaseContext(),   Login.class);
                startActivity(login);
                break;
        }
        return false;
    }
}