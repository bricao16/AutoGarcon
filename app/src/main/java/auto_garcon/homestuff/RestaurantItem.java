package auto_garcon.homestuff;

import android.graphics.Bitmap;

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
    private int font;
    private String fontColor;
    private String secondaryColor;

    public RestaurantItem() {
    }

    //get restaurant id
    public int getID() {
        return this.ID;
    }

    //set restaurant id
    public void setID(int ID) {
        this.ID = ID;
    }

    public String timeIntToString(int time) {
        String finishedTime = Integer.toString(time % 1200);

        if (finishedTime.length() == 3) {
            finishedTime = finishedTime.substring(0, 1) + ":" + finishedTime.substring(1, 3);
        } else {
            finishedTime = finishedTime.substring(0, 2) + ":" + finishedTime.substring(2, 4);
        }

        if (time >= 1200) {
            finishedTime = finishedTime + "pm";
        } else {
            finishedTime = finishedTime + "am";
        }

        return finishedTime;
    }

    //get restaurant opening hour
    public int getOpeningTime() {
        return this.openingTime;
    }

    //set restaurant opening hour
    public void setOpeningTime(int openingTime) {
        this.openingTime = openingTime;
    }

    //get restaurant closing hour
    public int getClosingTime() {
        return this.closingTime;
    }

    //get restaurant opening hour day
    //set restaurant closing hour
    public void setClosingTime(int closingTime) {
        this.closingTime = closingTime;
    }
    //get restaurant closing hour day

    //get Bitmap object of restaurant image
    public Bitmap getImageBitmap() {
        return this.image;
    }

    //set restaurant image
    public void setImageBitmap(Bitmap image) {
        this.image = image;
    }

    //get restaurant address
    public String getAddress() {
        return this.address;
    }

    //set restaurant address
    public void setAddress(String address) {
        this.address = address;
    }

    //get restaurant name
    public String getName() {
        return this.name;
    }

    //set restaurant name
    public void setName(String name) {
        this.name = name;
    }

    //get restaurant phone number
    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    //set restaurant phone number
    public void setPhoneNumber(long phoneNumber) {
        if (Long.toString(phoneNumber).length() == 10) {
            String fullNumber = Long.toString(phoneNumber);
            this.phoneNumber = "(" + fullNumber.substring(0, 3) + ") " + fullNumber.substring(3, 6) + "-" + fullNumber.substring(6);
        }

    }

    public int getFont() {
        return this.font;
    }

    public void setFont(int font) {
        this.font = font;
    }

    public String getFontColor() {
        return this.fontColor;
    }

    public void setFontColor(String fontColor) {
        this.fontColor = fontColor;
    }

    public String getSecondaryColor() {
        return this.secondaryColor;
    }

    public void setSecondaryColor(String secondaryColor) {
        this.secondaryColor = secondaryColor;
    }
}
