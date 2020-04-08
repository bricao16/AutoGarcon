package auto_garcon.AccountStuff;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.example.auto_garcon.R;

import auto_garcon.Singleton.SharedPreference;
import auto_garcon.Singleton.UserSingleton;

public class Account extends AppCompatActivity {

    private SharedPreference pref;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_account);

        pref = new SharedPreference(this);

        final EditText changeFirstName = findViewById(R.id.first_name_change);
        final EditText changeLastName = findViewById(R.id.last_name_change);
        final EditText changeUsername = findViewById(R.id.change_username);
        final EditText changeEmail = findViewById(R.id.change_email);
        Button saveAccountChanges = findViewById(R.id.save_acct_change);
        TextView changePassword = findViewById(R.id.change_password);

        changeFirstName.setText(pref.getUser().getFirstName());
        changeLastName.setText(pref.getUser().getLastName());
        changeEmail.setText(pref.getUser().getEmail());
        changeUsername.setText(pref.getUser().getUsername());

        saveAccountChanges.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String newFirstName = changeFirstName.getText().toString().trim();
                String newLastName = changeLastName.getText().toString().trim();
                String newUsername = changeUsername.getText().toString().trim();
                String newEmail = changeEmail.getText().toString().trim();

                pref.setUser(new UserSingleton(newFirstName, newLastName, newUsername, newEmail));

                //still need request to change this in the database
            }
        });

        changePassword.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent passwordChange = new Intent(Account.this, PasswordChange.class);
                startActivity(passwordChange);
            }
        });
    }
}
