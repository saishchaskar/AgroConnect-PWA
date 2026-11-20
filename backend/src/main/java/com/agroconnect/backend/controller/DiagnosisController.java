package com.agroconnect.backend.controller;

import com.agroconnect.backend.model.DiagnosisResponse;
import com.agroconnect.backend.service.DiagnosisService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class DiagnosisController {

    private final DiagnosisService diagnosisService;

    public DiagnosisController(DiagnosisService diagnosisService) {
        this.diagnosisService = diagnosisService;
    }

    @PostMapping("/diagnose")
    public ResponseEntity<DiagnosisResponse> diagnose(
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "cropType", required = false) String cropType,
            @RequestParam(value = "location", required = false) String location) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) auth.getPrincipal();

        DiagnosisResponse response = diagnosisService.diagnose(image, cropType, location, userId);
        return ResponseEntity.ok(response);
    }
}
