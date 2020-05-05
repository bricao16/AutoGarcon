package auto_garcon.cartorderhistory;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.util.Log;
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

import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;
import auto_garcon.singleton.VolleySingleton;

/*
This is a container for history pages that the user can see.
 */
public class OrderHistoryAdapter extends RecyclerView.Adapter<OrderHistoryAdapter.OrderViewHolder> {
    private SharedPreference pref;// used to refrence user information
    private ArrayList<String> order;// used to capture user order number
    private ArrayList<ShoppingCartSingleton> carts;// used to handle items returned from the recent order history
    private ArrayList<String> date;// used to capture time for all orders
    private Context ct;
    private ArrayList<String> resturantName;
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
    public  OrderHistoryAdapter(Context ctx, SharedPreference preference, ArrayList<String> order, ArrayList<ShoppingCartSingleton> carts, ArrayList<String> date,ArrayList<String> resturantName){
        ct=ctx;
        pref=preference;
        this.order=order;
        this.carts=carts;
        this.date=date;
        this.resturantName= resturantName;
        Log.d("asd32e4ff", ""+carts.get(0).toString());

    }

    @NonNull
    @Override
    public OrderHistoryAdapter.OrderViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        Log.d("asd32e4ff1", ""+carts.get(0).toString());

        LayoutInflater inflater = LayoutInflater.from(ct);//this allows the list expand dynamically
        View view = inflater.inflate(R.layout.order_cards,parent,false);//make the list visible

        return new OrderViewHolder(view);
    }


    @Override
    public void onBindViewHolder(@NonNull OrderHistoryAdapter.OrderViewHolder holder, final int position) {

        holder.order_num.setText(resturantName.get(position));
        holder.resturant_num.setText(Integer.toString(carts.get(position).getRestaurantID()));
        holder.date.setText(date.get(position));
        holder.items.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
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
                confirmPopup.setContentView(R.layout.confirm3_popup);
                confirmPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                confirmPopup.show();
                Button confirmYes = confirmPopup.findViewById(R.id.confirm_clear);

                confirmYes.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        Toast.makeText(ct, "Yes Confirmed",Toast.LENGTH_LONG).show();
                        //Clear the order
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
    public class OrderViewHolder extends RecyclerView.ViewHolder{

        TextView order_num;
        TextView date;
        TextView resturant_num;
        TextView items;
        Button reOrder;
        ImageView resturant;
            public OrderViewHolder(@NonNull View v) {
                super(v);
                order_num= v.findViewById(R.id.order_num2);
                date = v.findViewById(R.id.date);
                resturant_num = v.findViewById(R.id.resturant_num);
                items= v.findViewById(R.id.order_items);
                reOrder = v.findViewById(R.id.ReOrderButton);
                resturant = v.findViewById(R.id.resturant);

            }

    }
}
