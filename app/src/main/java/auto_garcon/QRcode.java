

package auto_garcon;

import android.Manifest;

import android.os.Bundle;

import android.view.SurfaceView;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;

import androidx.appcompat.app.AppCompatActivity;

import com.example.auto_garcon.R;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionDeniedResponse;
import com.karumi.dexter.listener.PermissionGrantedResponse;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.single.PermissionListener;

import github.nisrulz.qreader.QRDataListener;
import github.nisrulz.qreader.QREader;

/**
 * QR Reader
 * Activity for user to start ordering at restaurant
 */
public class QRcode extends AppCompatActivity {

    private TextView txt_result;
    private SurfaceView surfaceView;
    private QREader QReader;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.qr_code_page);

        //request permission for camera
    Dexter.withActivity(this)
            .withPermission(Manifest.permission.CAMERA)
            .withListener(new PermissionListener() {

                //if permission for camera is accepted camera is set up.
                @Override
                public void onPermissionGranted(PermissionGrantedResponse response) {
                    setupCamera();
                }

                //if permission is denied for camera sends error message
                @Override
                public void onPermissionDenied(PermissionDeniedResponse response) {
                    Toast.makeText(QRcode.this, "You must enable this permission", Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onPermissionRationaleShouldBeShown(PermissionRequest permission, PermissionToken token) {

                }
            }).check();
    }

    /**
     * Camera is set up
     * Can start and stop scanning for QR code.
     */
    private void setupCamera() {
        txt_result = (TextView) findViewById(R.id.code_info);
        final ToggleButton btn_on_off = (ToggleButton) findViewById(R.id.btn_enable_disable);

        btn_on_off.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Stops scanning for QR code if button to stop is selected.
                if(QReader.isCameraRunning()){
                    btn_on_off.setChecked(false);
                    QReader.stop();
                }
                //starts scanning for QR code if button to start is selected.
                else {
                    btn_on_off.setChecked(true);
                    QReader.start();
                }
            }
        });

        surfaceView = (SurfaceView) findViewById(R.id.camera_view);
        setupQREader();
    }

    /**
     * Sets up QR reader
     */
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

    /**
     * If QR scanning resumes
     */
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

    /**
     *
     * If scanning is paused
     *
     */
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

