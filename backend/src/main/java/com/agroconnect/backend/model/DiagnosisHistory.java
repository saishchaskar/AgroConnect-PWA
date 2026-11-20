package com.agroconnect.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "diagnosis_history")
public class DiagnosisHistory {

    @Id
    private String id;

    private String userId;
    private String diseaseName;
    private String cropDetected;
    private double confidence;
    private boolean isHealthy;

    @Column(columnDefinition = "TEXT")
    private String symptoms; // JSON array string

    @Column(columnDefinition = "TEXT")
    private String culturalControl; // JSON array string

    @Column(columnDefinition = "TEXT")
    private String chemicalControl; // JSON array string

    @Column(columnDefinition = "TEXT")
    private String biologicalControl; // JSON array string

    @Column(columnDefinition = "TEXT")
    private String prevention; // JSON array string

    private String severity;
    private String location;
    private String modelUsed;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant timestamp;

    private String imageUrl;

    public DiagnosisHistory() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getDiseaseName() { return diseaseName; }
    public void setDiseaseName(String diseaseName) { this.diseaseName = diseaseName; }

    public String getCropDetected() { return cropDetected; }
    public void setCropDetected(String cropDetected) { this.cropDetected = cropDetected; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public boolean isHealthy() { return isHealthy; }
    public void setHealthy(boolean healthy) { isHealthy = healthy; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getCulturalControl() { return culturalControl; }
    public void setCulturalControl(String culturalControl) { this.culturalControl = culturalControl; }

    public String getChemicalControl() { return chemicalControl; }
    public void setChemicalControl(String chemicalControl) { this.chemicalControl = chemicalControl; }

    public String getBiologicalControl() { return biologicalControl; }
    public void setBiologicalControl(String biologicalControl) { this.biologicalControl = biologicalControl; }

    public String getPrevention() { return prevention; }
    public void setPrevention(String prevention) { this.prevention = prevention; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getModelUsed() { return modelUsed; }
    public void setModelUsed(String modelUsed) { this.modelUsed = modelUsed; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
