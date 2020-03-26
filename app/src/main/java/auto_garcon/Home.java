package auto_garcon;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;

import com.example.auto_garcon.R;
import com.google.android.material.navigation.NavigationView;
import com.squareup.picasso.Picasso;
import com.squareup.seismic.ShakeDetector;

public class Home extends AppCompatActivity implements ShakeDetector.Listener, NavigationView.OnNavigationItemSelectedListener {
    private static final String TAG = "MainActivity";
    DrawerLayout drawerLayout;
    Toolbar toolbar;
    NavigationView navigationView;
    ActionBarDrawerToggle toggle;
    Button logOut;
    public Prefrence pref;


    //This is where we can get url from database.
    String[] url = { "https://www.tutorialspoint.com/java/images/java-mini-logo.jpg",  "https://www.tutorialspoint.com/python/images/python-mini.jpg" };
    //This is where you can get restaurant name from databse.
    String[] version = {"Android Alpha", "Android Alpha"};
    //This is where you can get some data you want from database
    String[] versionNumber = {"1.0", "1.0"};
    ListView lView;
    ListAdapter lAdapter;



    @Override
    //do any quriy here, firebase.......
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        lView = (ListView) findViewById(R.id.androidList);
        lAdapter = new ListAdapter(Home.this, version, versionNumber, url);
        lView.setAdapter(lAdapter);
        lView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {

                Toast.makeText(Home.this, version[i]+" "+versionNumber[i], Toast.LENGTH_SHORT).show();

            }
        });



        /*pref = new Prefrence(this);
        if(!pref.getLoginStatus()){
            pref.changeLogStatus(false);
            Intent signIn = new Intent(Home.this, Login.class);
            startActivity(signIn);
        }
        Toast.makeText(Home.this,pref.getName(),Toast.LENGTH_LONG).show();*/

        /*drawerLayout = findViewById(R.id.home_main);
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
        //Map<String, Object> user = new HashMap<>();
        // Add a new document with a generated ID

        /*DB STUFF*/
        /*logOut = findViewById(R.id.log_out);
        logOut.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View view) {
                Intent signIn = new Intent(Home.this, Login.class);
                startActivity(signIn);

            }
        });

        SensorManager sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        ShakeDetector shakeDetector = new ShakeDetector(this);
        shakeDetector.start(sensorManager);*/
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


 class ListAdapter extends BaseAdapter {

    Context context;
    private final String[] values;
    private final String[] numbers;
    private final String[] url;

    public ListAdapter(Context context, String[] values, String[] numbers, String[] url) {
        //super(context, R.layout.single_list_app_item, utilsArrayList);
        this.context = context;
        this.values = values;
        this.numbers = numbers;
        this.url = url;
    }

    @Override
    public int getCount() {
        return values.length;
    }

    @Override
    public Object getItem(int i) {
        return i;
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {


        ViewHolder viewHolder;

        final View result;

        if (convertView == null) {

            viewHolder = new ViewHolder();
            LayoutInflater inflater = LayoutInflater.from(context);
            convertView = inflater.inflate(R.layout.single_list_item, parent, false);
            viewHolder.txtName = (TextView) convertView.findViewById(R.id.aNametxt);
            viewHolder.txtVersion = (TextView) convertView.findViewById(R.id.aVersiontxt);
            //viewHolder.icon = (ImageView) convertView.findViewById(R.id.appIconIV);

            ImageView imag = convertView.findViewById(R.id.appIconIV);
            Picasso.with(context).load(url[position]).into(imag);
            viewHolder.icon = imag;


            result = convertView;

            convertView.setTag(viewHolder);
        } else {
            viewHolder = (ViewHolder) convertView.getTag();
            result = convertView;
        }

        viewHolder.txtName.setText(values[position]);
        viewHolder.txtVersion.setText("Version: " + numbers[position]);
        //viewHolder.icon.setImageResource(images[position]);

        return convertView;
    }

    private static class ViewHolder {

        TextView txtName;
        TextView txtVersion;
        ImageView icon;

    }
}


