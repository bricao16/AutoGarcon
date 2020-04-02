package auto_garcon.HomeStuff;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;

import com.example.auto_garcon.R;

import auto_garcon.MenuStuff.Menu;
import auto_garcon.Singleton.SharedPreference;
import auto_garcon.Singleton.ShoppingCartSingleton;

public class ConfirmPopup extends AppCompatActivity {

    private SharedPreference pref;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.confirm_popup);

        final int restaurantID = this.getIntent().getIntExtra("restaurant id", 0);
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

                cart = new ShoppingCartSingleton();

                pref.setShoppingCart(cart);

                Intent menu = new Intent(v.getContext(), Menu.class);
                menu.putExtra("restaurant id", restaurantID);
                startActivity(menu);
            }
        });

    }
}
