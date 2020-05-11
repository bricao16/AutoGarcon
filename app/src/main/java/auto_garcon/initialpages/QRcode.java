package auto_garcon.initialpages;

import android.Manifest;
import android.content.Intent;
import android.os.Bundle;

import android.view.MenuItem;
import android.view.SurfaceView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.auto_garcon.R;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionDeniedResponse;
import com.karumi.dexter.listener.PermissionGrantedResponse;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.single.PermissionListener;

import org.json.JSONException;
import org.json.JSONObject;

import auto_garcon.cartorderhistory.ShoppingCart;
import auto_garcon.homestuff.Home;
import auto_garcon.menustuff.Menu;
import auto_garcon.singleton.SharedPreference;
import auto_garcon.singleton.UserSingleton;
import auto_garcon.singleton.VolleySingleton;
import github.nisrulz.qreader.QRDataListener;
import github.nisrulz.qreader.QREader;
/**
 * Class for Using QR code
 * Gets permission for using camera
 * Reads QR code and handles the request
 *
 */
public class QRcode extends AppCompatActivity {
    private TextView txt_result;
    private SurfaceView surfaceView;
    private QREader QReader;
    private SharedPreference pref;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.qr_code_page);
        pref = new SharedPreference(this);

        //request permission
    Dexter.withActivity(this)
            .withPermission(Manifest.permission.CAMERA)
            .withListener(new PermissionListener() {
                @Override
                public void onPermissionGranted(PermissionGrantedResponse response) {
                    setupCamera();
                }

                @Override
                public void onPermissionDenied(PermissionDeniedResponse response) {
                    Toast.makeText(QRcode.this, "You must enable this permission", Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onPermissionRationaleShouldBeShown(PermissionRequest permission, PermissionToken token) {

                }
            }).check();

        BottomNavigationView bottomNavigation = findViewById(R.id.bottom_navigation);

        BottomNavigationView.OnNavigationItemSelectedListener navigationItemSelectedListener =
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_scan:
                                startActivity(new Intent(QRcode.this, QRcode.class));
                                return true;
                            case R.id.action_home:
                                startActivity(new Intent(QRcode.this, Home.class));
                                return true;
                            case R.id.action_cart:
                                startActivity(new Intent(QRcode.this, ShoppingCart.class));
                                return true;
                        }
                        return false;
                    }
                };

        bottomNavigation.setOnNavigationItemSelectedListener(navigationItemSelectedListener);
    }

    private void setupCamera() {
        txt_result = findViewById(R.id.code_info);
        surfaceView = findViewById(R.id.camera_view);
        setupQREader();
    }

    private void setupQREader() {
        QReader = new QREader.Builder(this, surfaceView, new QRDataListener() {
            @Override
            public void onDetected(final String data) {
                txt_result.post(new Runnable() {
                    @Override
                    public void run() {
                        UserSingleton user = pref.getUser();
                        user.setRestaurantID(Integer.parseInt(data));
                        pref.setUser(user);

                        if(getIntent().getBooleanExtra("is from cart activity", false)) {
                            startActivity(new Intent(QRcode.this, ShoppingCart.class));
                        }

                        Intent menu = new Intent(QRcode.this, Menu.class);
                        menu.putExtra("restaurant id", Integer.parseInt(data));
                        startActivity(menu);
                    }
                });
            }
        }).facing(QREader.BACK_CAM)
                .enableAutofocus(true)
                .height(surfaceView.getHeight())
                .width(surfaceView.getWidth())
                .build();
    }

    @Override
    protected void onResume() {
        super.onResume();
        Dexter.withActivity(this)
                .withPermission(Manifest.permission.CAMERA)
                .withListener(new PermissionListener() {
                    @Override
                    public void onPermissionGranted(PermissionGrantedResponse response) {
                        if(QReader != null) {
                            QReader.initAndStart(surfaceView);
                        }
                    }

                    @Override
                    public void onPermissionDenied(PermissionDeniedResponse response) {
                        Toast.makeText(QRcode.this, "You must enable this permission", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onPermissionRationaleShouldBeShown(PermissionRequest permission, PermissionToken token) {

                    }
                }).check();
    }

    @Override
    protected void onPause() {
        super.onPause();

        Dexter.withActivity(this)
                .withPermission(Manifest.permission.CAMERA)
                .withListener(new PermissionListener() {
                    @Override
                    public void onPermissionGranted(PermissionGrantedResponse response) {
                        if(QReader != null) {
                            QReader.releaseAndCleanup();
                        }
                    }

                    @Override
                    public void onPermissionDenied(PermissionDeniedResponse response) {
                        Toast.makeText(QRcode.this, "You must enable this permission", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onPermissionRationaleShouldBeShown(PermissionRequest permission, PermissionToken token) {

                    }
                }).check();
    }
}

