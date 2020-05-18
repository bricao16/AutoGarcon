package auto_garcon.initialpages;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

import auto_garcon.homestuff.Home;
import auto_garcon.homestuff.HomeAdapter;
import auto_garcon.homestuff.RestaurantItem;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;
import auto_garcon.singleton.VolleySingleton;

/** Initial loading screen. */
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
     *     previously being shut down then this Bundle contains the data it most
     *     recently supplied in {@link #onSaveInstanceState}.  <b><i>Note: Otherwise it is null.</i></b>
     *
     * @see #onStart
     * @see #onSaveInstanceState
     * @see #onRestoreInstanceState
     * @see #onPostCreate
     */
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
        }, 3000);
    }
}