package auto_garcon.cartorderhistory;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
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
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import auto_garcon.accountstuff.Account;
import auto_garcon.accountstuff.Settings;
import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.initialpages.Register;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;
import auto_garcon.singleton.UserSingleton;
import auto_garcon.singleton.VolleySingleton;

/*
This generates a list of restaurants, and
dealing with the user actions in the activity_shopping_cart layout.
 */
public class ShoppingCart extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {
    //data fields
    private JSONObject obj;
    private SharedPreference pref;//saving user transaction data such as food item chosen by the user.
    private ShoppingCartSingleton shoppingCart;//keeping food item chosen by the user.
    private RecyclerView recyclerView;//generating a list of restaurants
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_shopping_cart);
        //set recyclerView on the list
        recyclerView = findViewById(R.id.list);
        //create a file to keep track of the data
        pref = new SharedPreference(this);
        //if it's not created yet
        if(pref.getShoppingCart() == null ){
            shoppingCart = new ShoppingCartSingleton();
            pref.setShoppingCart(shoppingCart);
        }
        else{
            shoppingCart = pref.getShoppingCart();
        }
        //create an adapter to deal with user interactions, and set it on the recyclerView.
        ShoppingCartAdapter adapter = new ShoppingCartAdapter(this,shoppingCart.getCart());
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.shopping_cart_main);
        Toolbar toolbar = findViewById(R.id.xml_toolbar);
        NavigationView navigationView = findViewById(R.id.navigationView);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);
        //create drawer listener for toolbar
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);
        //create and set a confirm button for order
        Button PlaceOrderButton = findViewById(R.id.btn_placeorder);

        PlaceOrderButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //put request for registering
                String url = "http://50.19.176.137:8000/orders/place";
                obj = new JSONObject();//json object that will be sent as the request parameter

                try {
                    JSONObject order = new JSONObject();//json object that will be sent as the request parameter


                        for (int i = 0; i < shoppingCart.getCart().size(); i++) {
                            JSONObject item = new JSONObject();//json object that will be sent as the request parameter

                            item.put("item", Integer.toString(shoppingCart.getCart().get(i).getItemID()));
                            item.put("quantity", Integer.toString(shoppingCart.getCart().get(i).getQuantity()));
                            order.put(Integer.toString(i), item);
                        }



                    obj.put("restaurant_id", Integer.toString(shoppingCart.getRestaurantID()));
                    obj.put("customer_id", pref.getUser().getUsername());
                    obj.put("table_num", Integer.toString(6));
                    obj.put("order", order);
                }catch (JSONException e){
                    //TODO figure out how to handle this other than stack trace
                    e.printStackTrace();
                }

                StringRequest putRequest = new StringRequest(Request.Method.PUT, url,
                        new Response.Listener<String>()
                        {
                            @Override
                            public void onResponse(String response) {
                                // response
                                Toast.makeText(ShoppingCart.this,response,Toast.LENGTH_LONG).show();
                            }
                        },
                        new Response.ErrorListener() {
                            @Override
                            public void onErrorResponse(VolleyError error) {
                                // error if the request fails
                                error.printStackTrace();
                                Toast.makeText(ShoppingCart.this,error.toString(),Toast.LENGTH_LONG).show();
                            }
                        }
                ) {
                    @Override
                    public byte[] getBody() throws AuthFailureError {
                        return obj.toString().getBytes();
                    }

                    @Override
                    public String getBodyContentType() {
                        return "application/json";
                    }
                };

                VolleySingleton.getInstance(ShoppingCart.this).addToRequestQueue(putRequest);// making the actual request
            }
        });

        BottomNavigationView bottomNavigation = findViewById(R.id.bottom_navigation);
        //toolbar
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

        pref = new SharedPreference(this);
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