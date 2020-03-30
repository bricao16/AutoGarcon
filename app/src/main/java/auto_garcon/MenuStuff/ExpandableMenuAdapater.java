package auto_garcon.MenuStuff;

import android.content.Context;
import android.content.Intent;
import android.graphics.Typeface;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.TextView;

import com.example.auto_garcon.R;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;

public class ExpandableMenuAdapater extends BaseExpandableListAdapter {
    private Context context;
    private List<String> listDataHeader;
    private HashMap<String, List<MenuItem>> listHashMap;

    public ExpandableMenuAdapater(Context context, List<String> listDataHeader, HashMap<String, List<MenuItem>> listHashMap) {
        this.context = context;
        this.listDataHeader = listDataHeader;
        this.listHashMap = listHashMap;
    }

    @Override
    public int getGroupCount() {
        return listDataHeader.size();
    }

    @Override
    public int getChildrenCount(int i) {
        return listHashMap.get(listDataHeader.get(i)).size();
    }

    @Override
    public Object getGroup(int i) {
        return listDataHeader.get(i);
    }

    @Override
    public MenuItem getChild(int i, int j) {
        return listHashMap.get(listDataHeader.get(i)).get(j);  //i = group item, j = child item
    }

    @Override
    public long getGroupId(int i) {
        return i;
    }

    @Override
    public long getChildId(int i, int j) {
        return j;
    }

    @Override
    public boolean hasStableIds() {
        return false;
    }

    @Override
    public View getGroupView(int i, boolean b, View view, ViewGroup viewGroup) {
        String headerTitle = (String) getGroup(i);

        if(view == null) {
            LayoutInflater inflater = (LayoutInflater) this.context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            view = inflater.inflate(R.layout.expandable_menu, null);
        }

        TextView listHeader = view.findViewById(R.id.list_header);
        listHeader.setTypeface(null, Typeface.BOLD);
        listHeader.setText(headerTitle);
        return view;
    }

    @Override
    public View getChildView(final int i, final int j, boolean b, View view, ViewGroup viewGroup) {
        final String childText = (String) getChild(i, j).getNameOfItem();

        if(view == null) {
            LayoutInflater inflater = (LayoutInflater) this.context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            view = inflater.inflate(R.layout.expandable_menu_item, null);
        }

        TextView txtListChild = view.findViewById(R.id.list_item);
        txtListChild.setText(childText);

        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent popup = new Intent(context, Popup.class);

                popup.putExtra("menuItem", (Serializable) getChild(i, j));
                context.startActivity(popup);
            }
        });

        return view;
    }

    @Override
    public boolean isChildSelectable(int i, int j) {
        return true;
    }
}