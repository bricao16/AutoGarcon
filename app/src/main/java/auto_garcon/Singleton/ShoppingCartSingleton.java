package auto_garcon.Singleton;

import java.util.ArrayList;

import auto_garcon.MenuStuff.MenuItem;

public class ShoppingCartSingleton {
    private static ShoppingCartSingleton customerCart;
    private static ArrayList<MenuItem> Items;



    private ShoppingCartSingleton(){
        Items = new ArrayList<MenuItem>();
    }

    public static ShoppingCartSingleton getCustomerCart(){
        if(customerCart == null){
            customerCart = new ShoppingCartSingleton();
        }

        return customerCart;
    }

    public ArrayList<MenuItem> getCart(){
        return Items;
    }

    public synchronized static void addToCart(MenuItem menuItem){
        Items.add(menuItem);
    }

    public synchronized static void removeFromCart(int i){
        Items.remove(i);
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
}