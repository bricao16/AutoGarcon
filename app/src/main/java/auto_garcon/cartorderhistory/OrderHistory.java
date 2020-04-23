package auto_garcon.cartorderhistory;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;
import com.google.gson.JsonObject;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import auto_garcon.accountstuff.*;
import auto_garcon.homestuff.*;
import auto_garcon.accountstuff.Settings;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.initialpages.TwoButtonPage;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.UserSingleton;
import auto_garcon.singleton.VolleySingleton;

/**
 * This class pulls data from the database relating to the user's past orders
 * The class is tied to the order history xml and uses nav bars to navigate other xml's
 * This class main function is to allow the user to view previous orders  and also click on the previous orders if they want to order again
 */
public class OrderHistory extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private SharedPreference pref;// This

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        pref = new SharedPreference(this);
        setContentView(R.layout.activity_order_history);

        String temp;
        final String url = "http://50.19.176.137:8000/customer/history/" + pref.getUser().getUsername();
        JSONObject obj = new JSONObject();//json object that will be sent as the request parameter
        final StringRequest getRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {

                    if(response.equals("No order history for this customer")){
                        setContentView(R.layout.emptyorders);
                    }
                    else {
                        setContentView(R.layout.activity_order_history);
                    }
                    Toast.makeText(OrderHistory.this,response+"hmmmm",Toast.LENGTH_LONG).show();

                    //creating side nav drawer
                    DrawerLayout drawerLayout = findViewById(R.id.order_history_main);// associating xml objects with the java Object equivalent
                    Toolbar toolbar = findViewById(R.id.xml_toolbar);// associating xml objects with the java Object equivalent
                    NavigationView navigationView = findViewById(R.id.navigationView);// associating xml objects with the java Object equivalent
                    ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(OrderHistory.this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);

                    drawerLayout.addDrawerListener(toggle);
                    toggle.syncState();
                    navigationView.setNavigationItemSelectedListener(OrderHistory.this);

                    BottomNavigationView bottomNavigation = findViewById(R.id.bottom_navigation);// associating xml objects with the java Object equivalent

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
            },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(OrderHistory.this,error.getMessage()+"hmmmm",Toast.LENGTH_LONG).show();
                    }
                }

        );
        VolleySingleton.getInstance(OrderHistory.this).addToRequestQueue(getRequest);// sending the request to the database


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
