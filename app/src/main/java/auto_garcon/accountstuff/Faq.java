package auto_garcon.accountstuff;

import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.text.Html;
import android.text.Spanned;
import android.text.method.ScrollingMovementMethod;
import android.view.MenuItem;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;

import com.example.auto_garcon.R;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

import auto_garcon.cartorderhistory.CurrentOrders;
import auto_garcon.cartorderhistory.OrderHistory;
import auto_garcon.cartorderhistory.ShoppingCart;
import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.singleton.SharedPreference;

/**
 * This class will display the FAQ to the user.
 */
public class Faq extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    // allows the app to reference the user information that has been stored
    private SharedPreference pref;

    /**
     * This methods defines the functionality of xml objects when the xml is loaded
     *
     * @param savedInstanceState This allows the xml data fields to retain data from an early instance as long the app was not destroyed
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this));//error handling for unexpected crashes

        pref = new SharedPreference(this);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_faq);


        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.terms_main);// associating xml objects with the java Object equivalent
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

        // get our html content
        //FAQ
        String htmlTermsAsString = "<!DOCTYPE html> <html> <head> <meta charset='utf-8'> <meta name='viewport' content='width=device-width'> </head> <body> <strong> FAQ:<br><br> </strong> <strong> Forgot Password </strong> <p> If you happen to forget your password, you may select the forgot password button and you will be promted to reset your password through your email.<br> </p> <strong> Changing Account Information </strong> <p> Go to the side menu bar, select account, and fill in your information. Once you are done select save and your account information will be updated. <br> </p> <strong> Viewing a Menu </strong> <p> There are two ways of viewing a restaurants menu. 1) Scanning QR code of the restaurant. 2) On the Home page you may search for restaurants and add them to your favorites. Adding them to your favorites allows you to always have it on your homescreen unlessyou decide to remove it in which case you may remove it by selecting the remove from favorites button on the given menus page. <br> </p> <strong> How to Order </strong> <p> Scan QR code at participating restaurant, select item(s) from restaurant, in your cart review your order and submit. At any point before placing the order you may modify your cart. In your cart you may incresae and decrease the quantity of the number of a selected item you would like.<br> </p> <strong> Viewing Orders Placed </strong> <p> Select side menu bar, select Order History. If you have any past orders you may view what you ordered. You may also reorder past orders which means it will automatically fill your cart with those items. It will still require you to have scanned the restaurants QR code.<br> </p> <strong> Other </strong> <p> Any further questions do not hesitate to contact us at autoGarcon@gmail.com.<br> </p>  <p> Images & icons used in app found here at https://icons8.com/ </p> </body> </html>";
        Spanned htmlTermsAsSpanned = Html.fromHtml(htmlTermsAsString); // used by TextView

        // set the html content on the TextView
        TextView textView = findViewById(R.id.textView);
        textView.setText(htmlTermsAsSpanned);
        textView.setMovementMethod(new ScrollingMovementMethod());


        BottomNavigationView bottomNavigation = findViewById(R.id.bottom_navigation);
        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override
                    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_scan:
                                startActivity(new Intent(Faq.this, QRcode.class));
                                return true;
                            case R.id.action_home:
                                startActivity(new Intent(Faq.this, Home.class));
                                return true;
                            case R.id.action_cart:
                                startActivity(new Intent(Faq.this, ShoppingCart.class));
                                return true;
                        }
                        return false;
                    }
                };
        bottomNavigation.setOnNavigationItemSelectedListener(navigationItemSelectedListener);
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
            Intent intent = new Intent(Faq.this, PasswordChange.class);
            startActivity(intent);
            Toast.makeText(this, "Please Update your Password", Toast.LENGTH_LONG).show();
        }
    }
}
