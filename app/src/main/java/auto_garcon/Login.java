package auto_garcon;

import androidx.appcompat.app.AppCompatActivity;

import android.accounts.AccountManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import android.util.Log;
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

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Login
 * This page is initially loaded after the Loading page, but may be reached from the Logout activity or registration activity.
 * User may enter their username and password to login.
 * If they login succesfully they go to the Home page
 * If they do not they recieve an error.
 * They may also select the do not have an account page which will send the to the registration activity.
 *
 */
public class Login extends AppCompatActivity {
    Context context = this;
    private EditText emailId;
    private EditText password;
    private Button buttonSignIn;
    private TextView textViewSignUp;
    private Account currentAccount;
    private AccountManager accountManager;
    public Prefrence pref;

    /**
     * Creates Layout for Login Page
     * loads activity_login xml page
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        // this is how we identify an existing user when they've already logged in
        pref = new Prefrence(this);

/*
        if(pref.getLoginStatus()){//send them to the homepage if their already logged in

            //Todo: check if there token is still valid
            Intent intent  = new Intent(Login.this, Home.class);
            startActivity(intent);
        }
*/
        emailId = findViewById(R.id.email);
        password = findViewById(R.id.password);
        buttonSignIn = findViewById(R.id.signUp);
        textViewSignUp = findViewById(R.id.loginLink);

        /**
         * Listener for elements
         * Listens for...
         *     email
         *     password
         *     sign-in
         *     sign-up
         */
        buttonSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                final String email = emailId.getText().toString().trim();
                final String passwd = password.getText().toString().trim();
                //Error if email is empty
                if(email.isEmpty()){
                    emailId.setError("Please enter email id");
                    emailId.requestFocus();
                }
                //error if password is empty
                else if (passwd.isEmpty()){
                    password.setError("Please enter your password");
                    password.requestFocus();
                }
                //Error if both fields are empty
                else if(email.isEmpty() && passwd.isEmpty()){
                    Toast.makeText(Login.this,"Fields are Empty!", Toast.LENGTH_SHORT).show();
                }
                //If the password and email fields have text entered in them by the user
                //A Request is made to the server to verify the login.
                else if (!(email.isEmpty() && passwd.isEmpty())) {
Log.d("HI", email);
                    Log.d("HI", passwd);

                    //some request to server goes here
                    String url = "http://50.19.176.137:8000/customers/login";
                    StringRequest postRequest = new StringRequest(Request.Method.POST, url,
                            new Response.Listener<String>()
                            {
                                @Override
                                public void onResponse(String response) {
                                    // response
                                    try {
                                        //creating JSON object from response
                                        JSONObject obj = new JSONObject(response);

                                        //if no error set auth token and user name in preference class and start new activity
                                        if(!obj.getBoolean("error")) {
                                            JSONObject user = obj.getJSONObject("user");
                                            JSONObject token = obj.getJSONObject("token");

                                            pref.writeName(user.getString("user_id"));
                                            pref.setAuthToken(token.getString("token"));
                                            pref.changeLogStatus(true);

                                            Intent home = new Intent(Login.this, Home.class);
                                            startActivity(home);
                                        }
                                        //Error in auth token
                                        else {
                                            Toast.makeText(getApplicationContext(), obj.getString("message"), Toast.LENGTH_SHORT).show();
                                        }
                                    } catch (JSONException e) {
                                        e.printStackTrace();
                                    }
                                }
                            },
                            //displays login error on screen.
                            new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    // error
                                    error.printStackTrace();
                                Toast.makeText(Login.this,error.toString(),Toast.LENGTH_LONG).show();
                                }
                            }
                    ) {
                        /**
                         * Function to get paramaters from the customer_id and password.
                         * @return
                         */
                        @Override
                        protected Map<String, String> getParams() {
                            Map<String, String> params = new HashMap<String, String>();
                            params.put("customer_id", email);
                            params.put("password", passwd);

                            return params;
                        }
                    };
                    postRequest.setShouldCache(false);
                    VolleySingleton.getInstance(Login.this).addToRequestQueue(postRequest);
                }
                else{
                    Toast.makeText(Login.this, "Error Occurred", Toast.LENGTH_SHORT);
                }
            }
        });
/**
 * If the account creation button is selected then,
 * activity will move to the registration.
 */
        textViewSignUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent signUp = new Intent(Login.this, Register.class);
                startActivity(signUp);
            }
        });
    }
}
