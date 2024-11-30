package com.Adapter.icare.Services;

import com.Adapter.icare.Constants.DHISConstants;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

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

    public Object getExternalData(String endpointUrl) throws Exception {
        try {
            String path = formulateDHIS2UrlPath(endpointUrl);
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", buildBasicAuthHeader(this.dhisConstants.DHIS2Username, this.dhisConstants.DHIS2Password));

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Object> response = restTemplate.exchange(
                    path,
                    org.springframework.http.HttpMethod.GET,
                    entity,
                    Object.class
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }

    public Object postExternalData(String endpointUrl, Map<String,Object> payload) {
        String path = formulateDHIS2UrlPath(endpointUrl);
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", buildBasicAuthHeader(this.dhisConstants.DHIS2Username, this.dhisConstants.DHIS2Password));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<Object> response = restTemplate.exchange(
                path,
                org.springframework.http.HttpMethod.POST,
                entity,
                Object.class
        );
        return response.getBody();
    }

    private String formulateDHIS2UrlPath(String endpointUrl) {
        String baseUrl = this.dhisConstants.DHIS2Instance +
                (this.dhisConstants.DHIS2ContextPath != null ? "/" + this.dhisConstants.DHIS2ContextPath : "") +
                (endpointUrl.contains("api/") ? "" : "/api/");
        return UriComponentsBuilder.fromHttpUrl(baseUrl)
                .path(endpointUrl)
                .build(false)
                .toUriString();
    }
}
