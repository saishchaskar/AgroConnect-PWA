package com.agroconnect.backend.model;

import java.util.List;

public class DiagnosisResponse {
    private String diseaseName;
    private double confidence;
    private List<String> symptoms;
    private List<String> recommendations;
    private String source;

    public DiagnosisResponse() {}

    public DiagnosisResponse(String diseaseName, double confidence, List<String> symptoms, List<String> recommendations, String source) {
        this.diseaseName = diseaseName;
        this.confidence = confidence;
        this.symptoms = symptoms;
        this.recommendations = recommendations;
        this.source = source;
    }

    public String getDiseaseName() { return diseaseName; }
    public void setDiseaseName(String diseaseName) { this.diseaseName = diseaseName; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
