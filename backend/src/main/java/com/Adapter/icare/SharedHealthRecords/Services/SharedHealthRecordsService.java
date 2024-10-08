package com.Adapter.icare.SharedHealthRecords.Services;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.SortOrderEnum;
import ca.uhn.fhir.rest.api.SortSpec;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.gclient.ReferenceClientParam;
import com.Adapter.icare.ClientRegistry.Services.ClientRegistryService;
import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Constants.FHIRConstants;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.PatientDTO;
import com.Adapter.icare.Services.UserService;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.Encounter;
import org.hl7.fhir.r4.model.Organization;
import org.hl7.fhir.r4.model.Patient;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SharedHealthRecordsService {

    private final IGenericClient fhirClient;
    private final FHIRConstants fhirConstants;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;
    private final ClientRegistryService clientRegistryService;

    public SharedHealthRecordsService(
            FHIRConstants fhirConstants,
            UserService userService,
            ClientRegistryService clientRegistryService) {
        this.fhirConstants = fhirConstants;
        this.userService = userService;
        this.clientRegistryService = clientRegistryService;
        FhirContext fhirContext = FhirContext.forR4();
        this.fhirClient =  fhirContext.newRestfulGenericClient(fhirConstants.FHIRServerUrl);
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService.getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
    }

    public List<Map<String, Object>> getSharedRecords(
            Integer page,
            Integer pageSize
    ) throws Exception {
        List<Map<String,Object>> sharedRecords =  new ArrayList<>();
        Bundle response = new Bundle();
        var searchRecords =  fhirClient.search().forResource(Patient.class);

        response = searchRecords.count(pageSize)
                .offset(page)
                .returnBundle(Bundle.class)
                .execute();

        for (Bundle.BundleEntryComponent entry : response.getEntry()) {
            if (entry.getResource() instanceof Patient) {
                Map<String, Object> templateData = new HashMap<>();
                Patient patient = (Patient) entry.getResource();
                PatientDTO patientDTO = this.clientRegistryService.mapToPatientDTO(patient);
                templateData.put("demographicDetails", patientDTO.toMap());

                Encounter encounter = getLatestEncounterUsingPatientAndOrganisation(patient.getId().toString(), null);
                Map<String,Object> visitDetails = new HashMap<>();
                if (encounter != null) {
                    visitDetails.put("visitDate", encounter.getPeriod().getStart());
                    visitDetails.put("visitClosedDate", encounter.getPeriod().getEnd());
                } else {
                    visitDetails = null;
                }
                templateData.put("visitDetails", visitDetails);

                sharedRecords.add(templateData);
            }
        }
        return sharedRecords;
    }

    public Encounter getLatestEncounterUsingPatientAndOrganisation(String id, Organization organization) throws Exception {
        Bundle results = fhirClient.search()
                .forResource(Encounter.class)
                .where(new ReferenceClientParam("patient").hasId(id))
                .sort(new SortSpec("date").setOrder(SortOrderEnum.DESC))
                .returnBundle(Bundle.class)
                .execute();
        if (results.hasEntry() && !results.getEntry().isEmpty()) {
            return (Encounter) results.getEntry().get(0).getResource();
        }
        return null;
    }
}
