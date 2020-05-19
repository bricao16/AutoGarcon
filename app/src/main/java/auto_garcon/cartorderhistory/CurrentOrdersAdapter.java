package auto_garcon.cartorderhistory;

import android.content.Context;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Typeface;
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
import java.util.List;

import auto_garcon.menustuff.MenuItem;
import auto_garcon.singleton.ShoppingCartSingleton;

/**
 * Class used to help display inprogress endpoint from database by dynamically
 * binding data pulled to respective xml elements
 */

public class CurrentOrdersAdapter extends RecyclerView.Adapter<CurrentOrdersAdapter.CurrentOrdersViewHolder> {
    HashMap<Integer, String> restaurantNames;
    private LayoutInflater layoutInflater;//Instantiates a layout XML file into its corresponding View objects
    private Context context;//It allows access to application-specific resources and classes
    private HashMap<Integer, ShoppingCartSingleton> orders;
    private HashMap<Integer, byte[]> logos;
    private ArrayList<Integer> orderNumbers;

    /**
     *
     * @param context Context gets set to instance variable context
     * @param orders HashMap<Integer, ShoppingCartSingleton> gets set to instance variable orders used to tie order number to order
     * @param logos HashMap<Integer, byte[]> gets set to instance variable logos used to tie restaurant id to logo
     * @param orderNumbers ArrayList<Integer> gets set to instance variable orderNumbers used to help get values from hashmaps
     * @param restaurantNames HashMap<Integer, String> gets set to instance variable restaurantNames used to tie restaurant id to name
     */
    CurrentOrdersAdapter(Context context, HashMap<Integer, ShoppingCartSingleton> orders, HashMap<Integer, byte[]> logos, ArrayList<Integer> orderNumbers, HashMap<Integer, String> restaurantNames) {
        this.layoutInflater = LayoutInflater.from(context);
        this.context = context;
        this.orders = orders;
        this.logos = logos;
        this.orderNumbers = orderNumbers;
        this.restaurantNames = restaurantNames;
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
     * {@link #onBindViewHolder(RecyclerView.ViewHolder, int, List)}. Since it will be re-used to display
     * different items in the data set, it is a good idea to cache references to sub views of
     * the View to avoid unnecessary {@link View#findViewById(int)} calls.
     *
     * @param parent The ViewGroup into which the new View will be added after it is bound to
     *               an adapter position.
     * @param viewType The view type of the new View.
     *
     * @return A new ViewHolder that holds a View of the given view type.
     * @see #getItemViewType(int)
     * @see #onBindViewHolder(RecyclerView.ViewHolder, int)
     */
    @NonNull
    @Override
    public CurrentOrdersAdapter.CurrentOrdersViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = layoutInflater.inflate(R.layout.current_orders_tile, parent, false);
        return new CurrentOrdersViewHolder(view);
    }

    /**
     * Used for tile on CurrentOrders activity
     * Sets xml elements to data pulled from database
     *
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
     *
     * Override {@link #onBindViewHolder(RecyclerView.ViewHolder, int, List)} instead if Adapter can
     * handle efficient partial bind.
     *
     * @param holder The ViewHolder which should be updated to represent the contents of the
     *        item at the given position in the data set.
     * @param position The position of the item within the adapter's data set.
     */
    @Override
    public void onBindViewHolder(@NonNull CurrentOrdersAdapter.CurrentOrdersViewHolder holder, final int position) {
        holder.restaurantLogo.setImageBitmap(BitmapFactory.decodeByteArray(logos.get(orderNumbers.get(position)), 0, logos.get(orderNumbers.get(position)).length));

        final ShoppingCartSingleton currentOrder = orders.get(orderNumbers.get(position));
        final Typeface typeface = ResourcesCompat.getFont(context, currentOrder.getFont());

        holder.currentOrdersTileBackground.setCardBackgroundColor(Color.parseColor(currentOrder.getSecondaryColor()));

        holder.textTitle.setText(restaurantNames.get(orderNumbers.get(position)));
        holder.totalCost.setText("Total: " + String.format("$%.02f", currentOrder.getCostOfItems()));

        holder.textTitle.setTypeface(typeface);
        holder.totalCost.setTypeface(typeface);

        holder.textTitle.setTextColor(Color.parseColor(currentOrder.getFontColor()));
        holder.totalCost.setTextColor(Color.parseColor(currentOrder.getFontColor()));

        holder.items.setAdapter(new RecyclerView.Adapter() {

            /**
             * Used for the list of MenuItems on each tile
             *
             * Called when RecyclerView needs a new {@link RecyclerView.ViewHolder} of the given type to represent
             * an item.
             * <p>
             * This new ViewHolder should be constructed with a new View that can represent the items
             * of the given type. You can either create a new View manually or inflate it from an XML
             * layout file.
             * <p>
             * The new ViewHolder will be used to display items of the adapter using
             * {@link #onBindViewHolder(RecyclerView.ViewHolder, int, List)}. Since it will be re-used to display
             * different items in the data set, it is a good idea to cache references to sub views of
             * the View to avoid unnecessary {@link View#findViewById(int)} calls.
             *
             * @param parent The ViewGroup into which the new View will be added after it is bound to
             *               an adapter position.
             * @param viewType The view type of the new View.
             *
             * @return A new ViewHolder that holds a View of the given view type.
             * @see #getItemViewType(int)
             * @see #onBindViewHolder(RecyclerView.ViewHolder, int)
             */
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

            /**
             * Sets xml elements to data pulled from database
             *
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
             *
             * Override {@link #onBindViewHolder(RecyclerView.ViewHolder, int, List)} instead if Adapter can
             * handle efficient partial bind.
             *
             * @param holder The ViewHolder which should be updated to represent the contents of the
             *        item at the given position in the data set.
             * @param position The position of the item within the adapter's data set.
             */
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

                if (!(itemBeingDisplayed.getCustomization().trim().length() > 1)) {
                    customizationOfItem.setVisibility(View.GONE);
                }
            }

            /**
             * returns the amount of items within each order
             */
            @Override
            public int getItemCount() {
                return currentOrder.getCart().size();
            }
        });
    }

    /**
     * returns amount of orders
     */
    @Override
    public int getItemCount() {
        return orders.size();
    }

    /**
     * Class used to implement our own version of RecylerView
     */
    public class CurrentOrdersViewHolder extends RecyclerView.ViewHolder {
        ImageView restaurantLogo; //a image of restaurant
        TextView textTitle; //restaurant name
        TextView totalCost;
        RecyclerView items;
        CardView currentOrdersTileBackground;


        /**
         * binds xml elements to Java objects
         * @param itemView view to be used for xml elements
         */
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