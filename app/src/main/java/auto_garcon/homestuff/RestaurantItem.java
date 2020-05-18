package auto_garcon.homestuff;

import android.graphics.Bitmap;
import android.util.Log;

import java.io.Serializable;
/*
This is an object of restaurant page.
 */
public class RestaurantItem implements Serializable {
    private int ID;//restaurant id
    private String openingTime;//restaurant opening hour
    private String closingTime;//restaurant closing hour
    private Bitmap image;//restaurant image for the page
    private String address;//restaurant address
    private String name;//restaurant name
    private String phoneNumber;//restaurant phone number
    private int font;
    private String fontColor;
    private String secondaryColor;

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
        String openingTimeFinished = Integer.toString(openingTime);

        Log.d("asdgadsgas", openingTime+"");

        if(openingTimeFinished.length() > 2) {
            openingTimeFinished = openingTime % 1200 + ":" + openingTimeFinished.substring(openingTimeFinished.length() - 2);
        }
        else {
            openingTimeFinished = openingTime + ":00";
        }


        if(openingTime > 1200) {
            openingTimeFinished = openingTimeFinished + "pm";
        }
        else {
            openingTimeFinished = openingTimeFinished + "am";
        }

        this.openingTime = openingTimeFinished;
    }

    //get restaurant opening hour
    public String getOpeningTime(){
        return this.openingTime;
    }
    //get restaurant opening hour day
    //set restaurant closing hour
    public void setClosingTime(int closingTime){
        String closingTimeFinished = Integer.toString(closingTime);

        closingTimeFinished = closingTimeFinished.substring(closingTimeFinished.length() - 2);
        closingTimeFinished = closingTime % 12 + closingTimeFinished;

        if(closingTime > 12) {
            closingTimeFinished = closingTimeFinished + "pm";
        }
        else {
            closingTimeFinished = closingTimeFinished + "am";
        }

        this.closingTime = closingTimeFinished;
    }

    //get restaurant closing hour
    public String getClosingTime(){
        return this.closingTime;
    }
    //get restaurant closing hour day

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
        if(Long.toString(phoneNumber).length() == 10){
            String fullNumber = Long.toString(phoneNumber);
            this.phoneNumber = "(" + fullNumber.substring(0, 3) + ") " + fullNumber.substring(3, 6) + "-" + fullNumber.substring(6);
        }

    }
    //get restaurant phone number
    public String getPhoneNumber(){
        return this.phoneNumber;
    }

    public void setFont(int font){
        this.font = font;
    }

    public int getFont(){
        return this.font;
    }

    public void setFontColor(String fontColor){
        this.fontColor = fontColor;
    }

    public String getFontColor(){
        return this.fontColor;
    }

    public void setSecondaryColor(String secondaryColor){
        this.secondaryColor = secondaryColor;
    }
    public String getSecondaryColor(){
        return this.secondaryColor;
    }
}
