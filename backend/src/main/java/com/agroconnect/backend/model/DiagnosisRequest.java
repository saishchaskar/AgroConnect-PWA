package com.agroconnect.backend.model;

public class DiagnosisRequest {
    private String cropType;
    private String location;
    private String notes;
    private String imageUrl;

    public DiagnosisRequest() {}

    public String getCropType() { return cropType; }
    public void setCropType(String cropType) { this.cropType = cropType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
