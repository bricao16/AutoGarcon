package auto_garcon.InitialPages;

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
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.auto_garcon.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import auto_garcon.AccountStuff.Account;
import auto_garcon.Singleton.PreferenceSingleton;
import auto_garcon.Singleton.VolleySingleton;

public class Login extends AppCompatActivity {
    Context context = this;
    private EditText emailId;
    private EditText password;
    private Button buttonSignIn;
    private TextView textViewSignUp;
    private Account currentAccount;
    private AccountManager accountManager;
    public PreferenceSingleton pref;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        // this is how we identify an existing user when they've already logged in
        pref = new PreferenceSingleton(this);

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

        buttonSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                final String email = emailId.getText().toString().trim();
                final String passwd = password.getText().toString().trim();
                if(email.isEmpty()){
                    emailId.setError("Please enter email id");
                    emailId.requestFocus();
                }
                else if (passwd.isEmpty()){
                    password.setError("Please enter your password");
                    password.requestFocus();
                }
                else if(email.isEmpty() && passwd.isEmpty()){
                    Toast.makeText(Login.this,"Fields are Empty!", Toast.LENGTH_SHORT).show();
                }
                else if (!(email.isEmpty() && passwd.isEmpty())) {
Log.d("HI", email);
                    Log.d("HI", passwd);

                    //some request to server goes here
                    String url = "http://50.19.176.137:8000/customers/login";
                    JSONObject obj =new JSONObject();//for the request paramter
                    try{
                        obj.put("username",email);
                        obj.put("password",passwd);
                    }catch (JSONException e){
                        e.printStackTrace();
                    }
                    JsonObjectRequest postRequest = new JsonObjectRequest(Request.Method.POST, url,obj,
                            new Response.Listener<JSONObject>()
                            {
                                @Override
                                public void onResponse(JSONObject response) {
                                   // Log.d("TAG",response);
                                    // response
                                    try {
                                           JSONObject object = response.getJSONObject("user");
                                            String token = response.getString("token");
                                            String username = object.getString("first_name");
                                        pref.writeName(username);
                                        pref.setAuthToken(token);
                                        pref.changeLogStatus(true);

                                        Intent home = new Intent(Login.this, Home.class);
                                        startActivity(home);

                                    } catch (JSONException e) {
                                        e.printStackTrace();
                                    }
                                }
                            },
                            new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    // error
                                    error.printStackTrace();
                                    Toast.makeText(Login.this,error.toString(),Toast.LENGTH_LONG).show();
                                }
                            }
                    ) {
                        @Override
                        protected Map<String, String> getParams() {
                            Map<String, String> params = new HashMap<String, String>();
                            params.put("username", email);
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

        textViewSignUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent signUp = new Intent(Login.this, Register.class);
                startActivity(signUp);
            }
        });
    }
}
