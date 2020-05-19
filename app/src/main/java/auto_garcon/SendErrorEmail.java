package auto_garcon;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.auto_garcon.R;

public class SendErrorEmail extends AppCompatActivity {
    private static final String autoGarconEmail = "autogarcon@gmail.com";// the address that the email will be sent to
    private EditText edit_body;
    private EditText edit_subject;
    private Button button_send;//button that will eventually trigger the email to be sent

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
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_send_error_email);// associating xml objects with the java Object equivalent

        edit_body = findViewById(R.id.et_message);// associating xml objects with the java Object equivalent
        edit_subject = findViewById(R.id.et_subject);// associating xml objects with the java Object equivalent
        button_send = findViewById(R.id.bt_send);// associating xml objects with the java Object equivalent
        if (getIntent().getIntExtra("network", 0) == 1) {
            edit_body.setVisibility(View.GONE);
            edit_subject.setVisibility(View.GONE);
            button_send.setVisibility(View.GONE);
            findViewById(R.id.wifi).setVisibility(View.VISIBLE);
        } else {
            button_send.setOnClickListener(new View.OnClickListener() {//make the button actually have a purpose
                @Override
                public void onClick(View v) {

                    if (TextUtils.isEmpty(edit_body.getText().toString())) {//check if they have inputted a body
                        edit_body.setError("Please enter a description");
                    } else if (TextUtils.isEmpty(edit_subject.getText().toString())) {//checki if they have inputted a subject
                        edit_subject.setError("Please enter a body");
                    } else {
                        sendEmail();// this sendEmail function actually sends the email if the user actually has the body filled out
                    }
                }
            });
        }


    }

    /**
     * This method is called after the send button is clicked and will send the email with whatever is in the body of the email
     */
    public void sendEmail() {
        String emailMessage;
        String subject;
        String error;
        final Intent emailIntent = new Intent(Intent.ACTION_SEND);
        error = getIntent().getStringExtra("error");
        try {
            emailMessage = this.edit_body.getText().toString();
            subject = this.edit_subject.getText().toString();
            emailIntent.setType("plain/text");
            emailIntent.putExtra(Intent.EXTRA_EMAIL, new String[]{autoGarconEmail});//this identifies where the email is being sent to
            emailIntent.putExtra(Intent.EXTRA_SUBJECT, subject);//this identifies the subject of what the email will be
            emailIntent.putExtra(Intent.EXTRA_TEXT, emailMessage + "\n" + error);//this sends the description of the user and the error stack trace
            this.startActivity(Intent.createChooser(emailIntent, "sending email"));

        } catch (Throwable t) {
            Toast.makeText(this, "Email failed to send try again" + t.toString(), Toast.LENGTH_LONG).show();
        }

    }
}
