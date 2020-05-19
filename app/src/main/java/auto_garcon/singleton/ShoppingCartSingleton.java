package auto_garcon.singleton;

import java.util.ArrayList;

import auto_garcon.menustuff.MenuItem;

/**
 * Class is a representation of an actual shopping cart stores all items user has added
 * as well as the restaurants information
 */
public class ShoppingCartSingleton {
    private ArrayList<MenuItem> items;
    private String restaurantName;
    private int restaurantID;
    private int startingHour;
    private int endingHour;
    private int font;
    private String fontColor;
    private String primaryColor;
    private String secondaryColor;
    private String tertiaryColor;

    /**
     * Sets default colors for shopping cart and initializes items ArrayList.
     */
    public ShoppingCartSingleton() {
        this.primaryColor = "#0B658A";
        this.secondaryColor = "#102644";
        this.tertiaryColor = "#FFFFFF";

        this.items = new ArrayList<>();
    }

    /**
     * Sets default colors for shopping cart and initializes items ArrayList given a restaurant ID.
     */
    public ShoppingCartSingleton(int restaurantID) {
        this.restaurantID = restaurantID;

        this.primaryColor = "#0B658A";
        this.secondaryColor = "#102644";
        this.tertiaryColor = "#FFFFFF";

        this.items = new ArrayList<MenuItem>();
    }

    /**
     * Sets font, colors, hours for a restaurant given a restaurant ID and information.
     */
    public ShoppingCartSingleton(int restaurantID, String primaryColor, String secondaryColor, String tertiaryColor, int font, String fontColor, int startingHour, int endingHour) {
        this.restaurantID = restaurantID;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.tertiaryColor = tertiaryColor;
        this.font = font;
        this.fontColor = fontColor;
        this.startingHour = startingHour;
        this.endingHour = endingHour;

        this.items = new ArrayList<MenuItem>();
    }

    /**
     * Sets font, colors, and restaurant name given a restaurant ID.
     */
    public ShoppingCartSingleton(String restaurantName, int restaurantID, int font, String fontColor, String primaryColor, String secondaryColor, String tertiaryColor) {
        this.restaurantName = restaurantName;
        this.restaurantID = restaurantID;
        this.font = font;
        this.fontColor = fontColor;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.tertiaryColor = tertiaryColor;

        this.items = new ArrayList<>();
    }

    /**
     * Returns items in cart.
     */
    public ArrayList<MenuItem> getCart() {
        return items;
    }

    /**
     * Returns the Menu item of item in cart.
     */
    public MenuItem cartContainsItem(MenuItem item) {
        for (int i = 0; i < getCart().size(); i++) {
            if (item.getNameOfItem().equals(getCart().get(i).getNameOfItem())) {
                return getCart().get(i);
            }
        }

        return null;
    }

    /**
     * Sets items in cart.
     */
    public void setItems(ArrayList<MenuItem> items) {
        this.items = items;
    }

    /**
     * Adds item to cart.
     */
    public void addToCart(MenuItem menuItem) {
        this.items.add(menuItem);
    }

    /**
     * Removes item from cart.
     */
    public void removeFromCart(int i) {
        this.items.remove(i);
    }

    /**
     * Returns cost of item.
     */
    public double getCostOfItems() {
        double cost = 0;

        for (int i = 0; i < items.size(); i++) {
            cost = cost + items.get(i).getCost();
        }

        return cost;
    }

    /**
     * Returns Restaurant ID.
     */
    public int getRestaurantID() {
        return this.restaurantID;
    }

    /**
     * Returns Opening Time.
     */
    public int getStartingHour() {
        return this.startingHour;
    }

    /**
     * Sets Opening Time.
     */
    public void setStartingHour(int time) {
        this.startingHour = time;
    }

    /**
     * Returns Closing Time.
     */
    public int getEndingHour() {
        return this.endingHour;
    }

    /**
     * Sets Closing Time.
     */
    public void setEndingHour(int time) {
        this.endingHour = time;
    }

    /**
     * Returns String of the Names of the items plus their quantity
     */
    public String toString() {
        String toReturn = "";

        for (int i = 0; i < items.size(); i++) {
            toReturn = toReturn + items.get(i).getNameOfItem() + " Qty(" + items.get(i).getQuantity() + ")\n";
        }
        return toReturn;
    }

    /**
     * Returns the font.
     */
    public int getFont() {
        return this.font;
    }

    /**
     * Sets the font.
     */
    public void setFont(int font) {
        this.font = font;
    }

    /**
     * Gets the font color.
     */
    public String getFontColor() {
        return this.fontColor;
    }

    /**
     * Sets the font color.
     */
    public void setFontColor(String fontColor) {
        this.fontColor = fontColor;
    }

    /**
     * Gets the Primary Color.
     */
    public String getPrimaryColor() {
        return this.primaryColor;
    }

    /**
     * Sets the Primary Color.
     */
    public void setPrimaryColor(String primaryColor) {
        this.primaryColor = primaryColor;
    }

    /**
     * Gets the Secondary Color.
     */
    public String getSecondaryColor() {
        return this.secondaryColor;
    }

    /**
     * Sets the Secondary Color.
     */
    public void setSecondaryColor(String secondaryColor) {
        this.secondaryColor = secondaryColor;
    }

    /**
     * Gets the Tertiary Color.
     */
    public String getTertiaryColor() {
        return this.tertiaryColor;
    }

    /**
     * Sets the Tertiary Color.
     */
    public void setTertiaryColor(String tertiaryColor) {
        this.tertiaryColor = tertiaryColor;
    }
}