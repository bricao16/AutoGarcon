package auto_garcon.initialpages;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import auto_garcon.accountstuff.PasswordChange;
import auto_garcon.homestuff.Home;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;
import auto_garcon.singleton.VolleySingleton;

/**
 * This class handles the main functions of the two button page
 * its tied two the TwoButton xml layout
 * This class is also capable of linking the user to the Home page and the QrCode page
 */
public class TwoButtonPage extends AppCompatActivity {
    private SharedPreference pref;//saving user transaction data such as food item chosen by the user.
    private ShoppingCartSingleton shoppingCart;//keeping food item chosen by the user.

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
        super.onCreate(savedInstanceState);
        // Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this));//error handling for unexpected crashes

        setContentView(R.layout.activity_two_button_page);
        pref = new SharedPreference(this);//file for keeping track of cart
        pref.setShoppingCart(new ShoppingCartSingleton());

        /**
         * volley request to get user favorites so we can store their IDs in SharedPreference
         */
        StringRequest getRequestForFavorites = new StringRequest(Request.Method.GET, "https://50.19.176.137:8001/favorites/" + pref.getUser().getUsername(),
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject favoritesJSONObject = new JSONObject(response);
                            //parsing through json from get request to add them to menu
                            Iterator<String> keys = favoritesJSONObject.keys();
                            while (keys.hasNext()) {
                                String key = keys.next();

                                if (favoritesJSONObject.get(key) instanceof JSONObject) {
                                    JSONObject item = favoritesJSONObject.getJSONObject(key);

                                    pref.addToFavorites(Integer.parseInt(item.get("restaurant_id").toString()));
                                }
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        if (error.networkResponse != null && error.networkResponse.statusCode == 500) {
                            Log.d("Error in loading screen", "Error retrieving favorites");
                        }
                    }
                }
        ) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {//adds header to request
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Authorization", "Bearer " + pref.getAuth());
                return headers;
            }
        };

        VolleySingleton.getInstance(TwoButtonPage.this).addToRequestQueue(getRequestForFavorites);

        /**
         * buttons to go to QRcode activity or Home activity
         */
        Button scannerButton = findViewById(R.id.scanner_button);// associating xml objects with the java Object equivalent
        Button favButton = findViewById(R.id.fav_button);// associating xml objects with the java Object equivalent

        /*
        When one of these buttons is clicked it will take the users onto either the QRcode or the Favorite Page
         */
        scannerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {//when the scannerButton is clicked this will send the user to the QrCode page
                startActivity(new Intent(TwoButtonPage.this, QRcode.class));
            }
        });

        favButton.setOnClickListener(new View.OnClickListener() {// when the favButton is clicked user is sent to the HomePage
            @Override
            public void onClick(View v) {
                startActivity(new Intent(TwoButtonPage.this, Home.class));
            }
        });

    }

    /**
     * Called after {@link #onCreate} &mdash; or after {@link #onRestart} when
     * the activity had been stopped, but is now again being displayed to the
     * user. It will usually be followed by {@link #onResume}. This is a good place to begin
     * drawing visual elements, running animations, etc.
     *
     * <p>You can call {@link #finish} from within this function, in
     * which case {@link #onStop} will be immediately called after {@link #onStart} without the
     * lifecycle transitions in-between ({@link #onResume}, {@link #onPause}, etc) executing.
     *
     * <p><em>Derived classes must call through to the super class's
     * implementation of this method.  If they do not, an exception will be
     * thrown.</em></p>
     *
     * @see #onCreate
     * @see #onStop
     * @see #onResume
     */
    @Override
    protected void onStart() {
        super.onStart();
        if (pref.getUser().getChangePassword() == 1) {//check if they have updated their password
            //if not send them back to PasswordChange page and force them to update their password
            Intent intent = new Intent(TwoButtonPage.this, PasswordChange.class);
            startActivity(intent);
            Toast.makeText(this, "Please Update your Password", Toast.LENGTH_LONG).show();
        }
    }
}