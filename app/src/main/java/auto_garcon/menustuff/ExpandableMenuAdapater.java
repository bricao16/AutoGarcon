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
import android.widget.EditText;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import auto_garcon.ExceptionHandler;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.ShoppingCartSingleton;
import auto_garcon.singleton.VolleySingleton;

/**
 * Class used to dynamically display a restaurants menu
 */

public class ExpandableMenuAdapater extends BaseExpandableListAdapter {
    Dialog addToCartPopup;
    Dialog confirmPopup;
    private Context context;
    private List<String> listDataHeader;
    private HashMap<String, ArrayList<MenuItem>> listHashMap;
    private SharedPreference pref;
    private ShoppingCartSingleton shoppingCart;
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

    /**
     * Constructor used to set all of the necessary variables need for creating the adapter for the expandable
     * list
     *
     * @param context        Context assigned to instance variable context and used to create new SharedPreference
     * @param listDataHeader List<String> assigned to instance variable listDataHeader
     * @param listHashMap    HashMap<String, ArrayList<MenuItem>> assigned to instance variable listHashMap
     * @param restaurantID   int assigned to instance variable restaurantID
     * @param font           int assigned to instance variable font
     * @param fontColor      String assigned to instance variable fontColor
     * @param primaryColor   String assigned to instance variable primaryColor
     * @param secondaryColor String assigned to instance variable secondaryColor
     * @param tertiaryColor  String assigned to instance variable tertiaryColor
     * @param opening        int assigned to instance variable opening
     * @param closing        int assigned to instance variable closing
     * @param drawable       BadgeDrawable assigned to instance variable badge
     */
    public ExpandableMenuAdapater(Context context, List<String> listDataHeader, HashMap<String, ArrayList<MenuItem>> listHashMap, int restaurantID, int font, String fontColor,
                                  String primaryColor, String secondaryColor, String tertiaryColor, int opening, int closing, BadgeDrawable drawable) {
        Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this.context));//error handling for unexpected crashes

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

    /**
     * returns size of instance variable listDataHeader
     */
    @Override
    public int getGroupCount() {
        return listDataHeader.size();
    }

    /**
     * @param i used to tell listHashMap which key to use
     * @return size of the arrayList stored in the values portion of listHashMap instance variable
     */
    @Override
    public int getChildrenCount(int i) {
        return listHashMap.get(listDataHeader.get(i)).size();
    }

    /**
     * @param i used to tell which category for listDataHeader to return
     * @return String stored within listDataHeader
     */
    @Override
    public Object getGroup(int i) {
        return listDataHeader.get(i);
    }

    /**
     * Gets the data associated with the given child within the given group.
     *
     * @param i the position of the group that the child resides in
     * @param j the position of the child with respect to other
     *          children in the group
     * @return the data of the child
     */
    @Override
    public MenuItem getChild(int i, int j) {
        return listHashMap.get(listDataHeader.get(i)).get(j);  //i = group item, j = child item
    }

    /**
     * method not actually needed
     *
     * @param i the position of the group for which the ID is wanted
     * @return parameter
     */
    @Override
    public long getGroupId(int i) {
        return i;
    }

    /**
     * method not actually needed
     *
     * @param i the position of the group that contains the child
     * @param j the position of the child within the group for which
     *          the ID is wanted
     * @return int j
     */
    @Override
    public long getChildId(int i, int j) {
        return j;
    }

    /**
     * method not actually needed
     *
     * @return false
     */
    @Override
    public boolean hasStableIds() {
        return false;
    }

    /**
     * Gets a View that displays the given group. This View is only for the
     * group--the Views for the group's children will be fetched using
     * Dynamically sets some xml elements based on data pulled from restaurant request on
     * Menu activity
     * <p>
     * {@link #getChildView(int, int, boolean, View, ViewGroup)}.
     *
     * @param i         the position of the group for which the View is
     *                  returned
     * @param b         whether the group is expanded or collapsed
     * @param view      the old view to reuse, if possible. You should check
     *                  that this view is non-null and of an appropriate type before
     *                  using. If it is not possible to convert this view to display
     *                  the correct data, this method can create a new view. It is not
     *                  guaranteed that the convertView will have been previously
     *                  created by
     *                  {@link #getGroupView(int, boolean, View, ViewGroup)}.
     * @param viewGroup the parent that this view will eventually be attached to
     * @return the View corresponding to the group at the specified position
     */
    @Override
    public View getGroupView(int i, boolean b, View view, ViewGroup viewGroup) {
        String headerTitle = (String) getGroup(i);

        if (view == null) {
            view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.expandable_menu_header, viewGroup, false);
            view.setBackgroundColor(Color.parseColor(secondaryColor));
        }

        TextView listHeader = view.findViewById(R.id.list_header);
        listHeader.setTypeface(typeface, Typeface.BOLD);
        listHeader.setTextColor(Color.parseColor(fontColor));
        listHeader.setText(headerTitle);
        return view;
    }

    /**
     * Gets a View that displays the data for the given child within the given
     * group.
     * <p>
     * Binds xml elements data pulled from database as well as sets various onClicks
     * and popups that will prompt user to use add MenuItems to cart as well as display
     * the MenuItems information and allow the user to set customization for the MenuItems
     *
     * @param i         the position of the group that contains the child
     * @param j         the position of the child (for which the View is
     *                  returned) within the group
     * @param b         Whether the child is the last child within the group
     * @param view      the old view to reuse, if possible. You should check
     *                  that this view is non-null and of an appropriate type before
     *                  using. If it is not possible to convert this view to display
     *                  the correct data, this method can create a new view. It is not
     *                  guaranteed that the convertView will have been previously
     *                  created by
     *                  {@link #getChildView(int, int, boolean, View, ViewGroup)}.
     * @param viewGroup the parent that this view will eventually be attached to
     * @return the View corresponding to the child at the specified position
     */
    @Override
    public View getChildView(final int i, final int j, boolean b, View view, ViewGroup viewGroup) {
        //Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this.context));//error handling for unexpected crashes

        if (view == null) {
            view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.expandable_menu_item, viewGroup, false);
            view.setBackgroundColor(Color.parseColor(tertiaryColor));
        }

        final MenuItem currentChild = getChild(i, j);

        TextView txtListChild = view.findViewById(R.id.list_item);
        TextView txtListChildPrice = view.findViewById(R.id.list_item_price);

        txtListChild.setTypeface(typeface);
        txtListChildPrice.setTypeface(typeface);

        txtListChild.setTextColor(Color.parseColor(fontColor));
        txtListChildPrice.setTextColor(Color.parseColor(fontColor));

        txtListChild.setText(currentChild.getNameOfItem());
        txtListChildPrice.setText(String.format("$%.02f", currentChild.getPrice()));

        /**
         * onClick for menu_item_popup.xml to appear
         */
        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                addToCartPopup = new Dialog(context);
                addToCartPopup.setContentView(R.layout.menu_item_popup);

                addToCartPopup.findViewById(R.id.menu_popup).setBackgroundColor(Color.parseColor(secondaryColor));

                /**
                 * onClick to dismiss menu_item_popup.xml
                 */
                addToCartPopup.findViewById(R.id.add_to_cart_popup_close).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        addToCartPopup.dismiss();
                    }
                });

                /**
                 * binding various xml elements to Java objects and setting certain features about
                 * them based on data pulled from database
                 */
                Button addToCart = addToCartPopup.findViewById(R.id.add_to_cart_menu_popup);
                final Button customize = addToCartPopup.findViewById(R.id.customize_item_menu_popup);
                TextView itemName = addToCartPopup.findViewById(R.id.item_name_menu_popup);
                TextView calorieCount = addToCartPopup.findViewById(R.id.item_calories_menu_popup);
                TextView itemPrice = addToCartPopup.findViewById(R.id.item_price_menu_popup);
                TextView itemDescription = addToCartPopup.findViewById(R.id.item_description_menu_popup);
                TextView itemAllergens = addToCartPopup.findViewById(R.id.item_allergens_menu_popup);
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

                itemName.setText(currentChild.getNameOfItem());
                itemDescription.setText(currentChild.getDescription());
                itemPrice.setText("Price: " + String.format("$%.02f", getChild(i, j).getPrice()));
                calorieCount.setText("Calories: " + getChild(i, j).getCalories());

                if (currentChild.getAllergens().length != 0) {
                    String allergenMessage = "Allergens: ";
                    String[] allergensArray = currentChild.getAllergens();
                    for (int i = 0; i < allergensArray.length; i++) {
                        allergenMessage = allergenMessage + allergensArray[i] + " ";
                    }
                    itemAllergens.setText(allergenMessage);
                }

                //If item Out of Stock sets message to alert customer & make it so customer cannot add it to the cart.
                if (currentChild.getAmountInStock() == 0) {
                    outOfStock.setText("Out of Stock");
                    addToCart.setVisibility(View.GONE);
                    customize.setVisibility(View.GONE);
                }

                if (currentChild.getAmountInStock() > 0) {
                    outOfStock.setVisibility(View.GONE);
                    outOfStockBackground.setVisibility(View.GONE);

                    /**
                     * onClick to display menu_item_edit_popup.xml
                     */
                    customize.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            final Dialog customizationPopup = new Dialog(context);
                            customizationPopup.setContentView(R.layout.menu_item_edit_popup);

                            customizationPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                            customizationPopup.show();

                            final EditText customization = customizationPopup.findViewById(R.id.text_menu_item_edit);
                            customization.setText(currentChild.getCustomization());

                            /**
                             * onClick to sets customers customization for MenuItem
                             */
                            customizationPopup.findViewById(R.id.menu_item_edit_submit).setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    currentChild.setCustomization(customization.getText().toString().trim() + "; ");
                                    customizationPopup.dismiss();
                                }
                            });

                            /**
                             * onClick to dismiss menu_item_edit_popup.xml
                             */
                            customizationPopup.findViewById(R.id.menu_item_edit_close).setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    customizationPopup.dismiss();
                                }
                            });
                        }
                    });

                    /**
                     * onClick to add MenuItem to ShoppingCartSingleton stored in SharedPreference
                     * will reset cart if this MenuItem is from a different restaurant than currently in cart
                     * if MenuItem in cart already just increments
                     * otherwise adds to cart
                     */
                    addToCart.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            if (pref.getShoppingCart().getCart().size() == 0 || pref.getShoppingCart().getCart() == null) {

                                shoppingCart = new ShoppingCartSingleton(restaurantID, primaryColor, secondaryColor, tertiaryColor, font, fontColor, opening, closing);

                                MenuItem itemToBeAdded = currentChild;

                                itemToBeAdded.setItemImage(itemImageByteArray);

                                shoppingCart.addToCart(itemToBeAdded);

                                pref.setShoppingCart(shoppingCart);
                                currentChild.setCustomization("");

                                badge.setNumber(shoppingCart.getCart().size());
                                badge.setVisible(false);
                                badge.setVisible(true);
                                addToCartPopup.dismiss();
                            } else if (pref.getShoppingCart().getRestaurantID() == restaurantID) {
                                shoppingCart = pref.getShoppingCart();

                                if (shoppingCart.cartContainsItem(currentChild) != null) {
                                    shoppingCart.cartContainsItem(currentChild).incrementQuantity();
                                    shoppingCart.cartContainsItem(currentChild).setCustomization(shoppingCart.cartContainsItem(currentChild).getCustomization() + currentChild.getCustomization());
                                } else {
                                    MenuItem itemToBeAdded = currentChild;

                                    itemToBeAdded.setItemImage(itemImageByteArray);

                                    shoppingCart.addToCart(itemToBeAdded);
                                }

                                pref.setShoppingCart(shoppingCart);
                                currentChild.setCustomization("");
                                badge.setNumber(shoppingCart.getCart().size());
                                badge.setVisible(false);
                                badge.setVisible(true);
                                addToCartPopup.dismiss();
                            } else if (pref.getShoppingCart().getRestaurantID() != restaurantID) {
                                confirmPopup = new Dialog(context);
                                confirmPopup.setContentView(R.layout.confirm_popup);

                                TextView dynamicPopupText = confirmPopup.findViewById(R.id.text_confirm_popup);

                                dynamicPopupText.setText("Adding this item will remove the other items currently in cart.");

                                confirmPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                                confirmPopup.show();

                                Button confirmClearCart = confirmPopup.findViewById(R.id.popup_yes);
                                confirmClearCart.setText("Confirm");

                                /**
                                 * onClick to confirm user wants to clear cart by adding new MenuItem
                                 */
                                confirmClearCart.setOnClickListener(new View.OnClickListener() {
                                    @Override
                                    public void onClick(View v) {

                                        shoppingCart = new ShoppingCartSingleton(restaurantID, primaryColor, secondaryColor, tertiaryColor, font, fontColor, opening, closing);

                                        MenuItem itemToBeAdded = currentChild;

                                        itemToBeAdded.setItemImage(itemImageByteArray);

                                        shoppingCart.addToCart(itemToBeAdded);

                                        pref.setShoppingCart(shoppingCart);
                                        currentChild.setCustomization("");

                                        badge.setNumber(shoppingCart.getCart().size());
                                        badge.setVisible(false);
                                        badge.setVisible(true);
                                        pref.getShoppingCart().setEndingHour(closing);
                                        pref.getShoppingCart().setStartingHour(opening);
                                        confirmPopup.dismiss();
                                        addToCartPopup.dismiss();
                                        Toast.makeText(context, "Successfully added to cart.", Toast.LENGTH_LONG).show();
                                    }
                                });

                                /**
                                 * dismiss clear cart popup
                                 */
                                confirmPopup.findViewById(R.id.confirm_close).setOnClickListener(new View.OnClickListener() {
                                    public void onClick(View v) {
                                        confirmPopup.dismiss();
                                    }
                                });
                            }
                        }
                    });
                }

                /**
                 * pulls images from database using MenuItem ids with volley request and binds
                 * to appropriate xml element
                 */
                final ImageView imageOfItem = addToCartPopup.findViewById(R.id.item_image_menu_popup);
                StringRequest getItemImageRequest = new StringRequest(Request.Method.GET, "https://50.19.176.137:8001/menu/image/" + currentChild.getItemID(),
                        new Response.Listener<String>() {
                            @Override
                            public void onResponse(String response) {
                                try {
                                    JSONObject imageData = new JSONObject(response);

                                    itemImageByteArray = new byte[imageData.getJSONObject("image").getJSONArray("data").length()];

                                    for (int i = 0; i < itemImageByteArray.length; i++) {
                                        itemImageByteArray[i] = (byte) (((int) imageData.getJSONObject("image").getJSONArray("data").get(i)) & 0xFF);
                                    }

                                    imageOfItem.setImageBitmap(BitmapFactory.decodeByteArray(itemImageByteArray, 0, itemImageByteArray.length));
                                } catch (JSONException e) {
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

                addToCartPopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                addToCartPopup.show();
            }
        });

        return view;
    }

    /**
     * method not used
     *
     * @param i the position of the group that contains the child
     * @param j the position of the child within the group
     * @return whether the child is selectable.
     */
    @Override
    public boolean isChildSelectable(int i, int j) {
        return true;
    }
}