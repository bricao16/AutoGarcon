package auto_garcon.accountstuff;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.auto_garcon.R;

/**
 * This class will change the password for the user
 * This will be done by sending a get request to the database
 */
public class PasswordChange extends AppCompatActivity {


    /**
     * This method will lay the constraints for the xml objects for this page
     * @param savedInstanceState contains the data that has been most recently supplied on the register xml after the creation of the app
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_password_change);

        final EditText oldPassword = findViewById(R.id.old_password);
        final EditText confirmPassword = findViewById(R.id.confirm_password);
        final EditText newPassword = findViewById(R.id.new_password);
        Button savePasswordChange = findViewById(R.id.save_password_change);

        savePasswordChange.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String oldPasswordString = oldPassword.getText().toString().trim();
                String confirmPasswordString = confirmPassword.getText().toString().trim();
                String newPasswordString = newPassword.getText().toString().trim();

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
                    //post request will go here

                }
            }
        });
    }
}
