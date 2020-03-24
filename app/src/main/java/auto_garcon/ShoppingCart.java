package auto_garcon;

import android.content.Context;
import android.content.Intent;
import android.database.DataSetObserver;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;

import com.example.auto_garcon.R;
import com.google.android.material.navigation.NavigationView;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/*<<<<<<< Updated upstream:app/src/main/java/auto_garcon/ShoppingCart.java*/
//=======
//>>>>>>> Stashed changes:app/src/main/java/com/example/auto_garcon/ShoppingCart.java

public class ShoppingCart extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    DrawerLayout drawerLayout;
    Toolbar toolbar;
    NavigationView navigationView;
    ActionBarDrawerToggle toggle;

    ArrayList<Food> orders;
    TextView mealTotalText;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_shopping_cart);

        ListView storedOrders = (ListView)findViewById(R.id.selected_food_list);

        orders = getListItemData();
        mealTotalText = (TextView)findViewById(R.id.meal_total);
        OrderAdapter adapter = new OrderAdapter(this, orders);

        storedOrders.setAdapter(adapter);
        adapter.registerDataSetObserver(observer);

        //This casues a crashe somehow.
        /*toolbar = findViewById(R.id.xml_toolbar);
        navigationView = findViewById(R.id.navigationView);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle(null);
        getSupportActionBar().setDisplayHomeAsUpEnabled(false);
        toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.drawerOpen, R.string.drawerClose);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);*/
    }
    //calc total price every time,
    public int calculateMealTotal(){
        int mealTotal = 0;
        for(Food order : orders){
            mealTotal += order.getmAmount() * order.getmQuantity();
        }
        return mealTotal;
    }
    //set observer to check updating from action buttons.
    DataSetObserver observer = new DataSetObserver() {
        @Override
        public void onChanged() {
            super.onChanged();
            setMealTotal();
        }
    };
    //create menu lists [name, price]
    private ArrayList<Food> getListItemData(){
        //this is where we can get data[ordered menu] from database.
        ArrayList<Food> listViewItems = new ArrayList<Food>();
        listViewItems.add(new Food("Rice",30));
        listViewItems.add(new Food("Beans",40));
        listViewItems.add(new Food("Yam",60));
        listViewItems.add(new Food("Pizza",80));
        listViewItems.add(new Food("Fries",100));

        return listViewItems;
    }
    //set font and get total price of orders.
    public void setMealTotal(){
        mealTotalText.setText("GH"+"\u20B5"+" "+ calculateMealTotal());
    }

    /*private void arrayAdapterListView() {
        setTitle("ArrayAdapter List View");

        List<Food> dataList = new ArrayList<Food>();
        dataList.add( new Food("Rice",30) );
        dataList.add( new Food("Rice",30) );


        ListView listView = (ListView)findViewById(R.id.listViewExample);
        ArrayAdapter<Food> arrayAdapter = new ArrayAdapter<Food>(this, android.R.layout.simple_list_item_multiple_choice, dataList);
        listView.setAdapter(arrayAdapter);



        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int index, long l) {
                Object clickItemObj = adapterView.getAdapter().getItem(index);
                Toast.makeText(ShoppingCart.this, "You clicked " + clickItemObj.toString(), Toast.LENGTH_SHORT).show();
            }
        });
    }*/


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

//created custom Adapter for Food object.
class OrderAdapter extends ArrayAdapter<Food>{
    private List<Food> list;
    private Context context;

    TextView currentFoodName,
            currentCost,
            quantityText,
            addMeal,
            subtractMeal,
            removeMeal;

    public OrderAdapter(Context context, List<Food> myOrders) {
        super(context, 0, myOrders);
        this.list = myOrders;
        this.context = context;
    }

    //create visible view on the screen
    public View getView(final int position, View convertView, ViewGroup parent){
        View listItemView = convertView;
        if(listItemView == null){
            listItemView = LayoutInflater.from(getContext()).inflate(
                    R.layout.item_my_meal,parent,false
            );
        }

        final Food currentFood = getItem(position);
        //make them viewable on the screen.
        currentFoodName = (TextView)listItemView.findViewById(R.id.selected_food_name);
        currentCost = (TextView)listItemView.findViewById(R.id.selected_food_amount);
        subtractMeal = (TextView)listItemView.findViewById(R.id.minus_meal);
        quantityText = (TextView)listItemView.findViewById(R.id.quantity);
        addMeal = (TextView)listItemView.findViewById(R.id.plus_meal);
        removeMeal = (TextView)listItemView.findViewById(R.id.delete_item);

        //Set the text of the meal, amount and quantity
        currentFoodName.setText(currentFood.getmName());
        currentCost.setText("$"+""+" "+ (currentFood.getmAmount() * currentFood.getmQuantity()));
        quantityText.setText("x "+ currentFood.getmQuantity());

        //OnClick listeners for all the buttons on the ListView Item
        addMeal.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                currentFood.addToQuantity();
                quantityText.setText("x "+ currentFood.getmQuantity());
                currentCost.setText("$"+""+" "+ (currentFood.getmAmount() * currentFood.getmQuantity()));
                notifyDataSetChanged();
            }
        });

        subtractMeal.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                currentFood.removeFromQuantity();
                quantityText.setText("x "+currentFood.getmQuantity());
                currentCost.setText("$"+""+" "+ (currentFood.getmAmount() * currentFood.getmQuantity()));
                notifyDataSetChanged();
            }
        });

        removeMeal.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                list.remove(position);
                notifyDataSetChanged();
            }
        });
        //return each menu list.
        return listItemView;
    }

}

//create serialized Food object.
class Food implements Serializable {
    // It has menu name, quantity, and price.
    private  String mName;
    private int mAmount;
    private int mQuantity;

    public void setmQuantity(int mQuantity) {
        this.mQuantity = mQuantity;
    }

    public Food(){}

    public Food(String mName, int mAmount) {
        this.mName = mName;
        this.mAmount = mAmount;
        this.mQuantity = 1;
    }

    public String getmName() {
        return mName;
    }

    public int getmAmount() {
        return mAmount;
    }

    public int getmQuantity(){
        return mQuantity;
    }

    public void addToQuantity(){
        this.mQuantity += 1;
    }

    public void removeFromQuantity(){
        if(this.mQuantity > 1){
            this.mQuantity -= 1;
        }
    }

}




