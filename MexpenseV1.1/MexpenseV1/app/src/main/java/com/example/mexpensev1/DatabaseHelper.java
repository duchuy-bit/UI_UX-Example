package com.example.mexpensev1;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.widget.Toast;

import androidx.annotation.Nullable;

import java.util.ArrayList;


class DatabaseHelper extends SQLiteOpenHelper {

    private final Context context;
    private static final String DATABASE_NAME = "mexpense.db";
    private static final int DATABASE_VERSION = 2;

    //TRIP TABLE
    private static final String TABLE_TRIP = "trip";
    private static final String COL_ID = "id";
    private static final String COL_NAME = "name";
    private static final String COL_DESTINATION = "destination";
    private static final String COL_TYPE= "type";
    private static final String COL_START_DATE = "start_date";
    private static final String COL_END_DATE = "end_date";
    private static final String COL_RISK = "risk";
    private static final String COL_IMPORTANT = "important";
    private static final String COL_DESCRIPTION = "description";



    //EXPENSE TABLE
    private static final String TABLE_EXPENSE = "expense";
    private static final String EX_ID = "id";
    private static final String EX_TYPE = "type";
    private static final String EX_AMOUNT = "amount";
    private static final String EX_DATE = "date";
    private static final String EX_TIME = "time";
    private static final String EX_COMMENT = "comment";
    private static final String EX_TRIP_ID = "trip_id";



    public DatabaseHelper(@Nullable Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
        this.context = context;
    }


    @Override
    public void onCreate(SQLiteDatabase db) {
        String tableTrip_query = "CREATE TABLE IF NOT EXISTS " + TABLE_TRIP + " ( " +
                COL_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
                COL_NAME + " TEXT NOT NULL," +
                COL_DESTINATION + " TEXT NOT NULL," +
                COL_TYPE + " TEXT NOT NULL," +
                COL_START_DATE + " TEXT NOT NULL," +
                COL_END_DATE + " TEXT NOT NULL," +
                COL_RISK + " INTEGER NOT NULL ," +
                COL_IMPORTANT + " INTEGER NOT NULL ," +
                COL_DESCRIPTION + " TEXT)";
        String tableExpense_query = "CREATE TABLE IF NOT EXISTS " + TABLE_EXPENSE + " (" +
                EX_ID + " INTEGER PRIMARY KEY," +
                EX_TYPE + " INTEGER NOT NULL," +
                EX_AMOUNT + " REAL NOT NULL," +
                EX_DATE + " TEXT NOT NULL," +
                EX_TIME + " TEXT NOT NULL," +
                EX_COMMENT + " TEXT," +
                EX_TRIP_ID + " INTEGER NOT NULL," +
                "FOREIGN KEY(" + EX_TRIP_ID + ") " +
                "REFERENCES " + TABLE_TRIP + "(" + COL_ID + "))";
        db.execSQL(tableTrip_query);
        db.execSQL(tableExpense_query);

    }



    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_TRIP);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_EXPENSE);
        onCreate(db);

    }
    // TRIP TABLE QUERY
    void addTrip(String tripName, String destination, String type, String startdate, String enddate, int risk, int important,  String description){
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put(COL_NAME, tripName);
        cv.put(COL_DESTINATION, destination);
        cv.put(COL_TYPE, type);
        cv.put(COL_START_DATE, startdate);
        cv.put(COL_END_DATE, enddate);
        cv.put(COL_RISK, risk);
        cv.put(COL_IMPORTANT, important);
        cv.put(COL_DESCRIPTION, description);
        long result = db.insert(TABLE_TRIP,null, cv);
        if(result == -1){
            Toast.makeText(context, "Failed", Toast.LENGTH_LONG).show();
        }else {
            Toast.makeText(context, "Added Trip Successfully!", Toast.LENGTH_LONG).show();
        }
    }

    //get All Trip List
    public ArrayList<Trip> getAllTrip(){
        String query = "SELECT * FROM " + TABLE_TRIP;

        ArrayList<Trip> trip = new ArrayList<>();
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery(query, null);
        cursor.moveToFirst();
        while (!cursor.isAfterLast()) {
            int tripID = cursor.getInt(0);
            String tripName = cursor.getString(1);
            String tripStartdate = cursor.getString(4);
            String tripEnddate = cursor.getString(5);

            trip.add(new Trip(tripID, tripName, tripStartdate, tripEnddate));
            cursor.moveToNext();
        }
        cursor.close();
        return trip;
    }




    Trip readTripDataByID(String row_id){
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.query(TABLE_TRIP,null, COL_ID + "=?", new String[]{row_id}, null,null,null);
        if(cursor != null)
            cursor.moveToFirst();
        //ArrayList detail_Trip = null;
        Trip trip = new Trip(cursor.getInt(0), cursor.getString(1), cursor.getString(2), cursor.getString(3),
                cursor.getString(4), cursor.getString(5), cursor.getInt(6), cursor.getInt(7), cursor.getString(8) );
        return trip;

    }

    void updateDataTrip(String row_id, String tripName, String destination, String type, String startdate, String enddate, int risk, int important,  String description){
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put(COL_NAME, tripName);
        cv.put(COL_DESTINATION, destination);
        cv.put(COL_TYPE, type);
        cv.put(COL_START_DATE, startdate);
        cv.put(COL_END_DATE, enddate);
        cv.put(COL_RISK, risk);
        cv.put(COL_IMPORTANT, important);
        cv.put(COL_DESCRIPTION, description);

        long result = db.update(TABLE_TRIP, cv, COL_ID +"=?", new String[]{row_id});
        if(result == -1){
            Toast.makeText(context, "Failed", Toast.LENGTH_SHORT).show();
        }else {
            Toast.makeText(context, "Updated Successfully!", Toast.LENGTH_SHORT).show();
        }

    }

    void deleteOneRow(String row_id){
        SQLiteDatabase db = this.getWritableDatabase();
        long result = db.delete(TABLE_TRIP, COL_ID +"=?", new String[]{row_id});
        if(result == -1){
            Toast.makeText(context, "Failed to Delete.", Toast.LENGTH_SHORT).show();
        }else{
            Toast.makeText(context, "Successfully Deleted.", Toast.LENGTH_SHORT).show();
        }
    }

    void deleteAllData(){
        SQLiteDatabase db = this.getWritableDatabase();
        db.execSQL("DELETE FROM " + TABLE_TRIP);
    }

    // EXPENSE TABLE QUERY
    void deleteExpenseByTrip(String trip_id){
        SQLiteDatabase db = this.getWritableDatabase();
        long result = db.delete(TABLE_EXPENSE, EX_TRIP_ID +"=?", new String[]{trip_id});
        if(result == -1){
            Toast.makeText(context, "Failed to Delete.", Toast.LENGTH_SHORT).show();
        }else{
            Toast.makeText(context, "Successfully Deleted.", Toast.LENGTH_SHORT).show();
        }
    }
    void addExpense(String type, double amount, String date, String time, String comment, long tripId){
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put(EX_TYPE, type);
        cv.put(EX_AMOUNT, amount);
        cv.put(EX_DATE, date);
        cv.put(EX_TIME, time);
        cv.put(EX_COMMENT, comment);
        cv.put(EX_TRIP_ID, tripId);
        long result = db.insert(TABLE_EXPENSE,null, cv);
        if(result == -1){
            Toast.makeText(context, "Failed", Toast.LENGTH_LONG).show();
        }else {
            Toast.makeText(context, "Added Expense Successfully!", Toast.LENGTH_LONG).show();
        }
    }

    Cursor readAllExpenseByTrip(String trip_id){
        String query = "SELECT * FROM " + TABLE_EXPENSE + " WHERE " + EX_TRIP_ID + "= " +trip_id;
        SQLiteDatabase db = this.getReadableDatabase();

        Cursor cursor = null;
        if(db != null){
            cursor = db.rawQuery(query, null);
        }
        return cursor;
    }




}
