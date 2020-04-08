package auto_garcon.Singleton;

import java.util.ArrayList;

import auto_garcon.MenuStuff.MenuItem;

public class ShoppingCartSingleton {
    private  ArrayList<MenuItem> items;
    private int restaurantID;

    public ShoppingCartSingleton(){
        this.items = new ArrayList<MenuItem>();
    }

    public ShoppingCartSingleton(int restaurantID){
        this.items = new ArrayList<MenuItem>();
        this.restaurantID = restaurantID;
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
            cost = cost + items.get(i).getPrice();
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

    public void setRestaurantID(int restaurantID) {
        this.restaurantID = restaurantID;
    }

    public int getRestaurantID() {
        return this.restaurantID;
    }
}