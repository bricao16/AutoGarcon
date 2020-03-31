package auto_garcon.Cart_OrderHistory;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.auto_garcon.R;
import com.google.android.gms.vision.text.Line;
import com.google.android.material.navigation.NavigationView;

import java.util.ArrayList;

import auto_garcon.AccountStuff.Account;
import auto_garcon.AccountStuff.Settings;
import auto_garcon.InitialPages.Home;
import auto_garcon.InitialPages.Login;
import auto_garcon.MenuStuff.Menu;
import auto_garcon.Singleton.SharedPreference;
import auto_garcon.Singleton.ShoppingCartSingleton;

/*<<<<<<< Updated upstream:app/src/main/java/auto_garcon/ShoppingCart.java*/
//=======
//>>>>>>> Stashed changes:app/src/main/java/com/example/auto_garcon/ShoppingCart.java
import auto_garcon.Singleton.SharedPreference;

public class ShoppingCart extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {
   private SharedPreference preference;
   private ShoppingCartSingleton shoppingCart;
   private RecyclerView.Adapter adapter;
   private  RecyclerView.LayoutManager layoutManager;
   private RecyclerView recyclerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_shopping_cart);
        recyclerView = findViewById(R.id.list);
        preference = new SharedPreference(this);
        if(preference.getShoppingCart()==null){
            shoppingCart = new ShoppingCartSingleton();
            preference.setShoppingCart(shoppingCart);
        }
        else{
            shoppingCart = preference.getShoppingCart();
        }
        ShoppingCartAdapter adapter = new ShoppingCartAdapter(this,shoppingCart.getCart());
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
    }

        //creating side nav drawer
        DrawerLayout drawerLayout = findViewById(R.id.shopping_cart_main);
        Toolbar toolbar = findViewById(R.id.xml_toolbar);
        NavigationView navigationView = findViewById(R.id.navigationView);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);

        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle(null);
        getSupportActionBar().setDisplayHomeAsUpEnabled(false);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);
    }

    //onClick for side nav bar
    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem nav_item){
        switch(nav_item.getItemId()){
            case R.id.account:
                Toast.makeText(ShoppingCart.this, "Account Selected", Toast.LENGTH_SHORT).show();
                Intent account = new Intent(getBaseContext(),   Account.class);
                startActivity(account);
                break;
            case R.id.settings:
                Toast.makeText(ShoppingCart.this, "Settings Selected", Toast.LENGTH_SHORT).show();
                Intent settings = new Intent(getBaseContext(),   Settings.class);
                startActivity(settings);
                break;
            case R.id.log_out:
                Toast.makeText(ShoppingCart.this, "Log Out Selected", Toast.LENGTH_SHORT).show();

                preference.changeLogStatus(false);
                preference.logOut();

                Intent login = new Intent(getBaseContext(),   Login.class);
                startActivity(login);
                break;
        }
        return false;
    }

    //onClick to home activity
    public void goHome(View view){
        Intent home = new Intent(getBaseContext(),   Home.class);
        startActivity(home);
    }

    //onClick to order history activity
    public void goOrderHistory(View view){
        Intent order_history = new Intent(getBaseContext(),   OrderHistory.class);
        startActivity(order_history);
    }

    //onClick to shopping cart activity
    public void goShoppingCart(View view){
        Intent shopping_cart = new Intent(getBaseContext(),   ShoppingCart.class);
        startActivity(shopping_cart);
    }
}