package com.example.auto_garcon;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class Login extends AppCompatActivity {
    EditText emailId;
    EditText password;
    Button buttonSignIn;
    TextView textViewSignUp;
    FirebaseAuth authentication;
    private FirebaseAuth.AuthStateListener authenticateListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        authentication = FirebaseAuth.getInstance();
        emailId = findViewById(R.id.email);
        password = findViewById(R.id.password);
        buttonSignIn = findViewById(R.id.signUp);
        textViewSignUp = findViewById(R.id.loginLink);

        authenticateListener = new FirebaseAuth.AuthStateListener() {
            @Override
            public void onAuthStateChanged(@NonNull FirebaseAuth firebaseAuth) {
                FirebaseUser user = authentication.getCurrentUser();
                if(user!= null){
                    Toast.makeText(Login.this, "Welcome", Toast.LENGTH_SHORT).show();
                    Intent intent  = new Intent(Login.this, Home.class);
                    startActivity(intent);

                }
                else{
                    Toast.makeText(Login.this, "Please Login", Toast.LENGTH_SHORT).show();

                }
            }
        };

        buttonSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String email=emailId.getText().toString();
                String passwd = password.getText().toString();
                if(email.isEmpty()){
                    emailId.setError("Please enter email id");
                    emailId.requestFocus();
                }
                else if (passwd.isEmpty()){
                    password.setError("Please enter your password");
                    password.requestFocus();
                }
                else if(email.isEmpty() && passwd.isEmpty()){
                    Toast.makeText(Login.this,"Feilds are Empty!", Toast.LENGTH_SHORT).show();
                }
                else if (!(email.isEmpty() && passwd.isEmpty())){
                    authentication.signInWithEmailAndPassword(email,passwd).addOnCompleteListener(Login.this, new OnCompleteListener<AuthResult>() {
                        @Override
                        public void onComplete(@NonNull Task<AuthResult> task) {
                            if (!task.isSuccessful()) {
                                Toast.makeText(Login.this, "Login Error Please Try again!", Toast.LENGTH_SHORT);
                            }
                            else {
                                Intent toHome = new Intent(Login.this, Home.class);
                                startActivity(toHome);
                                finish();
                            }
                        }
                    });
                }
                else{
                    Toast.makeText(Login.this, "Error Occurred", Toast.LENGTH_SHORT);
                }
            }
        });

        textViewSignUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent signUp = new Intent(Login.this, Register.class);
                startActivity(signUp);
            }
        });
    }
    protected void onStart(){
        super.onStart();
        authentication.addAuthStateListener(authenticateListener);
    }
}