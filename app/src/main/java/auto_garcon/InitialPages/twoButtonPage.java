package auto_garcon.InitialPages;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.example.auto_garcon.R;

public class twoButtonPage extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_two_button_page);

        Button button1 = findViewById(R.id.button);
        Button button2 = findViewById(R.id.button2);


        /*
        When one of these buttons is clicked it will take the users onto either the QRcode or the Favorite Page
         */
        button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent QrCode = new Intent(twoButtonPage.this, QRcode.class);
                startActivity(QrCode);
            }
        });
        button2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent home = new Intent(twoButtonPage.this, Home.class);
                startActivity(home);
            }
        });

    }
}