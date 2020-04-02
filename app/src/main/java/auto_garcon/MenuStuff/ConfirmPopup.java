package auto_garcon.MenuStuff;

import androidx.appcompat.app.AppCompatActivity;

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

public class ConfirmPopup extends AppCompatActivity {

    private SharedPreference pref;
    private MenuItem item;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.confirm_popup);

        item = (MenuItem) this.getIntent().getSerializableExtra("menuItem");
        pref = new SharedPreference(this);


        DisplayMetrics dm = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(dm);

        int width = dm.widthPixels;
        int height = dm.heightPixels;

        getWindow().setLayout((int)(width * .5), (int)(height * .3));

        WindowManager.LayoutParams params = getWindow().getAttributes();
        params.gravity = Gravity.CENTER;
        params.x = 0;
        params.y = -20;

        getWindow().setAttributes(params);

        Button ConfirmClear = findViewById(R.id.confirm_clear);

        ConfirmClear.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ShoppingCartSingleton cart;

                cart = new ShoppingCartSingleton(item.getRestaurantID());

                cart.addToCart(item);
                pref.setShoppingCart(cart);

                MenuPopup.menuPopupDeletion.finish();
                finish();
            }
        });

    }
}
