package auto_garcon.cartorderhistory;

import android.app.Dialog;
import android.content.Context;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.auto_garcon.R;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.TimeZone;

import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;

/*
This is a container for history pages that the user can see.
 */
public class OrderHistoryAdapter extends RecyclerView.Adapter<OrderHistoryAdapter.OrderHistoryViewHolder> {
    private SharedPreference pref;// used to reference user information
    private ArrayList<String> order;// used to capture user order number
    private ArrayList<ShoppingCartSingleton> carts;// used to handle items returned from the recent order history
    private ArrayList<String> date;// used to capture time for all orders
    private ArrayList<byte[]> logos;
    private Context ct;
    private ArrayList<String> restaurantName;
    Dialog popUp;
    Dialog confirmPopup;

    /**
     * This constructor initializes our variables passed in from the shopping cart page
     * @param ctx
     * @param preference
     * @param order
     * @param carts
     * @param date
     */
    public  OrderHistoryAdapter(Context ctx, SharedPreference preference, ArrayList<String> order, ArrayList<ShoppingCartSingleton> carts, ArrayList<String> date,ArrayList<String> restaurantName,ArrayList<byte[]> logos){
        ct = ctx;
        this.logos = logos;
        pref = preference;
        this.order = order;
        this.carts = carts;
        this.date = date;
        this.restaurantName = restaurantName;
        String hold = "";

        for(int i = 0 ;i < this.logos.get(0).length; i++) {
            hold = hold + "," + this.logos.get(0)[i];
        }
    }

    @NonNull
    @Override
    public OrderHistoryAdapter.OrderHistoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(ct);//this allows the list expand dynamically
        View view = inflater.inflate(R.layout.order_history_tile,parent,false);//make the list visible

        return new OrderHistoryViewHolder(view);
    }


    @Override
    public void onBindViewHolder(@NonNull OrderHistoryAdapter.OrderHistoryViewHolder holder, final int position) {
        holder.order_num.setText(restaurantName.get(position));// set the text for the order tile

        holder.restaurant_num.setText(Integer.toString(carts.get(position).getRestaurantID()));// set the restruant id to allow us to re order

        holder.date.setText(date.get(position));// set the date in the order tile card

        holder.restaurant.setImageBitmap(BitmapFactory.decodeByteArray(logos.get(position),0,logos.get(position).length));// set the image of the resturant to the image view on the order_tile card

        holder.items.setOnClickListener(new View.OnClickListener() {// when they user clicks on view items text view on the order tile card
            @Override
            public void onClick(View v) {// create pop up
                popUp = new Dialog(ct);
                confirmPopup = new Dialog(ct);

                popUp.setContentView(R.layout.history_popup);
                popUp.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                popUp.show();
                TextView historyItems = popUp.findViewById(R.id.order_items);
                historyItems.setText(carts.get(position).toString());
            }
        });

        holder.reOrder.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                confirmPopup = new Dialog(ct);
                confirmPopup.setContentView(R.layout.confirm_popup);
                confirmPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                confirmPopup.show();
                Button confirmYes = confirmPopup.findViewById(R.id.confirm_clear);

                confirmYes.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        Toast.makeText(ct, "Yes Confirmed",Toast.LENGTH_LONG).show();
                        //Clear the order if the item's are available during the correct time

                        pref.setShoppingCart(carts.get(position));
                        confirmPopup.dismiss();
                    }
                });
            }


        });
    }

    @Override
    public int getItemCount() {
        return order.size();
    }

    public class OrderHistoryViewHolder extends RecyclerView.ViewHolder{

        TextView order_num;
        TextView date;
        TextView restaurant_num;
        TextView items;
        Button reOrder;
        ImageView restaurant;
        public OrderHistoryViewHolder(@NonNull View v) {
            super(v);
            order_num= v.findViewById(R.id.order_num2);
            date = v.findViewById(R.id.date);
            restaurant_num = v.findViewById(R.id.resturant_num);
            items= v.findViewById(R.id.order_items);
            reOrder = v.findViewById(R.id.ReOrderButton);
            restaurant = v.findViewById(R.id.resturant);
        }
    }
}
