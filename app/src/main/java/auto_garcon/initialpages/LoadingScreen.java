package auto_garcon.initialpages;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.widget.ProgressBar;

import androidx.appcompat.app.AppCompatActivity;

import com.example.auto_garcon.R;

import auto_garcon.ExceptionHandler;
import auto_garcon.NukeSSLCerts;
import auto_garcon.singleton.SharedPreference;

/**
 * Initial loading screen.
 */
public class LoadingScreen extends AppCompatActivity {
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
        NukeSSLCerts.nuke();

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_loading_screen);
        Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this));//error handling for unexpected crashes


        ProgressBar pb = findViewById(R.id.pbLoading);
        pb.setVisibility(ProgressBar.VISIBLE);


        /** Waits for 3000 milliseconds then goes to login activity*/
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Intent toLogin = new Intent(LoadingScreen.this, Login.class);
                startActivity(toLogin);
                finish();
            }
        }, 3000);
    }
}