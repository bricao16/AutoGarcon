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

    /**
     * basic MenuItem constructor
     */
    public MenuItem() {
        this.customization = "";
        this.quantity = 1;
    }

    /**
     * Constructor used to help create objects that will be used in CurrentOrders
     *
     * @param itemID int assigned to instance variable itemID
     * @param itemName String assigned to instance variable itemName
     * @param price double assigned to instance variable price
     * @param quantity int assigned to instance variable quantity
     * @param customization String assigned to instance variable customization
     */
    public MenuItem(int itemID, String itemName, double price, int quantity, String customization) {
        this.itemID = itemID;
        this.itemName = itemName;
        this.price = price;
        this.quantity = quantity;
        this.customization = customization;
    }

    /**
     * @return instance variable customization
     */
    public String getCustomization() {
        return this.customization;
    }

    /**
     * @param customization String gets set to instance variable customization
     */
    public void setCustomization(String customization) {
        this.customization = customization;
    }

    /**
     * @return instance variable itemName
     */
    public String getNameOfItem() {
        return this.itemName;
    }

    /**
     * @param nameOfItem String gets set to instance variable itemName
     */
    public void setNameOfItem(String nameOfItem) {
        this.itemName = nameOfItem;
    }

    /**
     * @return instance variable calories
     */
    public int getCalories() {
        return this.calories;
    }

    /**
     * @param calories int gets set to instance variable calories
     */
    public void setCalories(int calories) {
        this.calories = calories;
    }

    /**
     * @return instance variable price
     */
    public double getPrice() {
        return this.price;
    }

    /**
     * @param price double gets set to instance variable price
     */
    public void setPrice(double price) {

        this.price = price;
    }

    /**
     * @return double calculated from price and quantity of item
     */
    public double getCost() {
        return getPrice() * getQuantity();
    }

    /**
     * @return category instance variable
     */
    public String getCategory() {
        return this.category;
    }

    /**
     * @param category String gets set to instance variable category
     */
    public void setCategory(String category) {
        this.category = category;
    }

    /**
     * @return amountInStock instance variable
     */
    public int getAmountInStock() {
        return this.amountInStock;
    }

    /**
     * @param amountInStock int gets set to instance variable amountInStock
     */
    public void setAmountInStock(int amountInStock) {
        this.amountInStock = amountInStock;
    }

    /**
     * @return itemID instance variable
     */
    public int getItemID() {
        return this.itemID;
    }

    /**
     * @param itemID int gets set to instance variable itemID
     */
    public void setItemID(int itemID) {
        this.itemID = itemID;
    }

    /**
     * @return quantity instance variable
     */
    public int getQuantity() {
        return this.quantity;
    }

    /**
     * @param quantity int gets set to instance variable quantity
     */
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    /**
     * increments instance variable quantity
     */
    public void incrementQuantity() {
        this.quantity = this.quantity + 1;
    }

    /**
     * decrements instance variable quantity
     */
    public void decrementQuantity() {
        if (this.quantity > 0) {
            this.quantity = this.quantity - 1;
        }
    }

    /**
     * @return instance variable description
     */
    public String getDescription() {
        return this.description;
    }

    /**
     * @param description String gets set to instance variable description
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return instance variable allergens
     */
    public String[] getAllergens() {
        return this.allergens;
    }

    /**
     * @param allergens String[] gets set to instance variable allergens
     */
    public void setAllergens(String[] allergens) {
        this.allergens = allergens;
    }

    /**
     * sets byte[] itemImage instance variable by pulling the image from the database using its ID
     * with volley request
     * @param context used to specify where to display errors if they occur
     */
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

    /**
     * @return instance variable itemImage
     */
    public byte[] getItemImage() {
        return this.itemImage;
    }

    /**
     * @param itemImage byte[] gets set to itemImage instance variable
     */
    public void setItemImage(byte[] itemImage) {
        this.itemImage = itemImage;
    }
}
