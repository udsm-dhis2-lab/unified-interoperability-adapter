package com.Adapter.icare.SharedHealthRecords.Services;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.model.primitive.IdDt;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.api.SortOrderEnum;
import ca.uhn.fhir.rest.api.SortSpec;
import ca.uhn.fhir.rest.api.SummaryEnum;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    public Map<String, Object> getSharedRecordsWithPagination(
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
        Bundle clientTotalBundle = searchRecords
                .summaryMode(SummaryEnum.COUNT)
                .returnBundle(Bundle.class)
                .execute();
        if (!response.hasEntry()) {
            searchRecords =  fhirClient.search().forResource(Patient.class);
            if (identifier != null) {
                searchRecords.where(Patient.RES_ID.exactly().code(identifier));
            }

            if (firstName != null) {
                searchRecords.where(Patient.GIVEN.matches().value(firstName));
            }

            response = searchRecords.count(pageSize)
                    .offset(page -1)
                    .returnBundle(Bundle.class)
                    .execute();
        }

        if (!response.getEntry().isEmpty()) {
            for (Bundle.BundleEntryComponent entry : response.getEntry()) {
                if (entry.getResource() instanceof Patient) {
                    SharedHealthRecordsDTO templateData = new SharedHealthRecordsDTO();
                    Patient patient = (Patient) entry.getResource();
                    try {
                        PatientDTO patientDTO = this.clientRegistryService.mapToPatientDTO(patient);
                        // TODO: Provided HFR code is provided find a way to return relevant identifiers
                        templateData.setDemographicDetails(patientDTO.toMap());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    templateData.setPaymentDetails(this.getPaymentDetailsViaCoverage(patient));
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
                    templateData.setFacilityDetails(organization != null ?
                            new OrganizationDTO(
                                    organization.getId(),
                                    organization.getIdentifier(),
                                    organization.getName(),
                                    organization.getActive()).toSummary(): null);

                    // TODO: Add logic to handle number of visits. Latest visit is primary and the rest is history
                    Encounter encounter = getLatestEncounterUsingPatientAndOrganisation(patient.getIdElement().getIdPart(), organization);
                    VisitDetailsDTO visitDetails = new VisitDetailsDTO();
                    if (encounter != null) {
                        visitDetails.setId(encounter.getIdElement().getIdPart());
                        visitDetails.setVisitDate(encounter.getPeriod() != null && encounter.getPeriod().getStart() != null ?  encounter.getPeriod().getStart(): null);
                        visitDetails.setClosedDate(encounter.getPeriod() != null && encounter.getPeriod().getEnd() != null ? encounter.getPeriod().getEnd(): null);
                        // TODO: Find a way to retrieve these from resource
                        visitDetails.setNewThisYear(Boolean.FALSE);
                        visitDetails.setNew(Boolean.FALSE);
                        templateData.setVisitDetails(visitDetails);

                        // Get clinicalInformation
                        // 1. clinicalInformation - vital signs
                        ClinicalInformationDTO clinicalInformationDTO = new ClinicalInformationDTO();
                        List<Map<String,Object>> vitalSigns =  new ArrayList<>();
                        // Get Observation Group
                        System.out.println(encounter.getIdElement().getIdPart());
                        List<Observation> observationGroups = getObservationsByCategory("vital-signs", encounter, true);
                        System.out.println(observationGroups.size());
                        for(Observation observationGroup: observationGroups) {
                            // Get observations mapped to this group
                            System.out.println(observationGroup.getIdElement().getIdPart());
                            List<Observation> observationsData = getObservationsByObservationGroupId(
                                    "vital-signs",
                                    encounter,
                                    observationGroup.getIdElement().getIdPart());
                            System.out.println(observationsData.size());
                        }

                        // Visit notes
                        List<String> visitNotes = new ArrayList<>();

                        Map<String,Object> clinicalInformationDetails = new HashMap<>();
                        clinicalInformationDetails.put("vitalSigns", vitalSigns);
                        clinicalInformationDetails.put("visitNotes", visitNotes);
                        clinicalInformationDTO.setClinicalInformation(clinicalInformationDetails);
                        templateData.setClinicalInformation(clinicalInformationDTO);

                        // TODO: Add history when numberOfVisits > 1
                    } else if (organization != null) {
                        // TODO: Request visit from facility provided
                        Mediator facilityConnectionDetails = this.mediatorsService.getMediatorByCode(hfrCode);
                        Map<String,Object> emrHealthRecords = mediatorsService.routeToMediator(facilityConnectionDetails, "emrHealthRecords?id=" + identifier + "&idType=" + identifierType,"GET", null);
                        List<Map<String,Object>> visits = (List<Map<String, Object>>) emrHealthRecords.get("results");
                        System.out.println(visits.size());
                        visitDetails = null;
                    } else {
                        visitDetails = null;
                    }
                    sharedRecords.add(templateData.toMap());
                }
            }
        }
        Map<String,Object> sharedRecordsResponse = new HashMap<>();
        sharedRecordsResponse.put("results", sharedRecords);
        Map<String, Object> pager = new HashMap<>();
        pager.put("total", clientTotalBundle.getTotal());
        pager.put("totalPages", null);
        pager.put("page", page);
        pager.put("pageSize", pageSize);
        sharedRecordsResponse.put("pager",pager);
        return sharedRecordsResponse;
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

    public Map<String,Object> processSharedRecords(SharedHealthRecordsDTO sharedRecordPayload,
                                                   Map<String,Object> mandatoryClientRegistryIdTypes) throws Exception {
        try {
            Map<String,Object> response = new HashMap<>();
            DemographicDetailsDTO demographicDetails = sharedRecordPayload.getDemographicDetails();
            FacilityDetailsDTO facilityDetails = sharedRecordPayload.getFacilityDetails();
            VisitDetailsDTO visitDetails = sharedRecordPayload.getVisitDetails();
            String mrn = sharedRecordPayload.getMrn();
            // Check if patient exists
            Patient patient = new Patient();

            List<IdentifierDTO> identifiers = demographicDetails != null ? demographicDetails.getIdentifiers(): null;
            String defaultIdentifierType = this.clientRegistryConstants.DefaultIdentifierType;
            // TODO: Find a way to use default identifier type to get client
            if (identifiers != null && !identifiers.isEmpty()) {
                for (IdentifierDTO identifier: identifiers) {
                    patient = this.clientRegistryService.getPatientUsingIdentifier(identifier.getId());
                    if (patient != null) {
                        break;
                    }
                }
            } else if (mrn != null) {
                patient = this.clientRegistryService.getPatientUsingIdentifier(mrn);
                if (patient == null) {
                    throw new Exception("Client with MRN " + mrn + " does not exists and MRN is not enough to register the client on CR. Please provide demographic details");
                }
            }

            if (patient == null) {
                // 1. Check if mandatory IDs are found to register the client
                if (mandatoryClientRegistryIdTypes == null) {
                    throw new Exception("Mandatory Identifier types have not been set. Contact ICT team");
                }
                //2. Create patient
                Patient patientToCreate = new Patient();
                patientToCreate.setActive(Boolean.TRUE);
                List<Identifier> identifiersList = new ArrayList<>();

                for (IdentifierDTO identifierDTO: identifiers) {
                    Identifier identifier = new Identifier();
                    Reference reference = new Reference();
                    identifier.setAssigner(reference);
                    CodeableConcept type = createCodeableConceptPayload(identifierDTO.getType());
                    identifier.setType(type);
                    identifiersList.add(identifier);
                }
                patientToCreate.setIdentifier(identifiersList);
                Organization organization = new Organization();
                organization.setName(facilityDetails.getName());
                patientToCreate.setManagingOrganization(null);
                MethodOutcome patientOutcome = fhirClient.create().resource(patientToCreate).execute();
                patient = (Patient) patientOutcome.getResource();
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
            Reference serviceProviderReference = new Reference();
            serviceProviderReference.setType("Organization");
            serviceProviderReference.setReference("Organization/" + facilityDetails.getCode());
            encounter.setServiceProvider(serviceProviderReference);
            String encounterId = encounterOutcome.getId().getIdPart();

            // TODO: Add all logics to handle processing shared health record
            Map<String,Object> visitData = new HashMap<>();
            visitData.put("id", encounterId);
            response.put("visit", visitData);
            Map<String,Object> patientObj = new HashMap<>();
            patientObj.put("id", patient.getId());
            response.put("patient",patientObj);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
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

    public List<PaymentDetailsDTO> getPaymentDetailsViaCoverage(Patient patient) throws Exception {
        try {
            List<PaymentDetailsDTO> paymentDetailsList = new ArrayList<>();
            var coverageSearch = fhirClient.search().forResource(Coverage.class);
            coverageSearch.where(Coverage.BENEFICIARY.hasAnyOfIds(patient.getIdElement().getIdPart()));
            Bundle coverageBundle = coverageSearch
                    .returnBundle(Bundle.class)
                    .execute();

            if (!coverageBundle.getEntry().isEmpty()) {
                for (Bundle.BundleEntryComponent entry : coverageBundle.getEntry()) {
                    if (entry.getResource() instanceof Coverage) {
                        Coverage coverage = (Coverage) entry.getResource();
                        PaymentDetailsDTO paymentDetails = new PaymentDetailsDTO();
                        paymentDetails.setStatus(coverage.getStatus().getDisplay());
                        paymentDetails.setInsuranceId(coverage.getId());
                        paymentDetailsList.add(paymentDetails);
                    }
                }
            }
            return paymentDetailsList;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return List.of();
    }

    public List<Observation> getObservationsByCategory(String category,
                                                       Encounter encounter,
                                                       boolean forGroup) throws Exception {
        List<Observation> observations = new ArrayList<>();
        var observationSearch = fhirClient.search().forResource(Observation.class)
                .where(Observation.ENCOUNTER.hasAnyOfIds(encounter.getIdElement().getIdPart()));
        observationSearch.where(Observation.CATEGORY.exactly().code(category));
        Bundle observationBundle = new Bundle();
        observationBundle = observationSearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent: observationBundle.getEntry()) {
                Observation observationGroup = (Observation) entryComponent.getResource();
                if (forGroup && !observationGroup.hasDerivedFrom() && !observationGroup.hasHasMember()) {
                    observations.add(observationGroup);
                }
            }
        }

        return observations;
    }

    public List<Observation> getObservationsByObservationGroupId(String category,
                                                               Encounter encounter,
                                                               String id) throws Exception {
        List<Observation> observations = new ArrayList<>();
        System.out.println(id);
        var observationSearch = fhirClient.search().forResource(Observation.class)
                .where(Observation.ENCOUNTER.hasAnyOfIds(encounter.getIdElement().getIdPart()));
        observationSearch.where(Observation.CATEGORY.exactly().code(category));
        observationSearch.where(Observation.HAS_MEMBER.hasId(id));
        Bundle observationBundle = new Bundle();
        observationBundle = observationSearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent: observationBundle.getEntry()) {
                Observation observation = (Observation) entryComponent.getResource();
                observations.add(observation);
            }
        }

        return observations;
    }
}
