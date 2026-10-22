package com.agroconnect.backend.controller;

import com.agroconnect.backend.model.DiagnosisRequest;
import com.agroconnect.backend.model.DiagnosisResponse;
import com.agroconnect.backend.service.DiseaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class DiseaseController {

    private final DiseaseService diseaseService;

    public DiseaseController(DiseaseService diseaseService) {
        this.diseaseService = diseaseService;
    }

    @PostMapping("/diagnose")
    public ResponseEntity<DiagnosisResponse> diagnose(@RequestBody DiagnosisRequest request) {
        DiagnosisResponse diagnosis = diseaseService.analyzeDisease(request);
        return ResponseEntity.ok(diagnosis);
    }
}
