package com.agroconnect.backend.model;

import java.time.Instant;
import java.util.List;

public class DiagnosisResponse {

    private String id;
    private String diseaseName;
    private String cropDetected;
    private double confidence;
    private Boolean isHealthy;
    private List<String> symptoms;
    private List<String> culturalControl;
    private List<String> chemicalControl;
    private List<String> biologicalControl;
    private List<String> prevention;
    private String severity;
    private String modelUsed;
    private Instant timestamp;
    private String imageUrl;

    public DiagnosisResponse() {}

    public DiagnosisResponse(String id, String diseaseName, String cropDetected, double confidence,
                              Boolean isHealthy, List<String> symptoms, List<String> culturalControl,
                              List<String> chemicalControl, List<String> biologicalControl,
                              List<String> prevention, String severity, String modelUsed,
                              Instant timestamp, String imageUrl) {
        this.id = id;
        this.diseaseName = diseaseName;
        this.cropDetected = cropDetected;
        this.confidence = confidence;
        this.isHealthy = isHealthy;
        this.symptoms = symptoms;
        this.culturalControl = culturalControl;
        this.chemicalControl = chemicalControl;
        this.biologicalControl = biologicalControl;
        this.prevention = prevention;
        this.severity = severity;
        this.modelUsed = modelUsed;
        this.timestamp = timestamp;
        this.imageUrl = imageUrl;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDiseaseName() { return diseaseName; }
    public void setDiseaseName(String diseaseName) { this.diseaseName = diseaseName; }

    public String getCropDetected() { return cropDetected; }
    public void setCropDetected(String cropDetected) { this.cropDetected = cropDetected; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public Boolean getIsHealthy() { return isHealthy; }
    public void setIsHealthy(Boolean isHealthy) { this.isHealthy = isHealthy; }

    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }

    public List<String> getCulturalControl() { return culturalControl; }
    public void setCulturalControl(List<String> culturalControl) { this.culturalControl = culturalControl; }

    public List<String> getChemicalControl() { return chemicalControl; }
    public void setChemicalControl(List<String> chemicalControl) { this.chemicalControl = chemicalControl; }

    public List<String> getBiologicalControl() { return biologicalControl; }
    public void setBiologicalControl(List<String> biologicalControl) { this.biologicalControl = biologicalControl; }

    public List<String> getPrevention() { return prevention; }
    public void setPrevention(List<String> prevention) { this.prevention = prevention; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getModelUsed() { return modelUsed; }
    public void setModelUsed(String modelUsed) { this.modelUsed = modelUsed; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
