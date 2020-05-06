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
import android.widget.TextView;
import android.widget.Toast;

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

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import auto_garcon.accountstuff.Account;
import auto_garcon.accountstuff.Settings;
import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.UserSingleton;
import auto_garcon.singleton.VolleySingleton;

public class CurrentOrders extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private SharedPreference pref;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_current_orders);

        pref = new SharedPreference(CurrentOrders.this);
        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.current_orders_main);// associating xml objects with the java Object equivalent
        Toolbar toolbar = findViewById(R.id.xml_toolbar);// associating xml objects with the java Object equivalent
        NavigationView navigationView = findViewById(R.id.navigationView);// associating xml objects with the java Object equivalent
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(CurrentOrders.this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);
        BottomNavigationView bottomNavigation = findViewById(R.id.bottom_navigation);

        TextView usernameSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_bar_name);
        usernameSideNavBar.setText(pref.getUser().getUsername());
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

        StringRequest getRequest = new StringRequest(Request.Method.GET, "http://50.19.176.137:8000/customer/inprogress/" + pref.getUser().getUsername(),
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response) {
                        // response
                        try {
                            JSONObject orderJSONObject = new JSONObject(response);

                            Iterator<String> keys = orderJSONObject.keys();
                            while(keys.hasNext()) {
                                String key = keys.next();

                                if (orderJSONObject.get(key) instanceof JSONObject) {
                                    auto_garcon.menustuff.MenuItem itemToBeAdded = new auto_garcon.menustuff.MenuItem();
                                    JSONObject menuItemCategories = orderJSONObject.getJSONObject(key);

                                    menuItemCategories.getInt("order_num");
                                    menuItemCategories.getInt("restaurant_id");
                                    menuItemCategories.getInt("item_id");
                                    menuItemCategories.getString("item_name");
                                    menuItemCategories.getDouble("price");
                                    menuItemCategories.getInt("quantity");
                                    menuItemCategories.getString("order_date");
                                    //menuItemCategories.getString("table_num");
                                }
                            }
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

    //onClick for side nav bar
    @Override
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
}
