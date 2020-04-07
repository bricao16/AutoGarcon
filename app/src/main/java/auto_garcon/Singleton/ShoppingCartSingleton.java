package auto_garcon.Singleton;

import android.util.Log;

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

    public MenuItem cartContainsItem(MenuItem item){
        for(int i = 0; i < getCart().size(); i++) {
            if(item.getNameOfItem().equals(getCart().get(i).getNameOfItem())) {
                return getCart().get(i);
            }
        }

        return null;
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