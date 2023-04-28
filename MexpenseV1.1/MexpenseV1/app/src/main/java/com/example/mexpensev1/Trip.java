package com.example.mexpensev1;

import java.util.ArrayList;

public class Trip {
    private int trip_id;
    private String name;
    private String destination;
    private String type;
    private String fromDate;
    private String toDate;
    private int risk;
    private int important;
    private String description;

    public Trip(int trip_id, String name, String destination, String type, String fromDate, String toDate, int risk, int important, String description) {
        this.trip_id = trip_id;
        this.name = name;
        this.destination = destination;
        this.type = type;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.risk = risk;
        this.important = important;
        this.description = description;
    }


    public Trip(String name, String destination, String type, String fromDate, String toDate, int risk, int important, String description) {
        this.name = name;
        this.destination = destination;
        this.type = type;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.risk = risk;
        this.important = important;
        this.description = description;
    }

    public Trip(int trip_id, String name, String fromDate, String toDate) {
        this.trip_id = trip_id;
        this.name = name;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }

    public int getTrip_id() {
        return trip_id;
    }

    public void setTrip_id(int trip_id) {
        this.trip_id = trip_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFromDate() {
        return fromDate;
    }

    public void setFromDate(String fromDate) {
        this.fromDate = fromDate;
    }

    public String getToDate() {
        return toDate;
    }

    public void setToDate(String toDate) {
        this.toDate = toDate;
    }

    public int getRisk() {
        return risk;
    }

    public void setRisk(int risk) {
        this.risk = risk;
    }

    public int getImportant() {
        return important;
    }

    public void setImportant(int important) {
        this.important = important;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
