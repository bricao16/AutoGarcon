package auto_garcon.AccountStuff;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import com.example.auto_garcon.R;

import auto_garcon.Singleton.SharedPreference;

public class Account extends AppCompatActivity {

    private SharedPreference pref;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_account);

        pref = new SharedPreference(this);

        TextView changePassword = findViewById(R.id.change_password);

        changePassword.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent changePassword = new Intent(Account.this, PasswordChange.class);
                startActivity(changePassword);
            }
        });
    }
}
