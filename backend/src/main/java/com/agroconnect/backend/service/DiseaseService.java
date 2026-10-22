package com.agroconnect.backend.service;

import com.agroconnect.backend.model.DiagnosisRequest;
import com.agroconnect.backend.model.DiagnosisResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiseaseService {

    public DiagnosisResponse analyzeDisease(DiagnosisRequest request) {
        return new DiagnosisResponse(
            "Leaf Blight",
            0.94,
            List.of("Yellowing of leaves", "Brown lesions", "Poor crop vigor"),
            List.of(
                "Inspect the field for early signs and isolate severe plants",
                "Apply crop-safe fungicide as per local agronomy guidance",
                "Improve ventilation and reduce water accumulation"
            ),
            "ResNet50-based mock diagnostic pipeline"
        );
    }
}
