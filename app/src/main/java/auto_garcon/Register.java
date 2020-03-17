package auto_garcon;

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

import com.example.auto_garcon.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;


import java.util.HashMap;
import java.util.Map;

/**
 *
 * Registration
 * Activity which allows a user to set up an account
 * Asks for First, Last, email, and password.
 * Can reach this activity from the Login activity
 * Still needs to be completed... file contains some old firebase comments when was testing to set up accounts with firebase.
 */
public class Register extends AppCompatActivity {
    EditText emailId;//used to extract data from xml page of the Registration Activity
    EditText userFirst;//used to extract data from xml page of the Registration Activity
    EditText userLast;//used to extract data from xml page of the Registration Activity
    EditText password;//used to extract data from xml page of the Registration Activity
    Button buttonSignUp;//used to identify when user wants to register
    TextView textViewSignIn;//used to send user into Sign in Activity
    String userID;

    /**
     * Creates layout for the registration activity
     * Sets up event  listeners
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        //OLD: WHEN WAS USING FIREBASE....fireBase objects should be instantiated before doing anything with them

        emailId = findViewById(R.id.email);
        userFirst = findViewById(R.id.firstName);
        userLast = findViewById(R.id.lastName);
        password = findViewById(R.id.password);
        buttonSignUp = findViewById(R.id.signUp);
        textViewSignIn = findViewById(R.id.loginLink);

        // everytime we create a new user A UID is created for that user through firebase
        buttonSignUp.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                final String email=emailId.getText().toString();
                final String passwd = password.getText().toString().trim();
                final String firstName = userFirst.getText().toString().trim();
                final String lastName = userLast.getText().toString().trim();

                //if email is empty
                if(TextUtils.isEmpty(email)){
                    emailId.setError("Please enter email id");
                    emailId.requestFocus();
                }
                //if password is empty
                else if (TextUtils.isEmpty(passwd)){
                    password.setError("Please enter your password");
                    password.requestFocus();
                }
                //password needs to be longer than 5 characters
                if(passwd.length()<6){
                    password.setError("Password Must be Greater than 6 Characters");
                }
                //This is where connection to the database will be made
                else if (!(TextUtils.isEmpty(email) && !TextUtils.isEmpty(passwd))){
                    //Connection to database will go here
                }
                //General default error
                else{
                    Toast.makeText(Register.this, "Error Occured", Toast.LENGTH_SHORT).show();
                }

            }
        });
        //Request to go to Login in activity was made
        textViewSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(Register.this, Login.class);
                startActivity(intent);
            }
        });
    }
}
