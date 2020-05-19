package auto_garcon.cartorderhistory;

import android.app.Dialog;
import android.content.Context;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.core.content.res.ResourcesCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.auto_garcon.R;

import java.util.ArrayList;

import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;

/**
 * This is a container for history pages that the user can see.
 */
public class OrderHistoryAdapter extends RecyclerView.Adapter<OrderHistoryAdapter.OrderHistoryViewHolder> {
    Dialog popUp;
    Dialog confirmPopup;
    private SharedPreference pref;// used to reference user information
    private ArrayList<String> order;// used to capture user order number
    private ArrayList<ShoppingCartSingleton> carts;// used to handle items returned from the recent order history
    private ArrayList<String> date;// used to capture time for all orders
    private ArrayList<byte[]> logos;
    private Context ct;
    private ArrayList<String> restaurantName;

    /**
     * This constructor initializes our variables passed in from the shopping cart page
     *
     * @param ctx        this Context represents the current state of the app we will use this initalize the instance variable ct as the Context for this java class
     * @param preference This sharedPreference represents the sharedPreference from the orderHistory page we use this initialize our sharedPreference variable so we can access user or current Shopping cart information
     * @param order      This Arraylist represents the order num for all the previous completed orders. We use this to initialize our order arraylist instance variable so we can access this info in later parts of code
     * @param carts      This ArrayList represents the carts for all previous completed orders pulled from database. We use this to initialize our carts arrayList instance variable so we can access this info in later parts of the code
     * @param date       This Arraylist represents the date for all our previous completed orders. We use this to intialize our date arraylist instance variable so we can access in later parts of the code
     */
    public OrderHistoryAdapter(Context ctx, SharedPreference preference, ArrayList<String> order, ArrayList<ShoppingCartSingleton> carts, ArrayList<String> date, ArrayList<String> restaurantName, ArrayList<byte[]> logos) {
        ct = ctx;
        this.logos = logos;
        this.pref = preference;
        this.order = order;
        this.carts = carts;
        this.date = date;
        this.restaurantName = restaurantName;

    }


    /**
     * Called when RecyclerView needs a new {@link RecyclerView.ViewHolder} of the given type to represent
     * an item.
     * <p>
     * This new ViewHolder should be constructed with a new View that can represent the items
     * of the given type. You can either create a new View manually or inflate it from an XML
     * layout file.
     * <p>
     * The new ViewHolder will be used to display items of the adapter using
     * {@link #onBindViewHolder(OrderHistoryViewHolder, int)  Since it will be re-used to display
     * different items in the data set, it is a good idea to cache references to sub views of
     * the View to avoid unnecessary {@link View#findViewById(int)} calls.
     *
     * @param parent   The ViewGroup into which the new View will be added after it is bound to
     *                 an adapter position.
     * @param viewType The view type of the new View.
     * @return A new ViewHolder that holds a View of the given view type.
     * @see #getItemViewType(int)
     * @see #onBindViewHolder(OrderHistoryViewHolder, int)
     */
    @NonNull
    @Override
    public OrderHistoryAdapter.OrderHistoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(ct);//this allows the list expand dynamically
        View view = inflater.inflate(R.layout.order_history_tile, parent, false);//make the list visible

        return new OrderHistoryViewHolder(view);
    }


    /**
     * Called by RecyclerView to display the data at the specified position. This method should
     * update the contents of the {@link RecyclerView.ViewHolder#itemView} to reflect the item at the given
     * position.
     * <p>
     * Note that unlike {@link android.widget.ListView}, RecyclerView will not call this method
     * again if the position of the item changes in the data set unless the item itself is
     * invalidated or the new position cannot be determined. For this reason, you should only
     * use the <code>position</code> parameter while acquiring the related data item inside
     * this method and should not keep a copy of it. If you need the position of an item later
     * on (e.g. in a click listener), use {@link RecyclerView.ViewHolder#getAdapterPosition()} which will
     * have the updated adapter position.
     * <p>
     * Override {@link #onBindViewHolder(OrderHistoryViewHolder, int)}  instead if Adapter can
     * handle efficient partial bind.
     *
     * @param holder   The ViewHolder which should be updated to represent the contents of the
     *                 item at the given position in the data set.
     * @param position The position of the item within the adapter's data set.
     */

    @Override
    public void onBindViewHolder(@NonNull OrderHistoryAdapter.OrderHistoryViewHolder holder, final int position) {
        Typeface typeface = ResourcesCompat.getFont(this.ct, carts.get(position).getFont());

        holder.orderTile.setCardBackgroundColor(Color.parseColor(carts.get(position).getSecondaryColor()));
        holder.order_num.setText(restaurantName.get(position));// set the text for the order tile
        holder.order_num.setTypeface(typeface);//setting font
        holder.order_num.setTextColor(Color.parseColor(carts.get(position).getFontColor()));//setting color
        holder.items.setTypeface(typeface);
        holder.items.setTextColor(Color.parseColor(carts.get(position).getFontColor()));
        holder.reOrder.setTypeface(typeface);
        holder.reOrder.setTextColor(Color.parseColor(carts.get(position).getFontColor()));
        holder.reOrder.setBackgroundColor(Color.parseColor(carts.get(position).getPrimaryColor()));


        int datePosition = date.get(position).indexOf("T");
        if (datePosition == -1) {
            holder.date.setText(date.get(position));// set the date in the order tile card
            holder.date.setTypeface(typeface);//setting font
            holder.date.setTextColor(Color.parseColor(carts.get(position).getFontColor()));//setting color
        } else {
            holder.date.setText(date.get(position).substring(0, datePosition));// set the date in the order tile card
            holder.date.setTypeface(typeface);//setting font
            holder.date.setTextColor(Color.parseColor(carts.get(position).getFontColor()));//setting color
        }
        holder.restaurant.setImageBitmap(BitmapFactory.decodeByteArray(logos.get(position), 0, logos.get(position).length));// set the image of the resturant to the image view on the order_tile card

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
                TextView restaurantNamePop = popUp.findViewById(R.id.Restaurant);
                restaurantNamePop.setText(restaurantName.get(position));
                popUp.findViewById(R.id.add_to_cart_popup_close).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        popUp.dismiss();
                    }
                });
            }
        });

        holder.reOrder.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (pref.getShoppingCart().getCart().size() > 0) {
                    confirmPopup = new Dialog(ct);
                    confirmPopup.setContentView(R.layout.confirm_popup);
                    confirmPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                    confirmPopup.show();
                    Button confirmYes = confirmPopup.findViewById(R.id.popup_yes);
                    ImageButton confirmClose = confirmPopup.findViewById(R.id.confirm_close);

                    confirmYes.setText("Confirm");
                    TextView dynamicPopupText = confirmPopup.findViewById(R.id.text_confirm_popup);
                    dynamicPopupText.setText("Adding this item will remove the other items currently in cart.");

                    confirmYes.setOnClickListener(new View.OnClickListener() {
                        public void onClick(View v) {
                            Toast.makeText(ct, "Successfully added to cart.", Toast.LENGTH_LONG).show();
                            //Clear the order if the item's are available during the correct time

                            pref.setShoppingCart(carts.get(position));
                            confirmPopup.dismiss();
                        }
                    });
                    confirmClose.setOnClickListener(new View.OnClickListener() {
                        public void onClick(View v) {
                            confirmPopup.dismiss();
                        }
                    });
                } else {
                    Toast.makeText(ct, "Successfully added to cart.", Toast.LENGTH_LONG).show();
                    pref.setShoppingCart(carts.get(position));
                }
            }
        });
    }


    /**
     * Returns the total number of items in the data set held by the adapter.
     *
     * @return The total number of items in this adapter.
     */
    @Override
    public int getItemCount() {
        return order.size();
    }


    /**
     * This class represents each card xml as a java object and allows access to each xml object
     * within a card
     */
    public class OrderHistoryViewHolder extends RecyclerView.ViewHolder {

        TextView order_num;
        TextView date;
        TextView items;
        Button reOrder;
        ImageView restaurant;
        CardView orderTile;

        /**
         * In this method we set the respected xml java objects to their associated xml objects
         *
         * @param v this parameter allows us to access the xml object for a specified card tile
         */
        public OrderHistoryViewHolder(@NonNull View v) {
            super(v);
            orderTile = v.findViewById(R.id.order_tile);
            order_num = v.findViewById(R.id.order_num2);
            date = v.findViewById(R.id.date);
            items = v.findViewById(R.id.order_items);
            reOrder = v.findViewById(R.id.ReOrderButton);
            restaurant = v.findViewById(R.id.resturant);
        }
    }
}
