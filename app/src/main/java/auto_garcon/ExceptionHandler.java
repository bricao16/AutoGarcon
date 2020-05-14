package auto_garcon;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import java.io.PrintWriter;
import java.io.StringWriter;

import auto_garcon.initialpages.TwoButtonPage;

public class ExceptionHandler implements Thread.UncaughtExceptionHandler {
    private  Context errorContex;

    public ExceptionHandler(Context ctx){
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
        StringWriter stackTrace = new StringWriter();// is used to caputre our stack trace as a string
        e.printStackTrace(new PrintWriter(stackTrace));//print the stack trace onto this string
        Intent intent = new Intent(errorContex, SendErrorEmail.class);
        if(!hasInternetConnection(errorContex)){
            intent.putExtra("network",1);
        }


        intent.putExtra("error",stackTrace.toString());
        errorContex.startActivity(intent);//
        android.os.Process.killProcess(android.os.Process.myPid());
        System.exit(2);
    }


    public static boolean hasInternetConnection(final Context context) {
        final ConnectivityManager connectivityManager = (ConnectivityManager)context.
                getSystemService(Context.CONNECTIVITY_SERVICE);

        final Network network = connectivityManager.getActiveNetwork();
        final NetworkCapabilities capabilities = connectivityManager
                .getNetworkCapabilities(network);

        return capabilities != null
                && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED);
    }

}
