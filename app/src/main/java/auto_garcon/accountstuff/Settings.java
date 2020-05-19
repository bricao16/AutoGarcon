package auto_garcon.accountstuff;

import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;

import com.example.auto_garcon.R;
import com.google.android.material.badge.BadgeDrawable;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

import auto_garcon.ExceptionHandler;
import auto_garcon.cartorderhistory.CurrentOrders;
import auto_garcon.cartorderhistory.OrderHistory;
import auto_garcon.cartorderhistory.ShoppingCart;
import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.singleton.SharedPreference;

/**
 * This class displays a menu for a user to see the privacy policy, the faq, and the terms and conditions
 * This class is linked to settings xml which also has a navigationBar that allows it to navigate to other pages
 */
public class Settings extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

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
     *                           previously being shut down then this Bundle contains the data it most
     *                           recently supplied in {@link #onSaveInstanceState}.  <b><i>Note: Otherwise it is null.</i></b>
     * @see #onStart
     * @see #onSaveInstanceState
     * @see #onRestoreInstanceState
     * @see #onPostCreate
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this));//error handling for unexpected crashes

        pref = new SharedPreference(this);


        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.settings_main);// associating xml objects with the java Object equivalent
        Toolbar toolbar = findViewById(R.id.xml_toolbar);// associating xml objects with the java Object equivalent
        NavigationView navigationView = findViewById(R.id.navigationView);// associating xml objects with the java Object equivalent
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);

        TextView usernameSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_bar_name);
        usernameSideNavBar.setText(pref.getUser().getUsername());

        ImageView userImageSideNavBar = navigationView.getHeaderView(0).findViewById(R.id.side_nav_account_picture);
        userImageSideNavBar.setImageBitmap(BitmapFactory.decodeByteArray(pref.getUser().getImageBitmap(), 0, pref.getUser().getImageBitmap().length));


        /**
         * It ties the bottom navigation bar xml element to a Java object and provides it with its
         * onClick functionality to other activities and sets the listener.
         */
        BottomNavigationView bottomNavigation = findViewById(R.id.bottom_navigation);
        BadgeDrawable badge = bottomNavigation.getOrCreateBadge(R.id.action_cart);
        badge.setVisible(true);
        if (pref.getShoppingCart() != null) {
            if (pref.getShoppingCart().getCart().size() != 0) {
                badge.setNumber(pref.getShoppingCart().getCart().size());
            }
        }

        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override
                    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
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

        /**
         * buttons used to navigate to FAQ, Privacy, Terms activities
         */
        Button faqButton = findViewById(R.id.faqButton);// associating xml objects with the java Object equivalent
        Button privacyLegalButton = findViewById(R.id.privacyLegalButton);// associating xml objects with the java Object equivalent
        Button termsLegalButton = findViewById(R.id.termsLegalButton);// associating xml objects with the java Object equivalent

        faqButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {//when the faq button is clicked this will send the user to the faq page page

                Intent privacy = new Intent(getBaseContext(), Faq.class);
                startActivity(privacy);
            }
        });

        privacyLegalButton.setOnClickListener(new View.OnClickListener() {// when the legal button is clicked user is sent to the legal page
            @Override
            public void onClick(View v) {
                Intent privacy = new Intent(getBaseContext(), Privacy.class);
                startActivity(privacy);

            }
        });

        termsLegalButton.setOnClickListener(new View.OnClickListener() {// when the legal button is clicked user is sent to the legal page
            @Override
            public void onClick(View v) {
                Intent privacy = new Intent(getBaseContext(), Terms.class);
                startActivity(privacy);

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
    public boolean onNavigationItemSelected(@NonNull MenuItem nav_item) {
        switch (nav_item.getItemId()) {
            case R.id.account:
                startActivity(new Intent(getBaseContext(), Account.class));
                break;
            case R.id.order_history:
                startActivity(new Intent(getBaseContext(), OrderHistory.class));
                break;
            case R.id.current_orders:
                startActivity(new Intent(getBaseContext(), CurrentOrders.class));
                break;
            case R.id.settings:
                startActivity(new Intent(getBaseContext(), Settings.class));
                break;
            case R.id.services:
                startActivity(new Intent(getBaseContext(), Services.class));
                break;
            case R.id.log_out:
                pref.changeLogStatus(false);
                pref.logOut();

                startActivity(new Intent(getBaseContext(), Login.class));
                break;
        }
        return false;
    }

    /**
     * Checks to see if use needs to update password.
     * If so sends them back to PassWordChange page.
     *
     * @return void
     */
    @Override
    protected void onStart() {
        super.onStart();
        if (pref.getUser().getChangePassword() == 1) {//check if they have updated their password
            //if not send them back to PasswordChange page and force them to update their password
            Intent intent = new Intent(Settings.this, PasswordChange.class);
            startActivity(intent);
            Toast.makeText(this, "Please Update your Password", Toast.LENGTH_LONG).show();
        }
    }


}
