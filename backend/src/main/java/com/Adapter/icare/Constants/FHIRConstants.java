package com.Adapter.icare.Constants;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FHIRConstants {
    @Value("${fhir.server.url}")
    public String FHIRServerUrl;

}
