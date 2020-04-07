package auto_garcon.HomeStuff;

import java.io.Serializable;

public class RestaurantItem implements Serializable {
    private int ID;
    private long phoneNumber;
    private int openingTime;
    private int closingTime;
    private String name;
    private String address;

    public RestaurantItem(){}

    public void setID(int ID){
        this.ID = ID;
    }

    public int getID(){
        return this.ID;
    }

    public void setPhoneNumber(long phoneNumber){
        this.phoneNumber = phoneNumber;
    }

    public long getPhoneNumber(){
        return this.phoneNumber;
    }

    public void setOpeningTime(int openingTime){
        this.openingTime = openingTime;
    }

    public int getOpeningTime(){
        return this.openingTime;
    }

    public void setClosingTime(int closingTime){
        this.closingTime = closingTime;
    }

    public int getClosingTime(){
        return this.closingTime;
    }


    public void setName(String name){
        this.name = name;
    }

    public String getName(){
        return this.name;
    }

    public void setAddress(String address){
        this.address = address;
    }

    public String getAddress(){
        return this.address;
    }
}
