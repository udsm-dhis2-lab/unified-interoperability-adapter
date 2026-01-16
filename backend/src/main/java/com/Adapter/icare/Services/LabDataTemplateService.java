package com.Adapter.icare.Services;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.SummaryEnum;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.gclient.StringClientParam;
import com.Adapter.icare.ClientRegistry.Services.ClientRegistryService;
import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Constants.ClientRegistryConstants;
import com.Adapter.icare.Constants.FHIRConstants;
import com.Adapter.icare.Constants.SharedRecordsConstants;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.*;
import org.hl7.fhir.r4.model.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.Adapter.icare.SharedHealthRecords.Utilities.LabRequestDetailsUtils.getLabRequestDetailsBySpecimen;
import static com.Adapter.icare.Utils.ExtensionUtils.getExtensionValueCodeableConcept;

@Service
public class LabDataTemplateService {
    private final IGenericClient fhirClient;
    private final FhirContext fhirContext;
    private final FHIRConstants fhirConstants;
    private final ClientRegistryConstants clientRegistryConstants;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;
    private final SharedRecordsConstants sharedRecordsConstants;
    private final ClientRegistryService clientRegistryService;
    private final MediatorsService mediatorsService;

    public LabDataTemplateService(FHIRConstants fhirConstants,
                                      UserService userService,
                                      ClientRegistryService clientRegistryService,
                                      MediatorsService mediatorsService,
                                      ClientRegistryConstants clientRegistryConstants,
                                      SharedRecordsConstants sharedRecordsConstants) {
        this.fhirConstants = fhirConstants;
        this.userService = userService;
        this.clientRegistryService = clientRegistryService;
        this.mediatorsService = mediatorsService;
        this.clientRegistryConstants = clientRegistryConstants;
        this.sharedRecordsConstants = sharedRecordsConstants;
        this.fhirContext = FhirContext.forR4();
        this.fhirClient = this.fhirContext.newRestfulGenericClient(fhirConstants.FHIRServerUrl);
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService
                    .getUserByUsername(((CustomUserDetails) authentication.getPrincipal())
                            .getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
    }

    public Map<String, Object> getLabRecordsWithPagination(Integer page,
                                                              Integer pageSize, String facilityCode, String specimenId) throws Exception {

        List<Map<String, Object>> labRecords = new ArrayList<>();
        Bundle response = new Bundle();
        Bundle specimensTotalBundle = new Bundle();
        var records = fhirClient.search().forResource(Specimen.class);
        records.sort().descending("_lastUpdated");

        String searchedSpecimenId = null;

        if(specimenId != null){
            searchedSpecimenId = facilityCode != null && specimenId.contains(facilityCode) ? specimenId : facilityCode != null ? facilityCode + "-" + specimenId : specimenId;
        }

        records.where(Specimen.IDENTIFIER.exactly().systemAndCode(
                "urn:sys:lab-request:specimen-id", specimenId != null
                        && facilityCode == null ? specimenId :
                        specimenId != null && specimenId.contains(facilityCode) ? "" :
                                specimenId != null && !specimenId.contains(facilityCode) ? specimenId : ""));
        records.and(Specimen.SUBJECT.isMissing(true));

        if(facilityCode != null && searchedSpecimenId == null){
            String hasParameterName = "_has:ServiceRequest:specimen:performer";
            String organizationReference = "Organization/" + facilityCode;

            records.and(new StringClientParam(hasParameterName).matches().value(organizationReference));
        }

        response = records.count(pageSize).offset(page - 1).returnBundle(Bundle.class)
                .execute();

        if(response.hasEntry()){
            for(Bundle.BundleEntryComponent entry :  response.getEntry()){
                if (entry.getResource() instanceof Specimen){
                    Specimen specimen = (Specimen) entry.getResource();

                    FacilityDetailsDTO facilityDetails = new FacilityDetailsDTO();

                    CodeableConcept specimenSystemCodeableConcept = getExtensionValueCodeableConcept(specimen, "http://fhir.moh.go.tz/fhir/lab-request/facilityDetails");
                    if(specimenSystemCodeableConcept != null){
                        facilityDetails.setCode(specimenSystemCodeableConcept.hasText() ? specimenSystemCodeableConcept.getText() : null);

                        FacilitySystemDTO facilitySystemDTO = new FacilitySystemDTO();
                        if(specimenSystemCodeableConcept.hasCoding() && !specimenSystemCodeableConcept.getCoding().isEmpty()){
                            for(Coding coding: specimenSystemCodeableConcept.getCoding()){
                                if(coding.hasSystem() && coding.getSystem().equals("http://fhir.moh.go.tz/fhir/lab-request/facility-details/")){

                                    facilitySystemDTO.setName(coding.hasDisplay() ? coding.getDisplay() : null);
                                    facilitySystemDTO.setVersion(coding.hasCode() ? coding.getCode() : null);
                                }
                            }
                        }
                        facilityDetails.setSystem(facilitySystemDTO);
                    }


                    LabRequestDetailsDTO labRequestDetailsDTO = getLabRequestDetailsBySpecimen(fhirClient, specimen);
                    if(labRequestDetailsDTO != null){
                        Map<String, Object> labRequestMap = labRequestDetailsDTO.toMap();
                        labRequestMap.put("facilityDetails", facilityDetails.toMap(null));
                        labRecords.add(labRequestMap);
                    }
                }
            }
        }

        specimensTotalBundle = records.summaryMode(SummaryEnum.COUNT)
                .returnBundle(Bundle.class).execute();



        Map<String, Object> labRecordsResponse = new HashMap<>();
        labRecordsResponse.put("results", labRecords);
        Map<String, Object> pager = new HashMap<>();
        pager.put("total", specimensTotalBundle.getTotal());
        pager.put("totalPages", specimensTotalBundle.getTotal()%pageSize == 0 ? specimensTotalBundle.getTotal()/pageSize : (specimensTotalBundle.getTotal()/pageSize) + 1);
        pager.put("page", page);
        pager.put("pageSize", pageSize);
        labRecordsResponse.put("pager", pager);
        return labRecordsResponse;
    }
}
