package auto_garcon.cartorderhistory;

import android.content.Context;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Typeface;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.core.content.res.ResourcesCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.auto_garcon.R;

import java.util.ArrayList;
import java.util.HashMap;

import auto_garcon.menustuff.MenuItem;
import auto_garcon.singleton.ShoppingCartSingleton;

public class CurrentOrdersAdapter extends RecyclerView.Adapter<CurrentOrdersAdapter.CurrentOrdersViewHolder>  {
    private LayoutInflater layoutInflater;//Instantiates a layout XML file into its corresponding View objects
    private Context context;//It allows access to application-specific resources and classes
    private HashMap<Integer, ShoppingCartSingleton> orders;
    private HashMap<Integer, byte[]> logos;
    private ArrayList<Integer> orderNumbers;
    HashMap<Integer, String> restaurantNames;

    CurrentOrdersAdapter(Context context, HashMap<Integer, ShoppingCartSingleton> orders, HashMap<Integer, byte[]> logos, ArrayList<Integer> orderNumbers, HashMap<Integer, String> restaurantNames) {
        this.layoutInflater = LayoutInflater.from(context);
        this.context = context;
        this.orders = orders;
        this.logos = logos;
        this.orderNumbers = orderNumbers;
        this.restaurantNames = restaurantNames;
    }

    @NonNull
    @Override
    public CurrentOrdersAdapter.CurrentOrdersViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = layoutInflater.inflate(R.layout.current_orders_tile, parent, false);
        return new CurrentOrdersViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CurrentOrdersAdapter.CurrentOrdersViewHolder holder, final int position) {
        holder.restaurantLogo.setImageBitmap(BitmapFactory.decodeByteArray(logos.get(orderNumbers.get(position)), 0, logos.get(orderNumbers.get(position)).length));

        final ShoppingCartSingleton currentOrder = orders.get(orderNumbers.get(position));
        final Typeface typeface =  ResourcesCompat.getFont(context, currentOrder.getFont());

        holder.currentOrdersTileBackground.setCardBackgroundColor(Color.parseColor(currentOrder.getSecondaryColor()));

        holder.textTitle.setText(restaurantNames.get(orderNumbers.get(position)));
        holder.totalCost.setText("Total: " + String.format("$%.02f", currentOrder.getCostOfItems()));

        holder.textTitle.setTypeface(typeface);
        holder.totalCost.setTypeface(typeface);

        holder.textTitle.setTextColor(Color.parseColor(currentOrder.getFontColor()));
        holder.totalCost.setTextColor(Color.parseColor(currentOrder.getFontColor()));

        holder.items.setAdapter(new RecyclerView.Adapter() {
            @NonNull
            @Override
            public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
                View view = layoutInflater.inflate(R.layout.individual_item, parent, false);
                return new RecyclerView.ViewHolder(view) {
                    @Override
                    public String toString() {
                        return super.toString();
                    }
                };
            }

            @Override
            public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position1) {
                TextView nameOfItem = holder.itemView.findViewById(R.id.name_of_item);
                TextView customizationOfItem = holder.itemView.findViewById(R.id.customization_of_item);
                TextView costOfItem = holder.itemView.findViewById(R.id.cost_of_item);

                MenuItem itemBeingDisplayed = currentOrder.getCart().get(position1);

                nameOfItem.setText(itemBeingDisplayed.getNameOfItem() + " x" + itemBeingDisplayed.getQuantity());
                costOfItem.setText(String.format("$%.02f", itemBeingDisplayed.getCost()));
                customizationOfItem.setText(itemBeingDisplayed.getCustomization());

                nameOfItem.setTypeface(typeface);
                costOfItem.setTypeface(typeface);
                customizationOfItem.setTypeface(typeface);

                nameOfItem.setTextColor(Color.parseColor(currentOrder.getFontColor()));
                costOfItem.setTextColor(Color.parseColor(currentOrder.getFontColor()));
                customizationOfItem.setTextColor(Color.parseColor(currentOrder.getFontColor()));

                if(!(itemBeingDisplayed.getCustomization().trim().length() > 1)) {
                    customizationOfItem.setVisibility(View.GONE);
                }
            }

            @Override
            public int getItemCount() {
                return currentOrder.getCart().size();
            }
        });
    }

    @Override
    public int getItemCount() {
        return orders.size();
    }

    public class CurrentOrdersViewHolder extends RecyclerView.ViewHolder{
        ImageView restaurantLogo; //a image of restaurant
        TextView textTitle; //restaurant name
        TextView totalCost;
        RecyclerView items;
        CardView currentOrdersTileBackground;


        public CurrentOrdersViewHolder(@NonNull View itemView) {
            super(itemView);

            //set each item in the xml layout
            textTitle = itemView.findViewById(R.id.restaurant_title);
            restaurantLogo = itemView.findViewById(R.id.restaurant_picture);
            items = itemView.findViewById(R.id.list_of_items);
            totalCost = itemView.findViewById(R.id.total_cost);
            currentOrdersTileBackground = itemView.findViewById(R.id.current_orders_tile_background);

            items.setLayoutManager(new LinearLayoutManager(context));
        }
    }
}