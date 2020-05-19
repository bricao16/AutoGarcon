package auto_garcon;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;

import androidx.annotation.NonNull;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * this class represent our exception handling it is used to capture exceptions that aren't handled explicitly by us
 */
public class ExceptionHandler implements Thread.UncaughtExceptionHandler {
    private Context errorContex;

    public ExceptionHandler(Context ctx) {
        this.errorContex = ctx;
    }

    /**
     * This method checks if there internet connect
     * @param context this is used to get information on the current state of the device and app
     * @return true or false if there is internet connection
     */
    public static boolean hasInternetConnection(final Context context) {
        final ConnectivityManager connectivityManager = (ConnectivityManager) context.
                getSystemService(Context.CONNECTIVITY_SERVICE);

        final Network network = connectivityManager.getActiveNetwork();
        final NetworkCapabilities capabilities = connectivityManager
                .getNetworkCapabilities(network);

        return capabilities != null
                && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED);
    }

    /**
     * Method invoked when the given thread terminates due to the
     * given uncaught exception.
     * <p>Any exception thrown by this method will be ignored by the
     * Java Virtual Machine.
     *
     *this method also allows us to capture the error information to pass it onto our errorEmail class
     *
     *
     * @param t the thread
     * @param e the exception
     */
    @Override
    public void uncaughtException(@NonNull Thread t, @NonNull Throwable e) {
        StringWriter stackTrace = new StringWriter();// is used to caputre our stack trace as a string
        e.printStackTrace(new PrintWriter(stackTrace));//print the stack trace onto this string
        Intent intent = new Intent(errorContex, SendErrorEmail.class);
        if (!hasInternetConnection(errorContex)) {
            intent.putExtra("network", 1);
        }


        intent.putExtra("error", stackTrace.toString());
        errorContex.startActivity(intent);//
        android.os.Process.killProcess(android.os.Process.myPid());
        System.exit(2);
    }

}
