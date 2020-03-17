package com.example.auto_garcon;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;

public class Register extends AppCompatActivity {
    EditText emailId;//used to extract data from xml page of the Registration Activity
    EditText userFirst;//used to extract data from xml page of the Registration Activity
    EditText userLast;//used to extract data from xml page of the Registration Activity
    EditText password;//used to extract data from xml page of the Registration Activity
    Button buttonSignUp;//used to identify when user wants to register
    TextView textViewSignIn;//used to send user into Sign in Activity
    FirebaseAuth authentication;// will be used to authenticate into a user account
    FirebaseFirestore dbStore;// This is being used to store user data
    String userID;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        //fireBase objects should be instantiated before doing anything with them
        authentication = FirebaseAuth.getInstance();
        dbStore = FirebaseFirestore.getInstance();

        emailId = findViewById(R.id.email);
        userFirst = findViewById(R.id.firstName);
        userLast = findViewById(R.id.lastName);
        password = findViewById(R.id.password);
        buttonSignUp = findViewById(R.id.signUp);
        textViewSignIn = findViewById(R.id.loginLink);

        if(authentication.getCurrentUser()!= null){
            startActivity(new Intent(Register.this, Home.class));
            finish();

        }
            // everytime we create a new user A UID is created for that user through firebase
        buttonSignUp.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                final String email=emailId.getText().toString();
                final String passwd = password.getText().toString().trim();
                final String firstName = userFirst.getText().toString().trim();
                final String lastName = userLast.getText().toString().trim();

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
                                userID = authentication.getCurrentUser().getUid();// retrive created new UID
                                DocumentReference documentReference = dbStore.collection("users").document(userID);//this adds a user into our database of users
                                //inserting users information into a hashmap
                                // using A hashmap is the most popular and recommended way for storing information
                                Map<String,Object> user = new HashMap<>();
                                user.put("FirstName",firstName);
                                user.put("Email ",email);
                                user.put("LastName",lastName);
                                documentReference.set(user).addOnSuccessListener(new OnSuccessListener<Void>() {
                                    @Override
                                    public void onSuccess(Void aVoid) {
                                        Log.d("Tag", "User information has been created"+ userID);

                                    }
                                }).addOnFailureListener(new OnFailureListener() {
                                    @Override
                                    public void onFailure(@NonNull Exception e) {
                                        Log.d("Tag","Failed"+e.toString());
                                    }
                                });
                                    startActivity(new Intent(Register.this, Home.class));
                            }

                        }
                    });
                }
                else{
                    Toast.makeText(Register.this, "Error Occured", Toast.LENGTH_SHORT).show();
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
