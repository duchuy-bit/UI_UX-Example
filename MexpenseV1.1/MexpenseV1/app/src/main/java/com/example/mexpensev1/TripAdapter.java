package com.example.mexpensev1;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class TripAdapter extends RecyclerView.Adapter<TripAdapter.MyViewHolder> implements Filterable {
    private Context context;
    private Activity activity;
    private List<Trip> allTrip;
    private List<Trip> allTripOld;

    int position;

    public TripAdapter(Context context, Activity activity, List<Trip> allTrip) {
        this.context = context;
        this.activity = activity;
        this.allTrip = allTrip;
        this.allTripOld = allTrip;

    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.trip_row, parent, false);
        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, @SuppressLint("RecyclerView") int position) {

        holder.trip_id_txt.setText(String.valueOf(allTrip.get(position).getTrip_id()));
        holder.trip_name_txt.setText(String.valueOf(allTrip.get(position).getName()));
        String TripDate = "From: "+String.valueOf(allTrip.get(position).getFromDate()) + " To: " + String.valueOf(allTrip.get(position).getToDate());
        holder.trip_date_txt.setText(TripDate);


        //Recyclerview onClickListener - Detail Trip
        holder.trip_name_txt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(context, detailTrip.class);
                intent.putExtra("id", String.valueOf(allTrip.get(position).getTrip_id()));
                intent.putExtra("name", String.valueOf(allTrip.get(position).getName()));
                intent.putExtra("startDate", String.valueOf(allTrip.get(position).getFromDate()));
                intent.putExtra("endDate", String.valueOf(allTrip.get(position).getToDate()));
                activity.startActivityForResult(intent, 1);

            }
        });

        //Button Edit Onclik
        holder.button_edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(context, updateTrip.class);
                intent.putExtra("id", String.valueOf(allTrip.get(position).getTrip_id()));
                intent.putExtra("name", String.valueOf(allTrip.get(position).getName()));
                intent.putExtra("startDate", String.valueOf(allTrip.get(position).getFromDate()));
                intent.putExtra("endDate", String.valueOf(allTrip.get(position).getToDate()));
                activity.startActivityForResult(intent, 1);
            }
        });

        //Button DEL  Onclick
        holder.button_del.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                confirmDialog(String.valueOf(allTrip.get(position).getTrip_id()), String.valueOf(allTrip.get(position).getName()));
            }
        });

    }

    void confirmDialog(String id, String name){
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle("Delete " + name + " ?");
        builder.setMessage("Are you sure you want to delete the trip \" " + name + " \" ? ");
        builder.setPositiveButton("Yes", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                DatabaseHelper db = new DatabaseHelper(context);
                db.deleteExpenseByTrip(id);
                db.deleteOneRow(id);
                activity.recreate();
            }
        });
        builder.setNegativeButton("No", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {

            }
        });
        builder.create().show();
    }

    @Override
    public int getItemCount() {
        return allTrip.size();
    }





    public class MyViewHolder extends RecyclerView.ViewHolder {
        TextView trip_id_txt, trip_name_txt, trip_date_txt;
        LinearLayout mainLayout;
        Button button_del, button_edit;

        public MyViewHolder(@NonNull View itemView) {
            super(itemView);
            trip_id_txt     = itemView.findViewById(R.id.trip_id_txt);
            trip_name_txt   = itemView.findViewById(R.id.trip_name_txt);
            trip_date_txt   = itemView.findViewById(R.id.trip_date_txt);
            mainLayout      = itemView.findViewById(R.id.mainLayout);
            button_del      = itemView.findViewById(R.id.button_del);
            button_edit      = itemView.findViewById(R.id.button_edit);

        }
    }


    //Search Filter
    @Override
    public Filter getFilter() {
        return new Filter() {
            @Override
            protected FilterResults performFiltering(CharSequence charSequence) {

                String strSearch = charSequence.toString();
                if (strSearch.isEmpty()){
                    allTrip = allTripOld;
                }else {
                    List<Trip> mlistTrip = new ArrayList<>();
                    for (Trip trip: allTripOld) {
                        if (trip.getName().toLowerCase().contains(strSearch.toLowerCase())) {
                            mlistTrip.add(trip);
                        }
                    }
                    allTrip = mlistTrip;
                }
                FilterResults filterResults = new FilterResults();
                filterResults.values = allTrip;
                return filterResults;
            }

            @Override
            protected void publishResults(CharSequence charSequence, FilterResults filterResults) {
                allTrip = (List<Trip>) filterResults.values;
                notifyDataSetChanged();

            }
        };
    }




}
