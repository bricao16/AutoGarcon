package auto_garcon.InitialPages;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.example.auto_garcon.R;

import auto_garcon.HomeStuff.Home;
import auto_garcon.Singleton.SharedPreference;

public class twoButtonPage extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_two_button_page);

        Button scannerButton = findViewById(R.id.scanner_button);
        Button favButton = findViewById(R.id.fav_button);

        /*
        When one of these buttons is clicked it will take the users onto either the QRcode or the Favorite Page
         */
        scannerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent QrCode = new Intent(twoButtonPage.this, QRcode.class);
                startActivity(QrCode);
            }
        });
        favButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent home = new Intent(twoButtonPage.this, Home.class);
                startActivity(home);
            }
        });

    }
}