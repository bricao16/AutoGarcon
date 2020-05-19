package auto_garcon.homestuff;

import android.graphics.Bitmap;

import java.io.Serializable;

/**
 * This class represent information of a specific resturant that has been pulled from the databse
 * */
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

    /**
     *This method returns the restaurant ID
     */
    public int getID() {
        return this.ID;
    }

    /**
     * This method sets our restaurant ID
     * @param ID the id that we will be setting our instance variable to
     */
    public void setID(int ID) {
        this.ID = ID;
    }

    /**
     * This method takes in a time as int and converts into a displayable string
     * @param time this represents the current time and is converted into a string
     * @return returns a String based off the integer time passed
     */
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

    /**
     * This method returns the opening Time instance variable
     */
    public int getOpeningTime() {
        return this.openingTime;
    }

    /**
     * This method sets the instance vairbale openeing Time variable
     * @param openingTime the time that our opening variable will be set too
     */
    public void setOpeningTime(int openingTime) {
        this.openingTime = openingTime;
    }


    /**
     * This method returns the closing time instance variable
     */
    public int getClosingTime() {
        return this.closingTime;
    }

    /**
     * This method sets the closing time instance variable
     * @param closingTime this variable represents the closing time we will set our instance variable to
     */
    public void setClosingTime(int closingTime) {
        this.closingTime = closingTime;
    }

    /**
     * This method will return our bitmap Instance Variable
     */
    public Bitmap getImageBitmap() {
        return this.image;
    }

    /**
     * This method sets the bitmapImage instance variable
     * @param image this represents the value we will set our instance variable too
     */
    public void setImageBitmap(Bitmap image) {
        this.image = image;
    }

    /**
     *This method returns the instance variable with the address
     */
    public String getAddress() {
        return this.address;
    }

    /**
     * This method sets the address instance variable
     * @param address this represents the value we will set our address instance variable too.
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     * This method returns the name of the restaurant.
     */
    public String getName() {
        return this.name;
    }

    /**
     * This method sets the restaurant name instance variable
     * @param name this represents the name we will be setting our instance variable too
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     *This method returns the phone number instance variable
     */
    public String getPhoneNumber() {
        return this.phoneNumber;
    }


    /**
     * This method sets the phoneNumber instance variable
     * @param phoneNumber this represents the phone number that will be set too
     */
    public void setPhoneNumber(long phoneNumber) {
        if (Long.toString(phoneNumber).length() == 10) {
            String fullNumber = Long.toString(phoneNumber);
            this.phoneNumber = "(" + fullNumber.substring(0, 3) + ") " + fullNumber.substring(3, 6) + "-" + fullNumber.substring(6);
        }
        else {
            this.phoneNumber ="Invalid phone number";
        }

    }

    /**
     * This method returns the font instance variable
     */
    public int getFont() {
        return this.font;
    }

    /**
     * this method sets the value for the font instance variable
     * @param font this variable represents the value that the font instance variable will be set too
     */
    public void setFont(int font) {
        this.font = font;
    }

    /**
     * This returns the font color instance variable
     */
    public String getFontColor() {
        return this.fontColor;
    }

    /**
     * this method sets the font color instance variable
     * @param fontColor this represents the value the font color will be set too
     */
    public void setFontColor(String fontColor) {
        this.fontColor = fontColor;
    }

    /**
     * this method gets the secondoryColor instance variable
     */
    public String getSecondaryColor() {
        return this.secondaryColor;
    }

    /**
     * this method sets the instance variable for secondaryColor
     * @param secondaryColor this represents the value that secondaryValue will be set too
     */
    public void setSecondaryColor(String secondaryColor) {
        this.secondaryColor = secondaryColor;
    }
}
