package auto_garcon;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.os.Bundle;

import com.example.auto_garcon.R;
import java.io.PrintWriter;
import java.io.StringWriter;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;

import auto_garcon.homestuff.Home;
import auto_garcon.initialpages.TwoButtonPage;

public class ExcpetionHandler extends AppCompatActivity implements Thread.UncaughtExceptionHandler {

    private Context errorContex;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_excpetion_handler);
    }
    public ExcpetionHandler(Context ctx){
        this.errorContex =ctx;
    }
    /**
     * Method invoked when the given thread terminates due to the
     * given uncaught exception.
     * <p>Any exception thrown by this method will be ignored by the
     * Java Virtual Machine.
     *
     * @param t the thread
     * @param e the exception
     */
    @Override
    public void uncaughtException(@NonNull Thread t, @NonNull Throwable e) {

     //   Intent intent = new Intent(errorContex, TwoButtonPage.class);
   //     this.startActivity(intent);
      // android.os.Process.killProcess(android.os.Process.myPid());//kill the error
      // System.exit(10);
        e.printStackTrace();

        Intent intent = new Intent(errorContex, TwoButtonPage.class);
        this.startActivity(intent);

    }
}
