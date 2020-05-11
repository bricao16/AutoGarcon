package auto_garcon.menustuff;

import android.app.Dialog;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
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

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;

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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import auto_garcon.ExcpetionHandler;
import auto_garcon.accountstuff.Account;
import auto_garcon.accountstuff.Settings;
import auto_garcon.cartorderhistory.CurrentOrders;
import auto_garcon.cartorderhistory.OrderHistory;
import auto_garcon.cartorderhistory.ShoppingCart;
import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.singleton.SharedPreference;
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
    private String addOrRemoveFavoritesURL;
    private Button addOrRemoveFavorite;
    private TextView restaurantName;
    private ImageView restaurantLogo;
    Dialog removeFromFavoritesPopup;
    private TextView cartCounter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Thread.setDefaultUncaughtExceptionHandler(new ExcpetionHandler(this));//error handling for unexpected crashes
        setContentView(R.layout.activity_menu);
        pref = new SharedPreference(this);

        /**
         * Ties the side navigation bar xml elements to Java objects and setting listeners for the
         * side navigation drawer as well as the elements within it.
         */
        final DrawerLayout drawerLayout = findViewById(R.id.restaurant_main);// associating xml objects with the java Object equivalent
        Toolbar toolbar = findViewById(R.id.xml_toolbar);// associating xml objects with the java Object equivalent
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayShowTitleEnabled(false);
        NavigationView navigationView = findViewById(R.id.navigationView);// associating xml objects with the java Object equivalent
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);

        TextView usernameSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_bar_name);
        usernameSideNavBar.setText(pref.getUser().getUsername());

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);

        restaurantLogo = findViewById(R.id.restaurant_logo);
        restaurantName = findViewById(R.id.restaurant_name);
        listDataHeader = new ArrayList<>();
        listHash = new HashMap<>();
        appetizer_list = new ArrayList<>();
        entree_list = new ArrayList<>();
        dessert_list = new ArrayList<>();
        drink_list = new ArrayList<>();
        alcohol_list = new ArrayList<>();
        addOrRemoveFavorite = findViewById(R.id.add_restaurant);

        if(pref.getFavorites().contains(getIntent().getIntExtra("restaurant id", 0))) {
            addOrRemoveFavorite.setText("Remove from favorites");
        }
        else {
            addOrRemoveFavorite.setText("Add to favorites");
        }

        addOrRemoveFavorite.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(pref.getFavorites().contains(getIntent().getIntExtra("restaurant id", 0))) {
                    pref.removeFromFavorites(getIntent().getIntExtra("restaurant id", 0));

                    removeFromFavoritesPopup = new Dialog(Menu.this);

                    removeFromFavoritesPopup.setContentView(R.layout.confirm_popup);
                    removeFromFavoritesPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                    removeFromFavoritesPopup.show();

                    TextView dynamicPopupText = removeFromFavoritesPopup.findViewById(R.id.text_confirm_popup);

                    dynamicPopupText.setText("Are you sure you want to remove from favorites?");

                    Button removeFromFavorites = removeFromFavoritesPopup.findViewById(R.id.popup_yes);
                    Button confirmClose = removeFromFavoritesPopup.findViewById(R.id.confirm_close);

                    removeFromFavorites.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            addOrRemoveFavorite.setText("Add to favorites");

                            obj = new JSONObject();//json object that will be sent as the request parameter

                            try {
                                obj.put("customer_id", pref.getUser().getUsername());
                                obj.put("restaurant_id", getIntent().getIntExtra("restaurant id", 0));
                            }
                            catch (JSONException e) {
                                //TODO figure out how to handle this other than stack trace
                                e.printStackTrace();
                            }

                            StringRequest deleteRequest = new StringRequest(Request.Method.POST, "http://50.19.176.137:8000/favorites/delete",
                                    new Response.Listener<String>() {
                                        @Override
                                        public void onResponse(String response) {
                                            Toast.makeText(Menu.this, response, Toast.LENGTH_LONG).show();
                                            removeFromFavoritesPopup.dismiss();
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
                    confirmClose.setOnClickListener(new View.OnClickListener() {
                        public void onClick(View v) {
                            removeFromFavoritesPopup.dismiss();
                        }
                    });
                }
                else {
                    addOrRemoveFavorite.setText("Remove from favorites");
                    pref.addToFavorites(getIntent().getIntExtra("restaurant id", 0));

                    obj = new JSONObject();//json object that will be sent as the request parameter

                    try {
                        obj.put("customer_id", pref.getUser().getUsername());
                        obj.put("restaurant_id", getIntent().getIntExtra("restaurant id", 0));
                    }catch (JSONException e){
                        //TODO figure out how to handle this other than stack trace
                        e.printStackTrace();
                    }

                    StringRequest putRequest = new StringRequest(Request.Method.PUT, "http://50.19.176.137:8000/favorites/add",
                            new Response.Listener<String>()
                            {
                                @Override
                                public void onResponse(String response) {
                                    // response
                                    Toast.makeText(Menu.this,response,Toast.LENGTH_LONG).show();
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
            }
        });

        StringRequest getRequest = new StringRequest(Request.Method.GET, "http://50.19.176.137:8000/restaurant/" + getIntent().getIntExtra("restaurant id", 0),
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject restaurantJSONObject = new JSONObject(response);
                            String font;
                            String primaryColor;

                            //parsing through json from get request to add them to menu
                            JSONObject restaurant = restaurantJSONObject.getJSONObject("restaurant");

                            restaurantName.setText(restaurant.getString("name"));
                            restaurant.getString("address");
                            restaurant.getInt("phone_number");
                            restaurant.getInt("opening");
                            restaurant.getInt("closing");

                            font = restaurant.getString("font");
                            primaryColor = restaurant.getString("primary_color");

                            restaurant.getString("cuisine");

                            listAdapter = new ExpandableMenuAdapater(Menu.this, listDataHeader, listHash, getIntent().getIntExtra("restaurant id", 0),
                                    primaryColor, restaurant.getString("secondary_color"), restaurant.getString("tertiary_color"),restaurant.getInt("opening"),restaurant.getInt("closing"));
                            listView = findViewById(R.id.menu_list);
                            listView.setAdapter(listAdapter);

                            drawerLayout.setBackgroundColor(Color.parseColor(primaryColor));

                            byte[] restaurantLogoByteArray = new byte[restaurant.getJSONObject("logo").getJSONArray("data").length()];

                            for(int i = 0; i < restaurantLogoByteArray.length; i++) {
                                restaurantLogoByteArray[i] = (byte) (((int) restaurant.getJSONObject("logo").getJSONArray("data").get(i)) & 0xFF);
                            }

                            restaurantLogo.setImageBitmap(BitmapFactory.decodeByteArray(restaurantLogoByteArray, 0, restaurantLogoByteArray.length));

                            JSONObject menuItem = restaurantJSONObject.getJSONObject("menu");

                            Iterator<String> keys = menuItem.keys();
                            while(keys.hasNext()) {
                                String key = keys.next();
                                if (menuItem.get(key) instanceof JSONObject) {
                                    JSONObject menuItemCategories = menuItem.getJSONObject(key);

                                    auto_garcon.menustuff.MenuItem itemToBeAdded = creatingToBeAddedItem(menuItemCategories);
                                    itemToBeAdded.setNameOfItem(key);
                                    String whereToSendItem = menuItemCategories.getString("category");

                                    if(itemToBeAdded.getCategory().equals("Alcohol") && alcohol_list != null) {
                                        for(int i = 0; i < alcohol_list.size(); i++) {
                                                alcohol_list.get(i).setPrice(itemToBeAdded.getPrice());
                                        }
                                    }
                                    else if(itemToBeAdded.getCategory().equals("Refillable Drink") && drink_list != null) {
                                        for(int i = 0; i < drink_list.size(); i++) {
                                                drink_list.get(i).setPrice(itemToBeAdded.getPrice());
                                        }
                                    }
                                    else if(itemToBeAdded.getCategory().equals("Dessert") && dessert_list != null) {
                                        for(int i = 0; i < dessert_list.size(); i++) {
                                                dessert_list.get(i).setPrice(itemToBeAdded.getPrice());
                                        }
                                    }
                                    else if(itemToBeAdded.getCategory().equals("Entree") && entree_list != null) {
                                        for(int i = 0; i < entree_list.size(); i++) {
                                            entree_list.get(i).setPrice(itemToBeAdded.getPrice());
                                        }
                                    }
                                    else if(itemToBeAdded.getCategory().equals("Appetizer") && appetizer_list != null){
                                        for(int i = 0; i < appetizer_list.size(); i++) {
                                            appetizer_list.get(i).setPrice(itemToBeAdded.getPrice());
                                        }
                                    }

                                    //if conditional filters out erroneous categories
                                    if((whereToSendItem.equals("Alcohol") || whereToSendItem.equals("Refillable Drink") || whereToSendItem.equals("Dessert") || whereToSendItem.equals("Entree") || whereToSendItem.equals("Appetizer"))
                                        && whereToSendItem.length() != 0) {
                                        addToList(itemToBeAdded, whereToSendItem);}
                                }
                            }

                            if(appetizer_list != null && appetizer_list.size() > 0) {
                                listDataHeader.add("Appetizer");
                                listHash.put(listDataHeader.get(listDataHeader.size() - 1), appetizer_list);
                            }
                            if(entree_list != null && entree_list.size()  > 0) {
                                listDataHeader.add("Entree");
                                listHash.put(listDataHeader.get(listDataHeader.size() - 1), entree_list);
                            }
                            if(dessert_list != null && dessert_list.size() > 0) {
                                listDataHeader.add("Dessert");
                                listHash.put(listDataHeader.get(listDataHeader.size() - 1), dessert_list);
                            }
                            if(drink_list != null && drink_list.size() > 0) {
                                listDataHeader.add("Refillable Drinks");
                                listHash.put(listDataHeader.get(listDataHeader.size() - 1), drink_list);
                            }
                            if(alcohol_list != null && alcohol_list.size() > 0) {
                                listDataHeader.add("Alcohol");
                                listHash.put(listDataHeader.get(listDataHeader.size() - 1), alcohol_list);
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
                                startActivity(new Intent(Menu.this, QRcode.class));
                                return true;
                            case R.id.action_home:
                                startActivity(new Intent(Menu.this, Home.class));
                                return true;
                            case R.id.action_cart:
                                startActivity(new Intent(Menu.this, ShoppingCart.class));
                                return true;
                        }
                        return false;
                    }
                };

        bottomNavigation.setOnNavigationItemSelectedListener(navigationItemSelectedListener);

    }
    /**
     * Initialize the contents of the Activity's standard options menu.  You
     * should place your menu items in to <var>menu</var>.
     *
     * <p>This is only called once, the first time the options menu is
     * displayed.  To update the menu every time it is displayed, see
     * {@link #onPrepareOptionsMenu}.
     *
     * <p>The default implementation populates the menu with standard system
     * menu items.  These are placed in the {@link android.view.Menu#CATEGORY_SYSTEM} group so that
     * they will be correctly ordered with application-defined menu items.
     * Deriving classes should always call through to the base implementation.
     *
     * <p>You can safely hold on to <var>menu</var> (and any items created
     * from it), making modifications to it as desired, until the next
     * time onCreateOptionsMenu() is called.
     *
     * <p>When you add items to the menu, you can implement the Activity's
     * {@link #onOptionsItemSelected} method to handle them there.
     *
     * @param menu The options menu in which you place your items.
     *
     * @return You must return true for the menu to be displayed;
     *         if you return false it will not be shown.
     *
     * @see #onPrepareOptionsMenu
     * @see #onOptionsItemSelected
     */
    @Override
    public boolean onCreateOptionsMenu(android.view.Menu menu) {
        Log.d("hello","HELLLL");

        getMenuInflater().inflate(R.menu.bottom_nav_menu,menu);

        MenuItem item = menu.findItem(R.id.action_cart);
        Log.d("hello","testing "+item);

        cartCounter =  item.getActionView().findViewById(R.id.cart_badge);
        setUpBadge();
        return super.onCreateOptionsMenu(menu);
    }



    private void setUpBadge(){

        if(cartCounter!= null){

            if(pref.getShoppingCart().getCart().size()==0){
                Log.d("hell1o","HELLLL");

                if(cartCounter.getVisibility()!=View.GONE){
                    Log.d("hell2o","HELLLL");

                    cartCounter.setVisibility((View.GONE));
                }

            }
            else {
                cartCounter.setText(String.valueOf(Math.min(pref.getShoppingCart().getCart().size(),99)));// setting max to 99
                if(cartCounter.getVisibility()!=View.VISIBLE){
                    cartCounter.setVisibility((View.VISIBLE));
                }
            }
        }
    }

    /**
     * This method is what provides the side navigation bar with its onClick functionality to
     * other activities.
     */
    public boolean onNavigationItemSelected(@NonNull MenuItem nav_item){
        switch(nav_item.getItemId()){
            case R.id.account:
                startActivity(new Intent(Menu.this, Account.class));
                break;
            case R.id.order_history:
                startActivity(new Intent(Menu.this, OrderHistory.class));
                break;
            case R.id.current_orders:
                startActivity(new Intent(Menu.this, CurrentOrders.class));
                break;
            case R.id.settings:
                startActivity(new Intent(Menu.this, Settings.class));
                break;
            case R.id.log_out:
                pref.changeLogStatus(false);
                pref.logOut();

                startActivity(new Intent(Menu.this, Login.class));
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

    private auto_garcon.menustuff.MenuItem creatingToBeAddedItem(JSONObject menuItemCategories) {
        auto_garcon.menustuff.MenuItem itemToBeAdded = new auto_garcon.menustuff.MenuItem();

        try {
            itemToBeAdded.setItemID(menuItemCategories.getInt("item_id"));
            itemToBeAdded.setCalories(menuItemCategories.getInt("calories"));
            itemToBeAdded.setPrice(menuItemCategories.getDouble("price"));
            itemToBeAdded.setCategory(menuItemCategories.getString("category"));

            itemToBeAdded.setAmountInStock(menuItemCategories.getInt("in_stock"));
            itemToBeAdded.setDescription(menuItemCategories.getString("description"));

            byte[] menuItemImageByteArray = new byte[menuItemCategories.getJSONObject("picture").getJSONArray("data").length()];

            for(int i = 0; i < menuItemImageByteArray.length; i++) {
                menuItemImageByteArray[i] = (byte) (((int) menuItemCategories.getJSONObject("picture").getJSONArray("data").get(i)) & 0xFF);
            }

            if(menuItemCategories.getInt("item_id") == 8) {
                itemToBeAdded.setItemImage(menuItemImageByteArray);
            }
        }
        catch (JSONException e) {
            e.printStackTrace();
        }

        return itemToBeAdded;
    }
}