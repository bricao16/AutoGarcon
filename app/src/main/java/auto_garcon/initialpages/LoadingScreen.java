package auto_garcon.initialpages;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import com.example.auto_garcon.R;

/** Initial loading screen. */
public class LoadingScreen extends AppCompatActivity {
    private static int LOADING_SCREEN = 3000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_loading_screen);

        /** Waits for 3000 milliseconds then goes to login activity*/
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Intent toLogin = new Intent(LoadingScreen.this, Login.class);
                startActivity(toLogin);
                finish();
            }
        }, LOADING_SCREEN);
    }
}
