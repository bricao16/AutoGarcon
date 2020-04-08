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
import auto_garcon.Singleton.SharedPreference;
import auto_garcon.Singleton.ShoppingCartSingleton;

public class ShoppingCartAdapter extends RecyclerView.Adapter<ShoppingCartAdapter.ShoppingCartViewHolder>{

    private ArrayList<MenuItem> menuItemArrayList;
    private Context ct;
    private SharedPreference preference;
    private ShoppingCartSingleton cart;

    public ShoppingCartAdapter(Context context, ArrayList<MenuItem> items) {
        ct= context;
        menuItemArrayList = items;
        preference = new SharedPreference(ct);
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
        String quantity = "Qty(" + menuItemArrayList.get(position).getQuantity() + ")";
        cart = preference.getShoppingCart();

        holder.name.setText(menuItemArrayList.get(position).getNameOfItem());
        menuItemArrayList.get(position).setCost();
        holder.price.setText(String.format("$%.02f", menuItemArrayList.get(position).getCost()));
        holder.quantity.setText(quantity);

        holder.add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                menuItemArrayList.get(position).incrementQuantity();
                menuItemArrayList.get(position).setCost();


                holder.quantity.setText("Qty(" + menuItemArrayList.get(position).getQuantity() + ")");
                holder.price.setText(String.format("$%.02f", menuItemArrayList.get(position).getCost()));
                cart.cartContainsItem(menuItemArrayList.get(position)).incrementQuantity();
                preference.setShoppingCart(cart);
            }
        });

        holder.remove.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(menuItemArrayList.get(position).getQuantity() != 1){
                    menuItemArrayList.get(position).decrementQuantity();
                    menuItemArrayList.get(position).setCost();

                    holder.quantity.setText("Qty(" + menuItemArrayList.get(position).getQuantity() + ")");
                    holder.price.setText(String.format("$%.02f", menuItemArrayList.get(position).getCost()));
                    cart.cartContainsItem(menuItemArrayList.get(position)).decrementQuantity();
                    preference.setShoppingCart(cart);
                }
            }
        });
        holder.removeItem.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                menuItemArrayList.remove(position);
                notifyItemChanged(position);
                cart.setItems(menuItemArrayList);
                preference.setShoppingCart(cart);
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
        TextView removeItem;

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