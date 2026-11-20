package com.agroconnect.backend.service;

import com.agroconnect.backend.exception.DiagnosisException;
import com.agroconnect.backend.model.*;
import com.agroconnect.backend.repository.DiagnosisHistoryRepository;
import com.agroconnect.backend.repository.UserRepository;
import com.agroconnect.backend.service.GeminiVisionService.GeminiDiagnosisResult;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DiagnosisService {

    private static final Logger logger = LoggerFactory.getLogger(DiagnosisService.class);
    private static final long MAX_IMAGE_SIZE = 10 * 1024 * 1024L; // 10MB

    private final GeminiVisionService geminiVisionService;
    private final DiagnosisHistoryRepository historyRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public DiagnosisService(GeminiVisionService geminiVisionService,
                            DiagnosisHistoryRepository historyRepository,
                            UserRepository userRepository,
                            ObjectMapper objectMapper) {
        this.geminiVisionService = geminiVisionService;
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    public DiagnosisResponse diagnose(MultipartFile image, String cropType, String location, String userId) {
        // Validate image
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file is required and cannot be empty");
        }
        if (image.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("Image file size must not exceed 10MB");
        }

        byte[] imageBytes;
        try {
            imageBytes = image.getBytes();
        } catch (IOException e) {
            throw new DiagnosisException("Failed to read image file", e);
        }

        // Call Gemini Vision AI
        GeminiDiagnosisResult result = geminiVisionService.analyzeImage(
                imageBytes, image.getContentType(), cropType);

        // Save to history
        String id = UUID.randomUUID().toString();
        DiagnosisHistory history = new DiagnosisHistory();
        history.setId(id);
        history.setUserId(userId);
        history.setDiseaseName(result.diseaseName());
        history.setCropDetected(result.cropDetected());
        history.setConfidence(result.confidence());
        history.setHealthy(result.isHealthy() != null && result.isHealthy());
        history.setSeverity(result.severity());
        history.setLocation(location);
        history.setModelUsed("gemini-2.0-flash");
        history.setSymptoms(toJson(result.symptoms()));
        history.setCulturalControl(toJson(result.culturalControl()));
        history.setChemicalControl(toJson(result.chemicalControl()));
        history.setBiologicalControl(toJson(result.biologicalControl()));
        history.setPrevention(toJson(result.prevention()));

        historyRepository.save(history);

        // Reload to get the auto-generated timestamp
        DiagnosisHistory saved = historyRepository.findById(id)
                .orElseThrow(() -> new DiagnosisException("Failed to retrieve saved diagnosis"));

        return mapToResponse(saved, result.isHealthy());
    }

    public List<DiagnosisHistoryItem> getHistory(String userId) {
        return historyRepository.findByUserIdOrderByTimestampDesc(userId)
                .stream()
                .map(h -> new DiagnosisHistoryItem(
                        h.getId(),
                        h.getDiseaseName(),
                        h.getCropDetected(),
                        h.getConfidence(),
                        h.isHealthy(),
                        h.getSeverity(),
                        h.getTimestamp(),
                        h.getLocation()
                ))
                .collect(Collectors.toList());
    }

    public DiagnosisResponse getHistoryById(String id, String userId) {
        DiagnosisHistory history = historyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Diagnosis not found"));

        if (!history.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        return mapToResponse(history, history.isHealthy());
    }

    public void deleteHistory(String id, String userId) {
        DiagnosisHistory history = historyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Diagnosis not found"));

        if (!history.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        historyRepository.delete(history);
    }

    private DiagnosisResponse mapToResponse(DiagnosisHistory h, Boolean isHealthy) {
        return new DiagnosisResponse(
                h.getId(),
                h.getDiseaseName(),
                h.getCropDetected(),
                h.getConfidence(),
                isHealthy != null ? isHealthy : h.isHealthy(),
                fromJson(h.getSymptoms()),
                fromJson(h.getCulturalControl()),
                fromJson(h.getChemicalControl()),
                fromJson(h.getBiologicalControl()),
                fromJson(h.getPrevention()),
                h.getSeverity(),
                h.getModelUsed(),
                h.getTimestamp(),
                h.getImageUrl()
        );
    }

    private String toJson(List<String> list) {
        try {
            return objectMapper.writeValueAsString(list != null ? list : List.of());
        } catch (JsonProcessingException e) {
            logger.warn("Failed to serialize list to JSON", e);
            return "[]";
        }
    }

    private List<String> fromJson(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return objectMapper.readValue(json, objectMapper.getTypeFactory()
                    .constructCollectionType(List.class, String.class));
        } catch (Exception e) {
            logger.warn("Failed to deserialize JSON list: {}", json);
            return List.of();
        }
    }
}
