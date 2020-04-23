package auto_garcon.menustuff;

import java.io.Serializable;

public class MenuItem implements Serializable{
    private String category;
    private String nameOfItem;
    private int amountInStock;
    private int calories;
    private int restaurantID;
    private double price;
    private double cost;
    private int quantity;
    private int itemID;

    public MenuItem() {
        this.quantity = 1;
    }

    public MenuItem(String category, String nameOfItem,  int amountInStock,  int calories, int restaurantID, double price, int itemID) {
        this.nameOfItem = nameOfItem;
        this.restaurantID = restaurantID;
        this.calories = calories;
        this.price = price;
        this.category = category;
        this.amountInStock = amountInStock;
        this.quantity = 1;
        this.itemID = itemID;
    }

    public void setNameOfItem(String nameOfItem) {
        this.nameOfItem = nameOfItem;
    }

    public String getNameOfItem(){
        return this.nameOfItem;
    }

    public void setRestaurantID(int restaurantID) {
        this.restaurantID = restaurantID;
    }

    public int getRestaurantID(){
        return this.restaurantID;
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
}
