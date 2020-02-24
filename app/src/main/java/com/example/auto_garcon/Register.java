package com.example.auto_garcon;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;

public class Register extends AppCompatActivity {
    EditText emailId;
    EditText password;
    Button buttonSignUp;
    TextView textViewSignIn;
    FirebaseAuth authentication;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        authentication = FirebaseAuth.getInstance();
        emailId = findViewById(R.id.email);
        password = findViewById(R.id.password);
        buttonSignUp = findViewById(R.id.signUp);
        textViewSignIn = findViewById(R.id.loginLink);

        if(authentication.getCurrentUser()!= null){
            startActivity(new Intent(Register.this, Home.class));
            finish();

        }

        buttonSignUp.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                String email=emailId.getText().toString();
                String passwd = password.getText().toString().trim();
                if(TextUtils.isEmpty(email)){
                    emailId.setError("Please enter email id");
                    emailId.requestFocus();
                }
                else if (TextUtils.isEmpty(passwd)){
                    password.setError("Please enter your password");
                    password.requestFocus();
                }
                if(passwd.length()<6){
                    password.setError("Password Must be Greater than 6 Characters");
                }
                else if (!(TextUtils.isEmpty(email) && !TextUtils.isEmpty(passwd))){
                    authentication.createUserWithEmailAndPassword(email,passwd).addOnCompleteListener(Register.this, new OnCompleteListener<AuthResult>() {
                        @Override
                        public void onComplete(@NonNull Task<AuthResult> task) {

                            if(!task.isSuccessful()){
                                Toast.makeText(Register.this,"Can not register Please try again !", Toast.LENGTH_SHORT).show();

                            }
                            else{
                                    startActivity(new Intent(Register.this, Home.class));
                            }

                        }
                    });
                }
                else{
                    Toast.makeText(Register.this, "Error Occured", Toast.LENGTH_SHORT);
                }

            }
        });

        textViewSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(Register.this, Login.class);
                startActivity(intent);
            }
        });
    }
}
