package auto_garcon.singleton;

import java.util.ArrayList;

import auto_garcon.menustuff.MenuItem;
/**
 * Class for viewing and modifying shopping cart.
 *
 */
public class ShoppingCartSingleton {
    private  ArrayList<MenuItem> items;
    private int restaurantID;
    private int startingHour;
    private int endingHour;
    private int font;
    private String fontColor;
    private String primaryColor;
    private String secondaryColor;
    private String tertiaryColor;

    public ShoppingCartSingleton(){
        this.primaryColor = "#0B658A";
        this.secondaryColor = "#102644";
        this.tertiaryColor = "#FFFFFF";

        this.items = new ArrayList<MenuItem>();
    }

    public ShoppingCartSingleton(int restaurantID){
        this.restaurantID = restaurantID;

        this.primaryColor = "#0B658A";
        this.secondaryColor = "#102644";
        this.tertiaryColor = "#FFFFFF";

        this.items = new ArrayList<MenuItem>();
    }

    public ShoppingCartSingleton(int restaurantID, String primaryColor, String secondaryColor, String tertiaryColor, int font, String fontColor, int startingHour, int endingHour){
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

    public ArrayList<MenuItem> getCart(){
        return items;
    }

    public MenuItem cartContainsItem(MenuItem item){
        for(int i = 0; i < getCart().size(); i++) {
            if(item.getNameOfItem().equals(getCart().get(i).getNameOfItem())) {
                return getCart().get(i);
            }
        }

        return null;
    }
    public void setItems(ArrayList<MenuItem> items){
        this.items = items;
    }
    public void addToCart(MenuItem menuItem){
        this.items.add(menuItem);
    }

    public void removeFromCart(int i){
        this.items.remove(i);
    }

    public double getCostOfItems(){
        double cost = 0;

        for(int i = 0; i < items.size(); i++) {
            cost = cost + items.get(i).getCost();
        }

        return cost;
    }

    public double getCaloriesOfItems(){
        double calories = 0;

        for(int i = 0; i < items.size(); i++) {
            calories = calories + items.get(i).getPrice();
        }

        return calories;
    }


    public int getRestaurantID() {
        return this.restaurantID;
    }
    public void setStartingHour(int time){ this.startingHour = time; }
    public int  getStartingHour(){return this.startingHour;}
    public void setEndingHour(int time){this.endingHour = time;}
    public int  getEndingHour(){return this.endingHour;}
    public String toString(){
        String toReturn ="";

        for(int i = 0; i < items.size(); i++) {
            toReturn = toReturn + items.get(i).getNameOfItem() + " Qty(" + items.get(i).getQuantity() + ")\n";
        }
        return toReturn;
    }

    public void setFont(int font) {
        this.font = font;
    }

    public int getFont() {
        return this.font;
    }

    public void setPrimaryColor(String primaryColor) {
        this.primaryColor = primaryColor;
    }

    public String getPrimaryColor() {
        return this.primaryColor;
    }

    public void setSecondaryColor(String secondaryColor) {
        this.secondaryColor = secondaryColor;
    }

    public String getSecondaryColor() {
        return this.secondaryColor;
    }

    public void setTertiaryColor(String tertiaryColor) {
        this.tertiaryColor = tertiaryColor;
    }

    public String getTertiaryColor() {
        return this.tertiaryColor;
    }
}