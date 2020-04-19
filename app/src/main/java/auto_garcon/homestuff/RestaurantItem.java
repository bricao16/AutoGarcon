package auto_garcon.homestuff;

import android.graphics.Bitmap;

import java.io.Serializable;

public class RestaurantItem implements Serializable {
    private int ID;
    private int openingTime;
    private int closingTime;
    private Bitmap image;
    private String address;
    private String name;
    private String phoneNumber;

    public RestaurantItem(){}

    public void setID(int ID){
        this.ID = ID;
    }

    public int getID(){
        return this.ID;
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

    public void setImageBitmap(Bitmap image){
        this.image = image;
    }

    public Bitmap getImageBitmap(){
        return this.image;
    }

    public void setAddress(String address){
        this.address = address;
    }

    public String getAddress(){
        return this.address;
    }

    public void setName(String name){
        this.name = name;
    }

    public String getName(){
        return this.name;
    }

    public void setPhoneNumber(long phoneNumber){
        String fullNumber = Long.toString(phoneNumber);

        this.phoneNumber = "(" + fullNumber.substring(0, 3) + ") " + fullNumber.substring(3, 6) + "-" + fullNumber.substring(6);
    }

    public String getPhoneNumber(){
        return this.phoneNumber;
    }




}
