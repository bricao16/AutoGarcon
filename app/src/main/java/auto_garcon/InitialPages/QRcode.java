package auto_garcon.InitialPages;

import android.Manifest;
import android.os.Bundle;

import android.view.SurfaceView;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.auto_garcon.R;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionDeniedResponse;
import com.karumi.dexter.listener.PermissionGrantedResponse;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.single.PermissionListener;

import org.json.JSONException;
import org.json.JSONObject;

import github.nisrulz.qreader.QRDataListener;
import github.nisrulz.qreader.QREader;

public class QRcode extends AppCompatActivity {
    private TextView txt_result;
    private SurfaceView surfaceView;
    private QREader QReader;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.qr_code_page);

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
        String url = "http://50.19.176.137:8000/resturant/" + txt_result;
        Toast.makeText(QRcode.this,"help me", Toast.LENGTH_SHORT).show();
        JsonObjectRequest getRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            String restaurant = response.getString("restaurant_name");
                            TextView text_box = (TextView)findViewById(R.id.code_info);
                            text_box.setText(restaurant);
                            Toast.makeText(QRcode.this,"help me", Toast.LENGTH_SHORT).show();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(QRcode.this,error.toString(),Toast.LENGTH_LONG).show();
                    }
                }
        );

    }

    private void setupCamera() {
        txt_result = (TextView) findViewById(R.id.code_info);
        final ToggleButton btn_on_off = (ToggleButton) findViewById(R.id.btn_enable_disable);

        btn_on_off.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(QReader.isCameraRunning()){
                    btn_on_off.setChecked(false);
                    QReader.stop();
                }
                else {
                    btn_on_off.setChecked(true);
                    QReader.start();
                }
            }
        });

        surfaceView = (SurfaceView) findViewById(R.id.camera_view);
        setupQREader();
    }

    private void setupQREader() {
        QReader = new QREader.Builder(this, surfaceView, new QRDataListener() {
            @Override
            public void onDetected(final String data) {
                txt_result.post(new Runnable() {
                    @Override
                    public void run() {
                        txt_result.setText(data);
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

