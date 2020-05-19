package auto_garcon.initialpages;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.auto_garcon.R;

import auto_garcon.singleton.SharedPreference;

/**
 * Main class for registering users and handling a user when the want to register a new account
 * This classes main purpose is for registering users only
 * This class is also tied with the Register xml
 */
public class Register extends AppCompatActivity {
    EditText emailId;//used to extract data from xml page of the Registration Activity
    EditText userFirst;//used to extract data from xml page of the Registration Activity
    EditText userLast;//used to extract data from xml page of the Registration Activity
    EditText password;//used to extract data from xml page of the Registration Activity
    Button nextButton;//used to identify when user wants to register
    TextView textViewLogin;//used to send user into Sign in Activity
    EditText userID;//used to extract data from xml page of the Registration Activity
    private SharedPreference pref;//This object is used to store information about the user that can be used outside of this page

    /**
     * Called when the activity is starting.  This is where most initialization
     * should go
     *
     * <p><em>Derived classes must call through to the super class's
     * implementation of this method.  If they do not, an exception will be
     * thrown.</em></p>
     *
     * @param savedInstanceState If the activity is being re-initialized after
     *                           previously being shut down then this Bundle contains the data it most
     *                           recently supplied in {@link #onSaveInstanceState}.  <b><i>Note: Otherwise it is null.</i></b>
     * @see #onStart
     * @see #onSaveInstanceState
     * @see #onRestoreInstanceState
     * @see #onPostCreate
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);


        pref = new SharedPreference(this);
        /**
         * ties xml elemnts to Java objects and sets some properties from SharePreferences
         */
        userID = findViewById(R.id.username_enter_register);// associating xml objects with the java Object equivalent
        emailId = findViewById(R.id.email_enter_register);// associating xml objects with the java Object equivalent
        userFirst = findViewById(R.id.first_name_enter_register);// associating xml objects with the java Object equivalent
        userLast = findViewById(R.id.last_name_enter_register);// associating xml objects with the java Object equivalent
        password = findViewById(R.id.password_enter_register);// associating xml objects with the java Object equivalent
        nextButton = findViewById(R.id.next_button_on_register);// associating xml objects with the java Object equivalent
        textViewLogin = findViewById(R.id.yes_account_register);// associating xml objects with the java Object equivalent

        /**
         * onClick that check for valid inputs and goes to AccountImageSelectionRegister to finish registration process
         */
        nextButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                final String firstName = userFirst.getText().toString().trim();//extracted data from xml object and converted into a string
                final String lastName = userLast.getText().toString().trim();//extracted data from xml object and converted into a string
                final String email = emailId.getText().toString().trim();//extracted data from xml object and converted into a string
                final String passwd = password.getText().toString().trim();//extracted data from xml object and converted into a string
                final String username = userID.getText().toString().trim();//extracted data from xml object and converted into a string
                boolean passwordNumber =false;

                for(int i = 0 ; i<passwd.length();i++){
                       if(Character.isDigit(passwd.charAt(i))){
                           passwordNumber=true;
                       }
                }
                boolean validInputs = true;

                if (TextUtils.isEmpty(firstName)) {//checking if user entered there firstName
                    userFirst.setError("Please enter first name");
                    userFirst.requestFocus();
                    validInputs = false;
                }

                if (TextUtils.isEmpty(lastName)) {//checking if user entered there lastName
                    userLast.setError("Please enter last name");
                    userLast.requestFocus();
                    validInputs = false;
                }
                if (TextUtils.isEmpty(email)) {//checking if user entered their email
                    emailId.setError("Please enter email id");
                    emailId.requestFocus();
                    validInputs = false;
                }
                if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {// use android built patterns function to test if the email matches
                    emailId.setError("Please enter a valid email");
                    emailId.requestFocus();
                    validInputs = false;
                }
                if (TextUtils.isEmpty(passwd)) {//checking if user entered their password
                    password.setError("Please enter your password");
                    password.requestFocus();
                    validInputs = false;
                }
                if (passwd.length() < 8) {//checks if the user entered a password lass than 8 characters
                    password.setError("Password Must be Greater than 8 Characters");
                    password.requestFocus();
                    validInputs = false;
                }
                if (passwd.equals(passwd.toLowerCase())) {//checks if the password contains one uppercase
                    password.setError("Password Must contain at least one uppercase");
                    password.requestFocus();
                    validInputs = false;
                }
                if (passwd.equals(passwd.toUpperCase())) {//check if password contains one lowercase
                    password.setError("Password Must contain at least one lowercase");
                    password.requestFocus();
                    validInputs = false;
                }
                if(passwordNumber!=true){
                    password.setError("Password Must contain at least one Number");
                    password.requestFocus();
                    validInputs =false;
                }
                if (TextUtils.isEmpty(username)) {
                    userID.setError("Please enter a username");
                    userID.requestFocus();
                    validInputs = false;
                }
                if(android.text.TextUtils.isDigitsOnly(username)){
                    userID.setError("Please enter a username that is not only numbers");
                    userID.requestFocus();
                    validInputs =false;
                }
                if (validInputs == true) {// if all the requirments are met than we can send our put request to the database
                    Intent imageSelection = new Intent(Register.this, AccountImageSelectionRegister.class);

                    imageSelection.putExtra("first_name", firstName);
                    imageSelection.putExtra("last_name", lastName);
                    imageSelection.putExtra("email", email);
                    imageSelection.putExtra("username", username);
                    imageSelection.putExtra("password", passwd);

                    startActivity(imageSelection);
                }
            }
        });

        /**
         * onClick to go to Login activity
         */
        textViewLogin.setOnClickListener(new View.OnClickListener() {// when the user clicks on this link we change to xml to the log in layout
            @Override
            public void onClick(View view) {
                startActivity(new Intent(Register.this, Login.class));
            }
        });
    }
}