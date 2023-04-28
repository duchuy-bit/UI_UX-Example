package com.example.mexpensev1;

import androidx.appcompat.app.AppCompatActivity;

import android.app.DatePickerDialog;
import android.content.Context;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.Toast;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class AddTripActivity extends AppCompatActivity {
    EditText startdate, enddate;
    EditText tripName, destination, type, description;
    CheckBox risk, important;
    Button btnadd;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_trip);

        startdate   = findViewById(R.id.startdate);
        enddate     = findViewById(R.id.enddate);
        tripName    = findViewById(R.id.tripName);
        destination = findViewById(R.id.destination);
        type        = findViewById(R.id.type);
        description = findViewById(R.id.description);
        risk        = findViewById(R.id.risk);
        important   = findViewById(R.id.important);
        btnadd      = findViewById(R.id.btnadd);

        btnadd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                DatabaseHelper myDB = new DatabaseHelper(AddTripActivity.this);
                int checked_Risk =0, checked_Important = 0;
                if (risk.isChecked()){ checked_Risk =1;}
                if (important.isChecked()){ checked_Important =1;}

                if (TextUtils.isEmpty(tripName.getText().toString())){
                    tripName.setError("Name is not blank");
                    return;
                }
                if (TextUtils.isEmpty(destination.getText().toString())){
                    destination.setError("Destination is not blank");
                    return;
                }
                if (TextUtils.isEmpty(startdate.getText().toString()) || TextUtils.isEmpty(enddate.getText().toString())){
                    startdate.setError("Date is not blank");
                    enddate.setError("Date is not blank");
                    return;
                }

                if (TextUtils.isEmpty(type.getText().toString())){
                    type.setError("Type is not blank");
                    return;
                }

                if (!risk.isChecked()){
                    Toast.makeText(AddTripActivity.this, "Risk need to checked!", Toast.LENGTH_LONG).show();
                    return;
                }

                myDB.addTrip(tripName.getText().toString().trim(),
                        destination.getText().toString().trim(),
                        type.getText().toString().trim().trim(),
                        startdate.getText().toString().trim(),
                        enddate.getText().toString().trim(),
                        checked_Risk,
                        checked_Important,
                        description.getText().toString().trim() );
                //finish();

            }
        });

        startdate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Common common = new Common(AddTripActivity.this);
                common.ChonNgay(startdate);
            }
        });
        enddate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Common common = new Common(AddTripActivity.this);
                common.ChonNgay( enddate);
            }
        });


    }


}