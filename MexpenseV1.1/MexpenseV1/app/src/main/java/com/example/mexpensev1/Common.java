package com.example.mexpensev1;

import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.TimePicker;


import java.text.SimpleDateFormat;
import java.util.Calendar;

public class Common  {
    private final Context context;

    public Common(Context context) {
        this.context = context;
    }

    public void ChonNgay(EditText edtDate){
        Calendar calendar = Calendar.getInstance();
        int dd = calendar.get(Calendar.DATE);
        int mm = calendar.get(Calendar.MONTH);
        int yy = calendar.get(Calendar.YEAR);
        DatePickerDialog datePickerDialog = new DatePickerDialog(context, new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int month, int dayOfMonth) {
                calendar.set(year, month, dayOfMonth);
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("MM/dd/yyyy");
                edtDate.setText(simpleDateFormat.format(calendar.getTime()));

            }
        },yy,mm,dd);
        datePickerDialog.show();
    }

    public void ChonGio(EditText edtTime)
    {
        Calendar calendar = Calendar.getInstance();
        final int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE);
        TimePickerDialog timePickerDialog = new TimePickerDialog(context, new TimePickerDialog.OnTimeSetListener() {
            @Override
            public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
                String s=hourOfDay +":"+minute;
                int hourTam=hourOfDay;
                if(hourTam>12)
                    hourTam=hourTam-12;
                edtTime.setText
                        (hourTam +":"+minute +(hourOfDay>12?" PM":" AM"));
                //lưu giờ thực vào tag
                edtTime.setTag(s);
            }
        }, hour, minute, true);
        timePickerDialog.setTitle("Time");
        timePickerDialog.show();
    }
}
