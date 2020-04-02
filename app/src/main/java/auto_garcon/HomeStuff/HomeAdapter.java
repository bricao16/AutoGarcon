package auto_garcon.HomeStuff;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.auto_garcon.R;

import java.util.List;

import auto_garcon.MenuStuff.Menu;
import auto_garcon.MenuStuff.MenuPopup;
import auto_garcon.Singleton.SharedPreference;

public class HomeAdapter extends RecyclerView.Adapter<HomeAdapter.ViewHolder> {

    private LayoutInflater layoutInflater;
    private List<RestaurantItem> data;
    private Context context;
    private SharedPreference pref;


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
        String title = data.get(position).getName();
        holder.textTitle.setText(title);
    }

    @Override
    public int getItemCount() {
        return data.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        TextView textTitle;
        TextView textDescription;


        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent menu = new Intent(v.getContext(), Menu.class);
                    menu.putExtra("restaurant id", data.get(getAdapterPosition()).getID());
                    context.startActivity(menu);
                }
            });

            textTitle = itemView.findViewById(R.id.restaurant_title);
            textDescription = itemView.findViewById(R.id.restaurant_location);
        }
    }
}