package auto_garcon.MenuStuff;

public class MenuItem {
    private String nameOfItem;
    private int restaurantID;
    private int calories;
    private double price;
    private String category;
    private int amountInStock;

    public MenuItem() { }

    public MenuItem(String nameOfItem, int restaurantID, int calories, double price, String entree, int amountInStock) {
        this.nameOfItem = nameOfItem;
        this.restaurantID = restaurantID;
        this.calories = calories;
        this.price = price;
        this.category = category;
        this.amountInStock = amountInStock;
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

    public void setPrice(double Price) {
        this.price = price;
    }

    public double getPrice() {
        return this.price;
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
}
