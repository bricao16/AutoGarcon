package auto_garcon.Cart_OrderHistory;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.auto_garcon.R;

import java.util.ArrayList;

import auto_garcon.MenuStuff.Menu;
import auto_garcon.MenuStuff.MenuItem;

public class ShoppingCartAdapter extends RecyclerView.Adapter<ShoppingCartAdapter.ShoppingCartViewHolder>{

    ArrayList<MenuItem> menuItemArrayList;
    Context ct;

    public ShoppingCartAdapter(Context context, ArrayList<MenuItem> items) {
        ct= context;
        menuItemArrayList = items;
    }
    @NonNull
    @Override
    public ShoppingCartViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(ct);
            View view = inflater.inflate(R.layout.shopping_cart_row,parent,false);
        return new ShoppingCartViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ShoppingCartAdapter.ShoppingCartViewHolder holder, int position) {
        holder.name.setText(menuItemArrayList.get(position).getNameOfItem());

    }

    @Override
    public int getItemCount() {
        return menuItemArrayList.size();
    }

    public class ShoppingCartViewHolder extends RecyclerView.ViewHolder{

        TextView name;

        public ShoppingCartViewHolder(@NonNull View itemView) {
            super(itemView);
            name= itemView.findViewById(R.id.itemText);
        }
    }
}
