package com.agroconnect.backend.controller;

import com.agroconnect.backend.model.DiagnosisHistoryItem;
import com.agroconnect.backend.model.DiagnosisResponse;
import com.agroconnect.backend.service.DiagnosisService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final DiagnosisService diagnosisService;

    public HistoryController(DiagnosisService diagnosisService) {
        this.diagnosisService = diagnosisService;
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (String) auth.getPrincipal();
    }

    @GetMapping
    public ResponseEntity<List<DiagnosisHistoryItem>> getHistory() {
        List<DiagnosisHistoryItem> history = diagnosisService.getHistory(getCurrentUserId());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiagnosisResponse> getHistoryById(@PathVariable String id) {
        DiagnosisResponse response = diagnosisService.getHistoryById(id, getCurrentUserId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable String id) {
        diagnosisService.deleteHistory(id, getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
