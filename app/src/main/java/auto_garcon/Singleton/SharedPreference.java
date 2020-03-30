package auto_garcon.Singleton;

import android.content.Context;
import android.content.SharedPreferences;

import com.example.auto_garcon.R;

public class SharedPreference {
    private SharedPreferences sharedPreferences;
    private Context context;


    public SharedPreference(Context context){
        this.context=context;

        sharedPreferences= context.getSharedPreferences(context.getString(R.string.pref_file),Context.MODE_PRIVATE);
    }

    public void changeLogStatus(boolean status){
        SharedPreferences.Editor editor = sharedPreferences.edit();

        //editing preference file and changing login status to either false or true
        editor.putBoolean(context.getString(R.string.pref_login_status),status);
        //how you save???
        editor.commit();
    }
    public  boolean getLoginStatus(){

        // gets the login status from preference file
        return sharedPreferences.getBoolean(context.getString(R.string.pref_login_status), false);
    }

    public void writeName(String name){
        SharedPreferences.Editor editor = sharedPreferences.edit();
        // we take in the name given and store it in our prefrence file
        editor.putString(context.getString(R.string.pref_user_name),name);
        //save
        editor.commit();
    }
    public String getName(){
        // returns the user logged in at the moment else returns the string user
        return  sharedPreferences.getString(context.getString(R.string.pref_user_name),"User");
    }
    public String getAuth(){

        return sharedPreferences.getString(context.getString(R.string.pref_auth_token),"Token");
    }
    public  void setAuthToken(String authToken){
        SharedPreferences.Editor editor = sharedPreferences.edit();

        editor.putString(context.getString(R.string.pref_auth_token),authToken);
        editor.commit();
    }
}
