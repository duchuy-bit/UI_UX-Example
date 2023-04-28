package com.example.mexpensev1;

import android.app.Activity;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class ExpenseAdapter extends RecyclerView.Adapter<ExpenseAdapter.MyViewHolder> {
    private Context context;

    private ArrayList ex_Id, ex_Type, ex_Date, ex_Time, ex_Amount, ex_Comment;


    ExpenseAdapter(Context context, ArrayList ex_Id, ArrayList ex_Type, ArrayList ex_Date, ArrayList ex_Time, ArrayList ex_Amount, ArrayList ex_Comment){


        this.context     = context;
        this.ex_Id       = ex_Id;
        this.ex_Type     = ex_Type;
        this.ex_Date     = ex_Date;
        this.ex_Time     = ex_Time;
        this.ex_Amount   = ex_Amount;
        this.ex_Comment  = ex_Comment;

    }
    int position;
    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.expense_row, parent, false);
        return new ExpenseAdapter.MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        holder.ex_type_txt.setText(String.valueOf(ex_Type.get(position)));
        holder.ex_Date_txt.setText(String.valueOf(ex_Date.get(position)));
        holder.ex_time_txt.setText(String.valueOf(ex_Time.get(position)));
        holder.ex_comment_txt.setText(String.valueOf(ex_Amount.get(position)));
        holder.ex_amount_txt.setText(String.valueOf(ex_Comment.get(position)));

    }

    @Override
    public int getItemCount() {
        return ex_Id.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        TextView ex_type_txt, ex_Date_txt, ex_comment_txt, ex_amount_txt,ex_time_txt;
        LinearLayout mainexLayout;
        public MyViewHolder(@NonNull View itemView) {
            super(itemView);
            ex_type_txt     = itemView.findViewById(R.id.trip_name_txt);
            ex_Date_txt     = itemView.findViewById(R.id.trip_id_txt);
            ex_comment_txt     = itemView.findViewById(R.id.trip_date_txt);
            ex_amount_txt     = itemView.findViewById(R.id.ex_amount_txt);
            ex_time_txt     = itemView.findViewById(R.id.ex_time_txt);
            mainexLayout     = itemView.findViewById(R.id.mainexLayout);
        }
    }
}
