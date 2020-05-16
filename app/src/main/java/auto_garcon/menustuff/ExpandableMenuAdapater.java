package auto_garcon.menustuff;

import android.app.Dialog;
import android.content.Context;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.content.res.ResourcesCompat;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.auto_garcon.R;
import com.google.android.material.badge.BadgeDrawable;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;

import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;
import auto_garcon.singleton.VolleySingleton;

/*
This is a container for menu pages that the user can see.
 */

public class ExpandableMenuAdapater extends BaseExpandableListAdapter {
    private Context context;
    private List<String> listDataHeader;
    private HashMap<String, List<MenuItem>> listHashMap;
    private SharedPreference pref;
    private ShoppingCartSingleton cart;
    private int restaurantID;
    private String primaryColor;
    private String secondaryColor;
    private String tertiaryColor;
    private int font;
    private String fontColor;
    private int opening;
    private int closing;
    private Typeface typeface;
    private byte[] itemImageByteArray;
    private BadgeDrawable badge;


    Dialog addToCartPopup;
    Dialog confirmPopup;

    public ExpandableMenuAdapater(Context context, List<String> listDataHeader, HashMap<String, List<MenuItem>> listHashMap, int restaurantID, int font, String fontColor,
                                  String primaryColor, String secondaryColor, String tertiaryColor, int opening, int closing, BadgeDrawable drawable) {
        //Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this.context));//error handling for unexpected crashes

        this.context = context;
        this.badge = drawable;
        this.listDataHeader = listDataHeader;
        this.listHashMap = listHashMap;
        this.pref = new SharedPreference(context);
        this.restaurantID = restaurantID;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.tertiaryColor = tertiaryColor;
        this.opening = opening;
        this.closing = closing;
        this.font = font;
        this.fontColor = fontColor;
        this.typeface = ResourcesCompat.getFont(context, font);

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
            view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.expandable_menu_header, viewGroup, false);
            view.setBackgroundColor(Color.parseColor(secondaryColor));
        }

        TextView listHeader = view.findViewById(R.id.list_header);
        listHeader.setTypeface(typeface, Typeface.BOLD);
        listHeader.setTextColor(Color.parseColor(fontColor));
        listHeader.setText(headerTitle);
        return view;
    }

    @Override
    public View getChildView(final int i, final int j, boolean b, View view, ViewGroup viewGroup) {
        //Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this.context));//error handling for unexpected crashes

        if(view == null) {
            view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.expandable_menu_item, viewGroup, false);
            view.setBackgroundColor(Color.parseColor(tertiaryColor));
        }


        TextView txtListChild = view.findViewById(R.id.list_item);
        TextView txtListChildPrice = view.findViewById(R.id.list_item_price);

        txtListChild.setTypeface(typeface);
        txtListChildPrice.setTypeface(typeface);

        txtListChild.setTextColor(Color.parseColor(fontColor));
        txtListChildPrice.setTextColor(Color.parseColor(fontColor));

        txtListChild.setText(getChild(i, j).getNameOfItem());
        txtListChildPrice.setText(String.format("$%.02f", getChild(i, j).getPrice()));

        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                addToCartPopup = new Dialog(context);
                addToCartPopup.setContentView(R.layout.menu_item_popup);

                addToCartPopup.findViewById(R.id.menu_popup).setBackgroundColor(Color.parseColor(secondaryColor));

                addToCartPopup.findViewById(R.id.add_to_cart_popup_close).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        addToCartPopup.dismiss();
                    }
                });

                Button addToCart = addToCartPopup.findViewById(R.id.add_to_cart_menu_popup);
                Button customize = addToCartPopup.findViewById(R.id.customize_item_menu_popup);
                TextView itemName = addToCartPopup.findViewById(R.id.item_name_menu_popup);
                TextView calorieCount = addToCartPopup.findViewById(R.id.item_calories_menu_popup);
                TextView itemPrice = addToCartPopup.findViewById(R.id.item_price_menu_popup);
                TextView itemDescription = addToCartPopup.findViewById(R.id.item_description_menu_popup);
                TextView itemAllergens  = addToCartPopup.findViewById(R.id.item_allergens_menu_popup);
                TextView outOfStock = addToCartPopup.findViewById(R.id.out_of_stock);
                ImageView outOfStockBackground = addToCartPopup.findViewById(R.id.out_of_stock_background);

                addToCart.setTypeface(typeface);
                customize.setTypeface(typeface);
                itemName.setTypeface(typeface, Typeface.BOLD);
                outOfStock.setTypeface(typeface, Typeface.BOLD);

                calorieCount.setTypeface(typeface);
                itemPrice.setTypeface(typeface);
                itemDescription.setTypeface(typeface);
                itemAllergens.setTypeface(typeface);

                addToCart.setTextColor(Color.parseColor(fontColor));
                customize.setTextColor(Color.parseColor(fontColor));
                itemName.setTextColor(Color.parseColor(fontColor));
                calorieCount.setTextColor(Color.parseColor(fontColor));
                itemPrice.setTextColor(Color.parseColor(fontColor));
                itemDescription.setTextColor(Color.parseColor(fontColor));
                itemAllergens.setTextColor(Color.parseColor(fontColor));

                addToCart.setBackgroundColor(Color.parseColor(primaryColor));
                customize.setBackgroundColor(Color.parseColor(primaryColor));

                if(getChild(i, j).getAmountInStock() > 0) {
                    outOfStock.setVisibility(View.GONE);
                    outOfStockBackground.setVisibility(View.GONE);

                    customize.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {

                        }
                    });

                    addToCart.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            if(pref.getShoppingCart().getCart().size() == 0) {
                                cart = new ShoppingCartSingleton(restaurantID, primaryColor, secondaryColor, tertiaryColor, font, fontColor, opening, closing);

                                MenuItem itemToBeAdded = getChild(i, j);
                                itemToBeAdded.setItemImage(itemImageByteArray);

                                cart.addToCart(itemToBeAdded);
                                pref.setShoppingCart(cart);
                                badge.setNumber(cart.getCart().size());
                                badge.setVisible(false);
                                badge.setVisible(true);
                                addToCartPopup.dismiss();
                            }
                            else if(pref.getShoppingCart().getRestaurantID() == restaurantID) {
                                cart = pref.getShoppingCart();

                                if(cart.cartContainsItem(getChild(i, j)) != null) {
                                    cart.cartContainsItem(getChild(i, j)).incrementQuantity();
                                }
                                else {
                                    MenuItem itemToBeAdded = getChild(i, j);
                                    itemToBeAdded.setItemImage(itemImageByteArray);

                                    cart.addToCart(itemToBeAdded);
                                }

                                pref.setShoppingCart(cart);
                                badge.setNumber(cart.getCart().size());
                                badge.setVisible(false);
                                badge.setVisible(true);
                                addToCartPopup.dismiss();
                            }
                            else if(pref.getShoppingCart().getRestaurantID() != restaurantID) {
                                confirmPopup = new Dialog(context);
                                confirmPopup.setContentView(R.layout.confirm_popup);

                                TextView dynamicPopupText = confirmPopup.findViewById(R.id.text_confirm_popup);

                                dynamicPopupText.setText("Adding this item will remove the other items currently in cart.");

                                confirmPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                                confirmPopup.show();

                                Button confirmClearCart = confirmPopup.findViewById(R.id.popup_yes);
                                confirmClearCart.setText("Confirm");

                                confirmClearCart.setOnClickListener(new View.OnClickListener() {
                                    @Override
                                    public void onClick(View v) {
                                        cart = new ShoppingCartSingleton(restaurantID, primaryColor, secondaryColor, tertiaryColor, font, fontColor, opening, closing);

                                        MenuItem itemToBeAdded = getChild(i, j);
                                        itemToBeAdded.setItemImage(itemImageByteArray);
                                        cart.addToCart(itemToBeAdded);

                                        pref.setShoppingCart(cart);
                                        badge.setNumber(cart.getCart().size());
                                        badge.setVisible(false);
                                        badge.setVisible(true);
                                        pref.getShoppingCart().setEndingHour(closing);
                                        pref.getShoppingCart().setStartingHour(opening);
                                        confirmPopup.dismiss();
                                        addToCartPopup.dismiss();
                                        Toast.makeText(context, "Successfully added to cart.",Toast.LENGTH_LONG).show();

                                    }
                                });

                                confirmPopup.findViewById(R.id.confirm_close).setOnClickListener(new View.OnClickListener() {
                                    public void onClick(View v) {
                                        confirmPopup.dismiss();
                                    }
                                });
                            }
                        }
                    });
                }

                final ImageView imageOfItem = addToCartPopup.findViewById(R.id.item_image_menu_popup);
                StringRequest getItemImageRequest = new StringRequest(Request.Method.GET, "http://50.19.176.137:8000/menu/image/" + getChild(i, j).getItemID(),
                        new Response.Listener<String>() {
                            @Override
                            public void onResponse(String response) {
                                try {
                                    JSONObject imageData = new JSONObject(response);

                                    itemImageByteArray = new byte[imageData.getJSONObject("image").getJSONArray("data").length()];

                                    for(int i = 0; i < itemImageByteArray.length; i++) {
                                        itemImageByteArray[i] = (byte) (((int) imageData.getJSONObject("image").getJSONArray("data").get(i)) & 0xFF);
                                    }

                                    imageOfItem.setImageBitmap(BitmapFactory.decodeByteArray(itemImageByteArray, 0, itemImageByteArray.length));
                                }
                                catch(JSONException e) {
                                    e.printStackTrace();
                                }

                            }
                        },
                        new Response.ErrorListener() {
                            @Override
                            public void onErrorResponse(VolleyError error) {

                            }
                        }
                );

                VolleySingleton.getInstance(context).addToRequestQueue(getItemImageRequest);


                calorieCount.setText("Calories: " + getChild(i, j).getCalories());
                calorieCount.setTextColor(Color.WHITE);
                itemName.setText(getChild(i, j).getNameOfItem());
                itemName.setTextColor(Color.WHITE);
                itemPrice.setText("Price: " + String.format("$%.02f", getChild(i, j).getPrice()));
                itemPrice.setTextColor(Color.WHITE);
                if(getChild(i, j).getDescription() != "null") {
                    itemDescription.setText(getChild(i, j).getDescription());
                }
                if(getChild(i, j).getAllergens().length!=0) {
                    String allergenMessage = "Allergens: ";
                    String[] allergensArray = getChild(i, j).getAllergens();
                    for(int i = 0; i < allergensArray.length; i++) {
                        allergenMessage = allergenMessage + allergensArray[i] + " ";
                    }
                    itemAllergens.setText(allergenMessage);
                    itemPrice.setTextColor(Color.WHITE);
                }

                //If item Out of Stock sets message to alert customer & make it so customer cannot add it to the cart.
                if(getChild(i, j).getAmountInStock() == 0) {
                    outOfStock.setText("Out of Stock");
                    addToCart.setVisibility(View.GONE);
                  //  calorieCount.setVisibility(View.GONE);
                }

                addToCartPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                addToCartPopup.show();
            }
        });

        return view;
    }

    @Override
    public boolean isChildSelectable(int i, int j) {
        return true;
    }
}