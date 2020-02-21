package com.example.login;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
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
        emailId = findViewById(R.id.editText);
        password = findViewById(R.id.editText2);
        buttonSignUp = findViewById(R.id.button);
        textViewSignIn = findViewById(R.id.textView2);

        buttonSignUp.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
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
                    Toast.makeText(Register.this,"Feilds are Empty!", Toast.LENGTH_SHORT).show();
                }
                else if (!(email.isEmpty() && passwd.isEmpty())){
                    authentication.createUserWithEmailAndPassword(email,passwd).addOnCompleteListener(Register.this, new OnCompleteListener<AuthResult>() {
                        @Override
                        public void onComplete(@NonNull Task<AuthResult> task) {

                            if(!task.isSuccessful()){
                                Toast.makeText(Register.this,"Can not register Please try again !", Toast.LENGTH_SHORT).show();

                            }
                            else{
                                    startActivity(new Intent(Register.this,MainActivity.class));
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
