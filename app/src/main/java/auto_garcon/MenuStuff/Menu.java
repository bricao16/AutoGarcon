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
import android.widget.ExpandableListAdapter;
import android.widget.ExpandableListView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.auto_garcon.R;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import auto_garcon.AccountStuff.Account;
import auto_garcon.AccountStuff.Settings;
import auto_garcon.HomeStuff.Home;
import auto_garcon.InitialPages.Login;
import auto_garcon.Cart_OrderHistory.ShoppingCart;
import auto_garcon.InitialPages.QRcode;
import auto_garcon.Singleton.SharedPreference;
import auto_garcon.Singleton.VolleySingleton;

public class Menu extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private SharedPreference pref;

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

        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.restaurant_main);
        Toolbar toolbar = findViewById(R.id.xml_toolbar);
        NavigationView navigationView = findViewById(R.id.navigationView);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);

        BottomNavigationView bottomNavigation = findViewById(R.id.bottom_navigation);

        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_scan:
                                Intent home = new Intent(getBaseContext(),   QRcode.class);
                                startActivity(home);
                                return true;
                            case R.id.action_home:
                                Intent qrcode = new Intent(getBaseContext(),   Home.class);
                                startActivity(qrcode);
                                return true;
                            case R.id.action_cart:
                                Intent shoppingCart = new Intent(getBaseContext(),   ShoppingCart.class);
                                startActivity(shoppingCart);
                                return true;
                        }
                        return false;
                    }
                };

        bottomNavigation.setOnNavigationItemSelectedListener(navigationItemSelectedListener);

        pref = new SharedPreference(this);

        listDataHeader = new ArrayList<>();
        listHash = new HashMap<>();

        final String url = "http://50.19.176.137:8000/menu/" + getIntent().getIntExtra("restaurant id", 0);

        JsonObjectRequest getRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {

                            listAdapter = new ExpandableMenuAdapater(Menu.this, listDataHeader, listHash);
                            listView = findViewById(R.id.menu_list);
                            listView.setAdapter(listAdapter);
                            String whereToSendItem = "";

                            //parsing through json from get request to add them to menu
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
                                            case "restaurant":
                                                itemToBeAdded.setRestaurantID(Integer.parseInt(item.get(inner_key).toString()));
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

    //onClick for side nav bar
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

                pref.changeLogStatus(false);
                pref.logOut();

                Intent login = new Intent(getBaseContext(),   Login.class);
                startActivity(login);
                break;
        }
        return false;
    }

    //this will filter the json object from get request and place items in correct category
    private void addToList(auto_garcon.MenuStuff.MenuItem key, String category) {
        if(!listDataHeader.contains(category)) {
            listDataHeader.add(category);

            switch(category){
                case "Appetizer":
                    appetizer_list = new ArrayList<>();
                    listHash.put(listDataHeader.get(listDataHeader.size() - 1), appetizer_list);
                    break;
                case "Entree":
                    entree_list = new ArrayList<>();
                    listHash.put(listDataHeader.get(listDataHeader.size() - 1), entree_list);
                    break;
                case "Dessert":
                    dessert_list = new ArrayList<>();
                    listHash.put(listDataHeader.get(listDataHeader.size() - 1), dessert_list);
                    break;
                case "Refillable Drink":
                    drink_list = new ArrayList<>();
                    listHash.put(listDataHeader.get(listDataHeader.size() - 1), drink_list);
                    break;
                case "Alcohol":
                    alcohol_list = new ArrayList<>();
                    listHash.put(listDataHeader.get(listDataHeader.size() - 1), alcohol_list);
                    break;
            }

        }

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