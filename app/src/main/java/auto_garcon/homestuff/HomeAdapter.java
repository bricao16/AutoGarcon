package auto_garcon.homestuff;

import android.content.Context;
import android.content.Intent;
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
import androidx.recyclerview.widget.RecyclerView;

import com.example.auto_garcon.R;

import java.util.List;

import auto_garcon.menustuff.Menu;

/**
 * This is a container for restaurant pages that the user can see.
 */
public class HomeAdapter extends RecyclerView.Adapter<HomeAdapter.ViewHolder> {
    //data fields
    private LayoutInflater layoutInflater;//Instantiates a layout XML file into its corresponding View objects
    private List<RestaurantItem> data;//an container of restaurant page items
    private Context context;//It allows access to application-specific resources and classes


    HomeAdapter(Context context, List<RestaurantItem> data) {
        this.layoutInflater = LayoutInflater.from(context);
        this.data = data;
        this.context = context;
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
     * {@link #onBindViewHolder(ViewHolder, int)} . Since it will be re-used to display
     * different items in the data set, it is a good idea to cache references to sub views of
     * the View to avoid unnecessary {@link View#findViewById(int)} calls.
     *
     * @param parent   The ViewGroup into which the new View will be added after it is bound to
     *                 an adapter position.
     * @param viewType The view type of the new View.
     * @return A new ViewHolder that holds a View of the given view type.
     * @see #getItemViewType(int)
     * @see #onBindViewHolder(ViewHolder, int)
     */
    @NonNull
    @Override
    public HomeAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = layoutInflater.inflate(R.layout.favorites_tile, parent, false);
        return new ViewHolder(view);
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
     * Override {@link #onBindViewHolder(ViewHolder, int)} instead if Adapter can
     * handle efficient partial bind.
     *
     * @param holder   The ViewHolder which should be updated to represent the contents of the
     *                 item at the given position in the data set.
     * @param position The position of the item within the adapter's data set.
     */
    @Override
    public void onBindViewHolder(@NonNull HomeAdapter.ViewHolder holder, int position) {
        //bind the textview with data received
        Typeface typeface = ResourcesCompat.getFont(context, data.get(position).getFont());

        holder.favoritesTileBackground.setCardBackgroundColor(Color.parseColor(data.get(position).getSecondaryColor()));

        holder.textTitle.setText(data.get(position).getName());
        holder.textTitle.setTypeface(typeface);
        holder.textTitle.setTextColor(Color.parseColor(data.get(position).getFontColor()));

        holder.textDescription.setText(data.get(position).getAddress());
        holder.textDescription.setTypeface(typeface);
        holder.textDescription.setTextColor(Color.parseColor(data.get(position).getFontColor()));

        holder.textPhoneNumber.setText(data.get(position).getPhoneNumber());
        holder.textPhoneNumber.setTypeface(typeface);
        holder.textPhoneNumber.setTextColor(Color.parseColor(data.get(position).getFontColor()));

        String textTime = data.get(position).timeIntToString(data.get(position).getOpeningTime()) + " - " + data.get(position).timeIntToString(data.get(position).getClosingTime());
        holder.textHours.setText(textTime);
        holder.textHours.setTypeface(typeface);
        holder.textHours.setTextColor(Color.parseColor(data.get(position).getFontColor()));

        holder.restaurantLogo.setImageBitmap(data.get(position).getImageBitmap());
    }

    /**
     * Returns the total number of items in the data set held by the adapter.
     *
     * @return The total number of items in this adapter.
     */
    @Override
    public int getItemCount() {
        return data.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView textTitle;//restaurant name
        TextView textDescription;//restaurant description
        TextView textPhoneNumber;//restaurant phone number
        TextView textHours;//opening and closing hours
        ImageView restaurantLogo;//a image of restaurant
        CardView favoritesTileBackground;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            //set action listener for restaurant page (menu)
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent menu = new Intent(v.getContext(), Menu.class);
                    menu.putExtra("restaurant id", data.get(getAdapterPosition()).getID());

                    context.startActivity(menu);
                }
            });
            //set each item in the xml layout
            textTitle = itemView.findViewById(R.id.restaurant_title);
            textDescription = itemView.findViewById(R.id.restaurant_location);
            textPhoneNumber = itemView.findViewById(R.id.restaurant_number);
            textHours = itemView.findViewById(R.id.restaurant_hours);
            restaurantLogo = itemView.findViewById(R.id.restaurant_picture);
            favoritesTileBackground = itemView.findViewById(R.id.favorites_tile_background);
        }
    }
}