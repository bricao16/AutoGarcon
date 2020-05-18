package auto_garcon.accountstuff;

import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.text.Html;
import android.text.Spanned;
import android.text.method.ScrollingMovementMethod;
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

import auto_garcon.cartorderhistory.ShoppingCart;
import auto_garcon.initialpages.Login;
import auto_garcon.initialpages.QRcode;
import auto_garcon.homestuff.Home;
import auto_garcon.menustuff.Menu;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.cartorderhistory.OrderHistory;

public class Privacy extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

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
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_terms);
        pref = new SharedPreference(this);


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
        //Privacy Policy
        String htmlAsString = "<!DOCTYPE html> <html> <head> <meta charset='utf-8'> <meta name='viewport' content='width=device-width'></head> <body> <strong>Privacy Policy</strong> <p> AutoGarcon built the AutoGarcon app as a Free app. This SERVICE is provided by AutoGarcon at no cost and is intended for use as is. </p> <p> This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service. </p> <p> If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. we will not use or share your information with anyone except as described in this Privacy Policy. </p> <p> The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at AutoGarcon unless otherwise defined in this Privacy Policy. </p> <p><strong>Information Collection and Use</strong></p> <p> For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to Name, Email, Photo. The information that we request will be retained by us and used as described in this privacy policy. </p> <div><p> The app does use third party services that may collect information used to identify you. </p> <p> Link to privacy policy of third party service providers used by the app </p> <ul><li><a href=\"https://www.google.com/policies/privacy/\" target=\"_blank\">Google Play Services</a></li><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></ul></div> <p><strong>Log Data</strong></p> <p> we want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics. </p> <p><strong>Cookies</strong></p> <p> Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory. </p> <p> This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service. </p> <p><strong>Service Providers</strong></p> <p> we may employ third-party companies and individuals due to the following reasons: </p> <ul><li>To facilitate our Service;</li> <li>To provide the Service on our behalf;</li> <li>To perform Service-related services; or</li> <li>To assist us in analyzing how our Service is used.</li></ul> <p> we want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose. </p> <p><strong>Security</strong></p> <p> we value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security. </p> <p><strong>Links to Other Sites</strong></p> <p> This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. we have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. </p> <p><strong>Children’s Privacy</strong></p> <p> These Services do not address anyone under the age of 13. we do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions. </p> <p><strong>Changes to This Privacy Policy</strong></p> <p> we may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. we will notify you of any changes by posting the new Privacy Policy on this page. </p> <p>This policy is effective as of 2020-05-07</p> <p><strong>Contact Us</strong></p> <p> If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at autogarcon@gmail.com. </p> <p> This privacy policy page was created at <a href=\"https://privacypolicytemplate.net\" target=\"_blank\">privacypolicytemplate.net</a> and modified/generated by <a href=\"https://app-privacy-policy-generator.firebaseapp.com/\" target=\"_blank\">App Privacy Policy Generator</a></p> </body> </html> ";
        Spanned htmlAsSpanned = Html.fromHtml(htmlAsString); // used by TextView

// set the html content on the TextView
        TextView textView = (TextView) findViewById(R.id.textView);
        textView.setText(htmlAsSpanned);
        textView.setMovementMethod(new ScrollingMovementMethod());


        /**
         * It ties the bottom navigation bar xml element to a Java object and provides it with its
         * onClick functionality to other activities and sets the listener.
         */
        BottomNavigationView bottomNavigation = findViewById(R.id.bottom_navigation);
        BadgeDrawable badge = bottomNavigation.getOrCreateBadge(R.id.action_cart);
        badge.setVisible(true);
        if(pref.getShoppingCart()!=null) {
            if(pref.getShoppingCart().getCart().size()!=0){
                badge.setNumber(pref.getShoppingCart().getCart().size());
            }
        }

        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override
                    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_scan:
                                startActivity(new Intent(Privacy.this, QRcode.class));
                                return true;
                            case R.id.action_home:
                                startActivity(new Intent(Privacy.this, Home.class));
                                return true;
                            case R.id.action_cart:
                                startActivity(new Intent(Privacy.this, ShoppingCart.class));
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
                Intent account = new Intent(getBaseContext(), Account.class);
                startActivity(account);
                break;
            case R.id.order_history:
                Intent orderHistory = new Intent(getBaseContext(), OrderHistory.class);
                startActivity(orderHistory);
                break;
            case R.id.settings:
                Intent settings = new Intent(getBaseContext(), Settings.class);
                startActivity(settings);
                break;
            case R.id.log_out:
                pref.changeLogStatus(false);
                pref.logOut();

                Intent login = new Intent(getBaseContext(), Login.class);
                startActivity(login);
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
            Intent intent = new Intent(Privacy.this, PasswordChange.class);
            startActivity(intent);
            Toast.makeText(this,"Please Update your Password",Toast.LENGTH_LONG).show();
        }
    }
}
