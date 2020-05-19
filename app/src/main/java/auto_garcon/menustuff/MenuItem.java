package auto_garcon.menustuff;

import android.content.Context;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;

import auto_garcon.singleton.VolleySingleton;

/**
 * Sorts out information for menu items
 */
public class MenuItem implements Serializable {
    private String category;
    private String itemName;
    private String description;
    private String[] allergens;
    private int amountInStock;
    private int calories;
    private double price;
    private int quantity;
    private int itemID;
    private byte[] itemImage;
    private String customization;

    public MenuItem() {
        this.customization = "";
        this.quantity = 1;
    }

    public MenuItem(int itemID, String itemName, double price, int quantity, String customization) {
        this.itemID = itemID;
        this.itemName = itemName;
        this.price = price;
        this.quantity = quantity;
        this.customization = customization;
    }

    public String getCustomization() {
        return this.customization;
    }

    public void setCustomization(String customization) {
        this.customization = customization;
    }

    public String getNameOfItem() {
        return this.itemName;
    }

    public void setNameOfItem(String nameOfItem) {
        this.itemName = nameOfItem;
    }

    public int getCalories() {
        return this.calories;
    }

    public void setCalories(int calories) {
        this.calories = calories;
    }

    public double getPrice() {
        return this.price;
    }

    public void setPrice(double price) {

        this.price = price;
    }

    public double getCost() {
        return getPrice() * getQuantity();
    }

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getAmountInStock() {
        return this.amountInStock;
    }

    public void setAmountInStock(int amountInStock) {
        this.amountInStock = amountInStock;
    }

    public int getItemID() {
        return this.itemID;
    }

    public void setItemID(int itemID) {
        this.itemID = itemID;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void incrementQuantity() {
        this.quantity = this.quantity + 1;
    }

    public void decrementQuantity() {
        if (this.quantity > 0) {
            this.quantity = this.quantity - 1;
        }
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String[] getAllergens() {
        return this.allergens;
    }

    public void setAllergens(String[] allergens) {
        this.allergens = allergens;
    }

    public void setImage(final Context context) {
        if (this.itemID != -1) {

            StringRequest getItemImageRequest = new StringRequest(Request.Method.GET, "https://50.19.176.137:8001/menu/image/" + this.itemID, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {

                    try {
                        JSONObject imageData = new JSONObject(response);

                        byte[] itemImageByteArray = new byte[imageData.getJSONObject("image").getJSONArray("data").length()];

                        for (int i = 0; i < itemImageByteArray.length; i++) {
                            itemImageByteArray[i] = (byte) (((int) imageData.getJSONObject("image").getJSONArray("data").get(i)) & 0xFF);
                        }
                        itemImage = itemImageByteArray;
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    if (error.networkResponse.statusCode == 409) {
                        Toast.makeText(context, "image does not exist", Toast.LENGTH_LONG).show();
                    }
                    if (error.networkResponse.statusCode == 500) {
                        Toast.makeText(context, "Error retrieving image", Toast.LENGTH_LONG).show();
                    }
                }
            });
            VolleySingleton.getInstance(context).addToRequestQueue(getItemImageRequest);

        }
    }

    public byte[] getItemImage() {
        return this.itemImage;
    }

    public void setItemImage(byte[] itemImage) {
        this.itemImage = itemImage;
    }
}
