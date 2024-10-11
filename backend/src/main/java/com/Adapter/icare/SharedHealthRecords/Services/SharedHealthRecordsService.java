package com.Adapter.icare.SharedHealthRecords.Services;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.SortOrderEnum;
import ca.uhn.fhir.rest.api.SortSpec;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.gclient.ICriterion;
import ca.uhn.fhir.rest.gclient.ReferenceClientParam;
import ca.uhn.fhir.rest.gclient.StringClientParam;
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
import org.hl7.fhir.r4.model.codesystems.LinkType;
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
            Integer pageSize,
            String identifier,
            String identifierType,
            boolean onlyLinkedClients,
            String gender,
            String firstName,
            String middleName,
            String lastName,
            String hfrCode,
            boolean includeDeceased
    ) throws Exception {
        List<Map<String,Object>> sharedRecords =  new ArrayList<>();
        Bundle response = new Bundle();
        var searchRecords =  fhirClient.search().forResource(Patient.class);
        if (onlyLinkedClients) {
            // TODO replace hardcoded ids with dynamic ones
            searchRecords.where(Patient.LINK.hasAnyOfIds("299","152"));
        }

        // TODO: Review the deceased concept
        if (!includeDeceased) {
            searchRecords.where(Patient.DECEASED.isMissing(true));
        }
//                .where(new StringClientParam("linkType").matchesExactly().value("replaces"));
        if (identifier != null) {
            searchRecords.where(Patient.IDENTIFIER.exactly().systemAndIdentifier(null, identifier));
        }

        if (firstName != null) {
            searchRecords.where(Patient.GIVEN.matches().value(firstName));
        }

        response = searchRecords.count(pageSize)
                .offset(page)
                .returnBundle(Bundle.class)
                .execute();

        for (Bundle.BundleEntryComponent entry : response.getEntry()) {
            if (entry.getResource() instanceof Patient) {
                Map<String, Object> templateData = new HashMap<>();
                Patient patient = (Patient) entry.getResource();
                PatientDTO patientDTO = this.clientRegistryService.mapToPatientDTO(patient);
                templateData.put("id", patientDTO.getId());
                // TODO: Provided HFR code is provided find a way to return relevant identifiers
                templateData.put("demographicDetails", patientDTO.toMap());
                templateData.put("facilityDetails", patientDTO.toMap().get("organisation"));
                templateData.put("paymentDetails", null);
                Organization organization = null;
                if (hfrCode !=null) {
                    organization = (Organization) fhirClient.search().forResource(Organization.class).where(Organization.IDENTIFIER.exactly().identifier(hfrCode));
                }
                Encounter encounter = getLatestEncounterUsingPatientAndOrganisation(patient.getIdElement().getIdPart(), organization);
                Map<String,Object> visitDetails = new HashMap<>();
                if (encounter != null) {
                    visitDetails.put("id", null);
                    visitDetails.put("visitDate", encounter.getPeriod().getStart());
                    visitDetails.put("closedDate", encounter.getPeriod().getEnd());
                    visitDetails.put("newThisYear", null);
                    visitDetails.put("new", null);
                } else {
                    // TODO: Request visit from facility provided
                    visitDetails = null;
                }
                templateData.put("visitDetails", visitDetails);

                templateData.put("diagnosisDetails", null);

                sharedRecords.add(templateData);
            }
        }
        return sharedRecords;
    }

    public Encounter getLatestEncounterUsingPatientAndOrganisation(String id, Organization organization) throws Exception {
        Bundle results = new Bundle();
        var encounterSearch = fhirClient.search().forResource(Encounter.class)
                .where(new ReferenceClientParam("patient").hasId(id));
        if (organization != null) {
            encounterSearch.where(Encounter.SERVICE_PROVIDER.hasAnyOfIds(organization.getId()));
        }
        results = encounterSearch.sort(new SortSpec("date").setOrder(SortOrderEnum.DESC))
                .returnBundle(Bundle.class)
                .execute();
        if (results.hasEntry() && !results.getEntry().isEmpty()) {
            return (Encounter) results.getEntry().get(0).getResource();
        }
        return null;
    }
}
