package auto_garcon.Singleton;

import java.util.ArrayList;

import auto_garcon.MenuStuff.MenuItem;

public class ShoppingCartSingleton {
    private  ArrayList<MenuItem> Items;
    private int restaurantID;

    public ShoppingCartSingleton(){
        this.Items = new ArrayList<MenuItem>();
    }

    public ShoppingCartSingleton(int restaurantID){
        this.Items = new ArrayList<MenuItem>();
        this.restaurantID = restaurantID;
    }

    public ArrayList<MenuItem> getCart(){
        return Items;
    }

    public void addToCart(MenuItem menuItem){
        this.Items.add(menuItem);
    }

    public void removeFromCart(int i){
        this.Items.remove(i);
    }

    public double getCostOfItems(){
        double cost = 0;

        for(int i = 0; i < Items.size(); i++) {
            cost = cost + Items.get(i).getPrice();
        }

        return cost;
    }

    public double getCaloriesOfItems(){
        double calories = 0;

        for(int i = 0; i < Items.size(); i++) {
            calories = calories + Items.get(i).getPrice();
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