package com.Adapter.icare.Utils;

import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.ServiceRequest;

import java.util.ArrayList;
import java.util.List;

public class ServiceRequestUtils {
    public static List<ServiceRequest> getServiceRequestsByCategory(IGenericClient fhirClient, String encounterId, String category) throws Exception {
        List<ServiceRequest> serviceRequests = new ArrayList<>();
        var serviceRequestSearch = fhirClient.search().forResource(ServiceRequest.class)
                .where(ServiceRequest.ENCOUNTER.hasAnyOfIds(encounterId))
                .where(ServiceRequest.CATEGORY.exactly().code(category));

        Bundle observationBundle = new Bundle();
        observationBundle = serviceRequestSearch.sort().descending("_lastUpdated").returnBundle(Bundle.class)
                .execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                ServiceRequest serviceRequest = (ServiceRequest) entryComponent.getResource();
                serviceRequests.add(serviceRequest);
            }
        }
        return serviceRequests;
    }
}
