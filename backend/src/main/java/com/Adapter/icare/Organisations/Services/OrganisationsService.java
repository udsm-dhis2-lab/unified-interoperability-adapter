package com.Adapter.icare.Organisations.Services;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Constants.FHIRConstants;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Organisations.Dtos.OrganizationDTO;
import com.Adapter.icare.Services.UserService;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.Location;
import org.hl7.fhir.r4.model.Organization;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OrganisationsService {

    private final FHIRConstants fhirConstants;
    private final UserService userService;
    private final IGenericClient fhirClient;
    private final Authentication authentication;
    private final User authenticatedUser;

    public OrganisationsService(
            FHIRConstants fhirConstants,
            UserService userService) {
        this.fhirConstants = fhirConstants;
        this.userService = userService;
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

    public List<Map<String,Object>> getOrganisations(Integer page, Integer pageSize, String q) throws Exception {
        Bundle response = new Bundle();
        var searchRecords =  fhirClient.search().forResource(Organization.class);
        // searchRecords.where()
        response = searchRecords.count(pageSize)
                .offset(page)
                .returnBundle(Bundle.class)
                .execute();
        List<Map<String,Object>> organizations = new ArrayList<>();
        for (Bundle.BundleEntryComponent entry : response.getEntry()) {
            if (entry.getResource() instanceof Organization) {
                Organization organization = (Organization) entry.getResource();
                organizations.add(new OrganizationDTO(
                        organization.getId(),
                        organization.getIdentifier(),
                        organization.getName(),
                        organization.getActive()).toMap());
            }
        }
        return organizations;
    }

}
