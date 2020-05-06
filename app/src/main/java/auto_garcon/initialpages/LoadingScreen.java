package auto_garcon.initialpages;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import com.example.auto_garcon.R;

import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;

/** Initial loading screen. */
public class LoadingScreen extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_loading_screen);

        SharedPreference pref = new SharedPreference(LoadingScreen.this);
        ShoppingCartSingleton shoppingCart = new ShoppingCartSingleton();

        shoppingCart.setPrimaryColor("#0B658A");
        shoppingCart.setSecondaryColor("#102644");
        shoppingCart.setTertiaryColor("#318381");

        pref.setShoppingCart(shoppingCart);

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
