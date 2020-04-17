package auto_garcon.cartorderhistory;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;

import com.example.auto_garcon.R;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

import auto_garcon.accountstuff.Account;
import auto_garcon.accountstuff.Settings;
import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.singleton.SharedPreference;

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
        setContentView(R.layout.activity_order_history);

        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.order_history_main);// associating xml objects with the java Object equivalent
        Toolbar toolbar = findViewById(R.id.xml_toolbar);// associating xml objects with the java Object equivalent
        NavigationView navigationView = findViewById(R.id.navigationView);// associating xml objects with the java Object equivalent
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);

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