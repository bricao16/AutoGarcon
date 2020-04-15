package auto_garcon.initialpages;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.example.auto_garcon.R;

import auto_garcon.HomeStuff.Home;
/**
*This class handles the main functions of the two button page
 * its tied two the TwoButton xml layout
 * This class is also capable of linking the user to the Home page and the QrCode page
*/
public class twoButtonPage extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_two_button_page);

        Button scannerButton = findViewById(R.id.scanner_button);// associating xml objects with the java Object equivalent
        Button favButton = findViewById(R.id.fav_button);// associating xml objects with the java Object equivalent

        /*
        When one of these buttons is clicked it will take the users onto either the QRcode or the Favorite Page
         */
        scannerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {//when the scannerButton is clicked this will send the user to the QrCode page
                Intent QrCode = new Intent(twoButtonPage.this, QRcode.class);
                startActivity(QrCode);
            }
        });
        favButton.setOnClickListener(new View.OnClickListener() {// when the favButton is clicked user is sent to the HomePage
            @Override
            public void onClick(View v) {

                Intent home = new Intent(twoButtonPage.this, Home.class);//creating an intent to send the user to homepage
                startActivity(home);
            }
        });

    }
}