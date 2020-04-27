package auto_garcon.initialpages;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.auto_garcon.R;

import org.json.JSONException;
import org.json.JSONObject;

import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.UserSingleton;
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
                    userFirst.setError("Please enter first name");
                    userFirst.requestFocus();
                }
                else if (TextUtils.isEmpty(lastName)){//checking if user entered there lastName
                    userLast.setError("Please enter last name");
                    userLast.requestFocus();
                }
                else if(TextUtils.isEmpty(email)){//checking if user entered their email
                    emailId.setError("Please enter email id");
                    emailId.requestFocus();
                }
                else if(Patterns.EMAIL_ADDRESS.matcher(email).matches()){// use android built patterns function to test if the email matches
                    emailId.setError("Please enter a valid email");
                    emailId.requestFocus();
                }
                else if(TextUtils.isEmpty(passwd)){//checking if user entered their password
                    password.setError("Please enter your password");
                    password.requestFocus();
                }
                else if(passwd.length()<6){//checks if the user entered a password lass than 6 characters
                    password.setError("Password Must be Greater than 6 Characters");
                    password.requestFocus();

                }
                else if(passwd.equals(passwd.toLowerCase())){//checks if the password contains one uppercase
                    password.setError("Password Must contain at least one uppercase");
                    password.requestFocus();
                }
                else if(passwd.equals(passwd.toUpperCase())){//checkis if password contains one lowercase
                    password.setError("Password Must contain at least one lowercase");
                    password.requestFocus();
                }
                else if(username.length()>50){
                    userID.setError("Please enter a username with less than 50 characters");
                    userID.requestFocus();

                }
                else if(!(TextUtils.isEmpty(firstName) && TextUtils.isEmpty(lastName) && TextUtils.isEmpty(email)
                        && TextUtils.isEmpty(passwd) && passwd.length()<6)) {// if all the requirments are met than we can send our put request to the database

                    //put request for registering
                    String url = "http://50.19.176.137:8000/customer/register";
                    JSONObject obj = new JSONObject();//json object that will be sent as the request parameter
                    try{
                        obj.put("customer_id", username);
                        obj.put("first_name",firstName);
                        obj.put("last_name",lastName);
                        obj.put("email",email);
                        obj.put("password", passwd);
                    }
                    catch (JSONException e){
                        //TODO figure out how to handle this other than stack trace
                        e.printStackTrace();
                    }

                    JsonObjectRequest putRequest = new JsonObjectRequest(Request.Method.PUT, url, obj,
                            new Response.Listener<JSONObject>()
                            {
                                @Override
                                public void onResponse(JSONObject response) {
                                    // response
                                    try {
                                        JSONObject object = response.getJSONObject("customer");
                                        String token = response.getString("token");

                                        pref.setUser(new UserSingleton(object.get("first_name").toString(),  object.get("last_name").toString(),
                                                object.get("customer_id").toString(), object.get("email").toString()));
                                        pref.setAuthToken(token);
                                        pref.changeLogStatus(true);

                                        Intent twoButton = new Intent(Register.this, TwoButtonPage.class);// goes to two Button Page
                                        startActivity(twoButton);
                                        finish();//prevents user from coming back
                                    } catch (JSONException e) {
                                        e.printStackTrace();
                                    }
                                }
                            },
                            new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    // error if the request fails
                                    error.printStackTrace();
                                    Toast.makeText(Register.this, error.toString(), Toast.LENGTH_LONG).show();
                                }
                            }
                    );

                    VolleySingleton.getInstance(Register.this).addToRequestQueue(putRequest);// making the actual request
                }
                else{
                    Toast.makeText(Register.this, "Error Occurred", Toast.LENGTH_SHORT).show();// if something fails with our request display error
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