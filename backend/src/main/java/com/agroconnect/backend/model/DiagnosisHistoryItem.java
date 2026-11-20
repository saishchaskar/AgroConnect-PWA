package com.agroconnect.backend.model;

import java.time.Instant;

public class DiagnosisHistoryItem {

    private String id;
    private String diseaseName;
    private String cropDetected;
    private double confidence;
    private boolean isHealthy;
    private String severity;
    private Instant timestamp;
    private String location;

    public DiagnosisHistoryItem() {}

    public DiagnosisHistoryItem(String id, String diseaseName, String cropDetected,
                                 double confidence, boolean isHealthy, String severity,
                                 Instant timestamp, String location) {
        this.id = id;
        this.diseaseName = diseaseName;
        this.cropDetected = cropDetected;
        this.confidence = confidence;
        this.isHealthy = isHealthy;
        this.severity = severity;
        this.timestamp = timestamp;
        this.location = location;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDiseaseName() { return diseaseName; }
    public void setDiseaseName(String diseaseName) { this.diseaseName = diseaseName; }

    public String getCropDetected() { return cropDetected; }
    public void setCropDetected(String cropDetected) { this.cropDetected = cropDetected; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public boolean getIsHealthy() { return isHealthy; }
    public void setIsHealthy(boolean isHealthy) { this.isHealthy = isHealthy; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
