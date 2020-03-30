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

        MenuItem menuItem1 = new MenuItem();
        MenuItem menuItem2 = new MenuItem();

        menuItem1.setNameOfItem("HI1");
        menuItem2.setNameOfItem("HI2");

        ShoppingCartSingleton.getCustomerCart().addToCart(menuItem1);
        ShoppingCartSingleton.getCustomerCart().addToCart(menuItem2);

        Toast.makeText(LoadingScreen.this, ShoppingCartSingleton.getCustomerCart().getCart().get(0).getNameOfItem(), Toast.LENGTH_SHORT).show();


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
