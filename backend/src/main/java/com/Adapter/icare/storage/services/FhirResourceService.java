package com.Adapter.icare.storage.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FhirResourceService {

    @Value("${fhir.server.url}")
    private String fhirServerUrl;

    private final RestTemplate restTemplate;

    public FhirResourceService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Creates a FHIR ImagingStudy resource for the uploaded file and sends it to
     * the FHIR server
     * 
     * @param patientId        The patient ID
     * @param fileId           The generated file ID/name
     * @param originalFileName The original file name
     * @param contentType      The file content type
     * @param fileDownloadUrl  The URL where the file can be downloaded
     */
    public String createAndSubmitImagingStudyResource(String patientId, String fileId,
            String originalFileName, String contentType,
            String fileDownloadUrl) {
        String imagingStudyJson = createImagingStudyResource(patientId, fileId,
                originalFileName, contentType,
                fileDownloadUrl);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(imagingStudyJson, headers);

        try {
            String url = fhirServerUrl + "/ImagingStudy";
            String response = restTemplate.postForObject(url, request, String.class);
            return response;
        } catch (Exception e) {
            System.err.println("Failed to submit FHIR resource: " + e.getMessage());
            return imagingStudyJson;
        }
    }

    private String createImagingStudyResource(String patientId, String fileId,
            String originalFileName, String contentType,
            String fileDownloadUrl) {

        String modalityCode = "OT";
        if (contentType != null) {
            if (contentType.contains("image/")) {
                modalityCode = "XC";
            } else if (contentType.contains("application/pdf")) {
                modalityCode = "DOC";
            } else if (contentType.contains("video/")) {
                modalityCode = "XC";
            }
        }

        StringBuilder json = new StringBuilder();
        json.append("{\n");
        json.append("  \"resourceType\": \"ImagingStudy\",\n");
        json.append("  \"id\": \"").append(fileDownloadUrl).append("\",\n");
        json.append("  \"subject\": {\n");
        json.append("    \"reference\": \"Patient/").append(patientId).append("\"\n");
        json.append("  },\n");
        json.append("  \"modality\": [\n");
        json.append("    {\n");
        json.append("      \"system\": \"http://dicom.nema.org/resources/ontology/DCM\",\n");
        json.append("      \"code\": \"").append(modalityCode).append("\"\n");
        json.append("    }\n");
        json.append("  ],\n");
        json.append("  \"series\": [\n");
        json.append("    {\n");
        json.append("      \"number\": 1,\n");
        json.append("      \"modality\": {\n");
        json.append("        \"system\": \"http://dicom.nema.org/resources/ontology/DCM\",\n");
        json.append("        \"code\": \"").append(modalityCode).append("\"\n");
        json.append("      },\n");
        json.append("      \"instance\": [\n");
        json.append("        {\n");
        json.append("          \"sopClass\": {\n");
        json.append("            \"system\": \"urn:ietf:rfc:3986\",\n");
        json.append("            \"code\": \"1.2.840.10008.5.1.4.1.1.2\"\n");
        json.append("          },\n");
        json.append("          \"title\": \"").append(originalFileName).append("\",\n");
        json.append("          \"_title\": {\n");
        json.append("            \"extension\": [\n");
        json.append("              {\n");
        json.append("                \"url\": \"http://hl7.org/fhir/StructureDefinition/rendering-url\",\n");
        json.append("                \"valueUrl\": \"").append(fileDownloadUrl).append("\"\n");
        json.append("              }\n");
        json.append("            ]\n");
        json.append("          }\n");
        json.append("        }\n");
        json.append("      ]\n");
        json.append("    }\n");
        json.append("  ]\n");
        json.append("}");

        return json.toString();
    }
}