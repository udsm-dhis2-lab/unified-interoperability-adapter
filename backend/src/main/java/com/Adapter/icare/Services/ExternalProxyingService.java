package com.Adapter.icare.Services;

import com.Adapter.icare.Constants.DHISConstants;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.Map;

@Service
public class ExternalProxyingService {
    private final RestTemplate restTemplate;
    private final DHISConstants dhisConstants;
    public ExternalProxyingService(DHISConstants dhisConstants,
                                   RestTemplate restTemplate) {
        this.dhisConstants = dhisConstants;
        this.restTemplate = restTemplate;
    }

    private String buildBasicAuthHeader(String username, String password) {
        String credentials = username + ":" + password;
        return "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes());
    }

    public Map<String, Object> getExternalData(String endpointUrl) {
        String path = this.dhisConstants.DHIS2Instance + "/api/" + endpointUrl;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", buildBasicAuthHeader(this.dhisConstants.DHIS2Username, this.dhisConstants.DHIS2Password));

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                path,
                org.springframework.http.HttpMethod.GET,
                entity,
                Map.class
        );
        return response.getBody();
    }

    public Map<String, Object> postExternalData(String endpointUrl, Map<String,Object> payload) {
        String path = this.dhisConstants.DHIS2Instance + "/api/" + endpointUrl;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", buildBasicAuthHeader(this.dhisConstants.DHIS2Username, this.dhisConstants.DHIS2Password));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                path,
                org.springframework.http.HttpMethod.POST,
                entity,
                Map.class
        );
        return response.getBody();
    }
}
