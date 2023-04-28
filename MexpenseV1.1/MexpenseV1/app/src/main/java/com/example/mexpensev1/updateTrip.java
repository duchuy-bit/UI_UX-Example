package com.example.mexpensev1;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.Toast;

public class updateTrip extends AppCompatActivity {
    EditText startdate1, enddate1;
    EditText tripName1, destination1, type1, description1;
    CheckBox risk1, important1;
    Button btnupdate, btndel;
    String id, name, startDate, endDate, destination, type, description;
    int risk, important;
    boolean checked_R, checked_I;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_update_trip);

        startdate1   = findViewById(R.id.startdate1);
        enddate1     = findViewById(R.id.enddate1);
        tripName1    = findViewById(R.id.tripName1);
        destination1 = findViewById(R.id.destination1);
        type1        = findViewById(R.id.type1);
        description1 = findViewById(R.id.description1);
        risk1        = findViewById(R.id.risk1);
        important1   = findViewById(R.id.important1);
        btnupdate    = findViewById(R.id.btnupdate);
        btndel       = findViewById(R.id.btn_del);

        //First we call this
        getAndSetIntentData();

        //Set actionbar title after getAndSetIntentData method
        ActionBar ab = getSupportActionBar();
        if (ab != null) {
            ab.setTitle(name);
        }

        startdate1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Common common = new Common(updateTrip.this);
                common.ChonNgay(startdate1);
            }
        });
        enddate1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Common common = new Common(updateTrip.this);
                common.ChonNgay(enddate1);
            }
        });


        btnupdate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                name = tripName1.getText().toString().trim();
                destination = destination1.getText().toString().trim();
                startDate = startdate1.getText().toString().trim();
                endDate = enddate1.getText().toString().trim();
                type = type1.getText().toString().trim();
                description = description1.getText().toString().trim();
                int checked_Risk =0, checked_Important = 0;
                if (risk1.isChecked()){ checked_Risk =1;}
                if (important1.isChecked()){ checked_Important =1;}

                if (TextUtils.isEmpty(tripName1.getText().toString())){
                    tripName1.setError("Name is not blank");
                    return;
                }
                if (TextUtils.isEmpty(destination1.getText().toString())){
                    destination1.setError("Destination is not blank");
                    return;
                }
                if (TextUtils.isEmpty(startdate1.getText().toString()) || TextUtils.isEmpty(enddate1.getText().toString())){
                    startdate1.setError("Date is not blank");
                    enddate1.setError("Date is not blank");
                    return;
                }

                if (TextUtils.isEmpty(type1.getText().toString())){
                    type1.setError("Type is not blank");
                    return;
                }

                if (!risk1.isChecked()){
                    Toast.makeText(updateTrip.this, "Risk need to checked!", Toast.LENGTH_LONG).show();
                    return;
                }

                DatabaseHelper myDB = new DatabaseHelper(updateTrip.this);
                myDB.updateDataTrip(id, name, destination, type, startDate, endDate, checked_Risk, checked_Important, description);


            }
        });


        btndel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                confirmDialog();
            }
        });

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
            DatabaseHelper myDB = new DatabaseHelper(updateTrip.this);
            Trip trip = myDB.readTripDataByID(id);
            name        = trip.getName();
            destination = trip.getDestination();
            startDate   = trip.getFromDate();
            endDate     = trip.getToDate();
            type        = trip.getType();
            description = trip.getDescription();
            risk        = trip.getRisk();
            important   = trip.getImportant();

            //Setting Intent Data
            tripName1.setText(name);
            destination1.setText(destination);
            startdate1.setText(startDate);
            enddate1.setText(endDate);
            type1.setText(type);
            description1.setText(description);
            if (risk == 1){ checked_R = true;}
            if (important == 1){ checked_I = true;}
            risk1.setChecked(checked_R);
            important1.setChecked(checked_I);
        }else{
            Toast.makeText(this, "No data.", Toast.LENGTH_SHORT).show();
        }
    }

    void confirmDialog(){
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Delete " + name + " ?");
        builder.setMessage("Are you sure you want to delete " + name + " ?");
        builder.setPositiveButton("Yes", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                DatabaseHelper db = new DatabaseHelper(updateTrip.this);
                db.deleteOneRow(id);
                finish();
            }
        });
        builder.setNegativeButton("No", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {

            }
        });
        builder.create().show();
    }

}