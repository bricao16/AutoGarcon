package auto_garcon.initialpages;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;

import java.util.HashMap;
import java.util.Map;

import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.VolleySingleton;

/**
 * Main class for registering users and handling a user when the want to register a new account
 * This classes main purpose is for registering users only
 * This class is also tied with the Register xml
 *
 */
public class Register extends AppCompatActivity {
    EditText emailId;//used to extract data from xml page of the Registration Activity
    EditText userFirst;//used to extract data from xml page of the Registration Activity
    EditText userLast;//used to extract data from xml page of the Registration Activity
    EditText password;//used to extract data from xml page of the Registration Activity
    Button buttonSignUp;//used to identify when user wants to register
    TextView textViewLogin;//used to send user into Sign in Activity
    EditText userID;//used to extract data from xml page of the Registration Activity
    private SharedPreference pref;//This object is used to store information about the user that can be used outside of this page
    /**
     * This methods occurs when the user is brought to the Registration xml
     * It defines the constraint for the xml objects when they are interacted with
     * It also handles the put request that registers a user to the AutoGarcon databse
     * @param savedInstanceState contains the data that has been most recently supplied on the register xml after the creation of the app
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        pref = new SharedPreference(this);

        userID = findViewById(R.id.username);// associating xml objects with the java Object equivalent
        emailId = findViewById(R.id.email);// associating xml objects with the java Object equivalent
        userFirst = findViewById(R.id.firstName);// associating xml objects with the java Object equivalent
        userLast = findViewById(R.id.lastName);// associating xml objects with the java Object equivalent
        password = findViewById(R.id.password);// associating xml objects with the java Object equivalent
        buttonSignUp = findViewById(R.id.signUp);// associating xml objects with the java Object equivalent
        textViewLogin = findViewById(R.id.loginLink);// associating xml objects with the java Object equivalent

        /**/
        buttonSignUp.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                final String firstName = userFirst.getText().toString().trim();//extracted data from xml object and converted into a string
                final String lastName = userLast.getText().toString().trim();//extracted data from xml object and converted into a string
                final String email = emailId.getText().toString().trim();//extracted data from xml object and converted into a string
                final String passwd = password.getText().toString().trim();//extracted data from xml object and converted into a string
                final String username = userID.getText().toString().trim();//extracted data from xml object and converted into a string

                if(TextUtils.isEmpty(firstName)){//checking if user entered there firstName
                    emailId.setError("Please enter first name");
                    emailId.requestFocus();
                }
                else if (TextUtils.isEmpty(lastName)){//checking if user entered there lastName
                    password.setError("Please enter last name");
                    password.requestFocus();
                }
                else if(TextUtils.isEmpty(email)){//checking if user entered their email
                    emailId.setError("Please enter email id");
                    emailId.requestFocus();
                }
                else if(TextUtils.isEmpty(passwd)){//checking if user entered their password
                    password.setError("Please enter your password");
                    password.requestFocus();
                }
                else if(passwd.length()<6){//checks if the user entered a password lass than 6 characters
                    password.setError("Password Must be Greater than 6 Characters");
                }
                else if(!(TextUtils.isEmpty(firstName) && TextUtils.isEmpty(lastName) && TextUtils.isEmpty(email)
                        && TextUtils.isEmpty(passwd) && passwd.length()<6)) {// if all the requirments are met than we can send our put request to the database

                    //put request for registering
                    String url = "http://50.19.176.137:8000/customer/register";

                    StringRequest putRequest = new StringRequest(Request.Method.PUT, url,
                            new Response.Listener<String>()
                            {
                                @Override
                                public void onResponse(String response) {
                                    // response
                                    Toast.makeText(Register.this,response.toString(),Toast.LENGTH_LONG).show();

                                    //pref.writeUserName(username);
                                    //pref.changeLogStatus(true);

                                    Intent twoButton = new Intent(Register.this, Login.class);// creating an intent to change to the twoButton xml
                                    startActivity(twoButton);// move to the two button page
                                    finish();// this prevents the user from coming back to the register page if the successfully register
                                }
                            },
                            new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {//if our put request is un-successful we want display that there was an error to the user
                                    // error
                                    error.printStackTrace();
                                    Toast.makeText(Register.this, error.toString(),Toast.LENGTH_LONG).show();
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
                            params.put("password", passwd);

                            return params;
                        }
                    };

                    VolleySingleton.getInstance(Register.this).addToRequestQueue(putRequest);// sending the request to the database
                }
                else {
                    Toast.makeText(Register.this, "Error Occured", Toast.LENGTH_SHORT).show();//if the request couldn't be made show an error to the user
                }

            }
        });

        textViewLogin.setOnClickListener(new View.OnClickListener() {// when the user clicks on this link we change to xml to the log in layout
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(Register.this, Login.class);
                startActivity(intent);
            }
        });
    }
}
