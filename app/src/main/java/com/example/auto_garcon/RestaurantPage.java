package com.example.auto_garcon;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.ExpandableListAdapter;
import android.widget.ExpandableListView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.navigation.NavigationView;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RestaurantPage extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private ExpandableListView listView;
    private ExpandableListAdapter listAdapter;
    private List<String> listDataHeader;
    private FirebaseFirestore dbStore;
    private CollectionReference docRef;
    private List<String> HI;
    private List<String> HI2;
    private List<String> HI3;
    private HashMap<String, List<String>> listHash;

    DrawerLayout drawerLayout;
    Toolbar toolbar;
    NavigationView navigationView;
    ActionBarDrawerToggle toggle;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_restaurant_page);
        dbStore=FirebaseFirestore.getInstance();
        docRef = dbStore.collection("Menu");
        drawerLayout = findViewById(R.id.restaurant_main);
        toolbar = findViewById(R.id.xml_toolbar);
        navigationView = findViewById(R.id.navigationView);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle(null);
        getSupportActionBar().setDefaultDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayHomeAsUpEnabled(false);
        toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);


        listView = findViewById(R.id.menu_list);
        initData();
        listAdapter = new ExpandableMenuAdapater(this, listDataHeader, listHash);
        listView.setAdapter(listAdapter);

    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem nav_item){
        switch(nav_item.getItemId()){
            case R.id.account:
                Toast.makeText(RestaurantPage.this, "Account Selected", Toast.LENGTH_SHORT).show();
                Intent account = new Intent(getBaseContext(),   Account.class);
                startActivity(account);
                break;
            case R.id.settings:
                Toast.makeText(RestaurantPage.this, "Settings Selected", Toast.LENGTH_SHORT).show();
                Intent settings = new Intent(getBaseContext(),   Settings.class);
                startActivity(settings);
                break;
            case R.id.log_out:
                Toast.makeText(RestaurantPage.this, "Log Out Selected", Toast.LENGTH_SHORT).show();
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

    private void initData() {

        listDataHeader = new ArrayList<>();
        listHash = new HashMap<>();

        listDataHeader.add("Beverages");
        listDataHeader.add("app");
        listDataHeader.add("Entrees");

        HI = new ArrayList<>();
        HI2 = new ArrayList<>();
        HI3 = new ArrayList<>();
        //json dynamic add
        //second adapter class
        CollectionReference itemsRef = dbStore.collection("Menu");

         itemsRef.get().addOnSuccessListener(new OnSuccessListener<QuerySnapshot>() {
             @Override
             public void onSuccess(QuerySnapshot queryDocumentSnapshots) {

                 for(QueryDocumentSnapshot documentSnapshot: queryDocumentSnapshots){
                    Map<String,Object> map = documentSnapshot.getData();
                    for(Map.Entry<String,Object> entry : map.entrySet()) {

                        if (entry.getKey().equals("app")) {
                            for (String item : (ArrayList<String>) entry.getValue()) {
                                HI.add(item);
                            }
                        }
                        if (entry.getKey().equals("Beverages")) {
                            for (String item : (ArrayList<String>) entry.getValue()) {
                                HI2.add(item);
                            }
                        }
                        if (entry.getKey().equals("entres")) {
                            for (String item : (ArrayList<String>) entry.getValue()) {
                                HI3.add(item);
                            }
                        }
                    }
                 }
             }
         });

       // HI.add("HI.a");


        listHash.put(listDataHeader.get(0), HI);
        listHash.put(listDataHeader.get(1), HI2);
        listHash.put(listDataHeader.get(2), HI3);
    }
}
