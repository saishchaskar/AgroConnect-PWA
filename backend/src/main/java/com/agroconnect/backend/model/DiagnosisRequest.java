package com.agroconnect.backend.model;

public class DiagnosisRequest {
    private String cropType;
    private String location;

    public DiagnosisRequest() {}

    public DiagnosisRequest(String cropType, String location) {
        this.cropType = cropType;
        this.location = location;
    }

    public String getCropType() { return cropType; }
    public void setCropType(String cropType) { this.cropType = cropType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
