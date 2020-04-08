package auto_garcon.Cart_OrderHistory;

import android.content.Context;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.auto_garcon.R;

import java.util.ArrayList;

import auto_garcon.MenuStuff.Menu;
import auto_garcon.MenuStuff.MenuItem;

public class ShoppingCartAdapter extends RecyclerView.Adapter<ShoppingCartAdapter.ShoppingCartViewHolder>{

    private ArrayList<MenuItem> menuItemArrayList;
    private Context ct;

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
    public void onBindViewHolder(@NonNull final ShoppingCartAdapter.ShoppingCartViewHolder holder, final int position) {
        final int positionForOnClick =position;
        String quantity = "Qty(" + menuItemArrayList.get(position).getQuantity() + ")";

        holder.name.setText(menuItemArrayList.get(position).getNameOfItem());
        menuItemArrayList.get(position).setCost();
        holder.price.setText(String.format("$%.02f", menuItemArrayList.get(position).getCost()));
        holder.quantity.setText(quantity);

        holder.add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                menuItemArrayList.get(positionForOnClick).incrementQuantity();
                menuItemArrayList.get(positionForOnClick).setCost();


                holder.quantity.setText("Qty(" + menuItemArrayList.get(positionForOnClick).getQuantity() + ")");
                holder.price.setText(String.format("$%.02f", menuItemArrayList.get(positionForOnClick).getCost()));
            }
        });

        holder.remove.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(menuItemArrayList.get(positionForOnClick).getQuantity() != 1){
                    menuItemArrayList.get(positionForOnClick).decrementQuantity();
                    menuItemArrayList.get(positionForOnClick).setCost();

                    holder.quantity.setText("Qty(" + menuItemArrayList.get(positionForOnClick).getQuantity() + ")");
                    holder.price.setText(String.format("$%.02f", menuItemArrayList.get(positionForOnClick).getCost()));
                }
            }
        });
        holder.removeItem.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                menuItemArrayList.remove(position);
                notifyItemChanged(position);
            }
        });
    }

    @Override
    public int getItemCount() {
        return menuItemArrayList.size();
    }

    public class ShoppingCartViewHolder extends RecyclerView.ViewHolder{

        TextView name;
        TextView price;
        TextView quantity;
        ImageButton add;
        ImageButton remove;
        Button removeItem;

        public ShoppingCartViewHolder(@NonNull View itemView) {
            super(itemView);
            name = itemView.findViewById(R.id.itemText);
            quantity = itemView.findViewById(R.id.item_quantity);
            add = itemView.findViewById(R.id.addButton);
            remove = itemView.findViewById(R.id.removeButton);
            price = itemView.findViewById(R.id.price);
            removeItem = itemView.findViewById(R.id.removeItem);
        }
    }
}