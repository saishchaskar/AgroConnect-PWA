package com.agroconnect.backend.service;

import com.agroconnect.backend.exception.DiagnosisException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class GeminiVisionService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiVisionService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiVisionService(ObjectMapper objectMapper) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = objectMapper;
    }

    public GeminiDiagnosisResult analyzeImage(byte[] imageBytes, String mimeType, String cropHint) {
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        String effectiveMime = (mimeType != null && !mimeType.isBlank()) ? mimeType : "image/jpeg";

        String cropContext = (cropHint != null && !cropHint.isBlank())
                ? "\nNote: The farmer reports this may be a " + cropHint + " crop."
                : "";

        String prompt = """
                You are an expert plant pathologist and agronomist for Indian farming conditions.
                Analyze the crop image provided and return ONLY a valid JSON object (no markdown, no explanation).
                                
                Required JSON format:
                {
                  "diseaseName": "Disease name or 'Healthy' if no disease",
                  "cropDetected": "Crop type detected",
                  "confidence": 0.95,
                  "isHealthy": false,
                  "symptoms": ["symptom1", "symptom2"],
                  "culturalControl": ["measure1", "measure2"],
                  "chemicalControl": ["chemical1 (dosage)", "chemical2"],
                  "biologicalControl": ["bio-agent1", "bio-agent2"],
                  "prevention": ["tip1", "tip2"],
                  "severity": "MILD|MODERATE|SEVERE|HEALTHY"
                }
                                
                Rules:
                - If the image is not a crop/plant, set diseaseName to "Not a plant image", isHealthy to null
                - Severity must be MILD, MODERATE, SEVERE, or HEALTHY
                - Provide at least 2 items in symptoms, culturalControl, chemicalControl, biologicalControl, prevention
                - chemicalControl must include Indian market available fungicides/pesticides with dosages
                - All recommendations must be appropriate for Indian farming conditions""" + cropContext;

        // Build Gemini API request body
        Map<String, Object> inlineData = Map.of(
                "mime_type", effectiveMime,
                "data", base64Image
        );

        Map<String, Object> imagePart = Map.of("inline_data", inlineData);
        Map<String, Object> textPart = Map.of("text", prompt);

        Map<String, Object> content = Map.of(
                "parts", List.of(textPart, imagePart)
        );

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(content),
                "generationConfig", Map.of(
                        "temperature", 0.1,
                        "maxOutputTokens", 2048
                )
        );

        String urlWithKey = apiUrl + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(urlWithKey, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new DiagnosisException("Gemini API returned non-success status: " + response.getStatusCode());
            }

            return parseGeminiResponse(response.getBody());

        } catch (DiagnosisException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error calling Gemini API: {}", e.getMessage(), e);
            throw new DiagnosisException("Failed to analyze image with Gemini API: " + e.getMessage(), e);
        }
    }

    private GeminiDiagnosisResult parseGeminiResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            String text = root
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text")
                    .asText();

            // Strip markdown code fences if present
            text = text.trim();
            if (text.startsWith("```")) {
                int firstNewline = text.indexOf('\n');
                int lastFence = text.lastIndexOf("```");
                if (firstNewline >= 0 && lastFence > firstNewline) {
                    text = text.substring(firstNewline + 1, lastFence).trim();
                }
            }

            JsonNode result = objectMapper.readTree(text);

            String diseaseName = result.path("diseaseName").asText("Unknown");
            String cropDetected = result.path("cropDetected").asText("Unknown");
            double confidence = result.path("confidence").asDouble(0.5);
            Boolean isHealthy = result.path("isHealthy").isNull() ? null : result.path("isHealthy").asBoolean();
            String severity = result.path("severity").asText("MODERATE");

            List<String> symptoms = parseStringList(result.path("symptoms"));
            List<String> culturalControl = parseStringList(result.path("culturalControl"));
            List<String> chemicalControl = parseStringList(result.path("chemicalControl"));
            List<String> biologicalControl = parseStringList(result.path("biologicalControl"));
            List<String> prevention = parseStringList(result.path("prevention"));

            return new GeminiDiagnosisResult(
                    diseaseName, cropDetected, confidence, isHealthy,
                    symptoms, culturalControl, chemicalControl, biologicalControl,
                    prevention, severity
            );

        } catch (Exception e) {
            logger.error("Failed to parse Gemini response: {}", e.getMessage());
            throw new DiagnosisException("Failed to parse AI response: " + e.getMessage(), e);
        }
    }

    private List<String> parseStringList(JsonNode node) {
        if (node == null || node.isNull() || !node.isArray()) {
            return List.of();
        }
        return objectMapper.convertValue(node, objectMapper.getTypeFactory()
                .constructCollectionType(List.class, String.class));
    }

    // Inner record for structured result
    public record GeminiDiagnosisResult(
            String diseaseName,
            String cropDetected,
            double confidence,
            Boolean isHealthy,
            List<String> symptoms,
            List<String> culturalControl,
            List<String> chemicalControl,
            List<String> biologicalControl,
            List<String> prevention,
            String severity
    ) {}
}
