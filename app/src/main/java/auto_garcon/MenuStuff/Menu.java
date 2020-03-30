package auto_garcon.MenuStuff;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ExpandableListAdapter;
import android.widget.ExpandableListView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.auto_garcon.R;
import com.google.android.material.navigation.NavigationView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import auto_garcon.AccountStuff.Account;
import auto_garcon.AccountStuff.Settings;
import auto_garcon.InitialPages.Home;
import auto_garcon.InitialPages.Login;
import auto_garcon.Cart_OrderHistory.OrderHistory;
import auto_garcon.Cart_OrderHistory.ShoppingCart;
import auto_garcon.Singleton.VolleySingleton;

public class Menu extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private ExpandableListView listView;
    private ExpandableListAdapter listAdapter;
    private List<String> listDataHeader;
    private List<auto_garcon.MenuStuff.MenuItem> appetizer_list;
    private List<auto_garcon.MenuStuff.MenuItem> entree_list;
    private List<auto_garcon.MenuStuff.MenuItem> dessert_list;
    private List<auto_garcon.MenuStuff.MenuItem> drink_list;
    private List<auto_garcon.MenuStuff.MenuItem> alcohol_list;
    private HashMap<String, List<auto_garcon.MenuStuff.MenuItem>> listHash;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_restaurant_page);

        DrawerLayout drawerLayout = findViewById(R.id.restaurant_main);
        Toolbar toolbar = findViewById(R.id.xml_toolbar);
        NavigationView navigationView = findViewById(R.id.navigationView);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);

        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle(null);
        getSupportActionBar().setDisplayHomeAsUpEnabled(false);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);

        //creating list
        appetizer_list = new ArrayList<>();
        entree_list = new ArrayList<>();
        dessert_list = new ArrayList<>();

        drink_list = new ArrayList<>();
        alcohol_list = new ArrayList<>();

        final String url = "http://50.19.176.137:8000/menu/123";

        JsonObjectRequest getRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {

                            initData();
                            listAdapter = new ExpandableMenuAdapater(Menu.this, listDataHeader, listHash);
                            listView = findViewById(R.id.menu_list);
                            listView.setAdapter(listAdapter);
                            String whereToSendItem = "";

                            Iterator<String> keys = response.keys();
                            while(keys.hasNext()) {
                                String key = keys.next();
                                if (response.get(key) instanceof JSONObject) {

                                    auto_garcon.MenuStuff.MenuItem itemToBeAdded = new auto_garcon.MenuStuff.MenuItem();
                                    JSONObject item = response.getJSONObject(key.toString());

                                    Iterator<String> inner_keys = item.keys();
                                    while(inner_keys.hasNext()) {
                                        String inner_key = inner_keys.next();

                                        switch(inner_key){
                                            case "restaurant":
                                                itemToBeAdded.setRestaurantID(Integer.parseInt(item.get(inner_key).toString()));
                                                break;
                                            case "calories":
                                                itemToBeAdded.setCalories(Integer.parseInt(item.get(inner_key).toString()));
                                                break;
                                            case "price":
                                                itemToBeAdded.setPrice(Double.parseDouble(item.get(inner_key).toString()));
                                                break;
                                            case "category":
                                                itemToBeAdded.setCategory(item.get(inner_key).toString());
                                                whereToSendItem = item.get(inner_key).toString();
                                                break;
                                            case "in_stock":
                                                itemToBeAdded.setAmountInStock(Integer.parseInt(item.get(inner_key).toString()));
                                                break;
                                        }
                                    }

                                    itemToBeAdded.setNameOfItem(key);
                                    addToList(itemToBeAdded, whereToSendItem);
                                }
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(Menu.this,error.toString(),Toast.LENGTH_LONG).show();
                    }
                }
        );

        VolleySingleton.getInstance(Menu.this).addToRequestQueue(getRequest);
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem nav_item){
        switch(nav_item.getItemId()){
            case R.id.account:
                Toast.makeText(Menu.this, "Account Selected", Toast.LENGTH_SHORT).show();
                Intent account = new Intent(getBaseContext(),   Account.class);
                startActivity(account);
                break;
            case R.id.settings:
                Toast.makeText(Menu.this, "Settings Selected", Toast.LENGTH_SHORT).show();
                Intent settings = new Intent(getBaseContext(),   Settings.class);
                startActivity(settings);
                break;
            case R.id.log_out:
                Toast.makeText(Menu.this, "Log Out Selected", Toast.LENGTH_SHORT).show();
                Intent login = new Intent(getBaseContext(),   Login.class);
                startActivity(login);
                break;
        }
        return false;
    }

    public void goHome(View view){
        Intent home = new Intent(getBaseContext(),   Home.class);
        startActivity(home);
    }

    public void goOrderHistory(View view){
        Intent order_history = new Intent(getBaseContext(),   OrderHistory.class);
        startActivity(order_history);
    }

    public void goShoppingCart(View view){
        Intent shopping_cart = new Intent(getBaseContext(),   ShoppingCart.class);
        startActivity(shopping_cart);
    }

    private void initData() {
        listDataHeader = new ArrayList<>();
        listHash = new HashMap<>();

        listDataHeader.add("Appetizer");
        listDataHeader.add("Entrees");
        listDataHeader.add("Dessert");
        listDataHeader.add("Refillable Drink");
        listDataHeader.add("Alcohol");

        listHash.put(listDataHeader.get(0), appetizer_list);
        listHash.put(listDataHeader.get(1), entree_list);
        listHash.put(listDataHeader.get(2), dessert_list);
        listHash.put(listDataHeader.get(3), drink_list);
        listHash.put(listDataHeader.get(4), alcohol_list);
    }

    private void addToList(auto_garcon.MenuStuff.MenuItem key, String category) {
        switch(category){
            case "Appetizer":
                appetizer_list.add(key);
                break;
            case "Entree":
                entree_list.add(key);
                break;
            case "Dessert":
                dessert_list.add(key);
                break;
            case "Refillable Drink":
                drink_list.add(key);
                break;
            case "Alcohol":
                alcohol_list.add(key);
                break;
        }
    }
}