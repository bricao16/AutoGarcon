package auto_garcon;

import android.content.Context;
import android.content.Intent;
import android.hardware.SensorManager;
import android.os.Bundle;
/*<<<<<<< Updated upstream:app/src/main/java/auto_garcon/Home.java
=======*/
import android.util.Log;
import android.view.LayoutInflater;
/*>>>>>>> Stashed changes:app/src/main/java/com/example/auto_garcon/Home.java*/
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.viewpager.widget.PagerAdapter;

import com.example.auto_garcon.R;
import com.google.android.material.navigation.NavigationView;
import com.squareup.seismic.ShakeDetector;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Home extends AppCompatActivity implements ShakeDetector.Listener, NavigationView.OnNavigationItemSelectedListener {
    private static final String TAG = "MainActivity";
    DrawerLayout drawerLayout;
    Toolbar toolbar;
    NavigationView navigationView;
    ActionBarDrawerToggle toggle;
    Button logOut;
    public Prefrence pref;

    @Override
    //do any quriy here, firebase.......
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

/* Updated upstream:app/src/main/java/auto_garcon/Home.java*/
        pref = new Prefrence(this);
        if(!pref.getLoginStatus()){
            pref.changeLogStatus(false);
            Intent signIn = new Intent(Home.this, Login.class);
            startActivity(signIn);
        }
        drawerLayout = findViewById(R.id.home_main);

        /*drawerLayout = findViewById(R.id.home_main);
>>>>>>> Stashed changes:app/src/main/java/com/example/auto_garcon/Home.java
        toolbar = findViewById(R.id.xml_toolbar);
        navigationView = findViewById(R.id.navigationView);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle(null);
        getSupportActionBar().setDisplayHomeAsUpEnabled(false);
        toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);*/
        /*DB STUFF*/

        // Create a new user with a first and last name
        Map<String, Object> user = new HashMap<>();
        // Add a new document with a generated ID

        /*DB STUFF*/
        logOut = findViewById(R.id.log_out);
        logOut.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View view) {
                Intent signIn = new Intent(Home.this, Login.class);
                startActivity(signIn);
            }
        });

        SensorManager sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        ShakeDetector shakeDetector = new ShakeDetector(this);
        shakeDetector.start(sensorManager);
    }

    @Override
    public void hearShake(){
        Toast.makeText(this, "HI", Toast.LENGTH_SHORT).show();
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem nav_item){
        switch(nav_item.getItemId()){
            case R.id.account:
                Toast.makeText(Home.this, "Account Selected", Toast.LENGTH_SHORT).show();
                Intent account = new Intent(getBaseContext(),   Account.class);
                startActivity(account);
                break;
            case R.id.settings:
                Toast.makeText(Home.this, "Settings Selected", Toast.LENGTH_SHORT).show();
                Intent settings = new Intent(getBaseContext(),   Settings.class);
                startActivity(settings);
                break;
            case R.id.log_out:
                Toast.makeText(Home.this, "Log Out Selected", Toast.LENGTH_SHORT).show();
                Intent login = new Intent(getBaseContext(),   Login.class);
                startActivity(login);
                break;
        }
        return false;
    }

    public void goHome(View view){
        Intent home = new Intent(getBaseContext(),   Home.class);
        startActivity(home);
    }

    public void goOrderHistory(View view){
        Intent order_history = new Intent(getBaseContext(),   OrderHistory.class);
        startActivity(order_history);
    }

    public void goShoppingCart(View view){
        Intent shopping_cart = new Intent(getBaseContext(),   ShoppingCart.class);
        startActivity(shopping_cart);
    }
}


 class Adapter extends PagerAdapter {
    //create dynamic list of restaurants.
    private List<Model> models;
    private LayoutInflater layoutInflater;
    private Context context;

    public Adapter(List<Model> models, Context context) {
        this.models = models;
        this.context = context;
    }
    //@return number of restaurants
    @Override
    public int getCount() {
        return models.size();
    }
    //check if a object is viewable.
    @Override
    public boolean isViewFromObject(@NonNull View view, @NonNull Object object) {
        return view.equals(object);
    }

    //create a object of restaurant view.
    @NonNull
    @Override
    public Object instantiateItem(@NonNull ViewGroup container, final int position) {
        layoutInflater = LayoutInflater.from(context);
        View view = layoutInflater.inflate(R.layout.item, container, false);

        ImageView imageView;
        TextView title, desc;
        //get tag from xml file
        imageView = view.findViewById(R.id.image);
        title = view.findViewById(R.id.title);
        desc = view.findViewById(R.id.desc);
        //set a view for page.
        imageView.setImageResource(models.get(position).getImage());
        title.setText(models.get(position).getTitle());
        desc.setText(models.get(position).getDesc());
        //make a view clickable.
        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(context, DetailActivity.class);
                intent.putExtra("param", models.get(position).getTitle());
                context.startActivity(intent);
                // finish();
            }
        });

        container.addView(view, 0);
        return view;
    }
    //delete a view.
    @Override
    public void destroyItem(@NonNull ViewGroup container, int position, @NonNull Object object) {
        container.removeView((View)object);
    }
}


 class DetailActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detail);

        TextView textView = findViewById(R.id.textView);
        textView.setText(getIntent().getStringExtra("param"));
    }
}
 class Model {
    //create a container for a restaurant view
    private int image;
    private String title;
    private String desc;

    public Model(int image, String title, String desc) {
        this.image = image;
        this.title = title;
        this.desc = desc;
    }

    public int getImage() {
        return image;
    }

    public void setImage(int image) {
        this.image = image;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }
}
