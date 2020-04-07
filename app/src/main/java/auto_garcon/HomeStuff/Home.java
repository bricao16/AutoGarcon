package auto_garcon.HomeStuff;

import android.content.Intent;
import android.graphics.BitmapFactory;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.SearchView;
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
import com.squareup.seismic.ShakeDetector;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;

import auto_garcon.AccountStuff.Account;
import auto_garcon.AccountStuff.Settings;
import auto_garcon.Cart_OrderHistory.OrderHistory;
import auto_garcon.Cart_OrderHistory.ShoppingCart;
import auto_garcon.InitialPages.Login;
import auto_garcon.InitialPages.QRcode;
import auto_garcon.Singleton.SharedPreference;
import auto_garcon.Singleton.VolleySingleton;

public class Home extends AppCompatActivity implements ShakeDetector.Listener, NavigationView.OnNavigationItemSelectedListener {

    private SharedPreference pref;
    RecyclerView recyclerView;
    HomeAdapter adapter;
    private ArrayList<RestaurantItem> items;

    //Here is for Search box
    SearchView searchView;
    ArrayList<String> search_list;
    ArrayAdapter<String> list_adapter;
    //End of Search Box

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);


        // dummy  data for a search box
        search_list = new ArrayList<>();
        search_list.add("French");
        search_list.add("Chinese");
        search_list.add("Italian");
        search_list.add("Nigerian");
        search_list.add("Thai");

        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.home_main);
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
                                Intent QRcode = new Intent(Home.this, QRcode.class);
                                startActivity(QRcode);
                                return true;
                            case R.id.action_home:
                                Intent home = new Intent(Home.this, Home.class);
                                startActivity(home);
                                return true;
                            case R.id.action_cart:
                                Intent shoppingCart = new Intent(Home.this, ShoppingCart.class);
                                startActivity(shoppingCart);
                                return true;
                        }
                        return false;
                    }
                };

        bottomNavigation.setOnNavigationItemSelectedListener(navigationItemSelectedListener);

        pref = new SharedPreference(this);
        Toast.makeText(Home.this, pref.getUserName(), Toast.LENGTH_SHORT).show();

        //shake feature
        SensorManager sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        ShakeDetector shakeDetector = new ShakeDetector(this);
        shakeDetector.start(sensorManager);

        final String url = "http://50.19.176.137:8000/favorites/" + pref.getUserName();

        items = new ArrayList<>();

        JsonObjectRequest getRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {

                            //parsing through json from get request to add them to menu
                            Iterator<String> keys = response.keys();
                            while(keys.hasNext()) {
                                String key = keys.next();

                                if (response.get(key) instanceof JSONObject) {

                                    RestaurantItem itemToBeAdded = new RestaurantItem();
                                    JSONObject item = response.getJSONObject(key.toString());

                                    Iterator<String> inner_keys = item.keys();
                                    while(inner_keys.hasNext()) {
                                        String inner_key = inner_keys.next();

                                        switch(inner_key){
                                            case "restaurant_id":
                                                itemToBeAdded.setID(Integer.parseInt(item.get(inner_key).toString()));
                                                break;
                                            case "restaurant_name":
                                                itemToBeAdded.setName(item.get(inner_key).toString());
                                                break;
                                            case "address":
                                                itemToBeAdded.setAddress(item.get(inner_key).toString());
                                                break;
                                            case "phone_number":
                                                itemToBeAdded.setPhoneNumber(Long.parseLong(item.get(inner_key).toString()));
                                                break;
                                            case "opening_time":
                                                itemToBeAdded.setOpeningTime(Integer.parseInt(item.get(inner_key).toString()));
                                                break;
                                            case "closing_time":
                                                itemToBeAdded.setClosingTime(Integer.parseInt(item.get(inner_key).toString()));
                                                break;
                                            case "logo":
                                                JSONObject obj = item.getJSONObject("logo");
                                                byte[] temp = new byte[obj.getJSONArray("data").length()];

                                                for(int i = 0; i < obj.getJSONArray("data").length(); i++) {
                                                    temp[i] = (byte) (((int) obj.getJSONArray("data").get(i)) & 0xFF);
                                                }

                                                itemToBeAdded.setImageBitmap(BitmapFactory.decodeByteArray(temp, 0, temp.length));
                                                break;
                                        }
                                    }

                                    items.add(itemToBeAdded);
                                }
                            }

                            recyclerView = findViewById(R.id.favorites_list);
                            recyclerView.setLayoutManager(new LinearLayoutManager((Home.this)));
                            adapter = new HomeAdapter(Home.this, items);
                            recyclerView.setAdapter(adapter);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(Home.this,error.toString(),Toast.LENGTH_LONG).show();
                    }
                }

        );

        VolleySingleton.getInstance(Home.this).addToRequestQueue(getRequest);

        //Here is for Search box
        searchView = (SearchView) findViewById(R.id.searchView);
        list_adapter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1,search_list);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {

                //here we search restaurant by name, type of cuisine, etc...
                //and possibly re:render the table.
                if( search_list.contains(query) ){
                    list_adapter.getFilter().filter(query);
                    Toast.makeText(Home.this, "Yes Match found",Toast.LENGTH_LONG).show();
                }
                else {
                    Toast.makeText(Home.this, "No Match found",Toast.LENGTH_LONG).show();
                }
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                //    adapter.getFilter().filter(newText);
                return false;
            }
        });
        //Here is for End Search box
    }

    @Override
    public void hearShake(){
        Toast.makeText(this, "HI", Toast.LENGTH_SHORT).show();
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