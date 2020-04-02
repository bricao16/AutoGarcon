package auto_garcon.MenuStuff;

import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;

import com.example.auto_garcon.R;

import auto_garcon.Singleton.SharedPreference;
import auto_garcon.Singleton.ShoppingCartSingleton;

public class MenuPopup extends AppCompatActivity {

    private SharedPreference pref;
    private MenuItem item;
    public static Activity menuPopupDeletion;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.menu_popup);

        item = (MenuItem) this.getIntent().getSerializableExtra("menuItem");
        pref = new SharedPreference(this);


        DisplayMetrics dm = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(dm);

        int width = dm.widthPixels;
        int height = dm.heightPixels;

        getWindow().setLayout((int)(width * .7), (int)(height * .6));

        WindowManager.LayoutParams params = getWindow().getAttributes();
        params.gravity = Gravity.CENTER;
        params.x = 0;
        params.y = -20;

        getWindow().setAttributes(params);

        menuPopupDeletion = this;

        Button addToCart = findViewById(R.id.add_to_cart);

        /*this will check if the cart is currently empty and if it it will just add to it
        otherwise it will get the cart, add to it, then set the cart in SharedPreference again*/
        addToCart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ShoppingCartSingleton cart;

                if(pref.getShoppingCart().getRestaurantID() == item.getRestaurantID()) {
                    cart = pref.getShoppingCart();
                    cart.addToCart(item);
                    pref.setShoppingCart(cart);
                    finish();
                }
                else if(pref.getShoppingCart().getCart().size() == 0) {
                    cart = new ShoppingCartSingleton(item.getRestaurantID());
                    cart.addToCart(item);
                    pref.setShoppingCart(cart);
                    finish();
                }
                else {
                    Intent confirm = new Intent(MenuPopup.this, ConfirmPopup.class);
                    confirm.putExtra("menuItem", item);
                    startActivity(confirm);
                }
            }
        });
    }
}
