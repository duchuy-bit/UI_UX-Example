package com.example.mexpensev1;

import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.app.TimePickerDialog;
import android.content.Intent;
import android.database.Cursor;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.Toast;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

public class detailTrip extends AppCompatActivity {
    RecyclerView listExpense;
    TextView name, destination, type, description, Date, important, risk;
    String id, tripName, startDate, endDate, tripDestination, tripType, tripDescription, txtRisk, txtImportant;
    int tripRisk, tripImportant;
    Button btnaddexpense;
    DatabaseHelper myDB;
    ArrayList<String> ex_Id, ex_Type, ex_Date, ex_Time, ex_Amount, ex_Comment;

    ExpenseAdapter expenseAdapter;
    private Activity activity;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detail_trip);
        listExpense     = findViewById(R.id.listExpense);

        name            = findViewById(R.id.tripdetail_Name);
        destination     = findViewById(R.id.tripdetail_Destination);
        type            = findViewById(R.id.tripdetail_Type);
        description     = findViewById(R.id.tripdetail_Description);
        Date            = findViewById(R.id.tripdetail_Date);
        important       = findViewById(R.id.tripdetail_Important);
        risk            = findViewById(R.id.tripdetail_Risk);
        btnaddexpense   = findViewById(R.id.btnaddexpense);

        // ADD EXPENSE
        btnaddexpense.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Dialog dialog = new Dialog(detailTrip.this);
                dialog.setTitle("Add Expense");
                dialog.setContentView(R.layout.expense_dialog);

                EditText  ex_addType, ex_addDate, ex_addTime, ex_addAmount, ex_addComment;
                Button  btn_Cancel, btn_Addexpense;

                ex_addType = (EditText) dialog.findViewById(R.id.ex_addType);
                ex_addDate = (EditText) dialog.findViewById(R.id.ex_addDate);
                ex_addTime = (EditText) dialog.findViewById(R.id.ex_addTime);
                ex_addAmount = (EditText) dialog.findViewById(R.id.ex_addAmount);
                ex_addComment = (EditText) dialog.findViewById(R.id.ex_addComment);
                btn_Cancel = (Button) dialog.findViewById(R.id.btn_Cancel);
                btn_Addexpense = (Button) dialog.findViewById(R.id.btn_Addexpense);

                btn_Cancel.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        dialog.dismiss();
                    }
                });

                ex_addDate.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        Common common = new Common(detailTrip.this);
                        common.ChonNgay(ex_addDate);
                    }
                });
                ex_addTime.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        Common common = new Common(detailTrip.this);
                        common.ChonGio(ex_addTime);

                    }
                });

                btn_Addexpense.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        DatabaseHelper myDB = new DatabaseHelper(detailTrip.this);
                        myDB.addExpense(ex_addType.getText().toString().trim(),
                                Double.valueOf(ex_addAmount.getText().toString().trim()),
                                ex_addDate.getText().toString().trim().trim(),
                                ex_addTime.getText().toString().trim(),
                                ex_addComment.getText().toString().trim(),
                                Long.valueOf(id) );
                        dialog.dismiss();
                        detailTrip.this.recreate();
                    }
                });
                dialog.show();

            }
        });

        getAndSetIntentData();
        //Set actionbar title after getAndSetIntentData method
        ActionBar ab = getSupportActionBar();
        if (ab != null) {
            ab.setTitle(tripName);
        }

        //EXPENSE CUSTOM LIST
        myDB = new DatabaseHelper(detailTrip.this);
        ex_Id = new ArrayList<>();
        ex_Type = new ArrayList<>();
        ex_Date = new ArrayList<>();
        ex_Time = new ArrayList<>();
        ex_Amount = new ArrayList<>();
        ex_Comment = new ArrayList<>();

        storeExpenseDataInArrays(id);
        expenseAdapter = new ExpenseAdapter(this, ex_Id, ex_Type, ex_Date, ex_Time, ex_Amount, ex_Comment);
        listExpense.setAdapter(expenseAdapter);
        listExpense.setLayoutManager(new LinearLayoutManager(detailTrip.this));

    }




    void getAndSetIntentData(){
        if(getIntent().hasExtra("id") && getIntent().hasExtra("name") &&
                getIntent().hasExtra("startDate") && getIntent().hasExtra("endDate")){
            //Getting Data from Intent
            id = getIntent().getStringExtra("id");
            //name = getIntent().getStringExtra("name");
            //startDate = getIntent().getStringExtra("startDate");
            //endDate = getIntent().getStringExtra("endDate");

            //Getting Data from DB by ID
            DatabaseHelper myDB = new DatabaseHelper(detailTrip.this);
            Trip trip = myDB.readTripDataByID(id);
            tripName        = trip.getName();
            tripDestination = trip.getDestination();
            startDate   = trip.getFromDate();
            endDate     = trip.getToDate();
            tripType        = trip.getType();
            tripDescription = trip.getDescription();
            tripRisk        = trip.getRisk();
            tripImportant   = trip.getImportant();

            //Setting Intent Data
            name.setText(tripName);
            destination.setText(tripDestination);
            String txtDate = startDate + " - " + endDate;
            Date.setText(txtDate);
            type.setText(tripType);
            description.setText(tripDescription);
            if (tripRisk == 1){
                txtRisk = "YES";
            }else { txtRisk = "NO";}
            risk.setText(txtRisk);
            if (tripImportant == 1){
                 txtImportant = "YES";
            }else { txtImportant = "NO";}
            important.setText(txtImportant);


        }else{
            Toast.makeText(this, "No data.", Toast.LENGTH_SHORT).show();
        }
    }

    void storeExpenseDataInArrays(String trip_id){
        Cursor cursor = myDB.readAllExpenseByTrip(trip_id);
        if(cursor.getCount() == 0){
            Toast.makeText(this, "No Expense", Toast.LENGTH_LONG).show();
        }else{
            while (cursor.moveToNext()){
                ex_Id.add(cursor.getString(0));
                ex_Type.add(cursor.getString(1));
                ex_Comment.add(cursor.getString(2));
                ex_Date.add(cursor.getString(3));
                ex_Time.add(cursor.getString(4));
                ex_Amount.add(cursor.getString(5));
            }
        }
    }
}