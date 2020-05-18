package auto_garcon.initialpages;

import androidx.appcompat.app.AppCompatActivity;

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
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.auto_garcon.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

import auto_garcon.VolleyMultipartRequest;
import auto_garcon.accountstuff.Account;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.UserSingleton;
import auto_garcon.singleton.VolleySingleton;
import de.hdodenhof.circleimageview.CircleImageView;

public class AccountImageSelectionRegister extends AppCompatActivity {
    private CircleImageView accountImage;
    private byte[] uploadToDatabase;
    private SharedPreference pref;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_account_image_selection_register);
        pref = new SharedPreference(AccountImageSelectionRegister.this);

        accountImage = findViewById(R.id.account_image_setup);

        accountImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final Dialog selectImagePopup = new Dialog(AccountImageSelectionRegister.this);
                selectImagePopup.setContentView(R.layout.account_image_popup);
                selectImagePopup.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

                selectImagePopup.show();

                selectImagePopup.findViewById(R.id.take_photo_button).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        startActivityForResult(new Intent(MediaStore.ACTION_IMAGE_CAPTURE), 0);
                        selectImagePopup.dismiss();
                    }
                });

                selectImagePopup.findViewById(R.id.choose_from_gallery_button).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        startActivityForResult(new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI), 1);
                        selectImagePopup.dismiss();
                    }
                });

                selectImagePopup.findViewById(R.id.account_image_close).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        selectImagePopup.dismiss();
                    }
                });
            }
        });


        findViewById(R.id.sign_up_button_register).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                VolleyMultipartRequest registerCustomerRequest = new VolleyMultipartRequest(Request.Method.PUT, "https://50.19.176.137:8001/customer/register",
                        new Response.Listener<String>() {
                            @Override
                            public void onResponse(String response) {
                                try {
                                    JSONObject responseData = new JSONObject(response);
                                    JSONObject userData = responseData.getJSONObject("customer");

                                    byte[] itemImageByteArray = new byte[userData.getJSONObject("image").getJSONArray("data").length()];

                                    for(int i = 0; i < itemImageByteArray.length; i++) {
                                        itemImageByteArray[i] = (byte) (((int) userData.getJSONObject("image").getJSONArray("data").get(i)) & 0xFF);
                                    }

                                    pref.setUser(new UserSingleton(userData.getString("first_name"), userData.getString("last_name"), userData.getString("customer_id"),
                                            userData.getString("email"), itemImageByteArray));

                                    String token = responseData.getString("token");
                                    pref.setAuthToken(token);

                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }

                                pref.changeLogStatus(true);
                                startActivity(new Intent(AccountImageSelectionRegister.this, TwoButtonPage.class));
                                finish();//prevents user from coming back
                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {

                    }
                }) {
                    @Override
                    protected Map<String, String> getParams() {// inserting parameters for the put request
                        Map<String, String> params = new HashMap<String, String>();
                        params.put("customer_id", getIntent().getStringExtra("username"));
                        params.put("first_name", getIntent().getStringExtra("first_name"));
                        params.put("last_name", getIntent().getStringExtra("last_name"));
                        params.put("email", getIntent().getStringExtra("email"));
                        params.put("password", getIntent().getStringExtra("password"));

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
                };

                VolleySingleton.getInstance(AccountImageSelectionRegister.this).addToRequestQueue(registerCustomerRequest);// sending the request to the database
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