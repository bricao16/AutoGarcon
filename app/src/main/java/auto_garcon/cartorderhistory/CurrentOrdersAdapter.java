package auto_garcon.cartorderhistory;

import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.auto_garcon.R;

public class CurrentOrdersAdapter extends RecyclerView.Adapter<CurrentOrdersAdapter.CurrentOrdersViewHolder>  {
    @NonNull
    @Override
    public CurrentOrdersAdapter.CurrentOrdersViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return null;
    }

    @Override
    public void onBindViewHolder(@NonNull CurrentOrdersAdapter.CurrentOrdersViewHolder holder, int position) {

    }

    @Override
    public int getItemCount() {
        return 0;
    }

    public class CurrentOrdersViewHolder extends RecyclerView.ViewHolder{

        public CurrentOrdersViewHolder(@NonNull View v) {
            super(v);
        }
    }
}
