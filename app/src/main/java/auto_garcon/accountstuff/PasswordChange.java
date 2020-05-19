package auto_garcon.accountstuff;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;

import java.util.HashMap;
import java.util.Map;

import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.Login;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.VolleySingleton;

/**
 * This class will change the password for the user
 * This will be done by sending a get request to the database
 */
public class PasswordChange extends AppCompatActivity {


    private SharedPreference pref;

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
        //Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this));//error handling for unexpected crashes

        pref = new SharedPreference(this);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_password_change);

        final EditText oldPassword = findViewById(R.id.old_password);
        final EditText confirmPassword = findViewById(R.id.confirm_password);
        final EditText newPassword = findViewById(R.id.new_password);
        Button savePasswordChange = findViewById(R.id.save_password_change);

        /**
         * onClick that will sends change password volley request
         */
        savePasswordChange.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final String oldPasswordString = oldPassword.getText().toString().trim();
                String confirmPasswordString = confirmPassword.getText().toString().trim();
                final String newPasswordString = newPassword.getText().toString().trim();

                if (TextUtils.isEmpty(oldPasswordString)) {
                    oldPassword.setError("Please enter your old password");
                    oldPassword.requestFocus();
                } else if (TextUtils.isEmpty(confirmPasswordString)) {
                    confirmPassword.setError("Please confirm your password");
                    confirmPassword.requestFocus();
                } else if (TextUtils.isEmpty(newPasswordString)) {
                    newPassword.setError("Please enter a new password");
                    newPassword.requestFocus();
                } else if (!oldPassword.getText().toString().trim().equals(confirmPassword.getText().toString().trim())) {
                    Toast.makeText(PasswordChange.this, "Passwords do not match", Toast.LENGTH_SHORT).show();
                    confirmPassword.requestFocus();
                } else if (newPassword.getText().toString().trim().length() < 6) {
                    newPassword.setError("Password Must be Greater than 6 Characters");
                } else {
                    StringRequest postRequestForPasswordUpdate = new StringRequest(Request.Method.POST, "https://50.19.176.137:8001/customer/password/update",
                            new Response.Listener<String>() {
                                @Override
                                public void onResponse(String response) {
                                    pref.getUser().setChangePassword(0);
                                    Toast.makeText(PasswordChange.this, response, Toast.LENGTH_LONG).show();

                                    startActivity(new Intent(getBaseContext(), Home.class));
                                    Toast.makeText(getBaseContext(), "Password Saved", Toast.LENGTH_LONG).show();
                                }
                            },
                            new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    if (error.networkResponse.statusCode == 400) {
                                        Toast.makeText(getBaseContext(), "Missing parameter", Toast.LENGTH_LONG).show();
                                    }
                                    if (error.networkResponse.statusCode == 401) {
                                        pref.changeLogStatus(false);

                                        startActivity(new Intent(getBaseContext(), Login.class));
                                        Toast.makeText(getBaseContext(), "session expired", Toast.LENGTH_LONG).show();
                                    }
                                    if (error.networkResponse.statusCode == 500) {
                                        Toast.makeText(getBaseContext(), "Error updating", Toast.LENGTH_LONG).show();
                                    }
                                }
                            }) {

                        @Override
                        protected Map<String, String> getParams() {// inserting parameters for the put request
                            Map<String, String> params = new HashMap<String, String>();
                            params.put("customer_id", pref.getUser().getUsername());
                            params.put("current_password", oldPasswordString);
                            params.put("new_password", newPasswordString);

                            Log.d("SDSDFIO", params.toString());
                            return params;
                        }

                        @Override
                        public Map<String, String> getHeaders() throws AuthFailureError {//adds header to request
                            HashMap<String, String> headers = new HashMap<String, String>();
                            headers.put("Authorization", "Bearer " + pref.getAuth());
                            return headers;
                        }
                    };

                    VolleySingleton.getInstance(PasswordChange.this).addToRequestQueue(postRequestForPasswordUpdate);
                }
            }
        });
    }
}
