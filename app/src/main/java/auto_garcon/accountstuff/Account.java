package auto_garcon.accountstuff;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;

import java.util.HashMap;
import java.util.Map;

import auto_garcon.initialpages.Login;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.UserSingleton;
import auto_garcon.singleton.VolleySingleton;

public class Account extends AppCompatActivity {
    EditText changeFirstName;//used to extract data from xml page of the Account Activity
    EditText changeLastName;//used to extract data from xml page of the Account Activity
    EditText changeUsername;//used to extract data from xml page of the Account Activity
    EditText changeEmail;//used to extract data from xml page of the Account Activity
    Button saveAccountChanges;//used to identify when user wants to register
    TextView changePassword;//used to send user into Sign in Activity
    private SharedPreference pref;//This object is used to store information about the user that can be used outside of this page

    /**
     * This methods occurs when the user is brought to the Account xml
     * It defines the constraint for the xml objects when they are interacted with
     * It also handles the put request that updates a users information on the AutoGarcon database
     * @param savedInstanceState contains the data that has been most recently supplied on the register xml after the creation of the app
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //sets display to account activity page
        setContentView(R.layout.activity_account);

        //initializing new preference variable
        pref = new SharedPreference(this);

        //setting input container fields to variables
        changeFirstName = findViewById(R.id.first_name_change);
        changeLastName = findViewById(R.id.last_name_change);
        changeUsername = findViewById(R.id.change_username);
        changeEmail = findViewById(R.id.change_email);

        //action buttons to save and change information
        saveAccountChanges = findViewById(R.id.save_acct_change);
        changePassword = findViewById(R.id.change_password);

        //Filling in current user information into container fields
        changeFirstName.setText(pref.getUser().getFirstName());
        changeLastName.setText(pref.getUser().getLastName());
        changeUsername.setText(pref.getUser().getUsername());
        changeEmail.setText(pref.getUser().getEmail());

        /*
        * If user selects the save account changes buttons
        * users information will update in database given inputs
        * */
        saveAccountChanges.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){

                //extracting user data and converting the objects into stings
                final String firstName = changeFirstName.getText().toString().trim();
                final String lastName = changeLastName.getText().toString().trim();
                final String email = changeEmail.getText().toString().trim();
                final String passwd = changePassword.getText().toString().trim();
                final String username = changeUsername.getText().toString().trim();

                if(TextUtils.isEmpty(firstName)){//checking if user entered their firstName
                    changeFirstName.setError("Please enter first name");
                    changeFirstName.requestFocus();
                }
                else if (TextUtils.isEmpty(lastName)){//checking if user entered their lastName
                    changeLastName.setError("Please enter last name");
                    changeLastName.requestFocus();
                }
                else if(TextUtils.isEmpty(email)){//checking if user entered their email
                    changeEmail.setError("Please enter email ");
                    changeEmail.requestFocus();
                }
                else if(!Patterns.EMAIL_ADDRESS.matcher(email).matches()){// use android built patterns function to test if the email matches
                    changeEmail.setError("Please enter a valid email");
                    changeEmail.requestFocus();
                }
                else if(TextUtils.isEmpty(username)){//checking if user entered their username
                    changeUsername.setError("Please enter username ");
                    changeUsername.requestFocus();
                }
                else if(username.length()>50){//checking if username is less than 50 characters
                    changeUsername.setError("Please enter a username with less than 50 characters");
                    changeUsername.requestFocus();
                }
                else if(!(TextUtils.isEmpty(firstName) && TextUtils.isEmpty(lastName) && TextUtils.isEmpty(email) && TextUtils.isEmpty(username))) {// if all the requirements are met than we can send our put request to the database

                    //put request for updating Account Information
                    StringRequest putRequest = new StringRequest(Request.Method.POST, "http://50.19.176.137:8000/customer/update",
                            new Response.Listener<String>()
                            {
                                @Override
                                public void onResponse(String response) {
                                    // response
                                    Toast.makeText(Account.this, response, Toast.LENGTH_LONG).show();

                                    pref.setUser(new UserSingleton(firstName,  lastName, username, email));//updating preferences in app

                                    //sends user to two button page after information has been updated
                                    Intent twoButton = new Intent(Account.this, Login.class);// creating an intent to change to the twoButton xml
                                    startActivity(twoButton);// move to the two button page
                                    finish();// this prevents the user from coming back to the Account page if they successfully updated the page
                                }
                            },
                            new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {//if put request is un-successful we want display that there was an error to the user
                                    // error
                                    error.printStackTrace();
                                    Toast.makeText(Account.this, error.toString(),Toast.LENGTH_LONG).show();
                                }
                            }
                    ) {

                        @Override
                        protected Map<String, String> getParams() {// inserting parameters for the put request
                            Map<String, String> params = new HashMap<String, String>();
                            params.put("customer_id", username);
                            params.put("first_name", firstName);
                            params.put("last_name", lastName);
                            params.put("email", email);
                            return params;
                        }

                        @Override
                        public Map<String, String> getHeaders() throws AuthFailureError {//adds header to request
                            HashMap<String,String> headers = new HashMap<String,String>();
                            headers.put("Authorization","Bearer " + pref.getAuth());
                            return headers;
                        }
                    };
                    VolleySingleton.getInstance(Account.this).addToRequestQueue(putRequest);// sending the request to the database
                }
                else {
                    Toast.makeText(Account.this, "Error Occured", Toast.LENGTH_SHORT).show();//if the request couldn't be made show an error to the user
                }

            }
        });

        changePassword.setOnClickListener(new View.OnClickListener() {// when the user clicks on this link we change to xml to the log in layout
            @Override
            public void onClick(View view) {//will change password
                Intent intent = new Intent(Account.this, Login.class);
                startActivity(intent);
            }
        });
    }
}