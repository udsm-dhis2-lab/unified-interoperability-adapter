package com.Adapter.icare.SharedHealthRecords.Services;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.model.primitive.IdDt;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.api.SortOrderEnum;
import ca.uhn.fhir.rest.api.SortSpec;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.gclient.ReferenceClientParam;
import com.Adapter.icare.ClientRegistry.Services.ClientRegistryService;
import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Constants.ClientRegistryConstants;
import com.Adapter.icare.Constants.FHIRConstants;
import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.*;
import com.Adapter.icare.Organisations.Dtos.OrganizationDTO;
import com.Adapter.icare.Services.MediatorsService;
import com.Adapter.icare.Services.UserService;
import org.hl7.fhir.r4.model.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.security.auth.Subject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SharedHealthRecordsService {

    private final IGenericClient fhirClient;
    private final FHIRConstants fhirConstants;
    private final ClientRegistryConstants clientRegistryConstants;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;
    private final ClientRegistryService clientRegistryService;
    private final MediatorsService mediatorsService;

    public SharedHealthRecordsService(
            FHIRConstants fhirConstants,
            UserService userService,
            ClientRegistryService clientRegistryService,
            MediatorsService mediatorsService,
            ClientRegistryConstants clientRegistryConstants) {
        this.fhirConstants = fhirConstants;
        this.userService = userService;
        this.clientRegistryService = clientRegistryService;
        this.mediatorsService = mediatorsService;
        this.clientRegistryConstants = clientRegistryConstants;
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
            boolean includeDeceased,
            Integer numberOfVisits
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
//            searchRecords.where(Patient.DECEASED.isMissing(true));
        }
//                .where(new StringClientParam("linkType").matchesExactly().value("replaces"));
        if (identifier != null) {
            searchRecords.where(Patient.IDENTIFIER.exactly().identifier(identifier));
        }

        if (firstName != null) {
            searchRecords.where(Patient.GIVEN.matches().value(firstName));
        }

        response = searchRecords.count(pageSize)
                .offset(page -1)
                .returnBundle(Bundle.class)
                .execute();

        if (!response.getEntry().isEmpty()) {
            for (Bundle.BundleEntryComponent entry : response.getEntry()) {
                if (entry.getResource() instanceof Patient) {
                    Map<String, Object> templateData = new HashMap<>();
                    Patient patient = (Patient) entry.getResource();
                    try {
                        PatientDTO patientDTO = this.clientRegistryService.mapToPatientDTO(patient);
                        templateData.put("id", patientDTO.getId());
                        // TODO: Provided HFR code is provided find a way to return relevant identifiers
                        templateData.put("demographicDetails", patientDTO.toMap());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    templateData.put("paymentDetails", null);
                    Organization organization = null;
                    if (hfrCode !=null) {
                        try {
                            Bundle bundle = new Bundle();
                            bundle = fhirClient.search().forResource(Organization.class).where(Organization.IDENTIFIER.exactly().identifier(hfrCode)).returnBundle(Bundle.class)
                                    .execute();
                            for (Bundle.BundleEntryComponent bundleEntryComponent : bundle.getEntry()) {
                                if (bundleEntryComponent.getResource() instanceof Organization) {
                                    organization = (Organization) bundleEntryComponent.getResource();
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                    templateData.put("facilityDetails", organization != null ?
                            new OrganizationDTO(
                                    organization.getId(),
                                    organization.getIdentifier(),
                                    organization.getName(),
                                    organization.getActive()).toSummary(): null);

                    // TODO: Add logic to handle number of visits. Latest visit is primary and the rest is history
                    Encounter encounter = getLatestEncounterUsingPatientAndOrganisation(patient.getIdElement().getIdPart(), organization);
                    Map<String,Object> visitDetails = new HashMap<>();
                    if (encounter != null) {
                        visitDetails.put("id", encounter.getIdElement().getIdPart());
                        visitDetails.put("visitDate", encounter.getPeriod() != null && encounter.getPeriod().getStart() != null ?  encounter.getPeriod().getStart(): null);
                        visitDetails.put("closedDate", encounter.getPeriod() != null && encounter.getPeriod().getEnd() != null ? encounter.getPeriod().getEnd(): null);
                        visitDetails.put("newThisYear", null);
                        visitDetails.put("new", null);
                        // TODO: Add history when numberOfVisits > 1
                    } else if (organization != null) {
                        // TODO: Request visit from facility provided
                        visitDetails = null;
                    } else {
                        visitDetails = null;
                    }
                    templateData.put("visitDetails", visitDetails);

                    templateData.put("diagnosisDetails", null);

                    sharedRecords.add(templateData);
                }
            }
        }
        return sharedRecords;
    }

    public Encounter getLatestEncounterUsingPatientAndOrganisation(String id, Organization organization) throws Exception {
        Bundle results = new Bundle();
        var encounterSearch = fhirClient.search().forResource(Encounter.class)
                .where(new ReferenceClientParam("patient").hasId(id));
        if (organization != null) {
            encounterSearch.where(Encounter.SERVICE_PROVIDER.hasAnyOfIds(organization.getIdElement().getIdPart()));
        }
        results = encounterSearch.sort(new SortSpec("date").setOrder(SortOrderEnum.DESC))
                .returnBundle(Bundle.class)
                .execute();
        if (results.hasEntry() && !results.getEntry().isEmpty()) {
            return (Encounter) results.getEntry().get(0).getResource();
        }
        return null;
    }

    public List<Map<String,Object>> requestDataFromHealthFacility(Map<String,Object> requestPayload) throws Exception {
        try {
            List<Map<String,Object>> dataFromHealthFacility =  new ArrayList<>();
            // TODO: Perform all logic to get visits from health facility
            /**
             * 1. Get Mediator (auth details for the health facility) using the HFR Code
             * 2. Perform post request
             * 3. Save the data to FHIR server (Workflow/process is preferred)
             * 4. Return the requested data to client
             */
            // 1.
            Mediator mediator = mediatorsService.getMediatorByCode(requestPayload.get("hfrCode").toString());
            if (mediator != null) {
                // 2. Request data
            } else {
                throw new Exception("Missing configurations for provided health facility");
            }
            return  dataFromHealthFacility;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public Map<String,Object> processSharedRecords(SharedHealthRecordsDTO sharedRecordPayload) throws Exception {
        Map<String,Object> response = new HashMap<>();
        DemographicDetailsDTO demographicDetails = sharedRecordPayload.getDemographicDetails();
        FacilityDetailsDTO facilityDetails = sharedRecordPayload.getFacilityDetails();
        VisitDetailsDTO visitDetails = sharedRecordPayload.getVisitDetails();
        // Check if patient exists
        List<IdentifierDTO> identifiers = demographicDetails.getIdentifiers();
        Patient patient = new Patient();
        String defaultIdentifierType = this.clientRegistryConstants.DefaultIdentifierType;
        for (IdentifierDTO identifier: identifiers) {
            patient = this.clientRegistryService.getPatientUsingIdentifier(identifier.getValue());
            if (patient != null) {
                break;
            }
        }

        if (patient == null) {
            //Create patient
            patient.setActive(Boolean.TRUE);
            List<Identifier> identifiersList = new ArrayList<>();

            for (IdentifierDTO identifierDTO: identifiers) {
                Identifier identifier = new Identifier();
                Reference reference = new Reference();
                identifier.setAssigner(reference);
                CodeableConcept type = createCodeableConceptPayload(identifierDTO.getType());
                identifier.setType(type);
                identifiersList.add(identifier);
            }
            patient.setIdentifier(identifiersList);
            Organization organization = new Organization();
            organization.setName(facilityDetails.getName());
            patient.setManagingOrganization(null);
        }
        // Create encounter
        Encounter encounter = new Encounter();
        String id = facilityDetails.getCode() + "-" + visitDetails.getId();
        encounter.setId(id);
        encounter.setStatus(Encounter.EncounterStatus.INPROGRESS);
        Period period = new Period();
        period.setEnd(visitDetails.getClosedDate());
        period.setStart(visitDetails.getVisitDate());
        Reference patientReference  = new Reference();
        patientReference.setType("Patient");
        patientReference.setReference("Patient/" + patient.getIdElement().getIdPart());
        encounter.setSubject(patientReference);
        encounter.setPeriod(period);
        MethodOutcome encounterOutcome = fhirClient.update().resource(encounter).execute();
        String encounterId = encounterOutcome.getId().getIdPart();

        // TODO: Add all logics to handle processing shared health record
        response.put("enounter", encounterId);
        return response;
    }

    public CodeableConcept createCodeableConceptPayload(String code) {
        CodeableConcept codeableConcept = new CodeableConcept();
        List<Coding> codings = new ArrayList<>();
        Coding coding = new Coding();
        coding.setCode(code);
        codings.add(coding);
        codeableConcept.setCoding(codings);
        return codeableConcept;
    }
}
