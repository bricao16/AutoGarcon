package auto_garcon.homestuff;

import android.graphics.Bitmap;
import android.util.Log;

import java.io.Serializable;
/*
This is an object of restaurant page.
 */
public class RestaurantItem implements Serializable {
    private int ID;//restaurant id
    private int openingTime;//restaurant opening hour
    private int closingTime;//restaurant closing hour
    private Bitmap image;//restaurant image for the page
    private String address;//restaurant address
    private String name;//restaurant name
    private String phoneNumber;//restaurant phone number

    public RestaurantItem(){}
    //set restaurant id
    public void setID(int ID){
        this.ID = ID;
    }
    //get restaurant id
    public int getID(){
        return this.ID;
    }
    //set restaurant opening hour
    public void setOpeningTime(int openingTime){
        this.openingTime = openingTime;
    }
    //get restaurant opening hour
    public int getOpeningTime(){
        return this.openingTime;
    }
    //set restaurant closing hour
    public void setClosingTime(int closingTime){
        this.closingTime = closingTime;
    }
    //get restaurant closing hour
    public int getClosingTime(){
        return this.closingTime;
    }
    //set restaurant image
    public void setImageBitmap(Bitmap image){
        this.image = image;
    }
    //get Bitmap object of restaurant image
    public Bitmap getImageBitmap(){
        return this.image;
    }
    //set restaurant address
    public void setAddress(String address){
        this.address = address;
    }
    //get restaurant address
    public String getAddress(){
        return this.address;
    }
    //set restaurant name
    public void setName(String name){
        this.name = name;
    }
    //get restaurant name
    public String getName(){
        return this.name;
    }
    //set restaurant phone number
    public void setPhoneNumber(long phoneNumber){
        if(phoneNumber!=0){
            String fullNumber = Long.toString(phoneNumber);
            this.phoneNumber = "(" + fullNumber.substring(0, 3) + ") " + fullNumber.substring(3, 6) + "-" + fullNumber.substring(6);
        }

    }
    //get restaurant phone number
    public String getPhoneNumber(){
        return this.phoneNumber;
    }




}
