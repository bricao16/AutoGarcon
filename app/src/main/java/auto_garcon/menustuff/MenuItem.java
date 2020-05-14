package auto_garcon.menustuff;

import android.util.Log;

import java.io.Serializable;
/**
 * Sorts out information for menu items
 *
 */
public class MenuItem implements Serializable{
    private String category;
    private String nameOfItem;
    private String description;
    private String[] allergens;
    private int amountInStock;
    private int calories;
    private double price;
    private double cost;
    private int quantity;
    private int itemID;
    private byte[] itemImage;
    private String customization;

    public MenuItem() {
        this.customization = "";
        this.quantity = 1;
    }

    public void setNameOfItem(String nameOfItem) {
        this.nameOfItem = nameOfItem;
    }

    public String getNameOfItem(){
        return this.nameOfItem;
    }

    public void setCalories(int calories) {
        this.calories = calories;
    }

    public int getCalories() {
        return this.calories;
    }

    public void setPrice(double price) {

        this.price = price;
    }
    public void setQuantity(int quantity){
        this.quantity=quantity;
    }

    public double getPrice() {
        return this.price;
    }

    public void setCost() {
        this.cost = getPrice() * getQuantity();
    }

    public double getCost() {
        return this.cost;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategory() {
        return this.category;
    }

    public void setAmountInStock(int amountInStock) {
        this.amountInStock = amountInStock;
    }

    public int getAmountInStock() {
        return this.amountInStock;
    }

    public void setItemID(int itemID) {
        this.itemID = itemID;
    }

    public int getItemID() {
        return this.itemID;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public void incrementQuantity() {
        this.quantity = this.quantity + 1;
    }

    public void decrementQuantity(){
        if(this.quantity > 0) {
            this.quantity = this.quantity - 1;
        }
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescription() {
        return this.description;
    }

    public void setAllergens(String[] allergens) { this.allergens = allergens;}

    public String[] getAllergens() {
        return this.allergens;
    }

    public void setItemImage(byte[] itemImage){
        this.itemImage = itemImage;
    }

    public byte[] getItemImage() {
        return this.itemImage;
    }
}
