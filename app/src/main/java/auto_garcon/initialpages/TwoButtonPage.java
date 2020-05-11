package auto_garcon.initialpages;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

import auto_garcon.homestuff.Home;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;
import auto_garcon.singleton.VolleySingleton;

/**
*This class handles the main functions of the two button page
 * its tied two the TwoButton xml layout
 * This class is also capable of linking the user to the Home page and the QrCode page
*/
public class TwoButtonPage extends AppCompatActivity {
    private SharedPreference pref;//saving user transaction data such as food item chosen by the user.
    private ShoppingCartSingleton shoppingCart;//keeping food item chosen by the user.
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_two_button_page);
        pref = new SharedPreference(this);//file for keeping track of cart
        Log.d("testing"," "+getIntent().getStringExtra("error"));
        StringRequest getRequestForFavorites = new StringRequest(Request.Method.GET, "http://50.19.176.137:8000/favorites/" + pref.getUser().getUsername(),
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject favoritesJSONObject = new JSONObject(response);
                            //parsing through json from get request to add them to menu
                            Iterator<String> keys = favoritesJSONObject.keys();
                            while(keys.hasNext()) {
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
                        if(error.networkResponse.statusCode == 500) {
                            Log.d("Error in loading screen", "Error retrieving favorites");
                        }
                    }
                }
        );

        VolleySingleton.getInstance(TwoButtonPage.this).addToRequestQueue(getRequestForFavorites);

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
}