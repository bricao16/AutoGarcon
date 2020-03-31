package auto_garcon.HomeStuff;

import java.io.Serializable;

public class RestaurantItem implements Serializable {
    private int ID;
    private String name;

    public RestaurantItem(){}

    public void setID(int ID){
        this.ID = ID;
    }

    public int getID(){
        return this.ID;
    }

    public void setName(String name){
        this.name = name;
    }

    public String getName(){
        return this.name;
    }
}
