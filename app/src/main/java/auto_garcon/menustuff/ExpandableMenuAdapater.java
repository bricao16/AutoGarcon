package auto_garcon.menustuff;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.Button;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;

import com.example.auto_garcon.R;

import java.util.HashMap;
import java.util.List;
/*
This is a container for menu pages that the user can see.
 */
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;

public class ExpandableMenuAdapater extends BaseExpandableListAdapter {
    private Context context;
    private List<String> listDataHeader;
    private HashMap<String, List<MenuItem>> listHashMap;
    private SharedPreference pref;
    private ShoppingCartSingleton cart;

    Dialog addToCartPopup;
    Dialog confirmPopup;

    public ExpandableMenuAdapater(Context context, List<String> listDataHeader, HashMap<String, List<MenuItem>> listHashMap) {
        this.context = context;
        this.listDataHeader = listDataHeader;
        this.listHashMap = listHashMap;
        this.pref = new SharedPreference(context);
    }

    @Override
    public int getGroupCount() {
        return listDataHeader.size();
    }

    @Override
    public int getChildrenCount(int i) {
        return listHashMap.get(listDataHeader.get(i)).size();
    }

    @Override
    public Object getGroup(int i) {
        return listDataHeader.get(i);
    }

    @Override
    public MenuItem getChild(int i, int j) {
        return listHashMap.get(listDataHeader.get(i)).get(j);  //i = group item, j = child item
    }

    @Override
    public long getGroupId(int i) {
        return i;
    }

    @Override
    public long getChildId(int i, int j) {
        return j;
    }

    @Override
    public boolean hasStableIds() {
        return false;
    }

    @Override
    public View getGroupView(int i, boolean b, View view, ViewGroup viewGroup) {
        String headerTitle = (String) getGroup(i);

        if(view == null) {
            LayoutInflater inflater = (LayoutInflater) this.context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            view = inflater.inflate(R.layout.expandable_menu, null);
        }

        TextView listHeader = view.findViewById(R.id.list_header);
        listHeader.setTypeface(null, Typeface.BOLD);
        listHeader.setText(headerTitle);
        return view;
    }

    @Override
    public View getChildView(final int i, final int j, boolean b, View view, ViewGroup viewGroup) {
        final String childText = (String) getChild(i, j).getNameOfItem();

        if(view == null) {
            LayoutInflater inflater = (LayoutInflater) this.context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            view = inflater.inflate(R.layout.expandable_menu_item, null);
        }

        TextView txtListChild = view.findViewById(R.id.list_item);
        txtListChild.setText(childText);

        TextView txtListChildPrice = view.findViewById(R.id.list_item_price);
        txtListChildPrice.setText(String.format("$%.02f", getChild(i, j).getPrice()));

        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                addToCartPopup = new Dialog(context);
                confirmPopup = new Dialog(context);

                addToCartPopup.setContentView(R.layout.menu_popup);
                addToCartPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                addToCartPopup.show();

                ConstraintLayout background = addToCartPopup.findViewById(R.id.menu_popup);
                Button addToCart = addToCartPopup.findViewById(R.id.add_to_cart);
                TextView outOfStock = addToCartPopup.findViewById(R.id.order_items);
                TextView calorieCount = addToCartPopup.findViewById(R.id.calories);
                TextView itemName = addToCartPopup.findViewById(R.id.itemNameMenuPop);
                TextView itemPrice = addToCartPopup.findViewById(R.id.menuItemPrice);

                background.setBackgroundColor(Color.parseColor(pref.getShoppingCart().getSecondaryColor()));

                String caloriesString = "Calories: " + getChild(i, j).getCalories();
                calorieCount.setText(caloriesString);
                calorieCount.setTextColor(Color.WHITE);
                itemName.setText(getChild(i, j).getNameOfItem());
                itemName.setTextColor(Color.WHITE);
                String priceString = "Price: " + String.format("$%.02f", getChild(i, j).getPrice());
                itemPrice.setText(priceString);
                itemPrice.setTextColor(Color.WHITE);

                //If item Out of Stock sets message to alert customer & make it so customer cannot add it to the cart.
                if(getChild(i, j).getAmountInStock() == 0) {
                    outOfStock.setText("Out of Stock");
                    addToCart.setVisibility(View.GONE);
                  //  calorieCount.setVisibility(View.GONE);
                }

                    addToCart.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if(pref.getShoppingCart().getCart().size() == 0) {
                            cart = new ShoppingCartSingleton(getChild(i, j).getRestaurantID());
                            cart.setPrimaryColor(pref.getShoppingCart().getPrimaryColor());
                            cart.setSecondaryColor(pref.getShoppingCart().getSecondaryColor());
                            cart.setTertiaryColor(pref.getShoppingCart().getTertiaryColor());
                            cart.addToCart(getChild(i, j));
                            pref.setShoppingCart(cart);
                        }
                        else if(pref.getShoppingCart().getRestaurantID() == getChild(i, j).getRestaurantID()) {
                            cart = pref.getShoppingCart();

                            if(cart.cartContainsItem(getChild(i, j)) != null) {
                                cart.cartContainsItem(getChild(i, j)).incrementQuantity();
                            }
                            else {
                                cart.addToCart(getChild(i, j));
                            }

                            pref.setShoppingCart(cart);
                        }
                        else if(pref.getShoppingCart().getRestaurantID() != getChild(i, j).getRestaurantID()) {
                            confirmPopup.setContentView(R.layout.confirm_popup);

                            confirmPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                            confirmPopup.show();

                            Button confirmClearCart = confirmPopup.findViewById(R.id.confirm_clear);

                            confirmClearCart.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    cart = new ShoppingCartSingleton(getChild(i, j).getRestaurantID());
                                    cart.setPrimaryColor(pref.getShoppingCart().getPrimaryColor());
                                    cart.setSecondaryColor(pref.getShoppingCart().getSecondaryColor());
                                    cart.setTertiaryColor(pref.getShoppingCart().getTertiaryColor());
                                    cart.addToCart(getChild(i, j));
                                    pref.setShoppingCart(cart);
                                    confirmPopup.dismiss();
                                    addToCartPopup.dismiss();
                                }
                            });
                        }
                    }
                });
            }
        });

        return view;
    }

    @Override
    public boolean isChildSelectable(int i, int j) {
        return true;
    }
}