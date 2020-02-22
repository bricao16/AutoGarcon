package com.example.auto_garcon;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.google.firebase.auth.FirebaseAuth;

//testing cause android studio sucks
//Testing because I am very cool
//test2
public class Home extends AppCompatActivity {
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



    }
}
