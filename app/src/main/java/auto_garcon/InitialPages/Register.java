package auto_garcon.InitialPages;

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

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import auto_garcon.Singleton.SharedPreference;
import auto_garcon.Singleton.VolleySingleton;

public class Register extends AppCompatActivity {
    EditText emailId;//used to extract data from xml page of the Registration Activity
    EditText userFirst;//used to extract data from xml page of the Registration Activity
    EditText userLast;//used to extract data from xml page of the Registration Activity
    EditText password;//used to extract data from xml page of the Registration Activity
    Button buttonSignUp;//used to identify when user wants to register
    TextView textViewLogin;//used to send user into Sign in Activity
    EditText userID;
    private SharedPreference pref;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        pref = new SharedPreference(this);

        userID = findViewById(R.id.username);
        emailId = findViewById(R.id.email);
        userFirst = findViewById(R.id.firstName);
        userLast = findViewById(R.id.lastName);
        password = findViewById(R.id.password);
        buttonSignUp = findViewById(R.id.signUp);
        textViewLogin = findViewById(R.id.loginLink);

        buttonSignUp.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                final String firstName = userFirst.getText().toString().trim();
                final String lastName = userLast.getText().toString().trim();
                final String email = emailId.getText().toString().trim();
                final String passwd = password.getText().toString().trim();
                final String username = userID.getText().toString().trim();

                if(TextUtils.isEmpty(firstName)){
                    emailId.setError("Please enter first name");
                    emailId.requestFocus();
                }
                else if (TextUtils.isEmpty(lastName)){
                    password.setError("Please enter last name");
                    password.requestFocus();
                }
                else if(TextUtils.isEmpty(email)){
                    emailId.setError("Please enter email id");
                    emailId.requestFocus();
                }
                else if(TextUtils.isEmpty(passwd)){
                    password.setError("Please enter your password");
                    password.requestFocus();
                }
                else if(passwd.length()<6){
                    password.setError("Password Must be Greater than 6 Characters");
                }
                else if(!(TextUtils.isEmpty(firstName) && TextUtils.isEmpty(lastName) && TextUtils.isEmpty(email)
                        && TextUtils.isEmpty(passwd) && passwd.length()<6)) {

                    //put request for registering
                    String url = "http://50.19.176.137:8000/customer/register";

                    StringRequest putRequest = new StringRequest(Request.Method.PUT, url,
                            new Response.Listener<String>()
                            {
                                @Override
                                public void onResponse(String response) {
                                    // response
                                    Toast.makeText(Register.this,response.toString(),Toast.LENGTH_LONG).show();

                                    pref.writeUserName(username);
                                    pref.changeLogStatus(true);

                                    Intent twoButton = new Intent(Register.this, twoButtonPage.class);
                                    startActivity(twoButton);
                                    finish();
                                }
                            },
                            new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    // error
                                    error.printStackTrace();
                                    Toast.makeText(Register.this, error.toString(),Toast.LENGTH_LONG).show();
                                }
                            }
                    ) {

                        @Override
                        protected Map<String, String> getParams() {
                            Map<String, String> params = new HashMap<String, String>();
                            params.put("customer_id", username);
                            params.put("first_name", firstName);
                            params.put("last_name", lastName);
                            params.put("email", email);
                            params.put("password", passwd);

                            return params;
                        }
                    };

                    VolleySingleton.getInstance(Register.this).addToRequestQueue(putRequest);
                }
                else {
                    Toast.makeText(Register.this, "Error Occured", Toast.LENGTH_SHORT).show();
                }

            }
        });

        textViewLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(Register.this, Login.class);
                startActivity(intent);
            }
        });
    }
}
