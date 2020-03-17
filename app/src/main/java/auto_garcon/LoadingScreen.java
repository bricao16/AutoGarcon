package auto_garcon;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import com.example.auto_garcon.R;

/**
 * Loading Screen Activity
 * Lets the loading page sit for 3 seconds displaying logo
 * After the three seconds goes to the login activity
 * This is the activity that is run first when the app starts up.
 */
public class LoadingScreen extends AppCompatActivity {

    //Time for Loading Screen to stay up for.
    private static int LOADING_SCREEN = 3000;

    /**
     * Creates the layout of the Loading page and changes activity to Login
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_loading_screen);

        new Handler().postDelayed(new Runnable() {
            /**
             * Runs after delay is stalled
             * Changes activity from Loading screen to Login
             */
            @Override
            public void run() {
                Intent toLogin = new Intent(LoadingScreen.this, Login.class);
                startActivity(toLogin);
                finish();
            }
        }, LOADING_SCREEN);
    }
}
