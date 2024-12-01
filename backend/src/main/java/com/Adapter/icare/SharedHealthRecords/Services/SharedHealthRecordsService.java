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
import com.google.common.collect.Iterables;

import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r4.model.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.security.auth.Subject;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

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

    public SharedHealthRecordsService(FHIRConstants fhirConstants, UserService userService, ClientRegistryService clientRegistryService, MediatorsService mediatorsService, ClientRegistryConstants clientRegistryConstants) {
        this.fhirConstants = fhirConstants;
        this.userService = userService;
        this.clientRegistryService = clientRegistryService;
        this.mediatorsService = mediatorsService;
        this.clientRegistryConstants = clientRegistryConstants;
        FhirContext fhirContext = FhirContext.forR4();
        this.fhirClient = fhirContext.newRestfulGenericClient(fhirConstants.FHIRServerUrl);
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService.getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
    }

    public Map<String, Object> getSharedRecordsWithPagination(Integer page, Integer pageSize, String identifier, String identifierType, String referralNumber, boolean onlyLinkedClients, String gender, String firstName, String middleName, String lastName, String hfrCode, Date dateOfBirth, boolean includeDeceased, Integer numberOfVisits) throws Exception {
        List<Map<String, Object>> sharedRecords = new ArrayList<>();
        Bundle response = new Bundle();
        Bundle clientTotalBundle = new Bundle();
        List<Encounter> encounters = new ArrayList<>();
        var searchRecords = fhirClient.search().forResource(Patient.class);
        try {
            if (referralNumber == null) {
                if (onlyLinkedClients) {
                    // TODO replace hardcoded ids with dynamic ones
                    searchRecords.where(Patient.LINK.hasAnyOfIds("299", "152"));
                }

                // TODO: Review the deceased concept
                if (!includeDeceased) {
//            searchRecords.where(Patient.DECEASED.isMissing(true));
                }
//                .where(new StringClientParam("linkType").matchesExactly().value("replaces"));
                if (identifier != null) {
                    searchRecords.where(Patient.IDENTIFIER.exactly().identifier(identifier));
                }

                if (hfrCode != null) {
                    searchRecords.where(Patient.IDENTIFIER.hasSystemWithAnyCode(hfrCode));
                }

                if (gender != null) {
                    searchRecords.where(Patient.GENDER.exactly().code(gender.toLowerCase()));
                }

                if (lastName != null) {
                    searchRecords.where(Patient.FAMILY.matches().value(lastName));
                }

                if (firstName != null) {
                    searchRecords.where(Patient.GIVEN.matches().value(firstName));
                }

                if (dateOfBirth != null) {
                    searchRecords.where(Patient.BIRTHDATE.beforeOrEquals().day(dateOfBirth));
                }

                response = searchRecords.count(pageSize).offset(page - 1).returnBundle(Bundle.class).execute();
                clientTotalBundle = searchRecords.summaryMode(SummaryEnum.COUNT).returnBundle(Bundle.class).execute();

            } else {
                // referralNumber should be saved as identifier of the encounter. Since it is concatenated with HFRcode then the search criteria should consider concatenating the two
                if (hfrCode == null) {
                    throw new Exception("HFR code is mandatory when searching using referral number (referralNumber) param");
                }
                var encSearch = fhirClient.search().forResource(Encounter.class).where(Encounter.IDENTIFIER.exactly().identifier(hfrCode + "-" + referralNumber));
                Bundle encBundle = encSearch.sort().descending("_lastUpdated").returnBundle(Bundle.class).execute();
                if (encBundle.hasEntry()) {
                    for (Bundle.BundleEntryComponent entry : response.getEntry()) {
                        if (entry.getResource() instanceof Encounter) {
                            // Assumption is the referral with the id will be one
                            encounters.add((Encounter) entry.getResource());
                            IIdType patientReference = encounters.get(0).getSubject().getReferenceElement();
                            Patient patient = fhirClient.read().resource(Patient.class).withId(patientReference.getIdPart()).execute();
                            response = fhirClient.search().forResource(Patient.class).where(Patient.IDENTIFIER.exactly().identifier(patient.getIdElement().getIdPart())).returnBundle(Bundle.class).execute();
                        }
                    }
                }
            }

            if (!response.hasEntry()) {
                searchRecords = fhirClient.search().forResource(Patient.class);
                if (identifier != null) {
                    searchRecords.where(Patient.RES_ID.exactly().code(identifier));
                }

                if (firstName != null) {
                    searchRecords.where(Patient.GIVEN.matches().value(firstName));
                }

                response = searchRecords.count(pageSize).offset(page - 1).returnBundle(Bundle.class).execute();
            }

            if (!response.getEntry().isEmpty()) {
                for (Bundle.BundleEntryComponent entry : response.getEntry()) {
                    if (entry.getResource() instanceof Patient) {
                        Patient patient = (Patient) entry.getResource();
                        Organization organization = null;
                        if (hfrCode != null) {
                            try {
                                Bundle bundle = new Bundle();
                                bundle = fhirClient.search().forResource(Organization.class).where(Organization.IDENTIFIER.exactly().identifier(hfrCode)).returnBundle(Bundle.class).execute();
                                for (Bundle.BundleEntryComponent bundleEntryComponent : bundle.getEntry()) {
                                    if (bundleEntryComponent.getResource() instanceof Organization) {
                                        organization = (Organization) bundleEntryComponent.getResource();
                                    }
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }

                        // TODO: Add logic to handle number of visits. Latest visit is primary and the rest is history
                        if (referralNumber == null) {
                            encounters = getLatestEncounterUsingPatientAndOrganisation(patient.getIdElement().getIdPart(), organization, numberOfVisits);
                        }
                        if (!encounters.isEmpty()) {
                            for (Encounter encounter : encounters) {
                                SharedHealthRecordsDTO templateData = new SharedHealthRecordsDTO();
                                // Get encounter organisation

                                // if organisation is null then do this
                                IIdType organisationReference = encounter.getServiceProvider().getReferenceElement();
                                organization = fhirClient.read().resource(Organization.class).withId(organisationReference.getIdPart()).execute();
                                PatientDTO patientDTO = this.clientRegistryService.mapToPatientDTO(patient);
                                List<Coverage> coverages = this.clientRegistryService.getCoverages(patient.getIdElement().getIdPart());
                                List<PaymentDetailsDTO> paymentDetailsDTOs = new ArrayList<>();
                                if (coverages.size() > 0) {
                                    paymentDetailsDTOs = coverages.stream().map(coverage -> this.clientRegistryService.mapToPaymentDetails(coverage)).collect(Collectors.toList());
                                }
                                patientDTO.setPaymentDetails(paymentDetailsDTOs);
                                String mrn = patientDTO.getMRN(organization.getIdElement().getIdPart());
                                templateData.setMrn(mrn);
                                String orgCode = organization != null ? organization.getIdElement().getIdPart() : null;
                                templateData.setDemographicDetails(patientDTO.toMap());
                                templateData.setPaymentDetails(this.getPaymentDetailsViaCoverage(patient));
                                templateData.setFacilityDetails(organization != null ? new OrganizationDTO(organization.getId(), organization.getIdentifier(), organization.getName(), organization.getActive()).toSummary() : null);
                                VisitDetailsDTO visitDetails = new VisitDetailsDTO();
                                visitDetails.setId(encounter.getIdElement().getIdPart());
                                visitDetails.setVisitDate(encounter.getPeriod() != null && encounter.getPeriod().getStart() != null ? encounter.getPeriod().getStart() : null);
                                visitDetails.setClosedDate(encounter.getPeriod() != null && encounter.getPeriod().getEnd() != null ? encounter.getPeriod().getEnd() : null);
                                // TODO: Find a way to retrieve these from resource
                                visitDetails.setNewThisYear(Boolean.FALSE);
                                visitDetails.setNew(Boolean.FALSE);
                                templateData.setVisitDetails(visitDetails);


                                // Get clinicalInformation
                                // 1. clinicalInformation - vital signs
                                ClinicalInformationDTO clinicalInformationDTO = new ClinicalInformationDTO();
                                List<Map<String, Object>> vitalSigns = new ArrayList<>();
                                // Get Observation Group
//                        System.out.println(encounter.getIdElement().getIdPart());
                                List<Observation> observationGroups = getObservationsByCategory("vital-signs", encounter, true);
//                        System.out.println(observationGroups.size());
                                for (Observation observationGroup : observationGroups) {
                                    List<Observation> observationsData = getObservationsByObservationGroupId("vital-signs", encounter, observationGroup.getIdElement().getIdPart());
                                    if (!observationsData.isEmpty()) {
                                        Map<String, Object> vitalSign = new LinkedHashMap<>();
                                        for (Observation observation : observationsData) {
                                            // TODO: Improve the code to use dynamically fetched LOINC codes for vital signs
                                            if (observation.hasCode() && observation.getCode().getCoding().get(0).getCode().equals("85354-9")) {
                                                vitalSign.put("bloodPressure", observation.hasValueStringType() ? observation.getValueStringType().getValue() : null);
                                            }
                                            if (observation.getCode().getCoding().get(0).getCode().equals("29463-7")) {
                                                vitalSign.put("weight", observation.hasValueQuantity() ? observation.getValueQuantity().getValue() : null);
                                            }
                                            if (observation.getCode().getCoding().get(0).getCode().equals("8310-5")) {
                                                vitalSign.put("temperature", observation.hasValueQuantity() ? observation.getValueQuantity().getValue() : null);
                                            }
                                            if (observation.getCode().getCoding().get(0).getCode().equals("8302-2")) {
                                                vitalSign.put("height", observation.hasValueQuantity() ? observation.getValueQuantity().getValue() : null);
                                            }
                                            if (observation.getCode().getCoding().get(0).getCode().equals("9279-1")) {
                                                vitalSign.put("respiration", observation.hasValueQuantity() ? observation.getValueQuantity().getValue() : null);
                                            }
                                            if (observation.getCode().getCoding().get(0).getCode().equals("8867-4")) {
                                                vitalSign.put("pulseRate", observation.hasValueQuantity() ? observation.getValueQuantity().getValue() : null);
                                            }
                                            vitalSign.put("dateTime", observationGroup.hasEffectiveDateTimeType() ? observationGroup.getEffectiveDateTimeType().getValueAsString() : null);
                                        }
                                        vitalSigns.add(vitalSign);
                                    }
                                }

                                List<Map<String, Object>> visitNotes = new ArrayList<>();
                                List<Observation> visitNotesGroup = getObservationsByCategory("visit-notes", encounter, true);
                                // Visit notes
                                if (!visitNotesGroup.isEmpty()) {
                                    for (Observation observationGroup : visitNotesGroup) {
                                        // TODO: Extract for all other blocks
                                        Map<String, Object> visitNotesData = new LinkedHashMap<>();
                                        visitNotesData.put("date", observationGroup.hasEffectiveDateTimeType() ? observationGroup.getEffectiveDateTimeType().getValueAsString() : null);
                                        // Chief complaints
                                        List<String> chiefComplaints = new ArrayList<>();
                                        List<Observation> chiefComplaintsData = getObservationsByObservationGroupId("chief-complaint", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!chiefComplaintsData.isEmpty()) {
                                            for (Observation observation : chiefComplaintsData) {
                                                chiefComplaints.add(observation.hasValueStringType() ? observation.getValueStringType().toString() : null);
                                            }
                                        }
                                        visitNotesData.put("chiefComplaints", chiefComplaints);
                                        // historyOfPresentIllness
                                        List<String> historyOfPresentIllness = new ArrayList<>();
                                        List<Observation> historyOfPresentIllnessData = getObservationsByObservationGroupId("history-of-preventive-illness", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!historyOfPresentIllnessData.isEmpty()) {
                                            for (Observation observation : historyOfPresentIllnessData) {
                                                historyOfPresentIllness.add(observation.hasValueStringType() ? observation.getValueStringType().toString() : null);
                                            }
                                        }
                                        visitNotesData.put("historyOfPresentIllness", historyOfPresentIllness);

                                        // reviewOfOtherSystems - review-of-other-system
                                        List<Map<String, Object>> reviewOfOtherSystems = new ArrayList<>();
                                        List<Observation> reviewOfOtherSystemsData = getObservationsByObservationGroupId("review-of-other-system", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!reviewOfOtherSystemsData.isEmpty()) {
                                            for (Observation observation : reviewOfOtherSystemsData) {
                                                Map<String, Object> data = new LinkedHashMap<>();
                                                data.put("code", observation.hasCode() ? observation.getCode().getCoding().get(0).getCode().toString() : null);
                                                data.put("name", observation.hasCode() ? observation.getCode().getCoding().get(0).getDisplay() : null);
                                                data.put("notes", observation.getValueStringType().toString());
                                                reviewOfOtherSystems.add(data);
                                            }
                                        }
                                        visitNotesData.put("reviewOfOtherSystems", reviewOfOtherSystems);

                                        // pastMedicalHistory - past-medical-history
                                        List<String> pastMedicalHistory = new ArrayList<>();
                                        List<Observation> pastMedicalHistoryData = getObservationsByObservationGroupId("past-medical-history", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!pastMedicalHistoryData.isEmpty()) {
                                            for (Observation observation : pastMedicalHistoryData) {
                                                pastMedicalHistory.add(observation.hasValueStringType() ? observation.getValueStringType().toString() : null);
                                            }
                                        }
                                        visitNotesData.put("pastMedicalHistory", pastMedicalHistory);

                                        // familyAndSocialHistory - family-and-social-history
                                        List<String> familyAndSocialHistory = new ArrayList<>();
                                        List<Observation> familyAndSocialHistoryData = getObservationsByObservationGroupId("family-and-social-history", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!familyAndSocialHistoryData.isEmpty()) {
                                            for (Observation observation : familyAndSocialHistoryData) {
                                                familyAndSocialHistory.add(observation.hasValueStringType() ? observation.getValueStringType().toString() : null);
                                            }
                                        }
                                        visitNotesData.put("familyAndSocialHistory", familyAndSocialHistory);

                                        // generalExaminationObservation - general-examination
                                        List<String> generalExaminationObservation = new ArrayList<>();
                                        List<Observation> generalExaminationObservationData = getObservationsByObservationGroupId("general-examination", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!generalExaminationObservationData.isEmpty()) {
                                            for (Observation observation : generalExaminationObservationData) {
                                                generalExaminationObservation.add(observation.hasValueStringType() ? observation.getValueStringType().toString() : null);
                                            }
                                        }
                                        visitNotesData.put("generalExaminationObservation", generalExaminationObservation);

                                        // localExamination - local-examination
                                        List<String> localExamination = new ArrayList<>();
                                        List<Observation> localExaminationData = getObservationsByObservationGroupId("local-examination", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!localExaminationData.isEmpty()) {
                                            for (Observation observation : localExaminationData) {
                                                localExamination.add(observation.hasValueStringType() ? observation.getValueStringType().toString() : null);
                                            }
                                        }
                                        visitNotesData.put("localExamination", localExamination);

                                        //systemicExaminationObservation - systemic-examination
                                        List<Map<String, Object>> systemicExaminationObservation = new ArrayList<>();
                                        List<Observation> systemicExaminationObservationData = getObservationsByObservationGroupId("systemic-examination", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!systemicExaminationObservationData.isEmpty()) {
                                            for (Observation observation : systemicExaminationObservationData) {
                                                Map<String, Object> data = new LinkedHashMap<>();
                                                data.put("code", observation.hasCode() ? observation.getCode().getCoding().get(0).getCode().toString() : null);
                                                data.put("name", observation.hasCode() ? observation.getCode().getCoding().get(0).getDisplay() : null);
                                                data.put("notes", observation.getValueStringType().toString());
                                                systemicExaminationObservation.add(data);
                                            }
                                        }
                                        visitNotesData.put("systemicExaminationObservation", systemicExaminationObservation);

                                        // doctorPlanOrSuggestion - doctor-plan
                                        List<String> doctorPlanOrSuggestion = new ArrayList<>();
                                        List<Observation> doctorPlanOrSuggestionData = getObservationsByObservationGroupId("doctor-plan", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!doctorPlanOrSuggestionData.isEmpty()) {
                                            for (Observation observation : doctorPlanOrSuggestionData) {
                                                doctorPlanOrSuggestion.add(observation.hasValueStringType() ? observation.getValueStringType().toString() : null);
                                            }
                                        }
                                        visitNotesData.put("doctorPlanOrSuggestion", doctorPlanOrSuggestion);

                                        // providerSpeciality - provider-speciality
                                        String providerSpeciality = null;
                                        List<Observation> providerSpecialityData = getObservationsByObservationGroupId("provider-speciality", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!providerSpecialityData.isEmpty()) {
                                            for (Observation observation : providerSpecialityData) {
                                                if (observation.hasValueStringType()) {
                                                    providerSpeciality = observation.getValueStringType().toString();
                                                    break;
                                                }
                                            }
                                        }
                                        visitNotesData.put("providerSpeciality", providerSpeciality);
                                        visitNotes.add(visitNotesData);
                                    }
                                }

                                clinicalInformationDTO.setVitalSigns(vitalSigns);
                                clinicalInformationDTO.setVisitNotes(visitNotes);
                                templateData.setClinicalInformation(clinicalInformationDTO);


                                // Allergies
                                List<AllergyIntolerance> allergyIntolerances = getAllergyTolerances(patient.getIdElement().getIdPart());
                                List<AllergiesDTO> allergiesDTOS = new ArrayList<>();
                                if (!allergyIntolerances.isEmpty()) {
                                    for (AllergyIntolerance allergyIntolerance : allergyIntolerances) {
                                        if (allergyIntolerance.hasCode()) {
                                            AllergiesDTO allergiesDTO = new AllergiesDTO();
                                            allergiesDTO.setCode(allergyIntolerance.hasCode() && allergyIntolerance.getCode().hasCoding() && !allergyIntolerance.getCode().getCoding().isEmpty() ? allergyIntolerance.getCode().getCoding().get(0).getCode().toString() : null);
                                            allergiesDTO.setCategory(allergyIntolerance.hasCategory() && !allergyIntolerance.getCategory().isEmpty() ? allergyIntolerance.getCategory().get(0).getCode() : null);
                                            allergiesDTO.setName(allergyIntolerance.hasCode() && allergyIntolerance.getCode().hasCoding() && !allergyIntolerance.getCode().getCoding().isEmpty() ? allergyIntolerance.getCode().getCoding().get(0).getDisplay() : null);
                                            allergiesDTO.setCriticality(allergyIntolerance.hasCriticality() ? allergyIntolerance.getCriticality().getDisplay().toString() : null);
                                            allergiesDTO.setVerificationStatus(allergyIntolerance.hasVerificationStatus() && allergyIntolerance.getVerificationStatus().hasCoding() ? allergyIntolerance.getVerificationStatus().getCoding().get(0).getCode().toString() : null);
                                            allergiesDTOS.add(allergiesDTO);
                                        }
                                    }
                                }

                                // Chronic conditions
                                List<ChronicConditionsDTO> chronicConditionsDTOS = new ArrayList<>();
                                List<Condition> conditions = getConditionsByCategory(encounter.getIdElement().getIdPart(), "chronic-condition");
                                if (!conditions.isEmpty()) {
                                    for (Condition condition : conditions) {
                                        ChronicConditionsDTO chronicConditionsDTO = new ChronicConditionsDTO();
                                        chronicConditionsDTO.setCode(condition.hasCode() && condition.getCode().hasCoding() && !condition.getCode().getCoding().isEmpty() ? condition.getCode().getCoding().get(0).getCode().toString() : null);
                                        chronicConditionsDTO.setName(condition.hasCategory() && !condition.getCategory().isEmpty() ? condition.getCategory().get(0).getCoding().get(0).getCode() : null);
                                        chronicConditionsDTO.setName(condition.hasCode() && condition.getCode().hasCoding() && !condition.getCode().getCoding().isEmpty() ? condition.getCode().getCoding().get(0).getDisplay().toString() : null);
                                        chronicConditionsDTO.setCriticality(condition.getClinicalStatus().getCoding().get(0).getCode());
                                        chronicConditionsDTO.setVerificationStatus(condition.hasVerificationStatus() ? condition.getVerificationStatus().getCoding().get(0).getCode() : null);
                                        chronicConditionsDTOS.add(chronicConditionsDTO);
                                    }
                                }
                                templateData.setChronicConditions(chronicConditionsDTOS);

                                LifeStyleInformationDTO lifeStyleInformationDTO = new LifeStyleInformationDTO();
                                List<Observation> smokingObs = getObservationsByCategory("smoking", encounter, true);
                                Map<String, Object> smoking = new LinkedHashMap<>();
                                if (!smokingObs.isEmpty()) {
                                    for (Observation observation : smokingObs) {
                                        if (observation.hasValue() && observation.hasValueBooleanType()) {
                                            smoking.put("use", observation.getValueBooleanType().booleanValue());
                                            smoking.put("notes", observation.getNote().stream().map(note -> note.getText()).collect(Collectors.joining(", ")));
                                            break;
                                        }
                                    }
                                }
                                lifeStyleInformationDTO.setSmoking(smoking);

                                List<Observation> alcoholUseObs = getObservationsByCategory("alcohol-use", encounter, true);
                                Map<String, Object> alcoholUse = new LinkedHashMap<>();
                                if (!alcoholUseObs.isEmpty()) {
                                    for (Observation observation : alcoholUseObs) {
                                        if (observation.hasValue() && observation.hasValueBooleanType()) {
                                            alcoholUse.put("use", observation.getValueBooleanType().booleanValue());
                                            alcoholUse.put("notes", observation.getNote().stream().map(note -> note.getText()).collect(Collectors.joining(", ")));
                                            break;
                                        }
                                    }
                                }
                                lifeStyleInformationDTO.setAlcoholUse(alcoholUse);

                                List<Observation> drugUseObs = getObservationsByCategory("drug-use", encounter, true);
                                Map<String, Object> drugUse = new LinkedHashMap<>();
                                if (!drugUseObs.isEmpty()) {
                                    for (Observation observation : drugUseObs) {
                                        if (observation.hasValue() && observation.hasValueBooleanType()) {
                                            drugUse.put("use", observation.getValueBooleanType().booleanValue());
                                            drugUse.put("notes", observation.getNote().stream().map(note -> note.getText()).collect(Collectors.joining(", ")));
                                            break;
                                        }
                                    }
                                }
                                lifeStyleInformationDTO.setDrugUse(drugUse);
                                templateData.setLifeStyleInformation(lifeStyleInformationDTO);

                                // Diagnosis details
                                List<DiagnosisDetailsDTO> diagnosisDetailsDTOS = new ArrayList<>();

                                List<Condition> conditionsList = getConditionsByCategory(encounter.getIdElement().getIdPart(), "encounter-diagnosis");
                                if (!conditionsList.isEmpty()) {
                                    for (Condition condition : conditionsList) {
                                        DiagnosisDetailsDTO diagnosisDetailsDTO = new DiagnosisDetailsDTO();
                                        diagnosisDetailsDTO.setDiagnosisCode(condition.hasCode() ? condition.getCode().getCoding().get(0).getCode().toString() : null);
                                        diagnosisDetailsDTO.setDiagnosis(condition.hasCode() ? condition.getCode().getCoding().get(0).getDisplay() : null);
                                        diagnosisDetailsDTO.setDiagnosisDate(condition.hasOnsetDateTimeType() ? condition.getOnsetDateTimeType().getValue() : null);
                                        diagnosisDetailsDTO.setDiagnosisDescription(condition.hasCode() ? condition.getCode().getText().toString() : null);
                                        diagnosisDetailsDTO.setCertainty(condition.hasVerificationStatus() ? condition.getVerificationStatus().getCoding().get(0).getCode() : null);
                                        diagnosisDetailsDTOS.add(diagnosisDetailsDTO);
                                    }
                                }
                                templateData.setDiagnosisDetails(diagnosisDetailsDTOS);

                                templateData.setAllergies(allergiesDTOS);

                                // Investigation details
                                List<InvestigationDetailsDTO> investigationDetailsDTOList = new ArrayList<>();
                                List<Observation> investigationDetailsGroup = getObservationsByCategory("investigation-details", encounter, true);
                                // Visit notes
                                if (!investigationDetailsGroup.isEmpty()) {
                                    for (Observation observationGroup : investigationDetailsGroup) {
                                        InvestigationDetailsDTO investigationDetailsDTO = new InvestigationDetailsDTO();
                                        List<Observation> caseClassificationData = getObservationsByObservationGroupId("case-classification", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!caseClassificationData.isEmpty()) {
                                            for (Observation observation : caseClassificationData) {
                                                if (observation.hasValueStringType()) {
                                                    investigationDetailsDTO.setCaseClassification(observation.getValueStringType().toString());
                                                    break;
                                                }
                                            }
                                        }
                                        investigationDetailsDTO.setDateOccurred(observationGroup.hasEffectiveDateTimeType() ? observationGroup.getEffectiveDateTimeType().getValue() : null);

                                        List<Observation> daysSinceSymptomsData = getObservationsByObservationGroupId("days-since-symptoms", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!daysSinceSymptomsData.isEmpty()) {
                                            for (Observation observation : daysSinceSymptomsData) {
                                                if (observation.hasValueQuantity()) {
                                                    investigationDetailsDTO.setDaysSinceSymptoms(observation.getValueQuantity().getValue().intValueExact());
                                                    break;
                                                }
                                            }
                                        }

                                        List<Observation> diseaseCodeData = getObservationsByObservationGroupId("disease-code", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!diseaseCodeData.isEmpty()) {
                                            for (Observation observation : diseaseCodeData) {
                                                if (observation.hasValueCodeableConcept()) {
                                                    investigationDetailsDTO.setDiseaseCode(observation.getValueCodeableConcept().getCoding().get(0).getCode());
                                                    break;
                                                }
                                            }
                                        }
                                        List<Observation> labSpecimenTakenData = getObservationsByObservationGroupId("lab-specimen-taken", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!labSpecimenTakenData.isEmpty()) {
                                            for (Observation observation : labSpecimenTakenData) {
                                                if (observation.hasValueStringType()) {
                                                    investigationDetailsDTO.setLabSpecimenTaken(observation.getValueStringType().toString());
                                                    break;
                                                }
                                            }
                                        }
                                        List<Observation> specimenSentToData = getObservationsByObservationGroupId("specimen-sent-to", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!specimenSentToData.isEmpty()) {
                                            for (Observation observation : specimenSentToData) {
                                                if (observation.hasValueStringType()) {
                                                    investigationDetailsDTO.setSpecimenSentTo(observation.getValueStringType().toString());
                                                    break;
                                                }
                                            }
                                        }

                                        List<Observation> vaccinatedData = getObservationsByObservationGroupId("vaccinated", encounter, observationGroup.getIdElement().getIdPart());
                                        if (!vaccinatedData.isEmpty()) {
                                            for (Observation observation : vaccinatedData) {
                                                if (observation.hasValueStringType()) {
                                                    investigationDetailsDTO.setVaccinated(observation.getValueStringType().toString());
                                                    break;
                                                }
                                            }
                                        }
                                        investigationDetailsDTOList.add(investigationDetailsDTO);
                                    }
                                }

                                templateData.setInvestigationDetails(investigationDetailsDTOList);

                                ReferralDetailsDTO referralDetailsDTO = new ReferralDetailsDTO();
                                // 1. get service request
                                // 2. Extract referral details data accordingly
                                List<ServiceRequest> serviceRequests = getServiceRequestsByCategory(encounter.getIdElement().getIdPart(), "referral-request");
                                if (!serviceRequests.isEmpty()) {
                                    for (ServiceRequest serviceRequest : serviceRequests) {
                                        if (serviceRequest.hasIdentifier() && serviceRequest.getIdentifier().get(0).hasType() && serviceRequest.getIdentifier().get(0).getType().hasCoding() && !serviceRequest.getIdentifier().get(0).getType().getCoding().isEmpty() && serviceRequest.getIdentifier().get(0).getType().getCoding().get(0).getCode().equals("REFERRAL-NUMBER")) {
                                            referralDetailsDTO.setReferralDate(serviceRequest.hasAuthoredOn() ? serviceRequest.getAuthoredOn() : null);
                                            referralDetailsDTO.setReferralNumber(serviceRequest.getIdentifier().get(0).hasValue() ? serviceRequest.getIdentifier().get(0).getValue().replace(orgCode + "-", "") : null);
                                            List<String> reasons = new ArrayList<>();
                                            for (Reference reasonReference : serviceRequest.getReasonReference()) {
                                                IIdType observationReference = reasonReference.getReferenceElement();
                                                if (observationReference.getResourceType().equals("Observation")) {
                                                    Observation observation = fhirClient.read().resource(Observation.class).withId(observationReference.getIdPart()).execute();
                                                    reasons.add(observation.getValueStringType().toString());
                                                }
                                            }
                                            referralDetailsDTO.setReason(reasons);

                                            String facilityToCode = new String();
                                            List<Reference> performers = serviceRequest.getPerformer();
                                            for (Reference reference : performers) {
                                                if (reference.hasReferenceElement() && reference.getType().equals("Organization")) {
                                                    IIdType performerReference = reference.getReferenceElement();
                                                    Organization performer = fhirClient.read().resource(Organization.class).withId(performerReference.getIdPart()).execute();
                                                    referralDetailsDTO.setHfrCode(performer.getIdElement().getIdPart());
                                                    break;
                                                }
                                            }

                                            Map<String, Object> referringClinician = new HashMap<>();
                                            Reference practitionerReference = serviceRequest.getRequester();

                                            IIdType practitionerReferenceType = practitionerReference.getReferenceElement();
                                            Practitioner practitioner = fhirClient.read().resource(Practitioner.class).withId(practitionerReferenceType.getIdPart()).execute();
                                            referringClinician.put("MCTCode", practitioner.hasIdentifier() ? practitioner.getIdElement().getIdPart() : null);
                                            referringClinician.put("name", practitioner.hasName() && !practitioner.getName().isEmpty() ? practitioner.getName().get(0).getText() : null);
                                            referringClinician.put("phoneNumber", practitioner.hasTelecom() && !practitioner.getTelecom().isEmpty() && practitioner.getTelecom().get(0).hasValue() ? practitioner.getTelecom().get(0).getValue() : null);
                                            referralDetailsDTO.setReferringClinician(referringClinician);
                                            break;
                                        }
                                    }
                                }
                                List<Identifier> identifiers = encounter.getIdentifier();
                                for (Identifier identifierData : identifiers) {
                                    referralDetailsDTO.setReferralNumber(identifierData.getValue());
                                    break;
                                }
                                templateData.setReferralDetails(referralDetailsDTO);

                                //Medication details
                                List<MedicationDetailsDTO> medicationDetailsDTOS = new ArrayList<>();
                                List<MedicationDispense> medicationDispensesList = getMedicationDispensesById(encounter.getIdElement().getIdPart());
                                if (!medicationDispensesList.isEmpty()) {
                                    for (MedicationDispense medicationDispense : medicationDispensesList) {
                                        MedicationDetailsDTO medicationDetailsDTO = new MedicationDetailsDTO();
                                        medicationDetailsDTO.setCode(medicationDispense.hasMedicationCodeableConcept() ? medicationDispense.getMedicationCodeableConcept().getCoding().get(0).getCode() : null);
                                        medicationDetailsDTO.setName(medicationDispense.hasMedicationCodeableConcept() ? medicationDispense.getMedicationCodeableConcept().getCoding().get(0).getDisplay() : null);
                                        medicationDetailsDTO.setOrderDate(medicationDispense.hasWhenHandedOver() ? medicationDispense.getWhenHandedOver() : null);
                                        String code = medicationDispense.hasMedicationCodeableConcept() ? medicationDispense.getMedicationCodeableConcept().getCoding().get(0).getSystem() : null;
                                        String codeStandard = code.contains("msd") ? "MSD CODE" : code.contains("loinc") ? "LOINC" : null;
                                        medicationDetailsDTO.setCodeStandard(codeStandard);
                                        String duration = "";
                                        if (medicationDispense.getDaysSupply() != null) {
                                            duration = medicationDispense.getDaysSupply().getValue() + " " + medicationDispense.getDaysSupply().getUnit();
                                        }
                                        medicationDetailsDTO.setPeriodOfMedication(duration);
                                        medicationDetailsDTO.setTreatmentType(medicationDispense.hasType() ? medicationDispense.getType().getText() : null);
                                        if (medicationDispense.hasDosageInstruction()) {
                                            Dosage dosage = Iterables.getLast(medicationDispense.getDosageInstruction());
                                            Map<String, Object> dosagePayload = new HashMap<>();
                                            ArrayList<BigDecimal> daysList = new ArrayList<>();
                                            ArrayList<String> schedules = new ArrayList<>();
                                            schedules.add(medicationDispense.hasWhenPrepared() ? medicationDispense.getWhenPrepared().toString() : null);
                                            schedules.add(medicationDispense.hasWhenHandedOver() ? medicationDispense.getWhenHandedOver().toString() : null);
                                            String quantity = "";
                                            if (medicationDispense.hasQuantity()) {
                                                quantity = medicationDispense.getQuantity().getValue() + " " + medicationDispense.getQuantity().getUnit();
                                            }
                                            dosagePayload.put("dose", quantity);
                                            dosagePayload.put("frequency", dosage.hasTiming() ? dosage.getTiming().getRepeat().getFrequency() : null);
                                            dosagePayload.put("route", dosage.hasRoute() ? dosage.getRoute().getCoding().get(0).getDisplay() : null);
                                            dosagePayload.put("instructions", dosage.hasText() ? dosage.getText() : null);
                                            dosagePayload.put("quantity", quantity);
                                            dosagePayload.put("duration", duration);
                                            dosagePayload.put("days", daysList.add(medicationDispense.hasDaysSupply() ? medicationDispense.getDaysSupply().getValue() : null));
                                            dosagePayload.put("schedule", schedules);
                                            dosagePayload.put("dosageDates", schedules);
                                            medicationDetailsDTO.setDosage(dosagePayload);
                                        }
                                        medicationDetailsDTOS.add(medicationDetailsDTO);
                                    }
                                    templateData.setMedicationDetails(medicationDetailsDTOS);
                                }


                                //Radiology details
                                List<RadiologyDetailsDTO> radiologyDetailsDTOS = new ArrayList<>();
                                List<DiagnosticReport> diagnosticReportsList = getDiagnosticReportsByCategory(encounter.getIdElement().getIdPart(), "radiology-category");
                                if (!diagnosticReportsList.isEmpty()) {
                                    for (DiagnosticReport diagnosticReport : diagnosticReportsList) {
                                        RadiologyDetailsDTO radiologyDetailsDTO = new RadiologyDetailsDTO();
                                        radiologyDetailsDTO.setTestDate(diagnosticReport.hasIssued() ? diagnosticReport.getIssued() : null);
                                        radiologyDetailsDTO.setTestTypeName(diagnosticReport.hasCode() ? diagnosticReport.getCode().getCoding().get(0).getDisplay() : null);
                                        radiologyDetailsDTO.setTestTypeCode(diagnosticReport.hasCode() ? diagnosticReport.getCode().getCoding().get(0).getCode() : null);
                                        //TODO: Add testReport and bodySite
                                        String mediaReferenceId = diagnosticReport.hasMedia() ? diagnosticReport.getMedia().get(0).getLink().getReference() : null;
                                        if (mediaReferenceId != null) {
                                            Media media = fhirClient.read().resource(Media.class).withId(mediaReferenceId).execute();
                                            radiologyDetailsDTO.setUrl(media.hasContent() ? media.getContent().getUrl() : null);
                                        }
                                        radiologyDetailsDTOS.add(radiologyDetailsDTO);
                                    }
                                    templateData.setRadiologyDetails(radiologyDetailsDTOS);
                                }


                                //Outcome details
                                List<Observation> outcomeObservations = getObservationsByCategory("outcome-details", encounter, true);
                                if (!outcomeObservations.isEmpty()) {
                                    Observation observation = Iterables.getLast(outcomeObservations);
                                    OutcomeDetailsDTO outcomeDetailsDTO = new OutcomeDetailsDTO();
                                    outcomeDetailsDTO.setAlive(getComponentValueBoolean(observation, 0));
                                    outcomeDetailsDTO.setDeathLocation(getComponentValueString(observation, 1));
                                    outcomeDetailsDTO.setDeathDate(getComponentValueDateTime(observation, 2));
                                    outcomeDetailsDTO.setContactTracing(getComponentValueBoolean(observation, 3));
                                    outcomeDetailsDTO.setInvestigationConducted(getComponentValueBoolean(observation, 4));
                                    outcomeDetailsDTO.setQuarantined(getComponentValueBoolean(observation, 5));
                                    outcomeDetailsDTO.setReferred(getComponentValueBoolean(observation, 6));
                                    templateData.setOutcomeDetails(outcomeDetailsDTO);
                                }


                                //Cause of death details
                                List<Observation> causeOfDeathObservations = getObservationsByCategory("cause-of-death", encounter, true);
                                if (!causeOfDeathObservations.isEmpty()) {
                                    //TODO: Discuss about the resource to be used here
                                    Observation observation = Iterables.getLast(causeOfDeathObservations);
                                    CausesOfDeathDetailsDTO causesOfDeathDetailsDTO = new CausesOfDeathDetailsDTO();
                                    causesOfDeathDetailsDTO.setDateOfDeath(observation.hasEffectiveDateTimeType() ? observation.getEffectiveDateTimeType().getValue() : null);
                                    causesOfDeathDetailsDTO.setLineA(observation.hasComponent() ? observation.getComponent().get(0).getValueStringType().toString() : null);
                                    causesOfDeathDetailsDTO.setLineB(observation.hasComponent() ? observation.getComponent().get(1).getValueStringType().toString() : null);
                                    causesOfDeathDetailsDTO.setLineC(observation.hasComponent() ? observation.getComponent().get(2).getValueStringType().toString() : null);
                                    causesOfDeathDetailsDTO.setLineD(observation.hasComponent() ? observation.getComponent().get(3).getValueStringType().toString() : null);
                                    causesOfDeathDetailsDTO.setCauseOfDeathOther(observation.hasComponent() ? observation.getComponent().get(4).getValueStringType().toString() : null);
                                    causesOfDeathDetailsDTO.setPlaceOfDeath(observation.hasComponent() ? observation.getComponent().get(5).getValueStringType().toString() : null);
                                    causesOfDeathDetailsDTO.setMannerOfDeath(observation.hasComponent() ? observation.getComponent().get(6).getValueStringType().toString() : null);
                                    OtherDeathDetailsDTO otherDeathDetailsDTO = new OtherDeathDetailsDTO();
                                    otherDeathDetailsDTO.setPostmortemDetails(observation.hasComponent() ? observation.getComponent().get(7).getValueStringType().toString() : null);
                                    otherDeathDetailsDTO.setMarcerated(observation.hasComponent() ? observation.getComponent().get(8).getValueBooleanType().booleanValue() : null);
                                    otherDeathDetailsDTO.setFresh(observation.hasComponent() ? observation.getComponent().get(9).getValueBooleanType().booleanValue() : null);
                                    otherDeathDetailsDTO.setMotherCondition(observation.hasComponent() ? observation.getComponent().get(10).getValueStringType().toString() : null);
                                    causesOfDeathDetailsDTO.setOtherDeathDetails(otherDeathDetailsDTO);

                                    templateData.setCausesOfDeathDetails(causesOfDeathDetailsDTO);
                                }


                                //Antenatal care details
                                List<Observation> antenatalCareObservations = getObservationsByCategory("anc-details", encounter, true);
                                if (!antenatalCareObservations.isEmpty()) {
                                    Observation observation = Iterables.getLast(antenatalCareObservations);
                                    AntenatalCareDetailsDTO antenatalCareDetailsDTO = new AntenatalCareDetailsDTO();
                                    antenatalCareDetailsDTO.setDate(observation.hasEffectiveDateTimeType() ? observation.getEffectiveDateTimeType().getValue() : null);
                                    antenatalCareDetailsDTO.setPregnancyAgeInWeeks(getComponentValueQuantityInt(observation, 0));
                                    antenatalCareDetailsDTO.setPositiveHivStatusBeforeService(getComponentValueBoolean(observation, 1));
                                    antenatalCareDetailsDTO.setProvidedWithFamilyPlanningCounseling(getComponentValueBoolean(observation, 2));
                                    antenatalCareDetailsDTO.setProvidedWithInfantFeedingCounseling(getComponentValueBoolean(observation, 3));
                                    antenatalCareDetailsDTO.setReferredToCTC(getComponentValueBoolean(observation, 4));

                                    Map<String, Object> hivDetails = new HashMap<>();
                                    hivDetails.put("status", getComponentValueCodeableConceptDisplay(observation, 9));
                                    hivDetails.put("code", getComponentValueCodeableConceptCode(observation, 9));
                                    antenatalCareDetailsDTO.setHivDetails(hivDetails);

                                    Map<String, Object> syphilisDetails = new HashMap<>();
                                    syphilisDetails.put("status", getComponentValueCodeableConceptDisplay(observation, 8));
                                    syphilisDetails.put("code", getComponentValueCodeableConceptCode(observation, 8));
                                    antenatalCareDetailsDTO.setSyphilisDetails(syphilisDetails);

                                    antenatalCareDetailsDTO.setGravidity(getComponentIntValue(observation, 5));

                                    SpouseDetailsDTO spouseDetails = new SpouseDetailsDTO();

                                    DiseaseStatusDTO spouseHivDetails = new DiseaseStatusDTO();
                                    spouseHivDetails.setCode(getComponentValueCodeableConceptCode(observation, 6));
                                    spouseHivDetails.setStatus(getComponentValueCodeableConceptDisplay(observation, 6));

                                    DiseaseStatusDTO spouseSyphilisDetails = new DiseaseStatusDTO();
                                    spouseSyphilisDetails.setCode(getComponentValueCodeableConceptCode(observation, 7));
                                    spouseSyphilisDetails.setStatus(getComponentValueCodeableConceptDisplay(observation, 7));

                                    spouseDetails.setHivDetails(spouseHivDetails);
                                    spouseDetails.setSyphilisDetails(spouseSyphilisDetails);

                                    //TODO: Add other spouse details
                                    antenatalCareDetailsDTO.setSpouseDetails(spouseDetails);

                                    templateData.setAntenatalCareDetails(antenatalCareDetailsDTO);
                                }


                                //prophylAxisDetails
                                List<ProphylAxisDetailsDTO> prophylAxisDetailsDTOS = new ArrayList<>();
                                List<Procedure> prophylAxisProcedures = getProceduresByCategory(encounter.getIdElement().getIdPart(), ""); //TODO: Add support to fetch by category
                                if (!prophylAxisProcedures.isEmpty()) {
                                    for (Procedure procedure : prophylAxisProcedures) {
                                        ProphylAxisDetailsDTO prophylAxisDetailsDTO = new ProphylAxisDetailsDTO();
                                        prophylAxisDetailsDTO.setDate(procedure.hasPerformedDateTimeType() ? procedure.getPerformedDateTimeType().getValue() : null);
                                        if (procedure.hasCode() && !procedure.getCode().getCoding().isEmpty()) {
                                            prophylAxisDetailsDTO.setCode(procedure.getCode().getCoding().get(0).getCode());
                                        }
                                        //TODO: Add prophylAxis type
                                        //TODO: Add prophylAxis name
                                        prophylAxisDetailsDTO.setStatus(procedure.hasStatus() ? procedure.getStatus().getDisplay() : null);
                                        prophylAxisDetailsDTO.setNotes(procedure.hasNote() ? procedure.getNote().get(0).getText() : null);
                                        //TODO: Add prophylAxis reaction
                                        prophylAxisDetailsDTOS.add(prophylAxisDetailsDTO);
                                    }
                                    templateData.setProphylAxisDetails(prophylAxisDetailsDTOS);
                                }

                                //Treatment details
                                TreatmentDetailsDTO treatmentDetailsDTO = new TreatmentDetailsDTO();

                                //Chemotherapy treatment
                                List<Procedure> chemotherapyProcedures = getProceduresByCategory(encounter.getIdElement().getIdPart(), "chemotherapy-treatment");
                                if (!chemotherapyProcedures.isEmpty()) {
                                    List<Map<String, Object>> chemotherapyTreatment = new ArrayList<>();
                                    for (Procedure procedure : chemotherapyProcedures) {
                                        Map<String, Object> chemoTherapy = new HashMap<>();
                                        chemoTherapy.put("diagnosis", procedure.hasReasonCode() ? procedure.getReasonCode().get(0).getCoding().get(0).getDisplay() : null);
                                        chemoTherapy.put("regiment", getNestedExtensionValueString(procedure, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/chemotherapy-details", "regiment"));
                                        chemoTherapy.put("stage", getNestedExtensionValueInteger(procedure, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/chemotherapy-details", "stage"));
                                        chemoTherapy.put("totalNumberOfExpectedCycles", getNestedExtensionValueInteger(procedure, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/chemotherapy-details", "totalExpectedCycles"));
                                        chemoTherapy.put("currentChemotherapeuticCycles", getNestedExtensionValueInteger(procedure, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/chemotherapy-details", "currentCycles"));
                                        chemotherapyTreatment.add(chemoTherapy);
                                    }
                                    treatmentDetailsDTO.setChemoTherapy(chemotherapyTreatment);
                                }

                                //Radiotherapy treatment
                                List<Procedure> radiotherapyProcedures = getProceduresByCategory(encounter.getIdElement().getIdPart(), "radiotherapy-treatment");
                                if (!radiotherapyProcedures.isEmpty()) {
                                    List<Map<String, Object>> radioTherapyTreatment = new ArrayList<>();
                                    for (Procedure procedure : radiotherapyProcedures) {
                                        Map<String, Object> radioTherapy = new HashMap<>();
                                        //Prescription
                                        Map<String, Object> prescription = new HashMap<>();
                                        prescription.put("type", getNestedExtensionValueString(procedure, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/radiotherapy-details", "prescriptionType"));
                                        prescription.put("intention", getNestedExtensionValueString(procedure, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/radiotherapy-details", "intention"));
                                        prescription.put("technique", getNestedExtensionValueString(procedure, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/radiotherapy-details", "technique"));
                                        prescription.put("site", getNestedExtensionValueString(procedure, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/radiotherapy-details", "site"));
                                        prescription.put("dailyDose", getNestedExtensionValueQuantityValue(procedure, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/radiotherapy-details", "dailyDose"));
                                        prescription.put("totalDose", getNestedExtensionValueQuantityValue(procedure, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/radiotherapy-details", "totalDose"));
                                        //TODO: Add the following values startDate, dosageDates, administrationDates and remarks
                                        //Dosage dates
                                        List<String> dosageDates = new ArrayList<>();
                                        //Administration dates
                                        List<String> administrationDates = new ArrayList<>();

                                        // Reports
                                        List<Map<String, Object>> reports = new ArrayList<>();
                                        if (procedure.hasReport()) {
                                            List<Reference> payLoadReports = procedure.getReport();
                                            for (Reference reference : payLoadReports) {
                                                Map<String, Object> report = new HashMap<>();
                                                // Check if the reference has an ID or a reference URL
                                                if (reference.getId() == null) {
                                                    System.out.println("****Reference object is missing ID and Reference: " + reference);
                                                    continue; // Skip this iteration
                                                }
                                                DocumentReference documentReference = getDocumentReferenceById(reference.getId());
                                                if (documentReference != null) {
                                                    report.put("date", documentReference.hasDate() ? documentReference.getDate() : null);
                                                    //TODO: attachments is a string but has been saved as a list in the radiologytherapy treatment
//                                                   report.put("attachments", documentReference.hasAttachment() ? documentReference.getAttachment() : null);
                                                    report.put("MU", getNestedExtensionValueInteger(documentReference, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/radiotherapy-report", "measurementUnits"));
                                                }
                                                reports.add(report);
                                            }
                                        }


                                        radioTherapy.put("prescription", prescription);
                                        radioTherapy.put("report", reports);
                                        radioTherapyTreatment.add(radioTherapy);
                                    }
                                    treatmentDetailsDTO.setRadioTherapy(radioTherapyTreatment);
                                }

                                //surgery procedure
                                List<Procedure> surgeryProcedures = getProceduresByCategory(encounter.getIdElement().getIdPart(), "surgery-treatment");
                                if (!surgeryProcedures.isEmpty()) {
                                    List<Map<String, Object>> surgeryTreatment = new ArrayList<>();
                                    for (Procedure procedure : surgeryProcedures) {
                                        Map<String, Object> surgery = new HashMap<>();
                                        Map<String, Object> report = new HashMap<>();
                                        surgery.put("diagnosis", procedure.hasCode() ? procedure.getCode().getCoding().get(0).getDisplay() : null);
                                        if (procedure.hasReasonCode() && !procedure.getReasonCode().isEmpty()) {
                                            surgery.put("reason", procedure.getReasonCode().get(0).getText());
                                        }
                                        surgeryTreatment.add(surgery);
                                        if (procedure.hasReport()) {
                                            List<Reference> payLoadReports = procedure.getReport();
                                            Reference reportPayload = Iterables.getLast(payLoadReports);
                                            // Check if the reference has an ID or a reference URL
                                            if (reportPayload.getId() == null) {
                                                System.out.println("*2*Reference object is missing ID and Reference: " + reportPayload);
                                                continue; // Skip this iteration
                                            }
                                            DocumentReference documentReference = getDocumentReferenceById(reportPayload.getId());
                                            if (documentReference != null) {
                                                //TODO: Surgery report has fields that are not included during saving
                                            }
                                        }
                                        surgery.put("report", report);
                                    }
                                    treatmentDetailsDTO.setSurgery(surgeryTreatment);
                                }

                                //Hormone therapy
                                List<Procedure> hormoneTherapyTreatments = getProceduresByCategory(encounter.getIdElement().getIdPart(), "hormonetherapy-treatment");
                                if (!hormoneTherapyTreatments.isEmpty()) {
                                    List<Map<String, Object>> hormoneTherapy = new ArrayList<>();
                                    for (Procedure procedure : hormoneTherapyTreatments) {
                                        Map<String, Object> treatment = new HashMap<>();
                                        treatment.put("diagnosis", procedure.hasReasonCode() ? procedure.getReasonCode().get(0).getCoding().get(0).getDisplay() : null);
                                        treatment.put("regiment", getNestedExtensionValueString(procedure, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/hormone-therapy-details", "regiment"));
                                        treatment.put("stage", getNestedExtensionValueInteger(procedure, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/hormone-therapy-details", "stage"));
                                        treatment.put("totalNumberOfExpectedCycles", getNestedExtensionValueInteger(procedure, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/hormone-therapy-details", "totalExpectedCycles"));
                                        treatment.put("currentCycles", getNestedExtensionValueInteger(procedure, "https://fhir.dhis2.udsm.ac.tz/fhir/StructureDefinition/hormone-therapy-details", "currentCycles"));
                                        hormoneTherapy.add(treatment);
                                    }
                                    treatmentDetailsDTO.setHormoneTherapy(hormoneTherapy);
                                }

                                //medicalProcedureDetails
                                List<Procedure> medicalProcedures = getProceduresByCategory(encounter.getIdElement().getIdPart(), "medical-procedure-details");
                                if (!medicalProcedures.isEmpty()) {
                                    List<MedicalProcedureDetailsDTO> medicalProcedureDetails = new ArrayList<>();
                                    for (Procedure procedure : medicalProcedures) {
                                        MedicalProcedureDetailsDTO treatment = new MedicalProcedureDetailsDTO();
                                        treatment.setProcedureDate(procedure.hasPerformedDateTimeType() ? procedure.getPerformedDateTimeType().getValue() : null);
                                        treatment.setProcedureType(procedure.hasCode() ? procedure.getCode().getText() : null);
                                        treatment.setDiagnosis(procedure.hasReasonCode() ? procedure.getReasonCode().get(0).getText() : null);
                                        //TODO Add findings
                                        medicalProcedureDetails.add(treatment);
                                    }
                                    treatmentDetailsDTO.setMedicalProcedureDetails(medicalProcedureDetails);
                                }


                                templateData.setTreatmentDetails(treatmentDetailsDTO);

                                sharedRecords.add(templateData.toMap());
                            }

                            // TODO: Add history when numberOfVisits > 1
                        } else if (organization != null) {
                            // TODO: Request visit from facility provided
                            Mediator facilityConnectionDetails = this.mediatorsService.getMediatorByCode(hfrCode);
                            Map<String, Object> emrHealthRecords = mediatorsService.routeToMediator(facilityConnectionDetails, "emrHealthRecords?id=" + identifier + "&idType=" + identifierType, "GET", null);
                            List<Map<String, Object>> visits = (List<Map<String, Object>>) emrHealthRecords.get("results");
//                        System.out.println(visits.size());
                            sharedRecords = visits;
                        } else {
                        }
                    }
                }
            }
            Map<String, Object> sharedRecordsResponse = new HashMap<>();
            sharedRecordsResponse.put("results", sharedRecords);
            Map<String, Object> pager = new HashMap<>();
            pager.put("total", clientTotalBundle.getTotal());
            pager.put("totalPages", null);
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            sharedRecordsResponse.put("pager", pager);
            return sharedRecordsResponse;
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e);
        }
    }

    public List<Encounter> getLatestEncounterUsingPatientAndOrganisation(String id, Organization organization, Integer numberOfVisits) throws Exception {
        List<Encounter> encounters = new ArrayList<>();
        Bundle results = new Bundle();
        var encounterSearch = fhirClient.search().forResource(Encounter.class).where(new ReferenceClientParam("patient").hasId(id));
        if (organization != null) {
            encounterSearch.where(Encounter.SERVICE_PROVIDER.hasAnyOfIds(organization.getIdElement().getIdPart()));
        }
        results = encounterSearch.sort(new SortSpec("date").setOrder(SortOrderEnum.DESC)).returnBundle(Bundle.class).execute();
        if (results.hasEntry() && !results.getEntry().isEmpty()) {
            int visitsLimit = results.getEntry().size() > numberOfVisits ? numberOfVisits : results.getEntry().size();
            for (var count = 0; count < visitsLimit; count++) {
                encounters.add((Encounter) results.getEntry().get(count).getResource());
            }
        }
        return encounters;
    }

    public List<Map<String, Object>> requestDataFromHealthFacility(Map<String, Object> requestPayload) throws Exception {
        try {
            List<Map<String, Object>> dataFromHealthFacility = new ArrayList<>();
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
            return dataFromHealthFacility;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public Map<String, Object> processSharedRecords(SharedHealthRecordsDTO sharedRecordPayload, Map<String, Object> mandatoryClientRegistryIdTypes) throws Exception {
        try {
            Map<String, Object> response = new HashMap<>();
            DemographicDetailsDTO demographicDetails = sharedRecordPayload.getDemographicDetails();
            FacilityDetailsDTO facilityDetails = sharedRecordPayload.getFacilityDetails();
            VisitDetailsDTO visitDetails = sharedRecordPayload.getVisitDetails();
            String mrn = sharedRecordPayload.getMrn();
            // Check if patient exists
            Patient patient = new Patient();

            List<IdentifierDTO> identifiers = demographicDetails != null ? demographicDetails.getIdentifiers() : null;
            String defaultIdentifierType = this.clientRegistryConstants.DefaultIdentifierType;
            // TODO: Find a way to use default identifier type to get client
            if (identifiers != null && !identifiers.isEmpty()) {
                for (IdentifierDTO identifier : identifiers) {
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

                for (IdentifierDTO identifierDTO : identifiers) {
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
            Reference patientReference = new Reference();
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
            Map<String, Object> visitData = new HashMap<>();
            visitData.put("id", encounterId);
            response.put("visit", visitData);
            Map<String, Object> patientObj = new HashMap<>();
            patientObj.put("id", patient.getId());
            response.put("patient", patientObj);
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
            Bundle coverageBundle = coverageSearch.returnBundle(Bundle.class).execute();

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

    public List<Observation> getObservationsByCategory(String category, Encounter encounter, boolean forGroup) throws Exception {
        List<Observation> observations = new ArrayList<>();
        var observationSearch = fhirClient.search().forResource(Observation.class).where(Observation.ENCOUNTER.hasAnyOfIds(encounter.getIdElement().getIdPart()));
        observationSearch.where(Observation.CATEGORY.exactly().code(category));
        Bundle observationBundle = new Bundle();
        // Valid sort params
        /**
         * [_content, _id, _lastUpdated, _profile, _security, _source, _tag, _text, based-on,
         * category, code, code-value-concept, code-value-date, code-value-quantity,
         * code-value-string, combo-code, combo-code-value-concept, combo-code-value-quantity,
         * combo-data-absent-reason, combo-value-concept, combo-value-quantity]
         */
        observationBundle = observationSearch.sort().descending("_lastUpdated").returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                Observation observationGroup = (Observation) entryComponent.getResource();
                if (forGroup && !observationGroup.hasDerivedFrom() && !observationGroup.hasHasMember()) {
                    observations.add(observationGroup);
                } else {
                    observations.add(observationGroup);
                }
            }
        }

        return observations;
    }

    public List<Observation> getObservationsByObservationGroupId(String category, Encounter encounter, String id) throws Exception {
        List<Observation> observations = new ArrayList<>();
        var observationSearch = fhirClient.search().forResource(Observation.class).where(Observation.ENCOUNTER.hasAnyOfIds(encounter.getIdElement().getIdPart()));
        observationSearch.where(Observation.CATEGORY.exactly().code(category));
        observationSearch.where(Observation.HAS_MEMBER.hasId(id));
        Bundle observationBundle = new Bundle();
        observationBundle = observationSearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                Observation observation = (Observation) entryComponent.getResource();
                observations.add(observation);
            }
        }

        return observations;
    }

    public List<AllergyIntolerance> getAllergyTolerances(String patientId) throws Exception {
        List<AllergyIntolerance> allergyIntolerances = new ArrayList<>();
        var allergySearch = fhirClient.search().forResource(AllergyIntolerance.class).where(AllergyIntolerance.PATIENT.hasAnyOfIds(patientId));

        Bundle observationBundle = new Bundle();
        observationBundle = allergySearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                AllergyIntolerance allergyIntolerance = (AllergyIntolerance) entryComponent.getResource();
                allergyIntolerances.add(allergyIntolerance);
            }
        }
        return allergyIntolerances;
    }

    public List<Condition> getConditionsByCategory(String encounterId, String category) throws Exception {
        List<Condition> conditions = new ArrayList<>();
        var conditionSearch = fhirClient.search().forResource(Condition.class).where(Condition.ENCOUNTER.hasAnyOfIds(encounterId)).where(Condition.CATEGORY.exactly().code(category));

        Bundle observationBundle = new Bundle();
        observationBundle = conditionSearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                Condition condition = (Condition) entryComponent.getResource();
                conditions.add(condition);
            }
        }
        return conditions;
    }

    public List<MedicationDispense> getMedicationDispensesById(String encounterId) throws Exception {
        List<MedicationDispense> medicationDispenses = new ArrayList<>();
        var medicationDispenseSearch = fhirClient.search().forResource(MedicationDispense.class).where(MedicationDispense.CONTEXT.hasAnyOfIds(encounterId));

        Bundle observationBundle;
        observationBundle = medicationDispenseSearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                MedicationDispense medicationDispense = (MedicationDispense) entryComponent.getResource();
                medicationDispenses.add(medicationDispense);
            }
        }
        return medicationDispenses;
    }

    public List<DiagnosticReport> getDiagnosticReportsByCategory(String encounterId, String category) throws Exception {
        List<DiagnosticReport> diagnosticReports = new ArrayList<>();
        var diagnosticReportSearch = fhirClient.search().forResource(DiagnosticReport.class).where(DiagnosticReport.ENCOUNTER.hasAnyOfIds(encounterId)).where(DiagnosticReport.CATEGORY.exactly().code(category));

        Bundle observationBundle;
        observationBundle = diagnosticReportSearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                DiagnosticReport diagnosticReport = (DiagnosticReport) entryComponent.getResource();
                diagnosticReports.add(diagnosticReport);
            }
        }
        return diagnosticReports;
    }

    //TODO: Confirm if we still need this function as questionnaire response is not used in the current implementation
    public List<QuestionnaireResponse> getQuestionnaireResponsesById(String encounterId) throws Exception {
        List<QuestionnaireResponse> questionnaireResponses = new ArrayList<>();
        var questionnaireResponseSearch = fhirClient.search().forResource(QuestionnaireResponse.class).where(QuestionnaireResponse.ENCOUNTER.hasAnyOfIds(encounterId));

        Bundle observationBundle;
        observationBundle = questionnaireResponseSearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                QuestionnaireResponse questionnaireResponse = (QuestionnaireResponse) entryComponent.getResource();
                questionnaireResponses.add(questionnaireResponse);
            }
        }
        return questionnaireResponses;
    }

    public List<ServiceRequest> getServiceRequestsByCategory(String encounterId, String category) throws Exception {
        List<ServiceRequest> serviceRequests = new ArrayList<>();
        var serviceRequestSearch = fhirClient.search().forResource(ServiceRequest.class).where(ServiceRequest.ENCOUNTER.hasAnyOfIds(encounterId)).where(ServiceRequest.CATEGORY.exactly().code(category));

        Bundle observationBundle = new Bundle();
        observationBundle = serviceRequestSearch.sort().descending("_lastUpdated").returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                ServiceRequest serviceRequest = (ServiceRequest) entryComponent.getResource();
                serviceRequests.add(serviceRequest);
            }
        }
        return serviceRequests;
    }

    public List<Procedure> getProceduresByCategory(String encounterId, String category) throws Exception {
        List<Procedure> procedures = new ArrayList<>();
        var procedureSearch = fhirClient.search().forResource(Procedure.class).where(Procedure.ENCOUNTER.hasAnyOfIds(encounterId)).where(Procedure.CATEGORY.exactly().code(category));

        Bundle observationBundle;
        observationBundle = procedureSearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                Procedure procedure = (Procedure) entryComponent.getResource();
                procedures.add(procedure);
            }
        }
        return procedures;
    }


    public List<Immunization> getImmunizationByEncounterId(String encounterId) throws Exception {
        List<Immunization> immunizations = new ArrayList<>();
//        var immunizationSearch = fhirClient.search().forResource(Immunization.class).where(Immunization.PATIENT.hasChainedProperty());
//        Bundle observationBundle;
//        observationBundle = immunizationSearch.returnBundle(Bundle.class).execute();
//        if (observationBundle.hasEntry()) {
//            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
//                Immunization immunization = (Immunization) entryComponent.getResource();
//                immunizations.add(immunization);
//            }
//        }
        return immunizations;
    }

    public DocumentReference getDocumentReferenceById(String id) throws Exception {
        DocumentReference documentReference;
        documentReference = fhirClient.read().resource(DocumentReference.class).withId(id).execute();
        return documentReference;
    }

    private Integer getComponentValueQuantityInt(Observation observation, int index) {
        if (observation.hasComponent() && observation.getComponent().size() > index) {
            Observation.ObservationComponentComponent component = observation.getComponent().get(index);
            if (component.hasValueQuantity() && component.getValueQuantity().hasValue()) {
                return component.getValueQuantity().getValue().intValue();
            }
        }
        return null;
    }

    private Integer getComponentIntValue(Observation observation, int index) {
        if (observation.hasComponent() && observation.getComponent().size() > index) {
            Observation.ObservationComponentComponent component = observation.getComponent().get(index);
            if (component.hasValueIntegerType() && component.getValueIntegerType().hasValue()) {
                return component.getValueIntegerType().getValue();
            }
        }
        return null;
    }

    private String getComponentValueString(Observation observation, int index) {
        if (observation.hasComponent() && observation.getComponent().size() > index) {
            Observation.ObservationComponentComponent component = observation.getComponent().get(index);
            if (component.hasValueStringType() && component.getValueStringType().hasValue()) {
                return component.getValueStringType().toString();
            }
        }
        return null;
    }

    private Date getComponentValueDateTime(Observation observation, int index) {
        if (observation.hasComponent() && observation.getComponent().size() > index) {
            Observation.ObservationComponentComponent component = observation.getComponent().get(index);
            if (component.hasValueDateTimeType() && component.getValueDateTimeType().hasValue()) {
                return component.getValueDateTimeType().getValue();
            }
        }
        return null;
    }

    private Boolean getComponentValueBoolean(Observation observation, int index) {
        if (observation.hasComponent() && observation.getComponent().size() > index) {
            Observation.ObservationComponentComponent component = observation.getComponent().get(index);
            if (component.hasValueBooleanType() && component.getValueBooleanType().hasValue()) {
                return component.getValueBooleanType().booleanValue();
            }
        }
        return false;
    }

    private String getComponentValueCodeableConceptDisplay(Observation observation, int index) {
        if (observation.hasComponent() && observation.getComponent().size() > index) {
            Observation.ObservationComponentComponent component = observation.getComponent().get(index);
            if (component.hasValueCodeableConcept() && component.getValueCodeableConcept().hasCoding() && !component.getValueCodeableConcept().getCoding().isEmpty()) {
                return component.getValueCodeableConcept().getCoding().get(0).getDisplay();
            }
        }
        return null;
    }

    private String getComponentValueCodeableConceptCode(Observation observation, int index) {
        if (observation.hasComponent() && observation.getComponent().size() > index) {
            Observation.ObservationComponentComponent component = observation.getComponent().get(index);
            if (component.hasValueCodeableConcept() && component.getValueCodeableConcept().hasCoding() && !component.getValueCodeableConcept().getCoding().isEmpty()) {
                return component.getValueCodeableConcept().getCoding().get(0).getCode();
            }
        }
        return null;
    }

    private String getNestedExtensionValueString(Procedure procedure, String parentUrl, String childUrl) {
        if (procedure.hasExtension()) {
            for (Extension parentExtension : procedure.getExtension()) {
                if (parentExtension.getUrl().equals(parentUrl) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtension.getUrl().equals(childUrl) && childExtension.hasValue() && childExtension.getValue() instanceof StringType) {
                            return ((StringType) childExtension.getValue()).getValue();
                        }
                    }
                }
            }
        }
        return null;
    }

    private Integer getNestedExtensionValueInteger(DomainResource resource, String parentUrl, String childUrl) {
        if (resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(parentUrl) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtension.getUrl().equals(childUrl) && childExtension.hasValue() && childExtension.getValue() instanceof IntegerType) {
                            return ((IntegerType) childExtension.getValue()).getValue();
                        }
                    }
                }
            }
        }
        return null;
    }


    private BigDecimal getNestedExtensionValueQuantityValue(Procedure procedure, String parentUrl, String childUrl) {
        if (procedure.hasExtension()) {
            for (Extension parentExtension : procedure.getExtension()) {
                if (parentExtension.getUrl().equals(parentUrl) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtension.getUrl().equals(childUrl) && childExtension.hasValue() && childExtension.getValue() instanceof Quantity) {
                            return ((Quantity) childExtension.getValue()).getValue();
                        }
                    }
                }
            }
        }
        return null;
    }
}
