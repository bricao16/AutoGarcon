package auto_garcon.accountstuff;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;

import com.example.auto_garcon.R;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

import auto_garcon.cartorderhistory.ShoppingCart;
import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.Login;
import auto_garcon.cartorderhistory.OrderHistory;
import auto_garcon.initialpages.QRcode;
import auto_garcon.singleton.SharedPreference;

/**
 * This class handles all settings related to the User
 * This class allows the user to custiomize certian features of there account
 * This class is linked to settings xml which also has a navigationBar that allows it to navigate to other pages
 */
public class Settings extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private SharedPreference pref;// allows the app to reference the user information that has been stored

    /**
     * This methods defines the functionality of xml objects when the xml is loaded
     * @param savedInstanceState This allows the xml data fields to retain data from an early instance as long the app was not destroyed
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.settings_main);// associating xml objects with the java Object equivalent
        Toolbar toolbar = findViewById(R.id.xml_toolbar);// associating xml objects with the java Object equivalent
        NavigationView navigationView = findViewById(R.id.navigationView);// associating xml objects with the java Object equivalent
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);

        pref = new SharedPreference(this);

        BottomNavigationView bottomNavigation = findViewById(R.id.bottom_navigation);
        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_scan:
                                startActivity(new Intent(Settings.this, QRcode.class));
                                return true;
                            case R.id.action_home:
                                startActivity(new Intent(Settings.this, Home.class));
                                return true;
                            case R.id.action_cart:
                                startActivity(new Intent(Settings.this, ShoppingCart.class));
                                return true;
                        }
                        return false;
                    }
                };

        bottomNavigation.setOnNavigationItemSelectedListener(navigationItemSelectedListener);

        Button faqButton = findViewById(R.id.faqButton);// associating xml objects with the java Object equivalent
        Button privacyLegalButton = findViewById(R.id.privacyLegalButton);// associating xml objects with the java Object equivalent

        faqButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {//when the faq button is clicked this will send the user to the faq page page
          //      startActivity(new Intent(Settings.this, faq.class));
            }
        });

        privacyLegalButton.setOnClickListener(new View.OnClickListener() {// when the legal button is clicked user is sent to the legal page
            @Override
            public void onClick(View v) {
         //       startActivity(new Intent(Settings.this, legal.class));
            }
        });


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
