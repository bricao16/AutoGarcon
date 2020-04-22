package auto_garcon.homestuff;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.auto_garcon.R;

import java.util.List;

import auto_garcon.menustuff.Menu;
import auto_garcon.singleton.SharedPreference;
/*
This is a container for restaurant pages that the user can see.
 */
public class HomeAdapter extends RecyclerView.Adapter<HomeAdapter.ViewHolder> {
    //data fields
    private LayoutInflater layoutInflater;//Instantiates a layout XML file into its corresponding View objects
    private List<RestaurantItem> data;//an container of restaurant page items
    private Context context;//It allows access to application-specific resources and classes
    private SharedPreference pref;//a file to keep data of the user


    HomeAdapter(Context context, List<RestaurantItem> data) {
        this.layoutInflater = LayoutInflater.from(context);
        this.data = data;
        this.context = context;
        this.pref = new SharedPreference(context);
    }

    @NonNull
    @Override
    public HomeAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = layoutInflater.inflate(R.layout.favorites_tile, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull HomeAdapter.ViewHolder holder, int position) {
        //bind the textview with data received
        holder.textTitle.setText(data.get(position).getName());
        holder.textDescription.setText(data.get(position).getAddress());
        holder.textPhoneNumber.setText(data.get(position).getPhoneNumber());
        holder.textHours.setText(data.get(position).getOpeningTime() + " - " + data.get(position).getClosingTime());
        holder.restaurantLogo.setImageBitmap(data.get(position).getImageBitmap());
    }

    @Override
    public int getItemCount() {
        return data.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        TextView textTitle;//restaurant name
        TextView textDescription;//restaurant description
        TextView textPhoneNumber;//restaurant phone number
        TextView textHours;//opening and closing hours
        ImageView restaurantLogo;//a image of restaurant

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            //set action listener for restaurant page (menu)
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent menu = new Intent(v.getContext(), Menu.class);
                    menu.putExtra("restaurant id", data.get(getAdapterPosition()).getID());
                    menu.putExtra("restaurant name", data.get(getAdapterPosition()).getName());

                    context.startActivity(menu);
                }
            });
            //set each item in the xml layout
            textTitle = itemView.findViewById(R.id.restaurant_title);
            textDescription = itemView.findViewById(R.id.restaurant_location);
            textPhoneNumber = itemView.findViewById(R.id.restaurant_number);
            textHours = itemView.findViewById(R.id.restaurant_hours);
            restaurantLogo = itemView.findViewById(R.id.restaurant_picture);
        }
    }
}