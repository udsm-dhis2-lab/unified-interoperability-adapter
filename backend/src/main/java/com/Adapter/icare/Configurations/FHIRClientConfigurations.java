package com.Adapter.icare.Configurations;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.client.impl.RestfulClientFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FHIRClientConfigurations {

    @Value("${fhir.server.url}")
    private String fhirServerUrl;

    @Bean
    public IGenericClient fhirClient() {
        FhirContext fhirContext = FhirContext.forR4();

        // Create and return the IGenericClient
        return fhirContext.newRestfulGenericClient(fhirServerUrl);
    }
}
