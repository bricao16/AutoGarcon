package auto_garcon.accountstuff;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;

import java.util.HashMap;
import java.util.Map;

import auto_garcon.menustuff.Menu;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.VolleySingleton;

/**
 * This class will change the password for the user
 * This will be done by sending a get request to the database
 */
public class PasswordChange extends AppCompatActivity {


    private SharedPreference pref;
    /**
     * This method will lay the constraints for the xml objects for this page
     * @param savedInstanceState contains the data that has been most recently supplied on the register xml after the creation of the app
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_password_change);

        pref = new SharedPreference(this);
        final EditText oldPassword = findViewById(R.id.old_password);
        final EditText confirmPassword = findViewById(R.id.confirm_password);
        final EditText newPassword = findViewById(R.id.new_password);
        Button savePasswordChange = findViewById(R.id.save_password_change);

        savePasswordChange.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final String oldPasswordString = oldPassword.getText().toString().trim();
                String confirmPasswordString = confirmPassword.getText().toString().trim();
                final String newPasswordString = newPassword.getText().toString().trim();

                if(TextUtils.isEmpty(oldPasswordString)){
                    oldPassword.setError("Please enter your old password");
                    oldPassword.requestFocus();
                }
                else if(TextUtils.isEmpty(confirmPasswordString)){
                    confirmPassword.setError("Please confirm your password");
                    confirmPassword.requestFocus();
                }
                else if(TextUtils.isEmpty(newPasswordString)){
                    newPassword.setError("Please enter a new password");
                    newPassword.requestFocus();
                }
                else if(!oldPassword.getText().toString().trim().equals(confirmPassword.getText().toString().trim())) {
                    Toast.makeText(PasswordChange.this, "Passwords do not match", Toast.LENGTH_SHORT).show();
                    confirmPassword.requestFocus();
                }
                else if(newPassword.getText().toString().trim().length() < 6){
                    newPassword.setError("Password Must be Greater than 6 Characters");
                }
                else {
                    StringRequest postRequestForPasswordUpdate = new StringRequest(Request.Method.POST, "http://50.19.176.137:8000/customer/password/update",
                            new Response.Listener<String>() {
                                @Override
                                public void onResponse(String response) {
                                    Toast.makeText(PasswordChange.this, response, Toast.LENGTH_LONG).show();
                                }
                            },
                            new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {

                                }
                            }) {

                            @Override
                            protected Map<String, String> getParams() {// inserting parameters for the put request
                                Map<String, String> params = new HashMap<String, String>();
                                params.put("customer_id", pref.getUser().getUsername());
                                params.put("current_password", oldPasswordString);
                                params.put("new_password", newPasswordString);
                                return params;
                            }

                            @Override
                            public Map<String, String> getHeaders() throws AuthFailureError {//adds header to request
                                HashMap<String,String> headers = new HashMap<String,String>();
                                headers.put("Authorization","Bearer " + pref.getAuth());
                                return headers;
                            }
                    };

                    VolleySingleton.getInstance(PasswordChange.this).addToRequestQueue(postRequestForPasswordUpdate);
                }
            }
        });
    }
}
