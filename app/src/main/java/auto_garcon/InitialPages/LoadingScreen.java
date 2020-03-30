package auto_garcon.InitialPages;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.widget.Toast;

import com.example.auto_garcon.R;

import auto_garcon.Cart_OrderHistory.ShoppingCart;
import auto_garcon.MenuStuff.MenuItem;
import auto_garcon.Singleton.ShoppingCartSingleton;

public class LoadingScreen extends AppCompatActivity {
    private static int LOADING_SCREEN = 3000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_loading_screen);

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
