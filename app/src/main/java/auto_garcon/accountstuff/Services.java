package auto_garcon.accountstuff;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;

import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;
import com.google.android.material.badge.BadgeDrawable;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

import java.util.HashMap;
import java.util.Map;

import auto_garcon.NukeSSLCerts;
import auto_garcon.cartorderhistory.CurrentOrders;
import auto_garcon.cartorderhistory.OrderHistory;
import auto_garcon.cartorderhistory.ShoppingCart;
import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.VolleySingleton;


public class Services extends AppCompatActivity  implements NavigationView.OnNavigationItemSelectedListener {

    private SharedPreference pref;// allows the app to reference the user information that has been stored

    /**
     * Called when the activity is starting.  This is where most initialization
     * should go
     *
     * <p><em>Derived classes must call through to the super class's
     * implementation of this method.  If they do not, an exception will be
     * thrown.</em></p>
     *
     * @param savedInstanceState If the activity is being re-initialized after
     *     previously being shut down then this Bundle contains the data it most
     *     recently supplied in {@link #onSaveInstanceState}.  <b><i>Note: Otherwise it is null.</i></b>
     *
     * @see #onStart
     * @see #onSaveInstanceState
     * @see #onRestoreInstanceState
     * @see #onPostCreate
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this));//error handling for unexpected crashes

        pref = new SharedPreference(this);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_services);




        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.settings_main);// associating xml objects with the java Object equivalent
        Toolbar toolbar = findViewById(R.id.xml_toolbar);// associating xml objects with the java Object equivalent
        NavigationView navigationView = findViewById(R.id.navigationView);// associating xml objects with the java Object equivalent
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(Services.this);

        TextView usernameSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_bar_name);
        usernameSideNavBar.setText(pref.getUser().getUsername());

        ImageView userImageSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_account_picture);
        userImageSideNavBar.setImageBitmap(BitmapFactory.decodeByteArray(pref.getUser().getImageBitmap(), 0, pref.getUser().getImageBitmap().length));


        /**
         * It ties the bottom navigation bar xml element to a Java object and provides it with its
         * onClick functionality to other activities and sets the listener.
         */
        BottomNavigationView bottomNavigation = findViewById(R.id.bottom_navigation);
        BadgeDrawable badge = bottomNavigation.getOrCreateBadge(R.id.action_cart);//setting badge for shopping cart
        badge.setVisible(true);//set the badge to visible
        if(pref.getShoppingCart()!=null) {//check if the shopping cart is null
            if(pref.getShoppingCart().getCart().size()!=0){
                badge.setNumber(pref.getShoppingCart().getCart().size());
            }
        }

        //if a bottom navbar item is clicked send them to the respected activity
        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_scan:
                                startActivity(new Intent(Services.this, QRcode.class));
                                return true;
                            case R.id.action_home:
                                startActivity(new Intent(Services.this, Home.class));
                                return true;
                            case R.id.action_cart:
                                startActivity(new Intent(Services.this, ShoppingCart.class));
                                return true;
                        }
                        return false;
                    }
                };

        bottomNavigation.setOnNavigationItemSelectedListener(navigationItemSelectedListener);
        Button buttonBill;
        Button buttonHelp;

        buttonBill = findViewById(R.id.Bill);// assigning the bill button from the xml to a java object
        buttonHelp = findViewById(R.id.Help);//assigning the help button from the xml to a java object


        //when the bill button has been clicked
        buttonBill.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(pref.getUser().getRestaurantID() == -1|| pref.getUser().getTableID() == -1) {
                    Toast.makeText(Services.this, "Please scan QR code",Toast.LENGTH_LONG).show();
                }
                else {
                    StringRequest updateStringRequest = new StringRequest(Request.Method.POST, "https://50.19.176.137:8001/services/update", new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            Toast.makeText(Services.this,"A service member will be with you shortly",Toast.LENGTH_LONG).show();

                        }
                    }, new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) { }
                    }){
                        @Override
                        protected Map<String, String> getParams() {// inserting parameters for the put request
                            Map<String, String> params = new HashMap<>();
                            params.put("restaurant_id",""+ pref.getUser().getRestaurantID());
                            params.put("table_num","" + pref.getUser().getTableID());
                            params.put("status","Good");
                            return params;
                        }
                    };

                    VolleySingleton.getInstance(Services.this).addToRequestQueue(updateStringRequest);
                }
            }
        });
        // when the help button has been clicked
        buttonHelp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(pref.getUser().getRestaurantID() == -1|| pref.getUser().getTableID() == -1) {
                    Toast.makeText(Services.this, "Please scan QR code",Toast.LENGTH_LONG).show();
                }
                else {
                    StringRequest updateStringRequest = new StringRequest(Request.Method.POST, "https://50.19.176.137:8001/services/update", new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            Toast.makeText(Services.this,"Help is on the way",Toast.LENGTH_LONG).show();
                        }
                    }, new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) { }
                    }){
                        @Override
                        protected Map<String, String> getParams() {// inserting parameters for the put request
                            Map<String, String> params = new HashMap<String, String>();
                            params.put("restaurant_id",""+pref.getUser().getRestaurantID());
                            params.put("table_num",""+pref.getUser().getTableID());
                            params.put("status","Help");
                            return params;
                        }
                    };

                    VolleySingleton.getInstance(Services.this).addToRequestQueue(updateStringRequest);
                }
            }
        });

    }
    /**
     * Called when an item in the navigation menu is selected.
     *
     * @param nav_item The selected item
     * @return true to display the item as the selected item
     */
    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem nav_item){
        switch(nav_item.getItemId()){
            case R.id.account:
                startActivity(new Intent(Services.this, Account.class));
                break;
            case R.id.order_history:
                startActivity(new Intent(Services.this, OrderHistory.class));
                break;
            case R.id.current_orders:
                startActivity(new Intent(Services.this, CurrentOrders.class));
                break;
            case R.id.settings:
                startActivity(new Intent(Services.this, Settings.class));
                break;
            case R.id.services:
                startActivity(new Intent(Services.this,Services.class));
                break;
            case R.id.log_out:
                pref.changeLogStatus(false);
                pref.logOut();

                startActivity(new Intent(Services.this, Login.class));
                break;
        }
        return false;
    }

    /**
     * Called after {@link #onCreate} &mdash; or after {@link #onRestart} when
     * the activity had been stopped, but is now again being displayed to the
     * user. It will usually be followed by {@link #onResume}. This is a good place to begin
     * drawing visual elements, running animations, etc.
     *
     * <p>You can call {@link #finish} from within this function, in
     * which case {@link #onStop} will be immediately called after {@link #onStart} without the
     * lifecycle transitions in-between ({@link #onResume}, {@link #onPause}, etc) executing.
     *
     * <p><em>Derived classes must call through to the super class's
     * implementation of this method.  If they do not, an exception will be
     * thrown.</em></p>
     *
     * @see #onCreate
     * @see #onStop
     * @see #onResume
     */
    @Override
    protected void onStart() {
        super.onStart();
        if(pref.getUser().getChangePassword()==1){//check if they have updated their password
            //if not send them back to PasswordChange page and force them to update their password
            Intent intent = new Intent(Services.this, PasswordChange.class);
            startActivity(intent);
            Toast.makeText(this,"Please Update your Password",Toast.LENGTH_LONG).show();
        }
    }

}
