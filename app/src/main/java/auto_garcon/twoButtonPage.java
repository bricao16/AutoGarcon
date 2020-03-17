package auto_garcon;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.example.auto_garcon.R;

import com.example.auto_garcon.R;

public class twoButtonPage extends AppCompatActivity {

    private Button button1;
    private Button button2;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_two_button_page);

        button1 = findViewById(R.id.button);
        button2= findViewById(R.id.button2);

        button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent QrCode = new Intent(twoButtonPage.this,QRcode.class);
                startActivity(QrCode);
            }
        });
        button2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent home = new Intent(twoButtonPage.this,Home.class);
                startActivity(home);
            }
        });

    }
}
