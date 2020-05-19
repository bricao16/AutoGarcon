package auto_garcon.accountstuff;

import android.app.Dialog;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.example.auto_garcon.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

import auto_garcon.VolleyMultipartRequest;
import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.Login;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.UserSingleton;
import auto_garcon.singleton.VolleySingleton;
import de.hdodenhof.circleimageview.CircleImageView;

public class Account extends AppCompatActivity {
    EditText changeFirstName;//used to extract data from xml page of the Account Activity
    EditText changeLastName;//used to extract data from xml page of the Account Activity
    EditText changeUsername;//used to extract data from xml page of the Account Activity
    EditText changeEmail;//used to extract data from xml page of the Account Activity
    Button saveAccountChanges;//used to identify when user wants to register
    TextView changePassword;//used to send user into Sign in Activity
    private SharedPreference pref;//This object is used to store information about the user that can be used outside of this page
    private CircleImageView accountImage;

    /**
     * Called when the activity is starting.  This is where most initialization
     * should go
     *
     * <p><em>Derived classes must call through to the super class's
     * implementation of this method.  If they do not, an exception will be
     * thrown.</em></p>
     *
     * @param savedInstanceState If the activity is being re-initialized after
     *                           previously being shut down then this Bundle contains the data it most
     *                           recently supplied in {@link #onSaveInstanceState}.  <b><i>Note: Otherwise it is null.</i></b>
     * @see #onStart
     * @see #onSaveInstanceState
     * @see #onRestoreInstanceState
     * @see #onPostCreate
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this));//error handling for unexpected crashes

        pref = new SharedPreference(this);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_account);

        //initializing new preference variable

        //setting input container fields to variables
        changeFirstName = findViewById(R.id.first_name_change);
        changeLastName = findViewById(R.id.last_name_change);
        changeUsername = findViewById(R.id.change_username);
        changeEmail = findViewById(R.id.change_email);

        //action buttons to save and change information
        saveAccountChanges = findViewById(R.id.save_acct_change);
        changePassword = findViewById(R.id.change_password);

        //Filling in current user information into container fields
        changeFirstName.setText(pref.getUser().getFirstName());
        changeLastName.setText(pref.getUser().getLastName());
        changeUsername.setText(pref.getUser().getUsername());
        changeEmail.setText(pref.getUser().getEmail());

        accountImage = findViewById(R.id.account_image_change);
        accountImage.setImageBitmap(BitmapFactory.decodeByteArray(pref.getUser().getImageBitmap(), 0, pref.getUser().getImageBitmap().length));

        accountImage.setOnClickListener(new Button.OnClickListener() {
            @Override
            public void onClick(View v) {
                final Dialog changeImagePopup = new Dialog(Account.this);
                changeImagePopup.setContentView(R.layout.account_image_popup);
                changeImagePopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

                changeImagePopup.show();

                changeImagePopup.findViewById(R.id.take_photo_button).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        startActivityForResult(new Intent(MediaStore.ACTION_IMAGE_CAPTURE), 0);
                        changeImagePopup.dismiss();
                    }
                });

                changeImagePopup.findViewById(R.id.choose_from_gallery_button).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        startActivityForResult(new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI), 1);
                        changeImagePopup.dismiss();
                    }
                });

                changeImagePopup.findViewById(R.id.account_image_close).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        changeImagePopup.dismiss();
                    }
                });
            }
        });

        /*
         * If user selects the save account changes buttons
         * users information will update in database given inputs
         * */
        saveAccountChanges.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {

                //extracting user data and converting the objects into stings
                final String firstName = changeFirstName.getText().toString().trim();
                final String lastName = changeLastName.getText().toString().trim();
                final String email = changeEmail.getText().toString().trim();
                final String username = changeUsername.getText().toString().trim();

                boolean validInputs = true;

                if (TextUtils.isEmpty(firstName)) {//checking if user entered their firstName
                    changeFirstName.setError("Please enter first name");
                    changeFirstName.requestFocus();
                    validInputs = false;
                }
                if (firstName.length() > 50) {//checking if firstname is less than 50 characters
                    changeFirstName.setError("Limit first name to less than 50 characters");
                    changeFirstName.requestFocus();
                    validInputs = false;
                }
                if (TextUtils.isEmpty(lastName)) {//checking if user entered their lastName
                    changeLastName.setError("Please enter last name");
                    changeLastName.requestFocus();
                    validInputs = false;
                }
                if (lastName.length() > 50) {//checking if lastname is less than 50 characters
                    changeLastName.setError("Limit last name to less than 50 characters");
                    changeLastName.requestFocus();
                    validInputs = false;
                }
                if (TextUtils.isEmpty(email)) {//checking if user entered their email
                    changeEmail.setError("Please enter email ");
                    changeEmail.requestFocus();
                    validInputs = false;
                }
                if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {// use android built patterns function to test if the email matches
                    changeEmail.setError("Please enter a valid email");
                    changeEmail.requestFocus();
                    validInputs = false;
                }
                if (TextUtils.isEmpty(username)) {//checking if user entered their username
                    changeUsername.setError("Please enter username ");
                    changeUsername.requestFocus();
                    validInputs = false;
                }
                if (username.length() > 50) {//checking if username is less than 50 characters
                    changeUsername.setError("Please enter a username with less than 50 characters");
                    changeUsername.requestFocus();
                    validInputs = false;
                }

                if (validInputs == true) {// if all the requirements are met than we can send our put request to the database

                    VolleyMultipartRequest updateCustomerRequest = new VolleyMultipartRequest(Request.Method.POST, "https://50.19.176.137:8001/customer/update",
                            new Response.Listener<String>() {
                                @Override
                                public void onResponse(String response) {
                                    try {
                                        JSONObject responseData = new JSONObject(response);
                                        JSONObject userData = responseData.getJSONObject("customer");

                                        byte[] itemImageByteArray = new byte[userData.getJSONObject("image").getJSONArray("data").length()];

                                        for (int i = 0; i < itemImageByteArray.length; i++) {
                                            itemImageByteArray[i] = (byte) (((int) userData.getJSONObject("image").getJSONArray("data").get(i)) & 0xFF);
                                        }

                                        pref.setUser(new UserSingleton(userData.getString("first_name"), userData.getString("last_name"), userData.getString("customer_id"),
                                                userData.getString("email"), itemImageByteArray));

                                        pref.setAuthToken(responseData.getString("token"));

                                        startActivity(new Intent(Account.this, Home.class));
                                        Toast.makeText(Account.this, "Changes Saved", Toast.LENGTH_LONG).show();
                                    } catch (JSONException e) {
                                        e.printStackTrace();
                                    }
                                }
                            }, new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            if (error.networkResponse.statusCode == 400) {
                                Toast.makeText(getBaseContext(), "Missing parameter", Toast.LENGTH_LONG).show();
                            }
                            if (error.networkResponse.statusCode == 401) {
                                pref.changeLogStatus(false);

                                startActivity(new Intent(getBaseContext(), Login.class));
                                Toast.makeText(getBaseContext(), "session expired", Toast.LENGTH_LONG).show();
                            }
                            if (error.networkResponse.statusCode == 409) {
                                Toast.makeText(getBaseContext(), "Username and/or email already exists or invalid image type", Toast.LENGTH_LONG).show();
                            }
                            if (error.networkResponse.statusCode == 500) {
                                Toast.makeText(getBaseContext(), "Error updating", Toast.LENGTH_LONG).show();
                            }
                        }
                    }) {
                        @Override
                        protected Map<String, String> getParams() {// inserting parameters for the put request
                            Map<String, String> params = new HashMap<String, String>();
                            params.put("customer_id", username);
                            params.put("first_name", firstName);
                            params.put("last_name", lastName);
                            params.put("email", email);

                            return params;
                        }

                        @Override
                        protected Map<String, DataPart> getByteData() {
                            Map<String, DataPart> params = new HashMap<>();
                            // file name could found file base or direct access from real path
                            // for now just get bitmap data from ImageView

                            ByteArrayOutputStream baos = new ByteArrayOutputStream();
                            ((BitmapDrawable) accountImage.getDrawable()).getBitmap().compress(Bitmap.CompressFormat.JPEG, 100, baos);

                            params.put("image", new DataPart("account.png", baos.toByteArray(), "image/png"));

                            return params;
                        }

                        @Override
                        public Map<String, String> getHeaders() {//adds header to request
                            HashMap<String, String> headers = new HashMap<>();
                            headers.put("Authorization", "Bearer " + pref.getAuth());

                            return headers;
                        }
                    };

                    VolleySingleton.getInstance(Account.this).addToRequestQueue(updateCustomerRequest);// sending the request to the database
                }
            }
        });

        changePassword.setOnClickListener(new View.OnClickListener() {// when the user clicks on this link we change to xml to the log in layout
            @Override
            public void onClick(View view) {//will change password
                Intent intent = new Intent(Account.this, PasswordChange.class);
                startActivity(intent);
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode != RESULT_CANCELED) {
            switch (requestCode) {
                case 0:
                    if (resultCode == RESULT_OK && data != null) {
                        Bitmap selectedImage = (Bitmap) data.getExtras().get("data");
                        accountImage.setImageBitmap(selectedImage);
                    }

                    break;
                case 1:
                    if (resultCode == RESULT_OK && data != null) {
                        Uri selectedImage = data.getData();
                        String[] filePathColumn = {MediaStore.Images.Media.DATA};
                        if (selectedImage != null) {
                            Cursor cursor = getContentResolver().query(selectedImage,
                                    filePathColumn, null, null, null);
                            if (cursor != null) {
                                cursor.moveToFirst();

                                int columnIndex = cursor.getColumnIndex(filePathColumn[0]);
                                String picturePath = cursor.getString(columnIndex);
                                accountImage.setImageBitmap(BitmapFactory.decodeFile(picturePath));

                                cursor.close();
                            }
                        }
                    }
                    break;
            }
        }
    }
}