package auto_garcon.initialpages;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.example.auto_garcon.R;

import auto_garcon.homestuff.Home;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;

/**
*This class handles the main functions of the two button page
 * its tied two the TwoButton xml layout
 * This class is also capable of linking the user to the Home page and the QrCode page
*/
public class TwoButtonPage extends AppCompatActivity {
    private SharedPreference pref;//saving user transaction data such as food item chosen by the user.
    private ShoppingCartSingleton shoppingCart;//keeping food item chosen by the user.
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_two_button_page);
        pref = new SharedPreference(this);//file for keeping track of cart

        Button scannerButton = findViewById(R.id.scanner_button);// associating xml objects with the java Object equivalent
        Button favButton = findViewById(R.id.fav_button);// associating xml objects with the java Object equivalent

        /*
        When one of these buttons is clicked it will take the users onto either the QRcode or the Favorite Page
         */
        scannerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {//when the scannerButton is clicked this will send the user to the QrCode page
                startActivity(new Intent(TwoButtonPage.this, QRcode.class));
            }
        });

        favButton.setOnClickListener(new View.OnClickListener() {// when the favButton is clicked user is sent to the HomePage
            @Override
            public void onClick(View v) {
                startActivity(new Intent(TwoButtonPage.this, Home.class));
            }
        });

    }
}