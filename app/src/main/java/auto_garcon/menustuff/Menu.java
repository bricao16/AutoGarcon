package auto_garcon.menustuff;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;

import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ExpandableListAdapter;
import android.widget.ExpandableListView;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import auto_garcon.accountstuff.*;
import auto_garcon.accountstuff.Settings;
import auto_garcon.cartorderhistory.OrderHistory;
import auto_garcon.homestuff.*;
import auto_garcon.initialpages.Login;
import auto_garcon.cartorderhistory.ShoppingCart;
import auto_garcon.initialpages.QRcode;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;
import auto_garcon.singleton.VolleySingleton;
/**
 * Class setting up the menu
 * Also sets up favorites
 */
public class Menu extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private SharedPreference pref;
    private ExpandableListView listView;
    private ExpandableListAdapter listAdapter;
    private List<String> listDataHeader;
    private List<auto_garcon.menustuff.MenuItem> appetizer_list;
    private List<auto_garcon.menustuff.MenuItem> entree_list;
    private List<auto_garcon.menustuff.MenuItem> dessert_list;
    private List<auto_garcon.menustuff.MenuItem> drink_list;
    private List<auto_garcon.menustuff.MenuItem> alcohol_list;
    private HashMap<String, List<auto_garcon.menustuff.MenuItem>> listHash;
    private JSONObject obj;
    private TextView restaurantName;
    private ImageView restaurantLogo;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);

        pref = new SharedPreference(this);

        /**
         * Ties the side navigation bar xml elements to Java objects and setting listeners for the
         * side navigation drawer as well as the elements within it.
         */
        final DrawerLayout drawerLayout = findViewById(R.id.restaurant_main);// associating xml objects with the java Object equivalent
        Toolbar toolbar = findViewById(R.id.xml_toolbar);// associating xml objects with the java Object equivalent
        NavigationView navigationView = findViewById(R.id.navigationView);// associating xml objects with the java Object equivalent
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);

        restaurantLogo = findViewById(R.id.restaurant_logo);
        restaurantName = findViewById(R.id.restaurant_name);
        listDataHeader = new ArrayList<>();
        listHash = new HashMap<>();

        boolean inFavorites = false;
        Button addOrRemoveFavorite = findViewById(R.id.add_restaurant);

        if(pref.getFavorites().contains(getIntent().getIntExtra("restaurant id", 0))) {
            inFavorites = true;
        }

        if(inFavorites) {
            addOrRemoveFavorite.setText("Remove from favorites");
            pref.removeFromFavorites(getIntent().getIntExtra("restaurant id", 0));

            addOrRemoveFavorite.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    String removeFavoriteURL = "http://50.19.176.137:8000/favorites/delete";

                    obj = new JSONObject();//json object that will be sent as the request parameter

                    try {
                        obj.put("customer_id", pref.getUser().getUsername());
                        obj.put("restaurant_id", getIntent().getIntExtra("restaurant id", 0));
                    }
                    catch (JSONException e) {
                        //TODO figure out how to handle this other than stack trace
                        e.printStackTrace();
                    }

                    StringRequest deleteRequest = new StringRequest(Request.Method.POST, removeFavoriteURL,
                            new Response.Listener<String>() {
                                @Override
                                public void onResponse(String response) {
                                    Toast.makeText(Menu.this, response, Toast.LENGTH_LONG).show();
                                    finish();
                                    startActivity(getIntent());
                                }
                            },
                            new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    error.printStackTrace();
                                    Toast.makeText(Menu.this, error.toString(), Toast.LENGTH_LONG).show();
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

                        @Override
                        public Map<String, String> getHeaders() throws AuthFailureError {
                            HashMap<String,String> headers = new HashMap<String,String>();
                            headers.put("Authorization", "Bearer " + pref.getAuth());
                            return headers;
                        }
                    };

                    VolleySingleton.getInstance(Menu.this).addToRequestQueue(deleteRequest);// making the actual request
                }
            });
        }
        else {
            addOrRemoveFavorite.setText("Add to favorites");
            pref.addToFavorites(getIntent().getIntExtra("restaurant id", 0));

            addOrRemoveFavorite.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    String addFavoriteURL = "http://50.19.176.137:8000/favorites/add";

                    obj = new JSONObject();//json object that will be sent as the request parameter

                    try {
                        obj.put("customer_id", pref.getUser().getUsername());
                        obj.put("restaurant_id", getIntent().getIntExtra("restaurant id", 0));
                    }catch (JSONException e){
                        //TODO figure out how to handle this other than stack trace
                        e.printStackTrace();
                    }

                    StringRequest putRequest = new StringRequest(Request.Method.PUT, addFavoriteURL,
                            new Response.Listener<String>()
                            {
                                @Override
                                public void onResponse(String response) {
                                    // response
                                    Toast.makeText(Menu.this,response,Toast.LENGTH_LONG).show();
                                    finish();
                                    startActivity(getIntent());
                                }
                            },
                            new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    // error if the request fails
                                    error.printStackTrace();
                                    Toast.makeText(Menu.this,error.toString(),Toast.LENGTH_LONG).show();
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

                    VolleySingleton.getInstance(Menu.this).addToRequestQueue(putRequest);// making the actual request
                }
            });
        }

        final String url = "http://50.19.176.137:8000/restaurant/" + getIntent().getIntExtra("restaurant id", 0);

        JsonObjectRequest getRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            listAdapter = new ExpandableMenuAdapater(Menu.this, listDataHeader, listHash);
                            listView = findViewById(R.id.menu_list);
                            listView.setAdapter(listAdapter);
                            String whereToSendItem = "";
                            String font;
                            String primaryColor;
                            String secondaryColor;
                            String tertiaryColor;
                            ShoppingCartSingleton toAddFontsAndColors = pref.getShoppingCart();

                            //parsing through json from get request to add them to menu
                            JSONObject restaurant = response.getJSONObject("restaurant");
                            restaurantName.setText(restaurant.getString("name"));

                            restaurant.getString("address");
                            restaurant.getInt("phone_number");
                            restaurant.getInt("opening");
                            restaurant.getInt("closing");
                            font = restaurant.getString("font");
                            primaryColor = restaurant.getString("primary_color");
                            secondaryColor = restaurant.getString("secondary_color");
                            tertiaryColor = restaurant.getString("tertiary_color");

                            toAddFontsAndColors.setFont(font);
                            toAddFontsAndColors.setPrimaryColor(primaryColor);
                            toAddFontsAndColors.setSecondaryColor(secondaryColor);
                            toAddFontsAndColors.setTertiaryColor(tertiaryColor);

                            pref.setShoppingCart(toAddFontsAndColors);

                            drawerLayout.setBackgroundColor(Color.parseColor(primaryColor));

                            byte[] temp = new byte[restaurant.getJSONObject("logo").getJSONArray("data").length()];

                            for(int i = 0; i < restaurant.getJSONObject("logo").getJSONArray("data").length(); i++) {
                                temp[i] = (byte) (((int) restaurant.getJSONObject("logo").getJSONArray("data").get(i)) & 0xFF);
                            }

                            restaurantLogo.setImageBitmap(BitmapFactory.decodeByteArray(temp, 0, temp.length));

                            JSONObject menu = response.getJSONObject("menu");

                            Iterator<String> keys = menu.keys();
                            while(keys.hasNext()) {
                                String key = keys.next();
                                if (menu.get(key) instanceof JSONObject) {

                                    auto_garcon.menustuff.MenuItem itemToBeAdded = new auto_garcon.menustuff.MenuItem();
                                    JSONObject item = menu.getJSONObject(key.toString());

                                    Iterator<String> inner_keys = item.keys();
                                    while(inner_keys.hasNext()) {
                                        String inner_key = inner_keys.next();

                                        itemToBeAdded.setRestaurantID(getIntent().getIntExtra("restaurant id", 0));

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

                                            case "item_id":
                                                itemToBeAdded.setItemID(Integer.parseInt(item.get(inner_key).toString()));
                                                break;
                                        }
                                    }
                                    //if conditional filters out erroneous categories
                                    if(whereToSendItem.equals("Alcohol") || whereToSendItem.equals("Refillable Drink") || whereToSendItem.equals("Dessert") || whereToSendItem.equals("Entree") || whereToSendItem.equals("Appetizer")){
                                    itemToBeAdded.setNameOfItem(key);
                                    addToList(itemToBeAdded, whereToSendItem);}
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
    }

    /**
     * This method is what provides the side navigation bar with its onClick functionality to
     * other activities.
     */
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

    /**
     * The method is what filters the restaurant items that are displayed on the menu. If the
     * current menu does not have a category for the item being added it will add that category.
     * It then adds the actual item to the category it belongs in.
     * */
    private void addToList(auto_garcon.menustuff.MenuItem key, String category) {
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
                default:
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
            default:
                break;
        }
    }
}