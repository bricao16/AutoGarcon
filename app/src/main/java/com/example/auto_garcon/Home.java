package com.example.auto_garcon;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;
import com.squareup.seismic.ShakeDetector;

//testing cause android studio sucks
//Testing because I am very cool
//test2
public class Home extends AppCompatActivity implements ShakeDetector.Listener {
    Button logOut;
    FirebaseAuth authentication;
    private  FirebaseAuth.AuthStateListener authStateListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        logOut = findViewById(R.id.logOut);
        logOut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                FirebaseAuth.getInstance().signOut();
                Intent signIn = new Intent(Home.this, Login.class);
                startActivity(signIn);

            }
        });

        SensorManager sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);

        ShakeDetector shakeDetector = new ShakeDetector(this);

        shakeDetector.start(sensorManager);
    }

    @Override
    public void hearShake(){
        Toast.makeText(this, "HI", Toast.LENGTH_SHORT).show();
    }
}
