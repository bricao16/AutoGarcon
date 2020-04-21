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

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.auto_garcon.R;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;
import com.google.gson.JsonObject;

import org.json.JSONArray;
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
import auto_garcon.singleton.UserSingleton;
import auto_garcon.singleton.VolleySingleton;

public class ShoppingCart extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private SharedPreference pref;
    private ShoppingCartSingleton shoppingCart;
    private RecyclerView recyclerView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_shopping_cart);

        recyclerView = findViewById(R.id.list);
        pref = new SharedPreference(this);

        if(pref.getShoppingCart() == null ){
            shoppingCart = new ShoppingCartSingleton();
            pref.setShoppingCart(shoppingCart);
        }
        else{
            shoppingCart = pref.getShoppingCart();
        }
        ShoppingCartAdapter adapter = new ShoppingCartAdapter(this,shoppingCart.getCart());
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.shopping_cart_main);
        Toolbar toolbar = findViewById(R.id.xml_toolbar);
        NavigationView navigationView = findViewById(R.id.navigationView);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);

        Button PlaceOrderButton = findViewById(R.id.btn_placeorder);

        PlaceOrderButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String url = "http://50.19.176.137:8000/orders/place";
                final JSONObject order = new JSONObject();//JSON object that will be sent as the request parameter

                try{
                    JSONObject order_format = new JSONObject();//JSON object that will be sent as the request parameter

                    for(int i = 0; i < shoppingCart.getCart().size(); i++) {
                        JSONObject item = new JSONObject();//JSON object of a menu item that will be inside of the order JSON
                        JSONObject number = new JSONObject();

                        item.put("item", shoppingCart.getCart().get(i).getItemID());
                        item.put("quantity", shoppingCart.getCart().get(i).getQuantity());

                        number.put(Integer.toString(i), item);
                        Log.d("SDFSDFSD", number.toString());

                        order_format.put("order", number);
                    }

                    Log.d("SDFSDFSD", order_format.toString());

                    order.put("restaurant_id", shoppingCart.getRestaurantID());
                    order.put("customer_id", pref.getUser().getUsername());
                   // order.put("table_num", );
                    order.put("order", order_format);
                }catch (JSONException e){
                    //TODO figure out how to handle this other than stack trace
                    e.printStackTrace();
                }

                JsonObjectRequest postRequest = new JsonObjectRequest(Request.Method.POST, url, order,
                        new Response.Listener<JSONObject>()
                        {
                            @Override
                            public void onResponse(JSONObject response) {
                                // response
                                Toast.makeText(ShoppingCart.this,response.toString(),Toast.LENGTH_LONG).show();
                                finish();
                            }
                        },
                        new Response.ErrorListener() {
                            @Override
                            public void onErrorResponse(VolleyError error) {
                                // error if the request fails
                                error.printStackTrace();
                                //Toast.makeText(ShoppingCart.this,order.toString(),Toast.LENGTH_LONG).show();

                                // Toast.makeText(ShoppingCart.this,error.toString(),Toast.LENGTH_LONG).show();
                            }
                        }
                );

                VolleySingleton.getInstance(ShoppingCart.this).addToRequestQueue(postRequest);// making the actual request
            }
        });

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