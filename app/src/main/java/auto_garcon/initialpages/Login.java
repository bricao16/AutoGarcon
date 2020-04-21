package auto_garcon.initialpages;

import androidx.appcompat.app.AppCompatActivity;

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
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.auto_garcon.R;

import org.json.JSONException;
import org.json.JSONObject;

import auto_garcon.cartorderhistory.ShoppingCart;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.UserSingleton;
import auto_garcon.singleton.VolleySingleton;
/**
 * This class handles all user login functionality
 * This class is linked to the Login xml and can send the user to the TwoButton page and
 */

public class Login extends AppCompatActivity {
    private EditText usernm;// used to extract data from emathe login activtiy xml
    private EditText password; // used to extract data from the password field in the login activity xml
    private Button buttonSignIn;// used to identify when the user is attempting to sign in
    private TextView textViewSignUp;// used to identify if the user wants to register
    private SharedPreference pref;//This object is used to store information about the user that can be used outside of this page

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        pref = new SharedPreference(this);// creating a sharedPrefrence object that access the same file of all other shared prefrences on the app


        if(pref.getLoginStatus()){ // checks if they are already signed in if so we send them to the homepage if their already logged in
            //Todo: check if there token is still valid
            Intent intent  = new Intent(Login.this, TwoButtonPage.class);
            startActivity(intent);
            finish();//prevents them from coming back to this page
        }

        usernm = findViewById(R.id.username);// associating xml objects with the java Object equivalent
        password = findViewById(R.id.password);// associating xml objects with the java Object equivalent
        buttonSignIn = findViewById(R.id.signUp);// associating xml objects with the java Object equivalent
        textViewSignUp = findViewById(R.id.loginLink);// associating xml objects with the java Object equivalent

        buttonSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                final String username = usernm.getText().toString().trim();//extracted data from xml object and converted into a string
                final String passwd = password.getText().toString().trim();//extracted data from xml object and converted into a string

                if(username.isEmpty()){//checks if the username they are trying to submit is empty
                    usernm.setError("Please enter username");
                    usernm.requestFocus();
                }
                else if (passwd.isEmpty()){//checks if the password the user is trying to submit is empty
                    password.setError("Please enter your password");
                    password.requestFocus();
                }
                else if (!(username.isEmpty() && passwd.isEmpty())) {//if everything is good we proceed with the get request

                    //post request for logging in
                    String url = "http://50.19.176.137:8000/customer/login";
                    JSONObject obj = new JSONObject();//json object that will be sent as the request parameter
                    try{
                        obj.put("username", username);
                        obj.put("password", passwd);
                    }catch (JSONException e){
                        //TODO figure out how to handle this other than stack trace
                        e.printStackTrace();
                    }

                    JsonObjectRequest postRequest = new JsonObjectRequest(Request.Method.POST, url, obj,
                            new Response.Listener<JSONObject>()
                            {
                                @Override
                                public void onResponse(JSONObject response) {
                                    // response
                                    try {
                                        JSONObject object = response.getJSONObject("user");
                                        String token = response.getString("token");

                                        pref.setUser(new UserSingleton(object.get("first_name").toString(),  object.get("last_name").toString(),
                                                object.get("customer_id").toString(), object.get("email").toString()));
                                        pref.setAuthToken(token);
                                        pref.changeLogStatus(true);

                                        Log.d("HI", response.toString());

                                        Intent twoButton = new Intent(Login.this, TwoButtonPage.class);
                                        startActivity(twoButton);
                                        finish();
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
                                    Toast.makeText(Login.this,error.toString(),Toast.LENGTH_LONG).show();
                                }
                            }
                    );

                    VolleySingleton.getInstance(Login.this).addToRequestQueue(postRequest);// making the actual request
                }
                else{
                    Toast.makeText(Login.this, "Error Occurred", Toast.LENGTH_SHORT).show();// if something fails with our request display error
                }
            }
        });

        textViewSignUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {// if user wants to go register page this will send them there
                Intent signUp = new Intent(Login.this, Register.class);
                startActivity(signUp);
            }
        });
    }
}
