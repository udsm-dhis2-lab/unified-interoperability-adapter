package com.Adapter.icare.SharedHealthRecords.Services;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.api.SortOrderEnum;
import ca.uhn.fhir.rest.api.SortSpec;
import ca.uhn.fhir.rest.api.SummaryEnum;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.gclient.ReferenceClientParam;
import ca.uhn.fhir.rest.gclient.TokenClientParam;

import com.Adapter.icare.ClientRegistry.Services.ClientRegistryService;
import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Constants.ClientRegistryConstants;
import com.Adapter.icare.Constants.FHIRConstants;
import com.Adapter.icare.Constants.SharedRecordsConstants;
import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.*;
import com.Adapter.icare.Enums.*;
import com.Adapter.icare.Organisations.Dtos.OrganizationDTO;
import com.Adapter.icare.Services.MediatorsService;
import com.Adapter.icare.Services.UserService;
import com.Adapter.icare.Utils.PrintOutHelper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Iterables;

import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r4.model.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.Adapter.icare.SharedHealthRecords.Utilities.AllergyIntoleranceUtils.getAllergyTolerances;
import static com.Adapter.icare.SharedHealthRecords.Utilities.ChargeItemsUtils.getChargeItemsByEncounterId;
import static com.Adapter.icare.SharedHealthRecords.Utilities.ChronicConditionsUtils.getConditionsByCategory;
import static com.Adapter.icare.SharedHealthRecords.Utilities.ComponentUtils.*;
import static com.Adapter.icare.SharedHealthRecords.Utilities.DiagnosticReportUtils.getDiagnosticReportsByCategory;
import static com.Adapter.icare.SharedHealthRecords.Utilities.ExtensionUtils.*;
import static com.Adapter.icare.SharedHealthRecords.Utilities.MedicationStatementUtils.getMedicationStatementsByCategoryAndCodeableConcept;
import static com.Adapter.icare.SharedHealthRecords.Utilities.ObservationsUtils.*;
import static com.Adapter.icare.SharedHealthRecords.Utilities.ProceduresUtils.getProceduresByCategoryAndObservationReference;
import static com.Adapter.icare.SharedHealthRecords.Utilities.ServiceRequestUtils.getServiceRequestsByCategory;
import static com.Adapter.icare.SharedHealthRecords.Utilities.medicationDispenseUtils.getMedicationDispensesById;
import static com.Adapter.icare.Utils.CarePlanUtils.getCarePlansByCategory;
import static com.Adapter.icare.Utils.DateUtils.stringToDateOrNull;

@Service
public class SharedHealthRecordsService {

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

    public SharedHealthRecordsService(FHIRConstants fhirConstants,
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

    public Map<String, Object> getSharedRecordsWithPagination(Integer page,
                                                              Integer pageSize,
                                                              String identifier,
                                                              String identifierType,
                                                              String referralNumber,
                                                              boolean onlyLinkedClients,
                                                              String gender,
                                                              String firstName,
                                                              String middleName,
                                                              String lastName,
                                                              String hfrCode,
                                                              Date dateOfBirth,
                                                              boolean includeDeceased,
                                                              Integer numberOfVisits,
                                                              boolean withReferral) throws Exception {

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

                if (withReferral) {

                }

                // TODO: Review the deceased concept
                if (!includeDeceased) {
                    // searchRecords.where(Patient.DECEASED.isMissing(true));
                }
                // .where(new StringClientParam("linkType").matchesExactly().value("replaces"));
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

                response = searchRecords.count(pageSize).offset(page - 1).returnBundle(Bundle.class)
                        .execute();
                clientTotalBundle = searchRecords.summaryMode(SummaryEnum.COUNT)
                        .returnBundle(Bundle.class).execute();

            } else {
                // referralNumber should be saved as identifier of the encounter. Since it is
                // concatenated with HFRcode then the search criteria should consider
                // concatenating the two
                if (hfrCode == null) {
                    throw new Exception(
                            "HFR code is mandatory when searching using referral number (referralNumber) param");
                }
                var encSearch = fhirClient.search().forResource(Encounter.class)
                        .where(Encounter.IDENTIFIER.exactly()
                                .identifier(hfrCode + "-" + referralNumber));
                Bundle encBundle = encSearch.sort().descending("_lastUpdated")
                        .returnBundle(Bundle.class).execute();
                if (encBundle.hasEntry()) {
                    for (Bundle.BundleEntryComponent entry : response.getEntry()) {
                        if (entry.getResource() instanceof Encounter) {
                            // Assumption is the referral with the id will be one
                            encounters.add((Encounter) entry.getResource());
                            IIdType patientReference = encounters.get(0).getSubject()
                                    .getReferenceElement();
                            Patient patient = fhirClient.read().resource(Patient.class)
                                    .withId(patientReference.getIdPart()).execute();
                            response = fhirClient.search().forResource(Patient.class)
                                    .where(Patient.IDENTIFIER.exactly()
                                            .identifier(patient
                                                    .getIdElement()
                                                    .getIdPart()))
                                    .returnBundle(Bundle.class).execute();
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

                response = searchRecords.count(pageSize).offset(page - 1).returnBundle(Bundle.class)
                        .execute();
            }

            if (!response.getEntry().isEmpty()) {
                for (Bundle.BundleEntryComponent entry : response.getEntry()) {
                    if (entry.getResource() instanceof Patient) {
                        Patient patient = (Patient) entry.getResource();
                        Organization organization = new Organization();
                        if (hfrCode != null) {
                            try {
                                Bundle bundle = new Bundle();
                                bundle = fhirClient.search()
                                        .forResource(Organization.class)
                                        .where(Organization.IDENTIFIER.exactly()
                                                .identifier(hfrCode))
                                        .returnBundle(Bundle.class).execute();
                                for (Bundle.BundleEntryComponent bundleEntryComponent : bundle
                                        .getEntry()) {
                                    if (bundleEntryComponent
                                            .getResource() instanceof Organization) {
                                        organization = (Organization) bundleEntryComponent
                                                .getResource();
                                    }
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }

                        // TODO: Add logic to handle number of visits. Latest visit is primary
                        // and the
                        // rest is history
                        if (referralNumber == null) {
                            encounters = getLatestEncounterUsingPatientAndOrganisation(
                                    patient.getIdElement().getIdPart(),
                                    organization, numberOfVisits);
                        }
                        if (!encounters.isEmpty()) {
                            for (Encounter encounter : encounters) {
                                SharedHealthRecordsDTO templateData = new SharedHealthRecordsDTO();
                                // Get encounter organisation

                                // if organisation is null then do this
                                IIdType organisationReference = encounter
                                        .getServiceProvider()
                                        .getReferenceElement();
                                organization = fhirClient.read()
                                        .resource(Organization.class)
                                        .withId(organisationReference
                                                .getIdPart())
                                        .execute();
                                // Bundle ouBundle =
                                // fhirClient.search().forResource(Organization.class).where(Organization.IDENTIFIER.exactly().code(organisationReference.getIdPart())).returnBundle(Bundle.class).execute();
                                // if (ouBundle.hasEntry()) {
                                // for (Bundle.BundleEntryComponent entryComponent:
                                // ouBundle.getEntry()) {
                                // Organization ou = (Organization)
                                // entryComponent.getResource();
                                // if
                                // (ou.getIdElement().getIdPart().equals(organisationReference.getIdPart()))
                                // {
                                // organization = ou;
                                // break;
                                // }
                                // }
                                // }
                                PatientDTO patientDTO = this.clientRegistryService
                                        .mapToPatientDTO(patient);
                                List<Coverage> coverages = this.clientRegistryService
                                        .getCoveragesByPatientIdAndOrDependent(patient.getIdElement()
                                                .getIdPart(), null);
                                // TODO: Add payment details for patient
                                // List<PaymentDetailsDTO> paymentDetailsDTOs = new
                                // ArrayList<>();
                                // if (coverages.size() > 0) {
                                // paymentDetailsDTOs = coverages.stream().map(coverage
                                // ->
                                // this.clientRegistryService.mapToPaymentDetails(coverage)).collect(Collectors.toList());
                                // }
                                List<VisitMainPaymentDetailsDTO> visitMainPaymentDetailsDTOS = new ArrayList<>();
                                if (!coverages.isEmpty()) {
                                    visitMainPaymentDetailsDTOS = coverages.stream()
                                            .map(this.clientRegistryService::mapToMainVisitPaymentDetails)
                                            .collect(Collectors.toList());
                                }
                                // patientDTO.setPaymentDetails(paymentDetailsDTOs);
                                templateData.setVisitMainPaymentDetails(
                                        !visitMainPaymentDetailsDTOS.isEmpty()
                                                ? visitMainPaymentDetailsDTOS
                                                .get(0)
                                                : null);
                                String nationality = getNestedExtensionValueString(
                                        patient,
                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/patient-extensions",
                                        "nationality");
                                String occupation = getNestedExtensionValueString(
                                        patient,
                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/patient-extensions",
                                        "occupation");
                                patientDTO.setOccupation(occupation);
                                patientDTO.setNationality(nationality);
                                String mrn = patientDTO.getMRN(organization
                                        .getIdElement().getIdPart());
                                templateData.setMrn(mrn);
                                String orgCode = organization != null
                                        ? organization.getIdElement()
                                        .getIdPart()
                                        : null;

                                List<PaymentDetailsDTO> paymentDetailsDTOList = new ArrayList<>();
                                var paymentDetailsCoverages = this.clientRegistryService
                                        .getCoveragesByPatientIdAndOrDependent(patient.getIdElement()
                                                .getIdPart(), "demographicPayment");

                                for(Coverage coverage: paymentDetailsCoverages){
                                    PaymentDetailsDTO paymentDetailsDTO = new PaymentDetailsDTO();

                                    paymentDetailsDTO.setName(coverage.hasClass_() && !coverage.getClass_().isEmpty() && coverage.getClass_().get(0).hasName() ? coverage.getClass_().get(0).getName() : null);

                                    paymentDetailsDTO.setType(coverage.hasType() && coverage.getType().hasCoding() && !coverage.getType().getCoding().isEmpty() ? coverage.getType().getCoding().get(0).getCode() : null);

                                    paymentDetailsDTO.setShortName(
                                            coverage.hasClass_() && !coverage.getClass_().isEmpty() && coverage.getClass_().get(0).hasValue() ? coverage.getClass_().get(0).getValue() : null
                                    );
                                    paymentDetailsDTO.setInsuranceId(coverage.hasSubscriberId() ? coverage.getSubscriberId() : null);

                                    paymentDetailsDTO.setInsuranceCode(coverage.hasPayor() && !coverage.getPayor().isEmpty() && coverage.getPayor().get(0).hasIdentifier() && coverage.getPayor().get(0).getIdentifier().hasValue() ? coverage.getPayor().get(0).getIdentifier().getValue() : null);

                                    paymentDetailsDTO.setPolicyNumber(getNestedExtensionValueString(coverage, "http://fhir.moh.go.tz/fhir/StructureDefinition/coverage-extension", "policyNumber"));
                                    paymentDetailsDTO.setGroupNumber(getNestedExtensionValueString(coverage, "http://fhir.moh.go.tz/fhir/StructureDefinition/coverage-extension", "groupNumber"));

                                    paymentDetailsDTOList.add(paymentDetailsDTO);
                                }

                                patientDTO.setPaymentDetails(paymentDetailsDTOList);

                                templateData.setDemographicDetails(patientDTO.toMap());
                                templateData.setPaymentDetails(this
                                        .getPaymentDetailsViaCoverage(patient));

                                // BloodBags
                                List<BiologicallyDerivedProduct> bags = getBiologicallyDerivedProductByOrganizationId(
                                        organization.getIdElement()
                                                .getIdPart());

                                List<BloodBagDTO> bagsDTO = new ArrayList<>();

                                for (BiologicallyDerivedProduct bag : bags) {
                                    BloodBagDTO bloodBagDTO = new BloodBagDTO();
                                    bloodBagDTO.setBloodType(
                                            getExtensionValueString(bag,
                                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/blood-type-name"));
                                    bloodBagDTO.setQuantity(getExtensionValueInt(
                                            bag,
                                            "http://fhir.moh.go.tz/fhir/StructureDefinition/blood-type-quantity"));
                                    bagsDTO.add(bloodBagDTO);
                                }

                                FacilityDetailsDTO facilityDetailsDTO = organization != null
                                        ? new OrganizationDTO(
                                        organization.getId(),
                                        organization.getIdentifier(),
                                        organization.getName(),
                                        organization.getActive())
                                        .toSummary()
                                        : null;

                                facilityDetailsDTO.setBloodBags(bagsDTO);

                                templateData.setFacilityDetails(facilityDetailsDTO);
                                VisitDetailsDTO visitDetails = new VisitDetailsDTO();
                                visitDetails.setId(
                                        encounter.getIdElement().getIdPart());
                                visitDetails.setVisitDate(
                                        encounter.getPeriod() != null
                                                && encounter.getPeriod()
                                                .getStart() != null
                                                ? encounter.getPeriod()
                                                .getStart()
                                                : null);
                                visitDetails.setClosedDate(
                                        encounter.getPeriod() != null
                                                && encounter.getPeriod()
                                                .getEnd() != null
                                                ? encounter.getPeriod()
                                                .getEnd()
                                                : null);
                                visitDetails.setVisitType(encounter.hasType()
                                        && !encounter.getType().isEmpty()
                                        ? encounter.getType()
                                        .get(0)
                                        .getText()
                                        : null);

                                visitDetails.setReferredIn(
                                        getExtensionValueBoolean(encounter, "http://fhir.moh.go.tz/fhir/StructureDefinition/visitDetails-referredIn")
                                );

                                visitDetails.setDisabled(
                                        getExtensionValueBoolean(encounter, "http://fhir.moh.go.tz/fhir/StructureDefinition/visitDetails-disabled")
                                );

                                List<CareServiceDTO> careServiceDTOs = new ArrayList<>();

                                List<Observation> careServicesObs = getObservationsByCategory(
                                        fhirClient,
                                        "care-services",
                                        encounter, false, false);
                                for (Observation careServiceObs : careServicesObs) {
                                    CareServiceDTO careServiceDTO = new CareServiceDTO();
                                    if (careServiceObs.hasComponent()
                                            && !careServiceObs
                                            .getComponent()
                                            .isEmpty()) {
                                        Observation.ObservationComponentComponent careTypeComponent = careServiceObs
                                                .getComponent().get(0);
                                        if (careTypeComponent != null
                                                && careTypeComponent
                                                .hasValueStringType()
                                                && careTypeComponent
                                                .getValueStringType()
                                                .hasValue()) {
                                            careServiceDTO.setCareType(CareType.fromString(careTypeComponent
                                                    .getValueStringType()
                                                    .getValueAsString()));
                                        }
                                        if (careServiceObs.getComponent()
                                                .size() > 1) {
                                            Observation.ObservationComponentComponent visitNumberComponent = careServiceObs
                                                    .getComponent()
                                                    .get(1);
                                            if (visitNumberComponent != null
                                                    && visitNumberComponent
                                                    .hasValueIntegerType()
                                                    && visitNumberComponent
                                                    .getValueIntegerType()
                                                    .hasValue()) {
                                                careServiceDTO.setVisitNumber(
                                                        visitNumberComponent
                                                                .getValueIntegerType()
                                                                .getValue());
                                            }
                                        }
                                    }
                                    careServiceDTOs.add(careServiceDTO);
                                }

                                visitDetails.setCareServices(careServiceDTOs);
                                visitDetails.setNewThisYear(getExtensionValueBoolean(
                                        encounter,
                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/newThisYear"));
                                visitDetails.setIsNew(getExtensionValueBoolean(
                                        encounter,
                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/newVisit"));

                                AttendedSpecialistDTO attendedSpecialistDTO = new AttendedSpecialistDTO();
                                List<AttendedSpecialistDTO> attendedSpecialistDTOS = new ArrayList<>();
                                attendedSpecialistDTO.setSuperSpecialist(
                                        getExtensionValueBoolean(encounter,
                                                "http://fhir.moh.go.tz/fhir/StructureDefinition/superSpecialist"));
                                attendedSpecialistDTO.setSpecialist(
                                        (getExtensionValueBoolean(encounter,
                                                "http://fhir.moh.go.tz/fhir/StructureDefinition/specialist")));
                                attendedSpecialistDTOS.add(attendedSpecialistDTO);
                                visitDetails.setAttendedSpecialist(
                                        attendedSpecialistDTOS);

                                ServiceComplaintsDTO serviceComplaintsDTO = new ServiceComplaintsDTO();
                                serviceComplaintsDTO.setProvidedComplaints(
                                        getExtensionValueBoolean(encounter,
                                                "http://fhir.moh.go.tz/fhir/StructureDefinition/providedComplaints"));
                                serviceComplaintsDTO.setComplaints(
                                        getExtensionValueString(encounter,
                                                "http://fhir.moh.go.tz/fhir/StructureDefinition/complaints"));

                                visitDetails.setServiceComplaints(serviceComplaintsDTO);

                                templateData.setVisitDetails(visitDetails);

                                // Get appointment details

                                List<Appointment> appointmentResourceList = getAppointmentByEncounterId(
                                        encounter.getIdElement().getIdPart());

                                List<AppointmentDetailsDTO> appointmentDetailsDTOS = new ArrayList<>();

                                for (Appointment appointment : appointmentResourceList) {
                                    AppointmentDetailsDTO appointmentDetailsDTO = new AppointmentDetailsDTO();
                                    appointmentDetailsDTO.setAppointmentId(
                                            appointment.getIdElement()
                                                    .getIdPart());
                                    String appointmentHfrCode = extractHfrCode(
                                            appointment.getIdElement()
                                                    .getIdPart());
                                    appointmentDetailsDTO
                                            .setHfrCode(appointmentHfrCode);
                                    appointmentDetailsDTO.setAppointmentStatus(
                                            appointment.hasStatus()
                                                    ? appointment.getStatus()
                                                    .toString()
                                                    : "booked");

                                    List<AppointmentServiceDetailsDTO> services = new ArrayList<>();
                                    if (appointment.hasServiceType() && !appointment
                                            .getServiceType().isEmpty()) {
                                        for (CodeableConcept serviceCode : appointment
                                                .getServiceType()) {
                                            AppointmentServiceDetailsDTO service = new AppointmentServiceDetailsDTO();
                                            service.setShortName(serviceCode
                                                    .hasText() ? serviceCode.getText() : null);
                                            service.setServiceCode(
                                                    serviceCode.hasCoding()
                                                            && !serviceCode.getCoding()
                                                            .isEmpty()
                                                            && serviceCode.getCoding()
                                                            .get(0)
                                                            .hasCode() ? serviceCode
                                                            .getCoding()
                                                            .get(0)
                                                            .getCode()
                                                            : null);
                                            service.setServiceName(
                                                    serviceCode.hasCoding()
                                                            && !serviceCode.getCoding()
                                                            .isEmpty()
                                                            && serviceCode.getCoding()
                                                            .get(0)
                                                            .hasDisplay() ? serviceCode
                                                            .getCoding()
                                                            .get(0)
                                                            .getDisplay()
                                                            : null);
                                            services.add(service);
                                        }
                                    }
                                    appointmentDetailsDTO
                                            .setServiceDetails(services);

                                    // Get appointment payment details
                                    List<PaymentNotice> paymentNoticeResources = getPaymentNoticesFromResource(appointment);
                                    List<AppointmentPaymentDetailsDTO> paymentDetailsDTOS = new ArrayList<>();
                                    for (PaymentNotice paymentNoticeResource : paymentNoticeResources) {
                                        AppointmentPaymentDetailsDTO paymentDetailsDTO = new AppointmentPaymentDetailsDTO();
                                        paymentDetailsDTO.setControlNumber(
                                                paymentNoticeResource
                                                        .hasIdentifier()
                                                        && !paymentNoticeResource
                                                        .getIdentifier()
                                                        .isEmpty()
                                                        && paymentNoticeResource
                                                        .getIdentifier()
                                                        .get(0)
                                                        .hasValue() ? paymentNoticeResource
                                                        .getIdentifier()
                                                        .get(0)
                                                        .getValue()
                                                        : null);
                                        paymentDetailsDTO.setStatusCode(
                                                paymentNoticeResource
                                                        .hasResponse()
                                                        && paymentNoticeResource
                                                        .getResponse()
                                                        .hasIdentifier()
                                                        && paymentNoticeResource
                                                        .getResponse()
                                                        .getIdentifier()
                                                        .hasValue() ? paymentNoticeResource
                                                        .getResponse()
                                                        .getIdentifier()
                                                        .getId()
                                                        : null);
                                        paymentDetailsDTO.setDescription(
                                                paymentNoticeResource
                                                        .hasResponse()
                                                        && paymentNoticeResource
                                                        .getResponse()
                                                        .hasIdentifier()
                                                        && paymentNoticeResource
                                                        .getResponse()
                                                        .getIdentifier()
                                                        .hasValue() ? paymentNoticeResource
                                                        .getResponse()
                                                        .getIdentifier()
                                                        .getValue()
                                                        : null);
                                        paymentDetailsDTOS
                                                .add(paymentDetailsDTO);
                                    }
                                    appointmentDetailsDTO.setPaymentDetails(
                                            paymentDetailsDTOS);
                                    appointmentDetailsDTOS
                                            .add(appointmentDetailsDTO);
                                }
                                templateData.setAppointment(appointmentDetailsDTOS);

                                // Get clinicalInformation
                                // 1. clinicalInformation - vital signs
                                ClinicalInformationDTO clinicalInformationDTO = new ClinicalInformationDTO();
                                List<VitalSignDTO> vitalSigns = new ArrayList<>();
                                // Get Observation Group
                                // System.out.println(encounter.getIdElement().getIdPart());
                                List<Observation> observationGroups = getObservationsByCategory(
                                        fhirClient,
                                        "vital-signs",
                                        encounter, true, false);
                                // System.out.println(observationGroups.size());
                                for (Observation observationGroup : observationGroups) {
                                    List<Observation> observationsData = getObservationsByObservationGroupId(
                                            fhirClient,
                                            "vital-signs", encounter,
                                            observationGroup.getIdElement()
                                                    .getIdPart());
                                    if (!observationsData.isEmpty()) {
                                        VitalSignDTO vitalSign = new VitalSignDTO();
                                        for (Observation observation : observationsData) {
                                            // TODO: Improve the code to use
                                            // dynamically fetched LOINC
                                            // codes for vital
                                            // signs
                                            if (observation.hasCode()
                                                    && observation.getCode()
                                                    .getCoding()
                                                    .get(0)
                                                    .getCode()
                                                    .equals("85354-9")) {
                                                vitalSign.setBloodPressure(observation.hasValueStringType()
                                                                ? observation.getValueStringType()
                                                                .getValue()
                                                                : null);
                                            }
                                            if (observation.getCode()
                                                    .getCoding()
                                                    .get(0)
                                                    .getCode()
                                                    .equals("29463-7")) {
                                                vitalSign.setWeight(observation.hasValueQuantity() && observation.getValueQuantity().hasValue()
                                                                ? observation.getValueQuantity()
                                                                .getValue().intValue()
                                                                : null);
                                            }
                                            if (observation.getCode()
                                                    .getCoding()
                                                    .get(0)
                                                    .getCode()
                                                    .equals("8310-5")) {
                                                vitalSign.setTemperature(observation.hasValueQuantity() && observation.getValueQuantity().hasValue()
                                                                ? observation.getValueQuantity()
                                                                .getValue().intValue()
                                                                : null);
                                            }
                                            if (observation.getCode()
                                                    .getCoding()
                                                    .get(0)
                                                    .getCode()
                                                    .equals("8302-2")) {
                                                vitalSign.setHeight(observation.hasValueQuantity() && observation.getValueQuantity().hasValue()
                                                                ? observation.getValueQuantity()
                                                                .getValue().intValue()
                                                                : null);
                                            }
                                            if (observation.getCode()
                                                    .getCoding()
                                                    .get(0)
                                                    .getCode()
                                                    .equals("9279-1")) {
                                                vitalSign.setRespiration(observation.hasValueQuantity() && observation.getValueQuantity().hasValue()
                                                                ? observation.getValueQuantity()
                                                                .getValue().intValue()
                                                                : null);
                                            }
                                            if (observation.getCode()
                                                    .getCoding()
                                                    .get(0)
                                                    .getCode()
                                                    .equals("8867-4")) {
                                                vitalSign.setPulseRate(observation.hasValueQuantity() && observation.getValueQuantity().hasValue()
                                                                ? observation.getValueQuantity()
                                                                .getValue().intValue()
                                                                : null);
                                            }
                                            if (observationGroup
                                                    .hasEffectiveDateTimeType()
                                                    && observationGroup
                                                    .getEffectiveDateTimeType()
                                                    .getValue() != null) {
                                                SimpleDateFormat sdf = new SimpleDateFormat(
                                                        "yyyy-MM-dd HH:mm:ss");
                                                String formattedDate = sdf
                                                        .format(observationGroup
                                                                .getEffectiveDateTimeType()
                                                                .getValue());
                                                vitalSign.setDateTime(formattedDate);
                                            }

                                            if (observation.hasCategory() &&
                                                    !observation.getCategory().isEmpty() && observation.getCategory().get(0).hasCoding() &&
                                                            !observation.getCategory().get(0).getCoding().isEmpty() &&
                                                            observation.getCategory().get(0).getCoding().get(0).hasCode() &&
                                                            observation.getCategory().get(0).getCoding().get(0).getCode().equals("vital-signs")
                                            ) {
                                                vitalSign.setNotes(observation.hasNote() && !observation.getNote().isEmpty() && observation.getNote().get(0).hasText()
                                                                ? observation.getNote().get(0).getText()
                                                                : null);
                                            }
                                        }
                                        vitalSigns.add(vitalSign);
                                    }
                                }

                                List<VisitNotesDTO> visitNotes = new ArrayList<>();
                                List<Observation> visitNotesGroup = getObservationsByCategory(
                                        fhirClient,
                                        "visit-notes", encounter,
                                        true, false);
                                // Visit notes
                                if (!visitNotesGroup.isEmpty()) {
                                    for (Observation observationGroup : visitNotesGroup) {
                                        // TODO: Extract for all other blocks
                                        VisitNotesDTO visitNotesData = new VisitNotesDTO();
                                        if (observationGroup
                                                .hasEffectiveDateTimeType()
                                                && observationGroup
                                                .getEffectiveDateTimeType()
                                                .getValue() != null) {
                                            SimpleDateFormat sdf = new SimpleDateFormat(
                                                    "yyyy-MM-dd HH:mm:ss");
                                            String formattedDate = sdf
                                                    .format(observationGroup
                                                            .getEffectiveDateTimeType()
                                                            .getValue());
                                            visitNotesData.setDate(formattedDate);
                                        }

                                        // Chief complaints
                                        List<String> chiefComplaints = new ArrayList<>();
                                        List<Observation> chiefComplaintsData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "chief-complaint",
                                                encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!chiefComplaintsData.isEmpty()) {
                                            for (Observation observation : chiefComplaintsData) {
                                                chiefComplaints.add(
                                                        observation.hasValueStringType()
                                                                ? observation.getValueStringType()
                                                                .toString()
                                                                : null);
                                            }
                                        }
                                        visitNotesData.setChiefComplains(chiefComplaints);
                                        // TO_BE_ADDED: -> SInjured
                                        List<Observation> injuredObservations = getObservationsByCategory(fhirClient, "visit-note-injured", encounter, false, true);
                                        if(!injuredObservations.isEmpty()){
                                            var observation = injuredObservations.get(0);
                                            visitNotesData.setInjured(observation.hasValueBooleanType() ? observation.getValueBooleanType().getValue() : null);
                                        }
                                        // historyOfPresentIllness
                                        List<String> historyOfPresentIllness = new ArrayList<>();
                                        List<Observation> historyOfPresentIllnessData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "history-of-preventive-illness",
                                                encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!historyOfPresentIllnessData
                                                .isEmpty()) {
                                            for (Observation observation : historyOfPresentIllnessData) {
                                                historyOfPresentIllness
                                                        .add(observation.hasValueStringType()
                                                                ? observation.getValueStringType()
                                                                .toString()
                                                                : null);
                                            }
                                        }
                                        visitNotesData.setHistoryOfPresentIllness(historyOfPresentIllness);

                                        // reviewOfOtherSystems -
                                        // review-of-other-system
                                        List<ReviewOfOtherSystemsDTO> reviewOfOtherSystems = new ArrayList<>();
                                        List<Observation> reviewOfOtherSystemsData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "review-of-other-system",
                                                encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!reviewOfOtherSystemsData.isEmpty()) {
                                            for (Observation observation : reviewOfOtherSystemsData) {
                                                ReviewOfOtherSystemsDTO data = new ReviewOfOtherSystemsDTO();
                                                data.setCode(observation.hasCode()
                                                                ? observation.getCode()
                                                                .getCoding()
                                                                .get(0)
                                                                .getCode()
                                                                .toString()
                                                                : null);
                                                data.setName(observation.hasCode()
                                                                ? observation.getCode()
                                                                .getCoding()
                                                                .get(0)
                                                                .getDisplay()
                                                                : null);
                                                data.setNotes(observation.getValueStringType()
                                                                .toString());
                                                reviewOfOtherSystems
                                                        .add(data);
                                            }
                                        }
                                        visitNotesData.setReviewOfOtherSystems(reviewOfOtherSystems);

                                        // pastMedicalHistory -
                                        // past-medical-history
                                        List<String> pastMedicalHistory = new ArrayList<>();
                                        List<Observation> pastMedicalHistoryData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "past-medical-history",
                                                encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!pastMedicalHistoryData.isEmpty()) {
                                            for (Observation observation : pastMedicalHistoryData) {
                                                pastMedicalHistory.add(
                                                        observation.hasValueStringType()
                                                                ? observation.getValueStringType()
                                                                .toString()
                                                                : null);
                                            }
                                        }
                                        visitNotesData.setPastMedicalHistory(pastMedicalHistory);

                                        // familyAndSocialHistory -
                                        // family-and-social-history
                                        List<String> familyAndSocialHistory = new ArrayList<>();
                                        List<Observation> familyAndSocialHistoryData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "family-and-social-history",
                                                encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!familyAndSocialHistoryData
                                                .isEmpty()) {
                                            for (Observation observation : familyAndSocialHistoryData) {
                                                familyAndSocialHistory
                                                        .add(observation.hasValueStringType()
                                                                ? observation.getValueStringType()
                                                                .toString()
                                                                : null);
                                            }
                                        }
                                        visitNotesData.setFamilyAndSocialHistory(familyAndSocialHistory);

                                        // generalExaminationObservation -
                                        // general-examination
                                        List<String> generalExaminationObservation = new ArrayList<>();
                                        List<Observation> generalExaminationObservationData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "general-examination",
                                                encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!generalExaminationObservationData
                                                .isEmpty()) {
                                            for (Observation observation : generalExaminationObservationData) {
                                                generalExaminationObservation
                                                        .add(observation.hasValueStringType()
                                                                ? observation.getValueStringType()
                                                                .toString()
                                                                : null);
                                            }
                                        }
                                        visitNotesData.setGeneralExaminationObservation(generalExaminationObservation);

                                        // localExamination - local-examination
                                        List<String> localExamination = new ArrayList<>();
                                        List<Observation> localExaminationData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "local-examination",
                                                encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!localExaminationData.isEmpty()) {
                                            for (Observation observation : localExaminationData) {
                                                localExamination.add(
                                                        observation.hasValueStringType()
                                                                ? observation.getValueStringType()
                                                                .toString()
                                                                : null);
                                            }
                                        }
                                        visitNotesData.setLocalExamination(localExamination);

                                        // systemicExaminationObservation -
                                        // systemic-examination
                                        List<ReviewOfOtherSystemsDTO> systemicExaminationObservation = new ArrayList<>();
                                        List<Observation> systemicExaminationObservationData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "systemic-examination",
                                                encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!systemicExaminationObservationData
                                                .isEmpty()) {
                                            for (Observation observation : systemicExaminationObservationData) {
                                                ReviewOfOtherSystemsDTO data = new ReviewOfOtherSystemsDTO();
                                                data.setCode(observation.hasCode()
                                                                ? observation.getCode()
                                                                .getCoding()
                                                                .get(0)
                                                                .getCode()
                                                                : null);
                                                data.setName(observation.hasCode()
                                                                ? observation.getCode()
                                                                .getCoding()
                                                                .get(0)
                                                                .getDisplay()
                                                                : null);
                                                data.setNotes(observation.getValueStringType()
                                                                .toString());
                                                systemicExaminationObservation
                                                        .add(data);
                                            }
                                        }
                                        visitNotesData.setSystemicExaminationObservation(systemicExaminationObservation);

                                        // doctorPlanOrSuggestion - doctor-plan
                                        List<String> doctorPlanOrSuggestion = new ArrayList<>();
                                        List<Observation> doctorPlanOrSuggestionData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "doctor-plan",
                                                encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!doctorPlanOrSuggestionData
                                                .isEmpty()) {
                                            for (Observation observation : doctorPlanOrSuggestionData) {
                                                doctorPlanOrSuggestion
                                                        .add(observation.hasValueStringType()
                                                                ? observation.getValueStringType()
                                                                .toString()
                                                                : null);
                                            }
                                        }
                                        visitNotesData.setDoctorPlanOrSuggestion(doctorPlanOrSuggestion);

                                        // providerSpeciality -
                                        // provider-speciality
                                        String providerSpeciality = null;
                                        List<Observation> providerSpecialityData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "provider-speciality",
                                                encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!providerSpecialityData.isEmpty()) {
                                            for (Observation observation : providerSpecialityData) {
                                                if (observation.hasValueStringType()) {
                                                    providerSpeciality = observation
                                                            .getValueStringType()
                                                            .toString();
                                                    break;
                                                }
                                            }
                                        }
                                        visitNotesData.setProviderSpeciality(providerSpeciality);
                                        visitNotes.add(visitNotesData);
                                    }
                                }

                                clinicalInformationDTO.setVitalSigns(vitalSigns);
                                clinicalInformationDTO.setVisitNotes(visitNotes);
                                templateData.setClinicalInformation(
                                        clinicalInformationDTO);

                                // Self Monitoring Clinical Information
                                SelfMonitoringClinicalInformationDTO selfMonitoringClinicalInformationDTO = new SelfMonitoringClinicalInformationDTO();
                                List<VitalSignDTO> selfVitalSigns = new ArrayList<>();
                                // Get Observation Group
                                List<Observation> selfObservationGroups = getObservationsByCategory(
                                        fhirClient,
                                        "self-vital-signs",
                                        encounter, true, false);
                                // System.out.println(observationGroups.size());
                                for (Observation observationGroup : selfObservationGroups) {
                                    List<Observation> observationsData = getObservationsByObservationGroupId(fhirClient,"self-vital-signs", encounter, observationGroup.getIdElement().getIdPart());
                                    if (!observationsData.isEmpty()) {
                                        VitalSignDTO vitalSign = new VitalSignDTO();
                                        for (Observation observation : observationsData) {
                                            // TODO: Improve the code to use
                                            // dynamically fetched LOINC
                                            // codes for vital
                                            // signs
                                            if (observation.hasCode()
                                                    && observation.getCode()
                                                    .getCoding()
                                                    .get(0)
                                                    .getCode()
                                                    .equals("85354-9")) {
                                                vitalSign.setBloodPressure(observation.hasValueStringType()
                                                                ? observation.getValueStringType()
                                                                .getValue()
                                                                : null);
                                            }
                                            if (observation.getCode()
                                                    .getCoding()
                                                    .get(0)
                                                    .getCode()
                                                    .equals("29463-7")) {
                                                vitalSign.setWeight(observation.hasValueQuantity() && observation.getValueQuantity().hasValue()
                                                                ? observation.getValueQuantity().getValue().intValue()
                                                                : null);
                                            }
                                            if (observation.getCode()
                                                    .getCoding()
                                                    .get(0)
                                                    .getCode()
                                                    .equals("8310-5")) {
                                                vitalSign.setTemperature(observation.hasValueQuantity() && observation.getValueQuantity().hasValue()
                                                                ? observation.getValueQuantity()
                                                                .getValue().intValue()
                                                                : null);
                                            }
                                            if (observation.getCode()
                                                    .getCoding()
                                                    .get(0)
                                                    .getCode()
                                                    .equals("8302-2")) {
                                                vitalSign.setHeight(observation.hasValueQuantity() && observation.getValueQuantity().hasValue()
                                                                ? observation.getValueQuantity()
                                                                .getValue().intValue()
                                                                : null);
                                            }
                                            if (observation.getCode()
                                                    .getCoding()
                                                    .get(0)
                                                    .getCode()
                                                    .equals("9279-1")) {
                                                vitalSign.setRespiration(observation.hasValueQuantity() && observation.getValueQuantity().hasValue()
                                                                ? observation.getValueQuantity()
                                                                .getValue().intValue()
                                                                : null);
                                            }
                                            if (observation.getCode()
                                                    .getCoding()
                                                    .get(0)
                                                    .getCode()
                                                    .equals("8867-4")) {
                                                vitalSign.setPulseRate(observation.hasValueQuantity()
                                                                ? observation.getValueQuantity()
                                                                .getValue().intValue()
                                                                : null);
                                            }
                                            if (observationGroup
                                                    .hasEffectiveDateTimeType()
                                                    && observationGroup
                                                    .getEffectiveDateTimeType()
                                                    .getValue() != null) {
                                                SimpleDateFormat sdf = new SimpleDateFormat(
                                                        "yyyy-MM-dd HH:mm:ss");
                                                String formattedDate = sdf
                                                        .format(observationGroup
                                                                .getEffectiveDateTimeType()
                                                                .getValue());
                                                vitalSign.setDateTime(formattedDate);
                                            } else {
                                                vitalSign.setDateTime(null);
                                            }

                                            if (observation.hasCategory() &&
                                                    !observation.getCategory().isEmpty() && observation.getCategory().get(0).hasCoding() &&
                                                    !observation.getCategory().get(0).getCoding().isEmpty() &&
                                                    observation.getCategory().get(0).getCoding().get(0).hasCode() &&
                                                    Objects.equals(observation.getCategory().get(0).getCoding().get(0).getCode(), "self-vital-signs")
                                            ) {
                                                vitalSign.setNotes(observation.hasNote() && !observation.getNote().isEmpty() && observation.getNote().get(0).hasText()
                                                                ? observation.getNote().get(0).getText()
                                                                : null);
                                            } else {
                                                vitalSign.setNotes(null);
                                            }
                                        }
                                        selfVitalSigns.add(vitalSign);
                                    }
                                }

                                selfMonitoringClinicalInformationDTO.setVitalSigns(selfVitalSigns);
                                templateData.setSelfMonitoringClinicalInformation(selfMonitoringClinicalInformationDTO);

                                // End Self Monitoring

                                // Allergies
                                List<AllergyIntolerance> allergyIntolerances = getAllergyTolerances(
                                        fhirClient,
                                        patient.getIdElement().getIdPart());
                                List<AllergiesDTO> allergiesDTOS = new ArrayList<>();
                                if (!allergyIntolerances.isEmpty()) {
                                    for (AllergyIntolerance allergyIntolerance : allergyIntolerances) {
                                        if (allergyIntolerance.hasCode()) {
                                            AllergiesDTO allergiesDTO = new AllergiesDTO();
                                            allergiesDTO.setCode(
                                                    allergyIntolerance
                                                            .hasCode()
                                                            && allergyIntolerance
                                                            .getCode()
                                                            .hasCoding()
                                                            && !allergyIntolerance
                                                            .getCode()
                                                            .getCoding()
                                                            .isEmpty()
                                                            ? allergyIntolerance
                                                            .getCode()
                                                            .getCoding()
                                                            .get(0)
                                                            .getCode()
                                                            : null);
                                            allergiesDTO.setCategory(
                                                    allergyIntolerance
                                                            .hasCategory()
                                                            && !allergyIntolerance
                                                            .getCategory()
                                                            .isEmpty()
                                                            ? allergyIntolerance
                                                            .getCategory()
                                                            .get(0)
                                                            .getCode()
                                                            : null);
                                            allergiesDTO.setName(
                                                    allergyIntolerance
                                                            .hasCode()
                                                            && allergyIntolerance
                                                            .getCode()
                                                            .hasText()
                                                            ? allergyIntolerance
                                                            .getCode()
                                                            .getText()
                                                            : null);
                                            allergiesDTO.setCriticality(
                                                    allergyIntolerance
                                                            .hasCriticality()
                                                            ? allergyIntolerance
                                                            .getCriticality()
                                                            .getDisplay()
                                                            .toString()
                                                            : null);
                                            allergiesDTO
                                                    .setVerificationStatus(
                                                            allergyIntolerance
                                                                    .hasVerificationStatus()
                                                                    && allergyIntolerance
                                                                    .getVerificationStatus()
                                                                    .hasCoding()
                                                                    ? allergyIntolerance
                                                                    .getVerificationStatus()
                                                                    .getCoding()
                                                                    .get(0)
                                                                    .getCode()
                                                                    .toString()
                                                                    : null);
                                            allergiesDTOS.add(allergiesDTO);
                                        }
                                    }
                                }

                                // Chronic conditions
                                List<ChronicConditionsDTO> chronicConditionsDTOS = new ArrayList<>();
                                List<Condition> conditions = getConditionsByCategory(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "chronic-condition");
                                if (!conditions.isEmpty()) {
                                    for (Condition condition : conditions) {
                                        ChronicConditionsDTO chronicConditionsDTO = new ChronicConditionsDTO();
                                        chronicConditionsDTO
                                                .setCode(condition
                                                        .hasCode()
                                                        && condition.getCode()
                                                        .hasCoding()
                                                        && !condition.getCode()
                                                        .getCoding()
                                                        .isEmpty()
                                                        && condition.getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .hasCode()
                                                        ? condition.getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getCode()
                                                        : null);
                                        chronicConditionsDTO.setName(condition
                                                .hasCategory()
                                                && !condition.getCategory()
                                                .isEmpty()
                                                && condition.getCategory()
                                                .get(0)
                                                .getCoding()
                                                .get(0)
                                                .hasCode()
                                                ? condition.getCategory()
                                                .get(0)
                                                .getCoding()
                                                .get(0)
                                                .getCode()
                                                : null);
                                        chronicConditionsDTO
                                                .setName(condition
                                                        .hasCode()
                                                        && condition.getCode()
                                                        .hasCoding()
                                                        && !condition.getCode()
                                                        .getCoding()
                                                        .isEmpty()
                                                        && condition.getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .hasDisplay()
                                                        ? condition.getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getDisplay()
                                                        : null);
                                        chronicConditionsDTO.setCriticality(
                                                condition.hasClinicalStatus()
                                                        && condition.getClinicalStatus()
                                                        .hasCoding()
                                                        && !condition.getClinicalStatus()
                                                        .getCoding()
                                                        .isEmpty()
                                                        && condition.getClinicalStatus()
                                                        .getCoding()
                                                        .get(0)
                                                        .hasCode()
                                                        ? condition.getClinicalStatus()
                                                        .getCoding()
                                                        .get(0)
                                                        .getCode()
                                                        : null);
                                        chronicConditionsDTO
                                                .setVerificationStatus(
                                                        condition.hasVerificationStatus()
                                                                && condition.getVerificationStatus()
                                                                .getCoding()
                                                                .get(0)
                                                                .hasCode()
                                                                ? condition.getVerificationStatus()
                                                                .getCoding()
                                                                .get(0)
                                                                .getCode()
                                                                : null);
                                        chronicConditionsDTOS.add(
                                                chronicConditionsDTO);
                                    }
                                }
                                templateData.setChronicConditions(
                                        chronicConditionsDTOS);

                                LifeStyleInformationDTO lifeStyleInformationDTO = new LifeStyleInformationDTO();
                                List<Observation> smokingObs = getObservationsByCategory(
                                        fhirClient,
                                        "smoking", encounter, true,
                                        false);
                                Map<String, Object> smoking = new LinkedHashMap<>();
                                if (!smokingObs.isEmpty()) {
                                    for (Observation observation : smokingObs) {
                                        if (observation.hasValue()
                                                && observation.hasValueBooleanType()) {
                                            smoking.put("use", observation
                                                    .getValueBooleanType()
                                                    .booleanValue());
                                            smoking.put("notes", observation
                                                    .getNote()
                                                    .stream()
                                                    .map(Annotation::getText)
                                                    .collect(Collectors
                                                            .joining(", ")));
                                            break;
                                        }
                                    }
                                }
                                lifeStyleInformationDTO.setSmoking(smoking);

                                List<Observation> alcoholUseObs = getObservationsByCategory(
                                        fhirClient,
                                        "alcohol-use", encounter,
                                        true, false);
                                Map<String, Object> alcoholUse = new LinkedHashMap<>();
                                if (!alcoholUseObs.isEmpty()) {
                                    for (Observation observation : alcoholUseObs) {
                                        if (observation.hasValue()
                                                && observation.hasValueBooleanType()) {
                                            alcoholUse.put("use",
                                                    observation.getValueBooleanType()
                                                            .booleanValue());
                                            alcoholUse.put("notes",
                                                    observation.getNote()
                                                            .stream()
                                                            .map(note -> note
                                                                    .getText())
                                                            .collect(Collectors
                                                                    .joining(", ")));
                                            break;
                                        }
                                    }
                                }
                                lifeStyleInformationDTO.setAlcoholUse(alcoholUse);

                                List<Observation> drugUseObs = getObservationsByCategory(
                                        fhirClient,
                                        "drug-use", encounter, true,
                                        false);
                                Map<String, Object> drugUse = new LinkedHashMap<>();
                                if (!drugUseObs.isEmpty()) {
                                    for (Observation observation : drugUseObs) {
                                        if (observation.hasValue()
                                                && observation.hasValueBooleanType()) {
                                            drugUse.put("use", observation
                                                    .getValueBooleanType()
                                                    .booleanValue());
                                            drugUse.put("notes", observation
                                                    .getNote()
                                                    .stream()
                                                    .map(note -> note
                                                            .getText())
                                                    .collect(Collectors
                                                            .joining(", ")));
                                            break;
                                        }
                                    }
                                }
                                lifeStyleInformationDTO.setDrugUse(drugUse);
                                templateData.setLifeStyleInformation(
                                        lifeStyleInformationDTO);

                                // Diagnosis details
                                List<DiagnosisDetailsDTO> diagnosisDetailsDTOS = new ArrayList<>();

                                List<Condition> conditionsList = getConditionsByCategory(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "encounter-diagnosis");
                                if (!conditionsList.isEmpty()) {
                                    for (Condition condition : conditionsList) {
                                        DiagnosisDetailsDTO diagnosisDetailsDTO = new DiagnosisDetailsDTO();
                                        diagnosisDetailsDTO.setDiagnosisCode(
                                                condition.hasCode()
                                                        ? condition.getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getCode()
                                                        .toString()
                                                        : null);
                                        diagnosisDetailsDTO.setDiagnosis(
                                                condition.hasCode()
                                                        ? condition.getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getDisplay()
                                                        : null);
                                        diagnosisDetailsDTO.setDiagnosisDate(
                                                condition.hasOnsetDateTimeType()
                                                        ? condition.getOnsetDateTimeType()
                                                        .getValue()
                                                        : null);
                                        diagnosisDetailsDTO
                                                .setDiagnosisDescription(
                                                        condition.hasCode()
                                                                ? condition.getCode()
                                                                .getText()
                                                                : null);
                                        diagnosisDetailsDTO.setCertainty(
                                                condition.hasVerificationStatus()
                                                        ? condition.getVerificationStatus()
                                                        .getCoding()
                                                        .get(0)
                                                        .getCode()
                                                        : null);
                                        diagnosisDetailsDTOS.add(
                                                diagnosisDetailsDTO);
                                    }
                                }
                                templateData.setDiagnosisDetails(diagnosisDetailsDTOS);

                                templateData.setAllergies(allergiesDTOS);

                                // Investigation details
                                List<InvestigationDetailsDTO> investigationDetailsDTOList = new ArrayList<>();
                                List<Observation> investigationDetailsGroup = getObservationsByCategory(
                                        fhirClient,
                                        "investigation-details", encounter,
                                        true, false);
                                // Visit notes
                                if (!investigationDetailsGroup.isEmpty()) {
                                    for (Observation observationGroup : investigationDetailsGroup) {
                                        InvestigationDetailsDTO investigationDetailsDTO = new InvestigationDetailsDTO();
                                        List<Observation> caseClassificationData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "case-classification",
                                                encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!caseClassificationData.isEmpty()) {
                                            for (Observation observation : caseClassificationData) {
                                                if (observation.hasValueStringType()) {
                                                    investigationDetailsDTO
                                                            .setCaseClassification(
                                                                    observation.getValueStringType()
                                                                            .toString());
                                                    break;
                                                }
                                            }
                                        }
                                        investigationDetailsDTO
                                                .setDateOccurred(
                                                        observationGroup.hasEffectiveDateTimeType()
                                                                ? observationGroup
                                                                .getEffectiveDateTimeType()
                                                                .getValue()
                                                                : null);

//                                        List<Observation> daysSinceSymptomsData = getObservationsByObservationGroupId(
//                                                fhirClient,
//                                                "days-since-symptoms",
//                                                encounter,
//                                                observationGroup.getIdElement()
//                                                        .getIdPart());

                                        List<Observation> daysSinceSymptomsData = getObservationsByCategoryAndCode(
                                                fhirClient,
                                                fhirContext,
                                                encounter,
                                                "days-since-symptoms",
                                                null);

                                        if (!daysSinceSymptomsData.isEmpty()) {
                                            for (Observation observation : daysSinceSymptomsData) {
                                                if (observation.hasValueQuantity()) {
                                                    investigationDetailsDTO
                                                            .setDaysSinceSymptoms(
                                                                    observation.getValueQuantity()
                                                                            .getValue()
                                                                            .intValueExact());
                                                    break;
                                                }
                                            }
                                        }

                                        List<Observation> diseaseCodeData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "disease-code",
                                                encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!diseaseCodeData.isEmpty()) {
                                            for (Observation observation : diseaseCodeData) {
                                                if (observation.hasValueCodeableConcept()) {
                                                    investigationDetailsDTO
                                                            .setDiseaseCode(observation
                                                                    .getValueCodeableConcept()
                                                                    .getCoding()
                                                                    .get(0)
                                                                    .getCode());
                                                    break;
                                                }
                                            }
                                        }
                                        List<Observation> labSpecimenTakenData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "lab-specimen-taken",
                                                encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!labSpecimenTakenData.isEmpty()) {
                                            for (Observation observation : labSpecimenTakenData) {
                                                if (observation.hasValueStringType()) {
                                                    investigationDetailsDTO
                                                            .setLabSpecimenTaken(
                                                                    observation.getValueStringType()
                                                                            .toString());
                                                    break;
                                                }
                                            }
                                        }
                                        List<Observation> specimenSentToData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "specimen-sent-to",
                                                encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!specimenSentToData.isEmpty()) {
                                            for (Observation observation : specimenSentToData) {
                                                if (observation.hasValueStringType()) {
                                                    investigationDetailsDTO
                                                            .setSpecimenSentTo(
                                                                    observation.getValueStringType()
                                                                            .toString());
                                                    break;
                                                }
                                            }
                                        }

                                        List<Observation> vaccinatedData = getObservationsByObservationGroupId(
                                                fhirClient,
                                                "vaccinated", encounter,
                                                observationGroup.getIdElement()
                                                        .getIdPart());
                                        if (!vaccinatedData.isEmpty()) {
                                            for (Observation observation : vaccinatedData) {
                                                if (observation.hasValueStringType()) {
                                                    investigationDetailsDTO
                                                            .setVaccinated(observation
                                                                    .getValueStringType()
                                                                    .toString());
                                                    break;
                                                }
                                            }
                                        }
                                        investigationDetailsDTOList.add(
                                                investigationDetailsDTO);
                                    }
                                }

                                templateData.setInvestigationDetails(
                                        investigationDetailsDTOList);

                                // Lab investigation details using DiagnosticReport
                                List<LabInvestigationDetailsDTO> labInvestigationDetailsDTOS = new ArrayList<>();
                                List<DiagnosticReport> diagnosticReports = getDiagnosticReportsByCategory(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "laboratory");
                                if (!diagnosticReports.isEmpty()) {
                                    for (DiagnosticReport diagnosticReport : diagnosticReports) {
                                        LabInvestigationDetailsDTO labInvestigationDetailsDTO = new LabInvestigationDetailsDTO();
                                        labInvestigationDetailsDTO.setTestCode(
                                                diagnosticReport.hasCode()
                                                        &&
                                                        diagnosticReport.getCode()
                                                                .hasCoding()
                                                        &&
                                                        !diagnosticReport
                                                                .getCode()
                                                                .getCoding()
                                                                .isEmpty()
                                                        ? diagnosticReport
                                                        .getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getCode()
                                                        : null);

                                        labInvestigationDetailsDTO
                                                .setTestResultDate(
                                                        diagnosticReport.hasEffectiveDateTimeType()
                                                                && diagnosticReport
                                                                .getEffectiveDateTimeType()
                                                                .hasValue()
                                                                ? diagnosticReport
                                                                .getEffectiveDateTimeType()
                                                                .getValue()
                                                                : null);
                                        labInvestigationDetailsDTO
                                                .setTestStatus(getNestedExtensionValueString(
                                                        diagnosticReport,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/diagonostic-report-results",
                                                        "testStatus"));

                                        List<Identifier> identifiers = diagnosticReport
                                                .getIdentifier();
                                        for (Identifier reportIdentifier : identifiers) {
                                            if (reportIdentifier.hasValue()
                                                    && reportIdentifier
                                                    .hasType()
                                                    && reportIdentifier
                                                    .getType()
                                                    .hasCoding()
                                                    && !reportIdentifier
                                                    .getType()
                                                    .getCoding()
                                                    .isEmpty()) {
                                                if (reportIdentifier
                                                        .getType()
                                                        .getCoding()
                                                        .get(0)
                                                        .getCode()
                                                        .equals("TEST-ORDER")) {
                                                    labInvestigationDetailsDTO
                                                            .setTestOrderId(reportIdentifier
                                                                    .getValue());
                                                } else if (reportIdentifier
                                                        .getType()
                                                        .getCoding()
                                                        .get(0)
                                                        .getCode()
                                                        .equals("SAMPLE-ID")) {
                                                    labInvestigationDetailsDTO
                                                            .setTestSampleId(
                                                                    reportIdentifier.getValue());
                                                }
                                            }
                                        }
                                        labInvestigationDetailsDTO
                                                .setTestOrderDate(
                                                        diagnosticReport.hasEffectiveDateTimeType()
                                                                ? diagnosticReport
                                                                .getEffectiveDateTimeType()
                                                                .getValue()
                                                                : null);

                                        labInvestigationDetailsDTO.setTestType(
                                                diagnosticReport.hasCode()
                                                        &&
                                                        diagnosticReport.getCode()
                                                                .hasCoding()
                                                        &&
                                                        !diagnosticReport
                                                                .getCode()
                                                                .getCoding()
                                                                .isEmpty()
                                                        ? diagnosticReport
                                                        .getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getDisplay()
                                                        : null);

                                        labInvestigationDetailsDTO
                                                .setStandardCode(
                                                        getNestedExtensionValueBoolean(
                                                                diagnosticReport,
                                                                "http://fhir.moh.go.tz/fhir/StructureDefinition/diagonostic-report-results",
                                                                "standardCode"));
                                        labInvestigationDetailsDTO.setCodeType(
                                                diagnosticReport.hasCode()
                                                        &&
                                                        diagnosticReport.getCode()
                                                                .hasCoding()
                                                        &&
                                                        !diagnosticReport
                                                                .getCode()
                                                                .getCoding()
                                                                .isEmpty()
                                                        && diagnosticReport
                                                        .getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getSystem()
                                                        .contains("loinc")
                                                        ? "LOINC"
                                                        : null);

                                        List<LabTestResultsDTO> labTestResultsDTOS = new ArrayList<>();
                                        if (diagnosticReport.hasResult()) {
                                            for (Reference reference : diagnosticReport
                                                    .getResult()) {
                                                LabTestResultsDTO labTestResultsDTO = new LabTestResultsDTO();
                                                IIdType obsReference = reference
                                                        .getReferenceElement();
                                                if (obsReference.getResourceType()
                                                        .equals("Observation")) {
                                                    Observation observation = fhirClient
                                                            .read()
                                                            .resource(Observation.class)
                                                            .withId(obsReference
                                                                    .getIdPart())
                                                            .execute();
                                                    labTestResultsDTO
                                                            .setStandardCode(
                                                                    getNestedExtensionValueBoolean(
                                                                            observation,
                                                                            "http://fhir.moh.go.tz/fhir/StructureDefinition/laboratory-results",
                                                                            "standardCode"));
                                                    labTestResultsDTO
                                                            .setReleaseDate(observation
                                                                    .hasEffectiveDateTimeType()
                                                                    ? observation.getEffectiveDateTimeType()
                                                                    .getValue()
                                                                    : null);
                                                    labTestResultsDTO
                                                            .setValueType(observation
                                                                    .hasValueStringType()
                                                                    ? "TEXT"
                                                                    : observation.hasValueQuantity()
                                                                    ? "NUMERIC"
                                                                    : observation.hasValueCodeableConcept()
                                                                    ? "CODED"
                                                                    : null);

                                                    labTestResultsDTO
                                                            .setResult(
                                                                    observation.hasInterpretation()
                                                                            && !observation.getInterpretation()
                                                                            .isEmpty()
                                                                            ? observation.getInterpretationFirstRep()
                                                                            .getText()
                                                                            : observation.hasValueStringType()
                                                                            ? observation.getValueStringType()
                                                                            .getValue()
                                                                            : observation.hasValueQuantity()
                                                                            ? String.valueOf(
                                                                            observation
                                                                                    .getValueQuantity()
                                                                                    .getValue())
                                                                            : observation
                                                                            .hasValueCodeableConcept()
                                                                            ? observation
                                                                            .getValueCodeableConcept()
                                                                            .getText()
                                                                            : null);

                                                    labTestResultsDTO
                                                            .setCodedValue(
                                                                    observation.hasCode()
                                                                            && observation.getCode()
                                                                            .hasText()
                                                                            ? observation.getCode()
                                                                            .getText()
                                                                            : null);
                                                    labTestResultsDTO
                                                            .setHighRange(getNestedExtensionValueString(
                                                                    observation,
                                                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/laboratory-results",
                                                                    "highRange"));
                                                    labTestResultsDTO
                                                            .setLowRange(getNestedExtensionValueString(
                                                                    observation,
                                                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/laboratory-results",
                                                                    "lowRange"));
                                                    labTestResultsDTO
                                                            .setRemarks(getNestedExtensionValueString(
                                                                    observation,
                                                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/laboratory-results",
                                                                    "remarks"));
                                                    labTestResultsDTO
                                                            .setCodeType(getNestedExtensionValueString(
                                                                    observation,
                                                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/laboratory-results",
                                                                    "codeType"));
                                                    labTestResultsDTO
                                                            .setParameter(getNestedExtensionValueString(
                                                                    observation,
                                                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/laboratory-results",
                                                                    "parameter"));
                                                    labTestResultsDTO
                                                            .setUnit(getNestedExtensionValueString(
                                                                    observation,
                                                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/laboratory-results",
                                                                    "unit"));
                                                }
                                                labTestResultsDTOS.add(
                                                        labTestResultsDTO);
                                            }
                                        }
                                        labInvestigationDetailsDTO
                                                .setTestResults(labTestResultsDTOS);
                                        labInvestigationDetailsDTOS.add(
                                                labInvestigationDetailsDTO);
                                    }
                                }

                                templateData.setLabInvestigationDetails(
                                        labInvestigationDetailsDTOS);

                                ReferralDetailsDTO referralDetailsDTO = new ReferralDetailsDTO();
                                // 1. get service request
                                // 2. Extract referral details data accordingly
                                List<ServiceRequest> serviceRequests = getServiceRequestsByCategory(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "referral-request");
                                if (!serviceRequests.isEmpty()) {
                                    for (ServiceRequest serviceRequest : serviceRequests) {
                                        if (serviceRequest.hasIdentifier()
                                                && serviceRequest
                                                .getIdentifier()
                                                .get(0)
                                                .hasType()
                                                && serviceRequest
                                                .getIdentifier()
                                                .get(0)
                                                .getType()
                                                .hasCoding()
                                                && !serviceRequest
                                                .getIdentifier()
                                                .get(0)
                                                .getType()
                                                .getCoding()
                                                .isEmpty()
                                                && serviceRequest
                                                .getIdentifier()
                                                .get(0)
                                                .getType()
                                                .getCoding()
                                                .get(0)
                                                .getCode()
                                                .equals("REFERRAL-NUMBER")) {
                                            referralDetailsDTO
                                                    .setReferralDate(
                                                            serviceRequest.hasAuthoredOn()
                                                                    ? serviceRequest.getAuthoredOn()
                                                                    : null);
                                            referralDetailsDTO
                                                    .setReferralNumber(
                                                            serviceRequest.hasIdentifier()
                                                                    && !serviceRequest
                                                                    .getIdentifier()
                                                                    .isEmpty()
                                                                    ? serviceRequest.getIdentifier()
                                                                    .get(0)
                                                                    .getValue()
                                                                    .replaceFirst(Pattern
                                                                                    .quote(orgCode + "-"),
                                                                            "")
                                                                    : null);
                                            List<String> reasons = new ArrayList<>();
                                            for (Reference reasonReference : serviceRequest
                                                    .getReasonReference()) {
                                                IIdType observationReference = reasonReference
                                                        .getReferenceElement();
                                                if (observationReference
                                                        .getResourceType()
                                                        .equals("Observation")) {
                                                    Observation observation = fhirClient
                                                            .read()
                                                            .resource(Observation.class)
                                                            .withId(observationReference
                                                                    .getIdPart())
                                                            .execute();
                                                    reasons.add(observation
                                                            .getValueStringType()
                                                            .toString());
                                                }
                                            }
                                            referralDetailsDTO.setReason(
                                                    reasons);
                                            referralDetailsDTO.setReferredToOtherCountry(getExtensionValueBoolean(serviceRequest, "http://fhir.moh.go.tz/fhir/StructureDefinition/extension-referred-to-other-country"));

                                            String facilityToCode = new String();
                                            List<Reference> performers = serviceRequest
                                                    .getPerformer();
                                            for (Reference reference : performers) {
                                                if (reference.hasReferenceElement()
                                                        && reference.getType()
                                                        .equals("Organization")) {
                                                    IIdType performerReference = reference
                                                            .getReferenceElement();
                                                    Organization performer = fhirClient
                                                            .read()
                                                            .resource(Organization.class)
                                                            .withId(performerReference
                                                                    .getIdPart())
                                                            .execute();
                                                    PrintOutHelper.print(
                                                            performer.getName());
                                                    referralDetailsDTO
                                                            .setHfrCode(performer
                                                                    .getIdElement()
                                                                    .getIdPart());
                                                    referralDetailsDTO
                                                            .setFacility(performer
                                                                    .getName());
                                                    break;
                                                }
                                            }

                                            Map<String, Object> referringClinician = new HashMap<>();
                                            Reference practitionerReference = serviceRequest
                                                    .getRequester();

                                            IIdType practitionerReferenceType = practitionerReference
                                                    .getReferenceElement();
                                            Practitioner practitioner = fhirClient
                                                    .read()
                                                    .resource(Practitioner.class)
                                                    .withId(practitionerReferenceType
                                                            .getIdPart())
                                                    .execute();
                                            referringClinician.put(
                                                    "MCTCode",
                                                    practitioner.hasIdentifier()
                                                            ? practitioner.getIdElement()
                                                            .getIdPart()
                                                            : null);
                                            referringClinician.put("name",
                                                    practitioner.hasName()
                                                            && !practitioner.getName()
                                                            .isEmpty()
                                                            ? practitioner.getName()
                                                            .get(0)
                                                            .getText()
                                                            : null);
                                            referringClinician.put(
                                                    "phoneNumber",
                                                    practitioner.hasTelecom()
                                                            && !practitioner.getTelecom()
                                                            .isEmpty()
                                                            && practitioner.getTelecom()
                                                            .get(0)
                                                            .hasValue()
                                                            ? practitioner.getTelecom()
                                                            .get(0)
                                                            .getValue()
                                                            : null);
                                            referralDetailsDTO
                                                    .setReferringClinician(
                                                            referringClinician);
                                            break;
                                        }
                                    }
                                }
                                // List<Identifier> identifiers =
                                // encounter.getIdentifier();
                                // for (Identifier identifierData : identifiers) {
                                // referralDetailsDTO.setReferralNumber(identifierData.getValue());
                                // break;
                                // }
                                templateData.setReferralDetails(referralDetailsDTO);

                                // Medication details
                                List<MedicationDetailsDTO> medicationDetailsDTOS = new ArrayList<>();
                                List<MedicationDispense> medicationDispensesList = getMedicationDispensesById(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart());

                                if (!medicationDispensesList.isEmpty()) {
                                    for (MedicationDispense medicationDispense : medicationDispensesList) {

                                        PrintOutHelper.print(
                                                "Medication Dispenses List: "
                                                        + medicationDispense);

                                        MedicationDetailsDTO medicationDetailsDTO = new MedicationDetailsDTO();
                                        medicationDetailsDTO.setCode(
                                                medicationDispense
                                                        .hasMedicationCodeableConcept()
                                                        && medicationDispense
                                                        .getMedicationCodeableConcept()
                                                        .hasCoding()
                                                        ? medicationDispense
                                                        .getMedicationCodeableConcept()
                                                        .getCoding()
                                                        .get(0)
                                                        .getCode()
                                                        : null);
                                        medicationDetailsDTO.setName(
                                                medicationDispense
                                                        .hasMedicationCodeableConcept()
                                                        && medicationDispense
                                                        .getMedicationCodeableConcept()
                                                        .hasCoding()
                                                        ? medicationDispense
                                                        .getMedicationCodeableConcept()
                                                        .getCoding()
                                                        .get(0)
                                                        .getDisplay()
                                                        : null);
                                        medicationDetailsDTO.setOrderDate(
                                                medicationDispense
                                                        .hasWhenHandedOver()
                                                        ? medicationDispense
                                                        .getWhenHandedOver()
                                                        : null);
                                        String code = medicationDispense
                                                .hasMedicationCodeableConcept()
                                                && medicationDispense
                                                .getMedicationCodeableConcept()
                                                .hasCoding()
                                                ? medicationDispense
                                                .getMedicationCodeableConcept()
                                                .getCoding()
                                                .get(0)
                                                .getSystem()
                                                : null;
                                        String codeStandard = code.contains(
                                                "msd") ? "MSD CODE"
                                                : code.contains("loinc")
                                                ? "LOINC"
                                                : null;
                                        medicationDetailsDTO.setCodeStandard(
                                                codeStandard);
                                        String duration = "";
                                        if (medicationDispense
                                                .getDaysSupply() != null) {
                                            duration = medicationDispense
                                                    .getDaysSupply()
                                                    .getValue()
                                                    + " "
                                                    + medicationDispense
                                                    .getDaysSupply()
                                                    .getUnit();
                                        }
                                        medicationDetailsDTO
                                                .setPeriodOfMedication(
                                                        duration);
                                        medicationDetailsDTO.setTreatmentType(
                                                medicationDispense
                                                        .hasType() ? medicationDispense.getType().getText()
                                                        : null);
                                        medicationDetailsDTO.setCurrentRefill(getExtensionValueInt(medicationDispense, "http://fhir.moh.go.tz/fhir/StructureDefinition/medication-current-refill"));
                                        medicationDetailsDTO.setMaxRefill(getExtensionValueInt(medicationDispense, "http://fhir.moh.go.tz/fhir/StructureDefinition/medication-max-refill"));
                                        if (medicationDispense
                                                .hasDosageInstruction()) {
                                            Dosage dosage = Iterables
                                                    .getLast(medicationDispense
                                                            .getDosageInstruction());
                                            Map<String, Object> dosagePayload = new HashMap<>();
                                            MedicationDetailPaymentDetailsDTO paymentDetailsPayload = new MedicationDetailPaymentDetailsDTO();

                                            List<ServiceRequest> paymentDetails = getServiceRequestsByCategory(
                                                    fhirClient,
                                                    encounter.getIdElement().getIdPart(),
                                                    "referral-request");

                                            ArrayList<BigDecimal> daysList = new ArrayList<>();
                                            ArrayList<String> schedules = new ArrayList<>();
                                            schedules.add(medicationDispense
                                                    .hasWhenPrepared()
                                                    ? medicationDispense
                                                    .getWhenPrepared()
                                                    .toString()
                                                    : null);
                                            schedules.add(medicationDispense
                                                    .hasWhenHandedOver()
                                                    ? medicationDispense
                                                    .getWhenHandedOver()
                                                    .toString()
                                                    : null);
                                            String quantity = "";
                                            if (medicationDispense
                                                    .hasQuantity()) {
                                                String unit = medicationDispense
                                                        .getQuantity()
                                                        .getUnit() == null
                                                        ? ""
                                                        : medicationDispense
                                                        .getQuantity()
                                                        .getUnit();
                                                quantity = medicationDispense
                                                        .getQuantity()
                                                        .getValue()
                                                        + ("null".equals(
                                                        unit) ? ""
                                                        : (" " + unit));
                                            }
                                            dosagePayload.put("dose",
                                                    quantity);
                                            dosagePayload.put("frequency",
                                                    dosage.hasTiming()
                                                            && dosage.getTiming()
                                                            .hasRepeat()
                                                            ? dosage.getTiming()
                                                            .getRepeat()
                                                            .getFrequency()
                                                            : null);
                                            dosagePayload.put("route",
                                                    dosage.hasRoute()
                                                            && dosage.getRoute()
                                                            .hasCoding()
                                                            ? dosage.getRoute()
                                                            .getCoding()
                                                            .get(0)
                                                            .getDisplay()
                                                            : null);
                                            dosagePayload.put(
                                                    "instructions",
                                                    dosage.hasText() ? dosage
                                                            .getText()
                                                            : null);
                                            dosagePayload.put("quantity",
                                                    medicationDispense
                                                            .hasQuantity()
                                                            ? medicationDispense
                                                            .getQuantity()
                                                            .getValue()
                                                            : null);
                                            dosagePayload.put("duration",
                                                    duration);
                                            daysList.add(medicationDispense
                                                    .hasDaysSupply()
                                                    ? medicationDispense
                                                    .getDaysSupply()
                                                    .getValue()
                                                    : null);
                                            dosagePayload.put("days",
                                                    daysList);
                                            dosagePayload.put("schedule",
                                                    schedules);
                                            dosagePayload.put("dosageDates",
                                                    schedules);
                                            medicationDetailsDTO.setDosage(
                                                    dosagePayload);
                                            medicationDetailsDTO
                                                    .setRefillStatus(
                                                            getExtensionValueString(
                                                                    medicationDispense,
                                                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/medication-refill-status"));


                                            List<PaymentNotice> paymentNoticeForMedication = getPaymentNoticesFromResource(medicationDispense);

                                            if (!paymentNoticeForMedication.isEmpty()) {
                                                paymentDetailsPayload.setControlNumber(
                                                        paymentNoticeForMedication.get(0)
                                                                .hasIdentifier()
                                                                && !paymentNoticeForMedication.get(0)
                                                                .getIdentifier()
                                                                .isEmpty()
                                                                && paymentNoticeForMedication.get(0)
                                                                .getIdentifier()
                                                                .get(0)
                                                                .hasValue() ? paymentNoticeForMedication.get(0)
                                                                .getIdentifier()
                                                                .get(0)
                                                                .getValue()
                                                                : null);


                                                paymentDetailsPayload.setStatusCode(
                                                        paymentNoticeForMedication.get(0).hasResponse()
                                                                && paymentNoticeForMedication.get(0)
                                                                .getResponse()
                                                                .hasIdentifier()
                                                                && paymentNoticeForMedication.get(0)
                                                                .getResponse()
                                                                .getIdentifier()
                                                                .hasValue() ? paymentNoticeForMedication.get(0)
                                                                .getResponse()
                                                                .getIdentifier()
                                                                .getId()
                                                                : null);

                                                paymentDetailsPayload.setStatus(
                                                        paymentNoticeForMedication.get(0)
                                                                .hasResponse()
                                                                && paymentNoticeForMedication.get(0)
                                                                .getResponse()
                                                                .hasIdentifier()
                                                                && paymentNoticeForMedication.get(0)
                                                                .getResponse()
                                                                .getIdentifier()
                                                                .hasValue() ? paymentNoticeForMedication.get(0)
                                                                .getResponse()
                                                                .getIdentifier()
                                                                .getValue()
                                                                : null);


                                                paymentDetailsPayload.setType(
                                                        getExtensionValueString(paymentNoticeForMedication.get(0), "http://fhir.moh.go.tz/fhir/StructureDefinition/payment-type"));

                                                paymentDetailsPayload.setDescription(
                                                        getExtensionValueString(paymentNoticeForMedication.get(0), "http://fhir.moh.go.tz/fhir/StructureDefinition/payment-description"));


                                                PrintOutHelper.print(paymentDetailsPayload);


                                                medicationDetailsDTO.setPaymentDetails(
                                                        paymentDetailsPayload
                                                );


                                            }

                                        }
                                        medicationDetailsDTOS.add(
                                                medicationDetailsDTO);
                                    }
                                    templateData.setMedicationDetails(
                                            medicationDetailsDTOS);
                                }

                                // Radiology detail
                                List<RadiologyDetailsDTO> radiologyDetailsDTOS = new ArrayList<>();
                                List<DiagnosticReport> diagnosticReportsList = getDiagnosticReportsByCategory(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "radiology-category");
                                if (!diagnosticReportsList.isEmpty()) {
                                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                                    for (DiagnosticReport diagnosticReport : diagnosticReportsList) {
                                        RadiologyDetailsDTO radiologyDetailsDTO = new RadiologyDetailsDTO();
                                        radiologyDetailsDTO.setTestDate(
                                                diagnosticReport.hasIssued()
                                                        ? diagnosticReport
                                                        .getIssued().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter)
                                                        : null);
                                        radiologyDetailsDTO.setTestTypeName(
                                                diagnosticReport.hasCode()
                                                        && diagnosticReport
                                                        .getCode()
                                                        .hasCoding()
                                                        ? diagnosticReport
                                                        .getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getDisplay()
                                                        : null);
                                        radiologyDetailsDTO.setTestTypeCode(
                                                diagnosticReport.hasCode()
                                                        && diagnosticReport
                                                        .getCode()
                                                        .hasCoding()
                                                        ? diagnosticReport
                                                        .getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getCode()
                                                        : null);
                                        radiologyDetailsDTO.setTestReport(
                                                diagnosticReport.hasConclusion()
                                                        ? diagnosticReport
                                                        .getConclusion()
                                                        : null);
                                        // TODO: Add testReport and bodySite
                                        String mediaReferenceId = diagnosticReport
                                                .hasMedia()
                                                ? diagnosticReport
                                                .getMedia()
                                                .get(0)
                                                .getLink()
                                                .getReference()
                                                : null;
                                        if (mediaReferenceId != null) {
                                            Media media = fhirClient.read()
                                                    .resource(Media.class)
                                                    .withId(mediaReferenceId)
                                                    .execute();
                                            radiologyDetailsDTO
                                                    .setUrl(media.hasContent()
                                                            ? media.getContent()
                                                            .getUrl()
                                                            : null);
                                        }
                                        radiologyDetailsDTOS.add(
                                                radiologyDetailsDTO);
                                    }
                                    templateData.setRadiologyDetails(
                                            radiologyDetailsDTOS);
                                }

                                // Outcome details
                                List<Observation> outcomeObservations = getObservationsByCategory(
                                        fhirClient,
                                        "outcome-details",
                                        encounter, false, true);
                                if (!outcomeObservations.isEmpty()) {
                                    Observation observation = outcomeObservations
                                            .get(0);
                                    OutcomeDetailsDTO outcomeDetailsDTO = new OutcomeDetailsDTO();
                                    outcomeDetailsDTO.setIsAlive(
                                            getComponentValueBoolean(
                                                    observation,
                                                    0));
                                    outcomeDetailsDTO.setDeathLocation(
                                            getComponentValueString(
                                                    observation,
                                                    1));
                                    outcomeDetailsDTO.setDeathDate(
                                            getComponentValueDateTime(
                                                    observation,
                                                    2));
                                    outcomeDetailsDTO.setContactTracing(
                                            getComponentValueBoolean(
                                                    observation,
                                                    3));
                                    outcomeDetailsDTO
                                            .setInvestigationConducted(
                                                    getComponentValueBoolean(
                                                            observation,
                                                            4));
                                    outcomeDetailsDTO.setQuarantined(
                                            getComponentValueBoolean(
                                                    observation,
                                                    5));
                                    outcomeDetailsDTO.setReferred(
                                            getComponentValueBoolean(
                                                    observation,
                                                    6));

                                    List<Observation.ObservationComponentComponent> dischargedLocationComponents = getComponentsByCode(observation, "http://fhir.moh.go.tz/fhir/ValueSet/otucome-category", "outcome-discharged-location");



                                    outcomeDetailsDTO.setDischargedLocation(
                                            !dischargedLocationComponents.isEmpty() && dischargedLocationComponents.get(0).hasValueStringType() ?
                                                    DischargedLocation.fromString(dischargedLocationComponents.get(0).getValueStringType().getValueAsString()) : null
                                    );
                                    templateData.setOutcomeDetails(
                                            outcomeDetailsDTO);
                                }

                                // Cause of death details
                                List<Observation> causeOfDeathObservations = getObservationsByCategory(
                                        fhirClient,
                                        "cause-of-death",
                                        encounter, false, true);
                                if (!causeOfDeathObservations.isEmpty()) {
                                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                                    Observation observation = causeOfDeathObservations
                                            .get(0);
                                    CausesOfDeathDetailsDTO causesOfDeathDetailsDTO = new CausesOfDeathDetailsDTO();
                                    causesOfDeathDetailsDTO.setDateOfDeath(
                                            observation.hasEffectiveDateTimeType()
                                                    ? observation.getEffectiveDateTimeType()
                                                    .getValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter)
                                                    : null);
                                    causesOfDeathDetailsDTO.setLineA(
                                            observation.hasComponent()
                                                    && !observation.getComponent()
                                                    .isEmpty()
                                                    && observation.getComponent()
                                                    .get(0)
                                                    .hasValueStringType()
                                                    ? observation.getComponent()
                                                    .get(0)
                                                    .getValueStringType()
                                                    .toString()
                                                    : null);

                                    causesOfDeathDetailsDTO.setLineB(
                                            observation.hasComponent()
                                                    && observation.getComponent()
                                                    .size() > 1
                                                    && observation.getComponent()
                                                    .get(1)
                                                    .hasValueStringType()
                                                    ? observation.getComponent()
                                                    .get(1)
                                                    .getValueStringType()
                                                    .toString()
                                                    : null);

                                    causesOfDeathDetailsDTO.setLineC(
                                            observation.hasComponent()
                                                    && observation.getComponent()
                                                    .size() > 2
                                                    && observation.getComponent()
                                                    .get(2)
                                                    .hasValueStringType()
                                                    ? observation.getComponent()
                                                    .get(2)
                                                    .getValueStringType()
                                                    .toString()
                                                    : null);

                                    causesOfDeathDetailsDTO.setLineD(
                                            observation.hasComponent()
                                                    && observation.getComponent()
                                                    .size() > 3
                                                    && observation.getComponent()
                                                    .get(3)
                                                    .hasValueStringType()
                                                    ? observation.getComponent()
                                                    .get(3)
                                                    .getValueStringType()
                                                    .toString()
                                                    : null);

                                    causesOfDeathDetailsDTO.setCauseOfDeathOther(
                                            observation.hasComponent()
                                                    && observation.getComponent()
                                                    .size() > 4
                                                    && observation.getComponent()
                                                    .get(4)
                                                    .hasValueStringType()
                                                    ? observation.getComponent()
                                                    .get(4)
                                                    .getValueStringType()
                                                    .toString()
                                                    : null);

                                    causesOfDeathDetailsDTO.setPlaceOfDeath(
                                            observation.hasComponent()
                                                    && observation.getComponent()
                                                    .size() > 5
                                                    && observation.getComponent()
                                                    .get(5)
                                                    .hasValueStringType()
                                                    ? observation.getComponent()
                                                    .get(5)
                                                    .getValueStringType()
                                                    .toString()
                                                    : null);

                                    causesOfDeathDetailsDTO.setMannerOfDeath(
                                            observation.hasComponent()
                                                    && observation.getComponent()
                                                    .size() > 6
                                                    && observation.getComponent()
                                                    .get(6)
                                                    .hasValueStringType()
                                                    ? observation.getComponent()
                                                    .get(6)
                                                    .getValueStringType()
                                                    .toString()
                                                    : null);

                                    OtherDeathDetailsDTO otherDeathDetailsDTO = new OtherDeathDetailsDTO();

                                    otherDeathDetailsDTO.setPostmortemDetails(
                                            observation.hasComponent()
                                                    && observation.getComponent()
                                                    .size() > 7
                                                    && observation.getComponent()
                                                    .get(7)
                                                    .hasValueStringType()
                                                    ? observation.getComponent()
                                                    .get(7)
                                                    .getValueStringType()
                                                    .toString()
                                                    : null);

                                    otherDeathDetailsDTO.setMarcerated(
                                            observation.hasComponent()
                                                    && observation.getComponent()
                                                    .size() > 8
                                                    && observation.getComponent()
                                                    .get(8)
                                                    .hasValueBooleanType()
                                                    && observation.getComponent()
                                                    .get(8)
                                                    .getValueBooleanType()
                                                    .getValue() != null
                                                    ? observation.getComponent()
                                                    .get(8)
                                                    .getValueBooleanType()
                                                    .getValue()
                                                    : null);

                                    otherDeathDetailsDTO.setFresh(
                                            observation.hasComponent()
                                                    && observation.getComponent()
                                                    .size() > 9
                                                    && observation.getComponent()
                                                    .get(9)
                                                    .hasValueBooleanType()
                                                    && observation.getComponent()
                                                    .get(9)
                                                    .getValueBooleanType()
                                                    .getValue() != null
                                                    ? observation.getComponent()
                                                    .get(9)
                                                    .getValueBooleanType()
                                                    .getValue()
                                                    : null);

                                    otherDeathDetailsDTO.setMotherCondition(
                                            observation.hasComponent()
                                                    && observation.getComponent()
                                                    .size() > 10
                                                    && observation.getComponent()
                                                    .get(10)
                                                    .hasValueStringType()
                                                    ? observation.getComponent()
                                                    .get(10)
                                                    .getValueStringType()
                                                    .toString()
                                                    : null);
                                    causesOfDeathDetailsDTO.setOtherDeathDetails(
                                            otherDeathDetailsDTO);

                                    templateData.setCausesOfDeathDetails(
                                            causesOfDeathDetailsDTO);
                                }

                                // Antenatal care details
                                List<Observation> antenatalCareObservations = getObservationsByCategory(
                                        fhirClient,
                                        "anc-details",
                                        encounter, false, true);
                                if (!antenatalCareObservations.isEmpty()) {
                                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                                    Observation observation = antenatalCareObservations
                                            .get(0);
                                    AntenatalCareDetailsDTO antenatalCareDetailsDTO = new AntenatalCareDetailsDTO();
                                    antenatalCareDetailsDTO.setDate(observation
                                            .hasEffectiveDateTimeType()
                                            ? observation.getEffectiveDateTimeType()
                                            .getValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter)
                                            : null);
                                    antenatalCareDetailsDTO
                                            .setPregnancyAgeInWeeks(
                                                    getComponentValueQuantityInt(
                                                            observation,
                                                            0) != null
                                                            ? getComponentValueQuantityInt(
                                                            observation,
                                                            0)
                                                            .intValue()
                                                            : null);
                                    antenatalCareDetailsDTO
                                            .setPositiveHivStatusBeforeService(
                                                    getComponentValueBoolean(
                                                            observation,
                                                            1));
                                    antenatalCareDetailsDTO.setReferredToCTC(
                                            getComponentValueBoolean(
                                                    observation,
                                                    4));

                                    antenatalCareDetailsDTO.setLastAncVisitDate(
                                            getExtensionValueString(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/anc-lastAncVisitDate")
                                    );

                                    antenatalCareDetailsDTO.setReferredIn(
                                            getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/anc-referredIn")
                                    );

                                    antenatalCareDetailsDTO.setReferredOut(
                                            getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/anc-referredIn")
                                    );

                                    List<CounsellingDTO> counsellingDTOList =  new ArrayList<CounsellingDTO>();

                                    List<Observation.ObservationComponentComponent> counsellingComponents = getComponentsByCode(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/counselling-types", "counselling");
                                    for(Observation.ObservationComponentComponent counsellingComponent: counsellingComponents){
                                        CounsellingDTO counsellingDTO = new CounsellingDTO();
                                        counsellingDTO.setCode(
                                                counsellingComponent.hasValueCodeableConcept() &&
                                                        counsellingComponent.getValueCodeableConcept().hasCoding() &&
                                                        !counsellingComponent.getValueCodeableConcept().getCoding().isEmpty() &&
                                                        counsellingComponent.getValueCodeableConcept().getCoding().get(0).hasCode() ? counsellingComponent.getValueCodeableConcept().getCoding().get(0).getCode() : null
                                        );

                                        counsellingDTO.setName(
                                                counsellingComponent.hasValueCodeableConcept() &&
                                                        counsellingComponent.getValueCodeableConcept().hasCoding() &&
                                                        !counsellingComponent.getValueCodeableConcept().getCoding().isEmpty() &&
                                                        counsellingComponent.getValueCodeableConcept().getCoding().get(0).hasDisplay() ? counsellingComponent.getValueCodeableConcept().getCoding().get(0).getDisplay() : null
                                        );

                                        counsellingDTOList.add(counsellingDTO);
                                    }

                                    antenatalCareDetailsDTO.setCounselling(counsellingDTOList);

                                    antenatalCareDetailsDTO.setProvidedWithHivCounsellingBeforeLabTest(
                                            getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/anc-providedWithHivCounsellingBeforeLabTest")
                                    );

                                    antenatalCareDetailsDTO.setProvidedWithHivCounsellingAfterLabTest(
                                            getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/anc-providedWithHivCounsellingAfterLabTest")
                                    );

                                    ANCProphylaxisDetailsDTO ancProphylaxisDetailsDTO = new ANCProphylaxisDetailsDTO();

                                    List<Observation.ObservationComponentComponent> prophylaxisWithLLINComponents = getComponentsByCode(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/anc-prophylaxis-codes", "prophylaxis-llin");

                                    List<Observation.ObservationComponentComponent> prophylaxisWithIPT2Components = getComponentsByCode(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/anc-prophylaxis-codes", "prophylaxis-ipt2");

                                    List<Observation.ObservationComponentComponent> prophylaxisWithIPT3Components = getComponentsByCode(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/anc-prophylaxis-codes", "prophylaxis-ipt3");

                                    List<Observation.ObservationComponentComponent> prophylaxisWithIPT4Components = getComponentsByCode(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/anc-prophylaxis-codes", "prophylaxis-ipt4");

                                    List<Observation.ObservationComponentComponent> providedWithIFFolic60TabletsComponents = getComponentsByCode(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/anc-prophylaxis-codes", "prophylaxis-if-folic");

                                    List<Observation.ObservationComponentComponent> providedWithMebendazoleOrAlbendazoleComponents = getComponentsByCode(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/anc-prophylaxis-codes", "prophylaxis-mebendazole");

                                    ancProphylaxisDetailsDTO.setProvidedWithLLIN(
                                            !prophylaxisWithLLINComponents.isEmpty() && prophylaxisWithLLINComponents.get(0).hasValueBooleanType() ? prophylaxisWithLLINComponents.get(0).getValueBooleanType().getValue() : null
                                    );

                                    ancProphylaxisDetailsDTO.setProvidedWithIPT2(
                                            !prophylaxisWithIPT2Components.isEmpty() && prophylaxisWithIPT2Components.get(0).hasValueBooleanType() ? prophylaxisWithIPT2Components.get(0).getValueBooleanType().getValue() : null
                                    );

                                    ancProphylaxisDetailsDTO.setProvidedWithIFFolic60Tablets(
                                            !providedWithIFFolic60TabletsComponents.isEmpty() && providedWithIFFolic60TabletsComponents.get(0).hasValueBooleanType() ? providedWithIFFolic60TabletsComponents.get(0).getValueBooleanType().getValue() : null
                                    );

                                    ancProphylaxisDetailsDTO.setProvidedWithMebendazoleOrAlbendazole(
                                            !providedWithMebendazoleOrAlbendazoleComponents.isEmpty() && providedWithMebendazoleOrAlbendazoleComponents.get(0).hasValueBooleanType() ? providedWithMebendazoleOrAlbendazoleComponents.get(0).getValueBooleanType().getValue() : null
                                    );

                                    ancProphylaxisDetailsDTO.setProvidedWithIPT3(
                                            !prophylaxisWithIPT3Components.isEmpty() && prophylaxisWithIPT3Components.get(0).hasValueBooleanType() ? prophylaxisWithIPT3Components.get(0).getValueBooleanType().getValue() : null
                                    );

                                    ancProphylaxisDetailsDTO.setProvidedWithIPT4(
                                            !prophylaxisWithIPT4Components.isEmpty() && prophylaxisWithIPT4Components.get(0).hasValueBooleanType() ? prophylaxisWithIPT4Components.get(0).getValueBooleanType().getValue() : null
                                    );

                                    antenatalCareDetailsDTO.setProphylaxis(ancProphylaxisDetailsDTO);

                                    HivDiseaseStatusDTO hivDetails = new HivDiseaseStatusDTO();
                                    hivDetails.setStatus(STATUS.fromString(getComponentValueCodeableConceptDisplay(
                                                    observation,
                                                    9)));
                                    hivDetails.setCode(getComponentValueCodeableConceptCode(
                                                    observation,
                                                    9));
                                    hivDetails.setHivTestNumber(getExtensionValueInt(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/anc-hivDetails-hivTestNumber"));
                                    antenatalCareDetailsDTO
                                            .setHivDetails(hivDetails);

                                    DiseaseStatusDTO syphilisDetails = new DiseaseStatusDTO();
                                    syphilisDetails.setStatus(STATUS.fromString(getComponentValueCodeableConceptDisplay(
                                            observation,
                                            8)));
                                    syphilisDetails.setCode(getComponentValueCodeableConceptCode(
                                            observation,
                                            8));
                                    syphilisDetails.setProvidedWithTreatment(
                                            getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/anc-syphilisDetails-providedWithTreatment")
                                    );
                                    antenatalCareDetailsDTO.setSyphilisDetails(
                                            syphilisDetails);

                                    antenatalCareDetailsDTO.setDiagnosedWithOtherSTDs(
                                            getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/anc-diagnosedWithOtherSTDs")
                                    );

                                    antenatalCareDetailsDTO.setProvidedWithTreatmentForOtherSTDs(
                                            getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/anc-providedWithTreatmentForOtherSTDs")
                                    );

                                    antenatalCareDetailsDTO.setGravidity(
                                            getComponentIntValue(
                                                    observation,
                                                    5));

                                    SpouseDetailsDTO spouseDetails = new SpouseDetailsDTO();

                                    HivDiseaseStatusDTO spouseHivDetails = new HivDiseaseStatusDTO();
                                    spouseHivDetails.setCode(
                                            getComponentValueCodeableConceptCode(
                                                    observation,
                                                    6));
                                    spouseHivDetails.setStatus(STATUS.fromString(getComponentValueCodeableConceptDisplay(
                                            observation, 6)));

                                    spouseHivDetails.setHivTestNumber(getExtensionValueInt(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/anc-spouseDetails-hivDetails-hivTestNumber"));

                                    DiseaseStatusDTO spouseHepatitisBDetails = new DiseaseStatusDTO();

                                    List<Observation.ObservationComponentComponent> spouseHepatitisBDetailsComponents = getComponentsByCode(observation, "http://loinc.org", "16935-9");

                                    spouseHepatitisBDetails.setCode(
                                            !spouseHepatitisBDetailsComponents.isEmpty() && spouseHepatitisBDetailsComponents.get(0).hasValueCodeableConcept() &&
                                                    spouseHepatitisBDetailsComponents.get(0).getValueCodeableConcept().hasCoding() &&
                                                    !spouseHepatitisBDetailsComponents.get(0).getValueCodeableConcept().getCoding().isEmpty() &&
                                                    spouseHepatitisBDetailsComponents.get(0).getValueCodeableConcept().getCoding().get(0).hasCode() ?
                                                    spouseHepatitisBDetailsComponents.get(0).getValueCodeableConcept().getCoding().get(0).getCode() : null
                                    );

                                    spouseHepatitisBDetails.setStatus( STATUS.fromString(
                                            !spouseHepatitisBDetailsComponents.isEmpty() && spouseHepatitisBDetailsComponents.get(0).hasValueCodeableConcept() &&
                                                    spouseHepatitisBDetailsComponents.get(0).getValueCodeableConcept().hasCoding() &&
                                                    !spouseHepatitisBDetailsComponents.get(0).getValueCodeableConcept().getCoding().isEmpty() &&
                                                    spouseHepatitisBDetailsComponents.get(0).getValueCodeableConcept().getCoding().get(0).hasDisplay() ?
                                                    spouseHepatitisBDetailsComponents.get(0).getValueCodeableConcept().getCoding().get(0).getDisplay() : null
                                    ));

                                    spouseHepatitisBDetails.setProvidedWithTreatment(
                                            getExtensionValueBoolean(observation,"http://fhir.moh.go.tz/fhir/StructureDefinition/anc-spouseDetails-hepatitisB-providedWithTreatments")
                                    );


                                    DiseaseStatusDTO spouseSyphilisDetails = new DiseaseStatusDTO();
                                    spouseSyphilisDetails.setCode(
                                            getComponentValueCodeableConceptCode(
                                                    observation,
                                                    7));
                                    spouseSyphilisDetails
                                            .setStatus(STATUS.fromString(getComponentValueCodeableConceptDisplay(
                                                    observation,
                                                    7)));
                                    spouseSyphilisDetails.setProvidedWithTreatment(
                                            getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/anc-spouseDetails-syphilisDetails-providedWithTreatment")
                                    );

                                    spouseDetails.setHivDetails(spouseHivDetails);
                                    spouseDetails.setHepatitisB(spouseHepatitisBDetails);
                                    spouseDetails.setSyphilisDetails(
                                            spouseSyphilisDetails);

                                    // TODO: Add other spouse details
                                    antenatalCareDetailsDTO.setSpouseDetails(
                                            spouseDetails);

                                    templateData.setAntenatalCareDetails(
                                            antenatalCareDetailsDTO);
                                }

                                // ProphylaxisDetails
                                List<ProphylaxisDetailsDTO> prophylaxisDetailsDTOS = new ArrayList<>();
                                List<Procedure> prophylaxisProcedures = getProceduresByCategoryAndObservationReference(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "prophyl-axis-details", null);
                                if (!prophylaxisProcedures.isEmpty()) {
                                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                                    for (Procedure procedure : prophylaxisProcedures) {
                                        ProphylaxisDetailsDTO prophylAxisDetailsDTO = new ProphylaxisDetailsDTO();
                                        prophylAxisDetailsDTO.setDate(procedure
                                                .hasPerformedDateTimeType()
                                                ? procedure.getPerformedDateTimeType()
                                                .getValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter)
                                                : null);
                                        if (procedure.hasCode() && !procedure
                                                .getCode().getCoding()
                                                .isEmpty()) {
                                            prophylAxisDetailsDTO
                                                    .setCode(procedure
                                                            .getCode()
                                                            .getCoding()
                                                            .get(0)
                                                            .getCode());
                                        }
                                        prophylAxisDetailsDTO
                                                .setCode(procedure
                                                        .hasCode()
                                                        && procedure.getCode()
                                                        .hasText()
                                                        ? procedure.getCode()
                                                        .getText()
                                                        : null);

                                        prophylAxisDetailsDTO.setType(
                                                procedure
                                                        .hasCode()
                                                        && procedure.getCode()
                                                        .hasText()
                                                        ? procedure.getCode()
                                                        .getText()
                                                        : null
                                        );

                                        prophylAxisDetailsDTO
                                                .setName(procedure
                                                        .hasCode()
                                                        && procedure.getCode()
                                                        .hasCoding()
                                                        && !procedure.getCode()
                                                        .getCoding()
                                                        .isEmpty()
                                                        && procedure.getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .hasDisplay()
                                                        ? procedure.getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getDisplay()
                                                        : null);
                                        prophylAxisDetailsDTO.setStatus(
                                                procedure.hasStatus()
                                                        ? procedure.getStatus()
                                                        .getDisplay()
                                                        : null);
                                        prophylAxisDetailsDTO
                                                .setNotes(procedure
                                                        .hasNote()
                                                        && !procedure.getNote()
                                                        .isEmpty()
                                                        ? procedure.getNote()
                                                        .get(0)
                                                        .getText()
                                                        : null);
                                        ReactionDTO prophylaxisReaction = new ReactionDTO();
                                        if (procedure.hasExtension()
                                                && !procedure.getExtension()
                                                .isEmpty()) {
                                            Date reactionDate = getNestedExtensionValueDateTime(
                                                    procedure,
                                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/event-date",
                                                    "reactionDate");
                                            prophylaxisReaction
                                                    .setReactionDate( reactionDate != null ?
                                                            reactionDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter) : null);
                                            prophylaxisReaction.setReported(
                                                    getNestedExtensionValueBoolean(
                                                            procedure,
                                                            "http://fhir.moh.go.tz/fhir/StructureDefinition/event-date",
                                                            "reported"));
                                            prophylaxisReaction.setNotes(
                                                    getNestedExtensionValueString(
                                                            procedure,
                                                            "http://fhir.moh.go.tz/fhir/StructureDefinition/event-date",
                                                            "reactionNotes"));
                                        }
                                        prophylAxisDetailsDTO.setReaction(
                                                prophylaxisReaction);
                                        prophylaxisDetailsDTOS.add(
                                                prophylAxisDetailsDTO);
                                    }
                                    templateData.setProphylAxisDetails(
                                            prophylaxisDetailsDTOS);
                                }

                                // Treatment details
                                TreatmentDetailsDTO treatmentDetailsDTO = new TreatmentDetailsDTO();

                                // Chemotherapy treatment
                                List<Procedure> chemotherapyProcedures = getProceduresByCategoryAndObservationReference(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "chemotherapy-treatment", null);
                                if (!chemotherapyProcedures.isEmpty()) {
                                    List<Map<String, Object>> chemotherapyTreatment = new ArrayList<>();
                                    for (Procedure procedure : chemotherapyProcedures) {
                                        Map<String, Object> chemoTherapy = new HashMap<>();
                                        chemoTherapy.put("diagnosis",
                                                procedure.hasReasonCode()
                                                        && !procedure.getReasonCode()
                                                        .isEmpty()
                                                        && procedure.getReasonCode()
                                                        .get(0)
                                                        .hasCoding()
                                                        ? procedure.getReasonCode()
                                                        .get(0)
                                                        .getCoding()
                                                        .get(0)
                                                        .getDisplay()
                                                        : null);
                                        chemoTherapy.put("regiment",
                                                getNestedExtensionValueString(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/chemotherapy-details",
                                                        "regiment"));
                                        chemoTherapy.put("stage",
                                                getNestedExtensionValueInteger(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/chemotherapy-details",
                                                        "stage"));
                                        chemoTherapy.put(
                                                "totalNumberOfExpectedCycles",
                                                getNestedExtensionValueInteger(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/chemotherapy-details",
                                                        "totalExpectedCycles"));
                                        chemoTherapy.put(
                                                "currentChemotherapeuticCycles",
                                                getNestedExtensionValueInteger(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/chemotherapy-details",
                                                        "currentCycles"));
                                        chemotherapyTreatment.add(chemoTherapy);
                                    }
                                    treatmentDetailsDTO.setChemoTherapy(
                                            chemotherapyTreatment);
                                }

                                // Radiotherapy treatment
                                List<Procedure> radiotherapyProcedures = getProceduresByCategoryAndObservationReference(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "radiotherapy-treatment", null);
                                if (!radiotherapyProcedures.isEmpty()) {
                                    List<Map<String, Object>> radioTherapyTreatment = new ArrayList<>();
                                    for (Procedure procedure : radiotherapyProcedures) {
                                        Map<String, Object> radioTherapy = new HashMap<>();
                                        // Prescription
                                        Map<String, Object> prescription = new HashMap<>();
                                        prescription.put("type",
                                                getNestedExtensionValueString(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/radiotherapy-details",
                                                        "prescriptionType"));
                                        prescription.put("intention",
                                                getNestedExtensionValueString(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/radiotherapy-details",
                                                        "intention"));
                                        prescription.put("technique",
                                                getNestedExtensionValueString(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/radiotherapy-details",
                                                        "technique"));
                                        prescription.put("site",
                                                getNestedExtensionValueString(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/radiotherapy-details",
                                                        "site"));
                                        prescription.put("dailyDose",
                                                getResourceNestedExtensionQuantityValue(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/radiotherapy-details",
                                                        "dailyDose"));
                                        prescription.put("totalDose",
                                                getResourceNestedExtensionQuantityValue(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/radiotherapy-details",
                                                        "totalDose"));
                                        // TODO: Add the following values
                                        // startDate, dosageDates,
                                        // administrationDates
                                        // and remarks
                                        // Dosage dates
                                        List<String> dosageDates = new ArrayList<>();
                                        // Administration dates
                                        List<String> administrationDates = new ArrayList<>();

                                        // Reports
                                        List<Map<String, Object>> reports = new ArrayList<>();
                                        if (procedure.hasReport()) {
                                            List<Reference> payLoadReports = procedure
                                                    .getReport();
                                            for (Reference reference : payLoadReports) {
                                                Map<String, Object> report = new HashMap<>();
                                                // Check if the
                                                // reference has an ID
                                                // or a reference URL
                                                if (reference.getId() == null) {
                                                    System.out.println(
                                                            "****Reference object is missing ID and Reference: "
                                                                    + reference);
                                                    continue; // Skip
                                                    // this
                                                    // iteration
                                                }
                                                DocumentReference documentReference = getDocumentReferenceById(
                                                        reference.getId());
                                                if (documentReference != null) {
                                                    report.put("date",
                                                            documentReference
                                                                    .hasDate() ? documentReference.getDate()
                                                                    : null);
                                                    // TODO:
                                                    // attachments
                                                    // is a string
                                                    // but has been
                                                    // saved as a
                                                    // list in the
                                                    // radiologytherapy
                                                    // treatment
                                                    // report.put("attachments",
                                                    // documentReference.hasAttachment()
                                                    // ?
                                                    // documentReference.getAttachment()
                                                    // : null);
                                                    report.put("MU", getNestedExtensionValueInteger(
                                                            documentReference,
                                                            "http://fhir.moh.go.tz/fhir/StructureDefinition/radiotherapy-report",
                                                            "measurementUnits"));
                                                }
                                                reports.add(report);
                                            }
                                        }

                                        radioTherapy.put("prescription",
                                                prescription);
                                        radioTherapy.put("report", reports);
                                        radioTherapyTreatment.add(radioTherapy);
                                    }
                                    treatmentDetailsDTO.setRadioTherapy(
                                            radioTherapyTreatment);
                                }

                                // surgery procedure
                                List<Procedure> surgeryProcedures = getProceduresByCategoryAndObservationReference(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "surgery-treatment", null);
                                if (!surgeryProcedures.isEmpty()) {
                                    List<Map<String, Object>> surgeryTreatment = new ArrayList<>();
                                    for (Procedure procedure : surgeryProcedures) {
                                        Map<String, Object> surgery = new HashMap<>();
                                        Map<String, String> surgeryReport = new HashMap<>();
                                        surgery.put("diagnosis",
                                                procedure.hasCode()
                                                        && procedure.getCode()
                                                        .hasCoding()
                                                        ? procedure.getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getDisplay()
                                                        : null);
                                        if (procedure.hasReasonCode()
                                                && !procedure.getReasonCode()
                                                .isEmpty()) {
                                            surgery.put("reason", procedure
                                                    .getReasonCode()
                                                    .get(0)
                                                    .getText());
                                        }
                                        surgeryReport.put("indication",
                                                getNestedExtensionValueString(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/extension-procedure-report",
                                                        "indication"));
                                        surgeryReport.put("steps",
                                                getNestedExtensionValueString(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/extension-procedure-report",
                                                        "steps"));
                                        surgeryReport.put("remarks",
                                                getNestedExtensionValueString(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/extension-procedure-report",
                                                        "remarks"));
                                        surgery.put("report", surgeryReport);
                                        surgeryTreatment.add(surgery);
                                        // if (procedure.hasReport()) {
                                        // List<Reference> payLoadReports =
                                        // procedure.getReport();
                                        // Reference reportPayload =
                                        // Iterables.getLast(payLoadReports);
                                        // // Check if the reference has an ID
                                        // or a reference URL
                                        // if (reportPayload.getId() == null) {
                                        // System.out.println("*2*Reference
                                        // object is missing ID and Reference: "
                                        // +
                                        // reportPayload);
                                        // continue; // Skip this iteration
                                        // }
                                        // DocumentReference documentReference =
                                        // getDocumentReferenceById(reportPayload.getId());
                                        // if (documentReference != null) {
                                        // //TODO: Surgery report has fields
                                        // that are not included during saving
                                        // }
                                        // }
                                    }
                                    treatmentDetailsDTO
                                            .setSurgery(surgeryTreatment);
                                }

                                // Hormone therapy
                                List<Procedure> hormoneTherapyTreatments = getProceduresByCategoryAndObservationReference(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "hormonetherapy-treatment", null);
                                if (!hormoneTherapyTreatments.isEmpty()) {
                                    List<Map<String, Object>> hormoneTherapy = new ArrayList<>();
                                    for (Procedure procedure : hormoneTherapyTreatments) {
                                        Map<String, Object> treatment = new HashMap<>();
                                        treatment.put("diagnosis",
                                                procedure.hasReasonCode()
                                                        && !procedure.getReasonCode()
                                                        .isEmpty()
                                                        ? procedure.getReasonCode()
                                                        .get(0)
                                                        .getCoding()
                                                        .get(0)
                                                        .getDisplay()
                                                        : null);
                                        treatment.put("regiment",
                                                getNestedExtensionValueString(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/hormone-therapy-details",
                                                        "regiment"));
                                        treatment.put("stage",
                                                getNestedExtensionValueInteger(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/hormone-therapy-details",
                                                        "stage"));
                                        treatment.put("totalNumberOfExpectedCycles",
                                                getNestedExtensionValueInteger(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/hormone-therapy-details",
                                                        "totalExpectedCycles"));
                                        treatment.put("currentCycles",
                                                getNestedExtensionValueInteger(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/hormone-therapy-details",
                                                        "currentCycles"));
                                        hormoneTherapy.add(treatment);
                                    }
                                    treatmentDetailsDTO.setHormoneTherapy(
                                            hormoneTherapy);
                                }

                                // medicalProcedureDetails
                                List<Procedure> medicalProcedures = getProceduresByCategoryAndObservationReference(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "medical-procedure-details", null);
                                if (!medicalProcedures.isEmpty()) {
                                    List<MedicalProcedureDetailsDTO> medicalProcedureDetails = new ArrayList<>();
                                    for (Procedure procedure : medicalProcedures) {
                                        MedicalProcedureDetailsDTO treatment = new MedicalProcedureDetailsDTO();
                                        treatment.setProcedureDate(procedure
                                                .hasPerformedDateTimeType()
                                                ? procedure.getPerformedDateTimeType()
                                                .getValue()
                                                : null);
                                        treatment.setProcedureType(
                                                procedure.hasCode()
                                                        ? procedure.getCode()
                                                        .getText()
                                                        : null);
                                        treatment.setDiagnosis(
                                                procedure.hasReasonCode()
                                                        && !procedure.getReasonCode()
                                                        .isEmpty()
                                                        ? procedure.getReasonCode()
                                                        .get(0)
                                                        .getText()
                                                        : null);
                                        treatment.setFindings(
                                                getNestedExtensionValueString(
                                                        procedure,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/medical-procedure-details",
                                                        "findings"));
                                        medicalProcedureDetails.add(treatment);
                                    }
                                    treatmentDetailsDTO.setMedicalProcedureDetails(
                                            medicalProcedureDetails);
                                }

                                templateData.setTreatmentDetails(treatmentDetailsDTO);

                                // Vaccination details
                                // TODO: Add name, type and notes for this resource
                                List<VaccinationDetailsDTO> vaccinationDetailsDTOS = getVaccinationDetails(
                                        encounter.getIdElement().getIdPart(),
                                        patient, null);

                                templateData.setVaccinationDetails(
                                        vaccinationDetailsDTOS);

                                // Billing details
                                List<BillingsDetailsDTO> billingsDetailsDTOS = new ArrayList<>();
                                List<ChargeItem> chargedItems = getChargeItemsByEncounterId(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart());
                                if (!chargedItems.isEmpty()) {
                                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                                    for (ChargeItem chargeItem : chargedItems) {
                                        // TODO: Add billingID

                                        BillingsDetailsDTO billingsDetailsDTO = new BillingsDetailsDTO();
                                        billingsDetailsDTO.setWavedAmount(getNestedExtensionValueDecimal(chargeItem, "http://fhir.moh.go.tz/fhir/StructureDefinition/billing-details", "wavedAmount").toString()
                                        );
                                        billingsDetailsDTO.setInsuranceCode(getNestedExtensionValueString(chargeItem, "http://fhir.moh.go.tz/fhir/StructureDefinition/billing-details", "insuranceCode"));

                                        billingsDetailsDTO.setInsuranceName(getNestedExtensionValueString(chargeItem, "http://fhir.moh.go.tz/fhir/StructureDefinition/billing-details", "insuranceName"));
                                        billingsDetailsDTO
                                                .setBillType(chargeItem
                                                        .hasReason()
                                                        && !chargeItem.getReason()
                                                        .isEmpty()
                                                        ? chargeItem.getReason()
                                                        .get(0)
                                                        .getText()
                                                        : null);
                                        billingsDetailsDTO
                                                .setBillingCode(chargeItem
                                                        .hasCode()
                                                        && chargeItem.getCode()
                                                        .hasCoding()
                                                        && !chargeItem.getCode()
                                                        .getCoding()
                                                        .isEmpty()
                                                        ? chargeItem.getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getCode()
                                                        : null);
                                        billingsDetailsDTO.setAmountBilled(
                                                chargeItem.hasPriceOverride()
                                                        ? chargeItem.getPriceOverride()
                                                        .getValue()
                                                        : null);
                                        billingsDetailsDTO.setBillDate(
                                                chargeItem.hasOccurrenceDateTimeType()
                                                        ? chargeItem.getOccurrenceDateTimeType()
                                                        .getValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter)
                                                        : null);
                                        billingsDetailsDTO.setExemptionType(
                                                getNestedExtensionValueString(
                                                        chargeItem,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/billing-details",
                                                        "exemptionType"));
                                        billingsDetailsDTO.setStandardCode(
                                                getNestedExtensionValueString(
                                                        chargeItem,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/billing-details",
                                                        "standardCode"));
                                        billingsDetailsDTOS.add(
                                                billingsDetailsDTO);
                                    }
                                    templateData.setBillingsDetails(
                                            billingsDetailsDTOS);
                                }

                                // Family planning details
                                FamilyPlanningDetailsDTO familyPlanningDetailsDTO = new FamilyPlanningDetailsDTO();
                                List<CarePlan> carePlans = getCarePlansByCategory(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "family-planning");
                                if (!carePlans.isEmpty()) {
                                    // TODO: Decide on what item should be used last
                                    CarePlan carePlan = Iterables
                                            .getLast(carePlans);
                                    familyPlanningDetailsDTO
                                            .setDate(carePlan
                                                    .hasPeriod() ? carePlan.getPeriod().getStart() : null);
                                    List<LongTermMethodDTO> longTermMethodDTOS = new ArrayList<>();
                                    List<ShortTermMethodDTO> shortTermMethodDTOS = new ArrayList<>();
                                    if (carePlan.hasActivity() && !carePlan
                                            .getActivity().isEmpty()) {
                                        for (CarePlan.CarePlanActivityComponent activity : carePlan
                                                .getActivity()) {
                                            if (activity.hasDetail()
                                                    && activity.getDetail()
                                                    .hasCode()
                                                    && activity.getDetail()
                                                    .getCode()
                                                    .hasCoding()
                                                    && activity.getDetail()
                                                    .getCode()
                                                    .getCoding()
                                                    .size() > 1) {
                                                if (activity.getDetail()
                                                        .getCode()
                                                        .getCoding()
                                                        .get(1)
                                                        .getCode()
                                                        .equals("long-term-method")) {
                                                    LongTermMethodDTO longTermMethodDTO = new LongTermMethodDTO();
                                                    longTermMethodDTO
                                                            .setProvided(activity
                                                                    .getDetail()
                                                                    .getCode()
                                                                    .getCoding()
                                                                    .get(0)
                                                                    .hasCode());
                                                    longTermMethodDTO
                                                            .setCode(activity
                                                                    .getDetail()
                                                                    .getCode()
                                                                    .getCoding()
                                                                    .get(0)
                                                                    .getCode());
                                                    longTermMethodDTO
                                                            .setType(activity
                                                                    .getDetail()
                                                                    .getCode()
                                                                    .getCoding()
                                                                    .get(0)
                                                                    .getDisplay());
                                                    longTermMethodDTOS
                                                            .add(longTermMethodDTO);
                                                }
                                                if (activity.getDetail()
                                                        .getCode()
                                                        .getCoding()
                                                        .get(1)
                                                        .getCode()
                                                        .equals("short-term-method")) {
                                                    ShortTermMethodDTO shortTermMethodDTO = new ShortTermMethodDTO();
                                                    shortTermMethodDTO
                                                            .setProvided(activity
                                                                    .getDetail()
                                                                    .getCode()
                                                                    .getCoding()
                                                                    .get(0)
                                                                    .hasCode());
                                                    shortTermMethodDTO
                                                            .setCode(activity
                                                                    .getDetail()
                                                                    .getCode()
                                                                    .getCoding()
                                                                    .get(0)
                                                                    .getCode());
                                                    shortTermMethodDTO
                                                            .setType(activity
                                                                    .getDetail()
                                                                    .getCode()
                                                                    .getCoding()
                                                                    .get(0)
                                                                    .getDisplay());
                                                    shortTermMethodDTOS
                                                            .add(shortTermMethodDTO);
                                                }
                                            }
                                        }
                                    }

                                    familyPlanningDetailsDTO.setPositiveHivStatusBeforeService(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-positiveHivStatusBeforeService"));
                                    familyPlanningDetailsDTO.setWasCounselled(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-wasCounselled"));
                                    familyPlanningDetailsDTO.setHasComeWithSpouse(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-hasComeWithSpouse"));
                                    familyPlanningDetailsDTO.setServiceLocation(ServiceLocations.fromString(getExtensionValueString(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-serviceLocation")));
                                    familyPlanningDetailsDTO.setReferred(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-referred"));

                                    // CANCER SCREENING DETAILS
                                    CancerScreeningDetailsDTO fpCancerScreeningDetailsDTO = new CancerScreeningDetailsDTO();
                                    BreastCancerDTO breastCancerDTO = new BreastCancerDTO();
                                    FPCervicalCancerDTO cervicalCancerDTO = new FPCervicalCancerDTO();

                                    breastCancerDTO.setFoundWithBreastCancerSymptoms(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-cancerScreeningDetails-breastCancer-foundWithBreastCancerSymptoms"));
                                    breastCancerDTO.setScreened(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-cancerScreeningDetails-breastCancer-screened"));

                                    cervicalCancerDTO.setSuspected(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-cancerScreeningDetails-cervicalCancer-suspected"));
                                    cervicalCancerDTO.setScreenedWithVIA(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-cancerScreeningDetails-cervicalCancer-screenedWithVIA"));
                                    cervicalCancerDTO.setViaTestPositive(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-cancerScreeningDetails-cervicalCancer-viaTestPositive"));

                                    fpCancerScreeningDetailsDTO.setBreastCancer(breastCancerDTO);
                                    fpCancerScreeningDetailsDTO.setCervicalCancer(cervicalCancerDTO);
                                    familyPlanningDetailsDTO.setCancerScreeningDetails(fpCancerScreeningDetailsDTO);

                                    FPHivStatusDTO fpHivStatus = new FPHivStatusDTO();
                                    fpHivStatus.setStatus(STATUS.fromString(getExtensionValueString(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-hivStatus-status")));
                                    fpHivStatus.setReferredToCTC(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-hivStatus-referredToCTC"));
                                    familyPlanningDetailsDTO.setHivStatus(fpHivStatus);

                                    fpHivStatus.setStatus(STATUS.fromString(getExtensionValueString(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-spouseHivStatus-status")));
                                    fpHivStatus.setReferredToCTC(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-spouseHivStatus-referredToCTC"));
                                    familyPlanningDetailsDTO.setSpouseHivStatus(fpHivStatus);

                                    familyPlanningDetailsDTO.setBreastFeeding(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-breastFeeding"));

                                    SideEffectsDTO fpSideEffects = new SideEffectsDTO();
                                    fpSideEffects.setBleeding(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-sideEffects-bleeding"));
                                    fpSideEffects.setHeadache(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-sideEffects-headache"));
                                    fpSideEffects.setGotPregnancy(getExtensionValueBoolean(carePlan, "http://fhir.moh.go.tz/fhir/StructureDefinition/fp-sideEffects-gotPregnancy"));
                                    familyPlanningDetailsDTO.setSideEffects(fpSideEffects);

                                    templateData.setFamilyPlanningDetails(
                                            familyPlanningDetailsDTO);
                                }

                                // Child Health Details
                                ChildHealthDetailsDTO childHealthDetailsDTO = new ChildHealthDetailsDTO();

                                List<Observation> childHealthObservations = getObservationsByCategory(fhirClient, "child-health", encounter, false, true);

                                if(!childHealthObservations.isEmpty()){
                                    Observation observation = childHealthObservations.get(0);

                                    childHealthDetailsDTO.setServiceModality(ServiceModality.fromString(getExtensionValueString(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ch-serviceModality")));

                                    childHealthDetailsDTO.setMotherAge(getExtensionValueInt(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ch-motherAge"));

                                    CHProphylaxisDTO chProphylaxisDTO = new CHProphylaxisDTO();
                                    ProphylaxisAdministrationDTO prophylaxisAdministrationDTO = new ProphylaxisAdministrationDTO();
                                    prophylaxisAdministrationDTO.setAdministered(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ch-prophylaxis-albendazole-administered"));
                                    chProphylaxisDTO.setAlbendazole(prophylaxisAdministrationDTO);

                                    prophylaxisAdministrationDTO.setAdministered(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ch-prophylaxis-vitaminA-administered"));
                                    chProphylaxisDTO.setVitaminA(prophylaxisAdministrationDTO);

                                    chProphylaxisDTO.setProvidedWithLLIN(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ch-prophylaxis-providedWithLLIN"));

                                    childHealthDetailsDTO.setProphylaxis(chProphylaxisDTO);

                                    childHealthDetailsDTO.setInfantFeeding(InfantFeeding.fromString(getExtensionValueString(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ch-infantFeeding")));

                                    childHealthDetailsDTO.setProvidedWithInfantFeedingCounselling(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ch-providedWithInfantFeedingCounselling"));

                                    childHealthDetailsDTO.setHasBeenBreastFedFor24Month(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ch-hasBeenBreastFedFor24Month"));

                                    MotherHivStatusDTO motherHivStatusDTO = new MotherHivStatusDTO();
                                    List<Observation.ObservationComponentComponent> motherHICStatusComponents = getComponentsByCode(observation, "http://loinc.org", "55277-8");

                                    motherHivStatusDTO.setStatus(STATUS.fromString(
                                            !motherHICStatusComponents.isEmpty() && motherHICStatusComponents.get(0).hasValueCodeableConcept() &&
                                                    motherHICStatusComponents.get(0).getValueCodeableConcept().hasCoding() &&
                                                    !motherHICStatusComponents.get(0).getValueCodeableConcept().getCoding().isEmpty() &&
                                                    motherHICStatusComponents.get(0).getValueCodeableConcept().getCoding().get(0).hasCode() ?
                                                    motherHICStatusComponents.get(0).getValueCodeableConcept().getCoding().get(0).getCode() : null)
                                    );
                                    motherHivStatusDTO.setTestingDate(stringToDateOrNull(getExtensionValueString(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ch-motherHivstatus-testingDate"), "yyyy-MM-dd"));

                                    childHealthDetailsDTO.setMotherHivStatus(motherHivStatusDTO);

                                    childHealthDetailsDTO.setReferredToCTC(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ch-referredToCTC"));
                                }
                                templateData.setChildHealthDetails(childHealthDetailsDTO);

                                // CPAC DETAILS
                                CpacDetailsDTO cpacDetailsDTO = new CpacDetailsDTO();

                                List<Observation> cpacObservations = getObservationsByCategoryAndCode(fhirClient, fhirContext, encounter, "procedure", "post-abortion-care-comprehensive");

                                if(!cpacObservations.isEmpty()){
                                    for(Observation observation: cpacObservations){
                                        cpacDetailsDTO.setPregnancyAgeInWeeks(getExtensionValueInt(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-pregnancyAgeInWeeks"));
                                        cpacDetailsDTO.setCauseOfAbortion(CauseOfAbortion.fromString(getExtensionValueString(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-causeOfAbortion")));
                                        cpacDetailsDTO.setAfterAbortionServices(AfterAbortionServices.fromString(getExtensionValueString(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-afterAbortionServices")));
                                        cpacDetailsDTO.setPositiveHIVStatusBeforeAbortion(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-positiveHIVStatusBeforeAbortion"));

                                        CpacHivTestDTO cpacHivTestDTO = new CpacHivTestDTO();
                                        cpacHivTestDTO.setStatus(STATUS.fromString(getExtensionValueString(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-hivTest-status")));
                                        cpacDetailsDTO.setHivTest(cpacHivTestDTO);

                                        cpacDetailsDTO.setReferReason(ReferReason.fromString(getExtensionValueString(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-referReason")));

                                        PostAbortionsMedicationsDTO postAbortionsMedicationsDTO = new PostAbortionsMedicationsDTO();
                                        PostAbortionCounsellingDTO postAbortionCounsellingDTO = new PostAbortionCounsellingDTO();

                                        postAbortionsMedicationsDTO.setProvidedWithAntibiotics(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-postAbortionsMedications-providedWithAntibiotics"));
                                        postAbortionsMedicationsDTO.setProvidedWithPainKillers(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-postAbortionsMedications-providedWithPainKillers"));
                                        postAbortionsMedicationsDTO.setProvidedWithOxytocin(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-postAbortionsMedications-providedWithOxytocin"));
                                        postAbortionsMedicationsDTO.setProvidedWithMisoprostol(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-postAbortionsMedications-providedWithMisoprostol"));
                                        postAbortionsMedicationsDTO.setProvidedWithIvInfusion(getExtensionValueBoolean(observation,"http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-postAbortionsMedications-providedWithIvInfusion"));

                                        postAbortionCounsellingDTO.setProvidedWithHIVCounselling(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-postAbortionCounselling-providedWithHIVCounselling"));
                                        postAbortionCounsellingDTO.setProvidedWithSTDsPreventionCounselling(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-postAbortionCounselling-providedWithSTDsPreventionCounselling"));
                                        postAbortionCounsellingDTO.setProvidedWithFamilyPlanningCounselling(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-postAbortionCounselling-providedWithFamilyPlanningCounselling"));

                                        cpacDetailsDTO.setPostAbortionsMedications(postAbortionsMedicationsDTO);
                                        cpacDetailsDTO.setPostAbortionCounselling(postAbortionCounsellingDTO);

                                        CpacContraceptivesDTO contraceptivesDTO = new CpacContraceptivesDTO();

                                        contraceptivesDTO.setDidReceiveOralPillsCOC(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-contraceptives-didReceiveOralPillsCOC"));
                                        contraceptivesDTO.setCocCyclesProvided(getExtensionValueInt(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-contraceptives-cocCyclesProvided"));
                                        contraceptivesDTO.setDidReceiveOralPillsPOP(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-contraceptives-didReceiveOralPillsPOP"));
                                        contraceptivesDTO.setPopCyclesProvided(getExtensionValueInt(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-contraceptives-popCyclesProvided"));
                                        contraceptivesDTO.setDidReceivePillCycles(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-contraceptives-didReceivePillCycles"));
                                        contraceptivesDTO.setWasInsertedWithImplanon(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-contraceptives-wasInsertedWithImplanon"));
                                        contraceptivesDTO.setWasInsertedWithJadelle(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-contraceptives-wasInsertedWithJadelle"));
                                        contraceptivesDTO.setDidReceiveIUD(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-contraceptives-didReceiveIUD"));
                                        contraceptivesDTO.setDidHaveTubalLigation(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-contraceptives-didHaveTubalLigation"));
                                        contraceptivesDTO.setDidReceiveInjection(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-contraceptives-didReceiveInjection"));
                                        contraceptivesDTO.setNumberOfFemaleCondomsProvided(getExtensionValueInt(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-contraceptives-numberOfFemaleCondomsProvided"));
                                        contraceptivesDTO.setNumberOfMaleCondomsProvided(getExtensionValueInt(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/cpac-contraceptives-numberOfMaleCondomsProvided"));

                                        cpacDetailsDTO.setContraceptives(contraceptivesDTO);
                                    }
                                }

                                templateData.setCpacDetails(cpacDetailsDTO);

                                // CECAP DETAILS
                                CecapDTO cecapDTO = new CecapDTO();
                                CancerScreeningDetailsDTO cancerScreeningDetailsDTO = new CancerScreeningDetailsDTO();

                                List<Observation> cecapObservations = getObservationsByCategoryAndCode(fhirClient, fhirContext, encounter, "procedure", "cancer-screening-comprehensive");

                                if(!cecapObservations.isEmpty()){
                                    Observation observation =  cecapObservations.get(0);
                                    BreastCancerDTO breastCancerDTO = new BreastCancerDTO();
                                    breastCancerDTO.setScreened(getComponentValueBoolean(observation,"http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "breast-cancer-screened"));
                                    breastCancerDTO.setFoundWithBreastCancerSymptoms(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "breast-cancer-symptoms"));

                                    cancerScreeningDetailsDTO.setBreastCancer(breastCancerDTO);
                                    CervicalCancerDTO cervicalCancerDTO = new CervicalCancerDTO();

                                    cervicalCancerDTO.setSuspected(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "cervical-cancer-suspected"));
                                    cervicalCancerDTO.setScreenedWithVIA(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "via-screening-performed"));
                                    cervicalCancerDTO.setScreenedWithHPVDNA(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "hpv-dna-screening-performed"));
                                    cervicalCancerDTO.setViaTestPositive(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "via-test-result"));
                                    cervicalCancerDTO.setHpvDNAPositive(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "hpv-dna-test-result"));
                                    cervicalCancerDTO.setDiagnosedWithLargeLesion(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "diagnosed-with-large-lesion"));
                                    cervicalCancerDTO.setDiagnosedWithSmallOrModerateLesion(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "diagnosed-with-small-or-moderate-lesion"));
                                    cervicalCancerDTO.setTreatedWithCryo(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "treated-with-cryo"));
                                    cervicalCancerDTO.setTreatedWithThermo(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "treated-with-thermo"));
                                    cervicalCancerDTO.setTreatedWithLEEP(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "treated-with-leep"));
                                    cervicalCancerDTO.setFirstTimeScreening(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "first-time-screening"));
                                    cervicalCancerDTO.setTreatedOnTheSameDay(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "treated-same-day"));
                                    cervicalCancerDTO.setComplicationsAfterTreatment(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "complications-after-treatment"));
                                    cervicalCancerDTO.setFoundWithHivAndReferredToCTC(getComponentValueBoolean(observation, "http://fhir.moh.go.tz/fhir/CodeSystem/cecap-codes", "hiv-found-referred-ctc"));

                                    cancerScreeningDetailsDTO.setCervicalCancer(cervicalCancerDTO);
                                }

                                cecapDTO.setCancerScreeningDetails(cancerScreeningDetailsDTO);
                                templateData.setCecap(cecapDTO);

                                // CONTRACEPTIVES
                                ContraceptivesDTO contraceptivesDTO = new ContraceptivesDTO();
                                CodeableConcept contraceptiveCodeableConcept = new CodeableConcept();
                                Coding contraceptiveCodeableConceptCoding = new Coding();

                                contraceptiveCodeableConceptCoding.setSystem("http://fhir.moh.go.tz/fhir/CodeSystem/contraceptive-methods");
                                contraceptiveCodeableConceptCoding.setCode("contraceptive-services");
                                contraceptiveCodeableConcept.addCoding(contraceptiveCodeableConceptCoding);

                                List<MedicationStatement> contraceptivesMedicationStatements= getMedicationStatementsByCategoryAndCodeableConcept(fhirClient, fhirContext, patient, "contraceptive", contraceptiveCodeableConcept);

                                if(!contraceptivesMedicationStatements.isEmpty()){
                                    MedicationStatement statement = contraceptivesMedicationStatements.get(0);
                                    String statementExtensionParentUrl = "http://fhir.moh.go.tz/fhir/StructureDefinition/contraceptive-details";

                                    contraceptivesDTO.setPopCyclesProvided(getResourceNestedExtensionQuantityValueAsInteger(statement, statementExtensionParentUrl,"http://fhir.moh.go.tz/fhir/StructureDefinition/pop-cycles"));
                                    contraceptivesDTO.setPopCyclesProvided(getResourceNestedExtensionQuantityValueAsInteger(statement, statementExtensionParentUrl,"http://fhir.moh.go.tz/fhir/StructureDefinition/coc-cycles"));
                                    contraceptivesDTO.setDidReceiveSDM(getNestedExtensionValueBoolean(statement, statementExtensionParentUrl, "http://fhir.moh.go.tz/fhir/StructureDefinition/sdm-provided"));
                                    contraceptivesDTO.setDidUseLAM(getNestedExtensionValueBoolean(statement, statementExtensionParentUrl, "http://fhir.moh.go.tz/fhir/StructureDefinition/lam-used"));
                                    contraceptivesDTO.setDidOptToUseEmergencyMethods(getNestedExtensionValueBoolean(statement, statementExtensionParentUrl, "http://fhir.moh.go.tz/fhir/StructureDefinition/emergency-methods"));
                                    contraceptivesDTO.setWasInsertedWithImplanon(getNestedExtensionValueBoolean(statement, statementExtensionParentUrl, "http://fhir.moh.go.tz/fhir/StructureDefinition/implanon-inserted"));
                                    contraceptivesDTO.setWasInsertedWithJadelle(getNestedExtensionValueBoolean(statement, statementExtensionParentUrl, "http://fhir.moh.go.tz/fhir/StructureDefinition/jadelle-inserted"));
                                    contraceptivesDTO.setDidRemoveImplanon(getNestedExtensionValueBoolean(statement, statementExtensionParentUrl, "http://fhir.moh.go.tz/fhir/StructureDefinition/implanon-removed"));
                                    contraceptivesDTO.setDidRemoveJadelle(getNestedExtensionValueBoolean(statement, statementExtensionParentUrl, "http://fhir.moh.go.tz/fhir/StructureDefinition/jadelle-removed"));
                                    contraceptivesDTO.setDidReceiveIUD(getNestedExtensionValueBoolean(statement, statementExtensionParentUrl, "http://fhir.moh.go.tz/fhir/StructureDefinition/iud-received"));
                                    contraceptivesDTO.setDidRemoveIUD(getNestedExtensionValueBoolean(statement, statementExtensionParentUrl, "http://fhir.moh.go.tz/fhir/StructureDefinition/iud-removed"));
                                    contraceptivesDTO.setDidHaveTubalLigation(getNestedExtensionValueBoolean(statement, statementExtensionParentUrl, "http://fhir.moh.go.tz/fhir/StructureDefinition/tubal-ligation"));
                                    contraceptivesDTO.setDidHaveVasectomy(getNestedExtensionValueBoolean(statement, statementExtensionParentUrl, "http://fhir.moh.go.tz/fhir/StructureDefinition/vasectomy"));
                                    contraceptivesDTO.setDidReceiveInjection(getNestedExtensionValueBoolean(statement, statementExtensionParentUrl,"http://fhir.moh.go.tz/fhir/StructureDefinition/injection-received"));
                                    contraceptivesDTO.setNumberOfFemaleCondomsProvided(getResourceNestedExtensionQuantityValueAsInteger(statement, statementExtensionParentUrl, "http://fhir.moh.go.tz/fhir/StructureDefinition/female-condoms-provided"));
                                    contraceptivesDTO.setNumberOfMaleCondomsProvided(getResourceNestedExtensionQuantityValueAsInteger(statement, statementExtensionParentUrl, "http://fhir.moh.go.tz/fhir/StructureDefinition/male-condoms-provided"));
                                }

                                templateData.setContraceptives(contraceptivesDTO);

                                // EYE DETAILS
                                EyeClinicDetailsDTO eyeClinicDetailsDTO = new EyeClinicDetailsDTO();
                                List<Observation> eyeObservations = getObservationsByCategoryAndCode(fhirClient, fhirContext, encounter, "procedure", "eye-clinic-exam");

                                if(!eyeObservations.isEmpty()){
                                    Observation observation = eyeObservations.get(0);

                                    eyeClinicDetailsDTO.setRefracted(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/eye-refracted"));
                                    eyeClinicDetailsDTO.setSpectaclesPrescribed(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/eye-spectaclesPrescribed"));
                                    eyeClinicDetailsDTO.setSpectacleDispensed(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/eye-spectacleDispensed"));
                                    eyeClinicDetailsDTO.setContactLenseDispensed(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/eye-contactLenseDispensed"));
                                    eyeClinicDetailsDTO.setPrescribedWithLowVision(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/eye-prescribedWithLowVision"));
                                    eyeClinicDetailsDTO.setIsDispensedWithLowVisionDevice(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/eye-isDispensedWithLowVisionDevice"));
                                }

                                templateData.setEyeClinicDetails(eyeClinicDetailsDTO);

                                // laborAndDeliveryDetails
                                LaborAndDeliveryDetailsDTO laborAndDeliveryDetailsDTO = new LaborAndDeliveryDetailsDTO();

                                // Delivery procedure
                                List<Procedure> deliveryProcedures = getProceduresByCategoryAndObservationReference(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "obstetrics", null);
                                if (!deliveryProcedures.isEmpty()) {
                                    // TODO: Decide on what resource to be used here
                                    Procedure deliveryProcedure = deliveryProcedures.get(0);
                                    laborAndDeliveryDetailsDTO
                                            .setDate(deliveryProcedure
                                                    .hasPerformedDateTimeType()
                                                    ? deliveryProcedure
                                                    .getPerformedDateTimeType()
                                                    .getValue()
                                                    : null);

                                    Map<String, Object> deliveryMethod = new HashMap<>();
                                    if (deliveryProcedure.hasCode()
                                            && deliveryProcedure.getCode()
                                            .hasCoding()
                                            && !deliveryProcedure.getCode()
                                            .getCoding()
                                            .isEmpty()) {
                                        deliveryMethod.put("code",
                                                deliveryProcedure
                                                        .getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getCode());
                                        deliveryMethod.put("name",
                                                deliveryProcedure
                                                        .getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getDisplay());
                                        laborAndDeliveryDetailsDTO
                                                .setDeliveryMethod(
                                                        deliveryMethod);
                                    }
                                    var timeBetweenLaborPainAndDeliveryInHrs =  getExtensionValueDecimal(deliveryProcedure, "http://fhir.moh.go.tz/fhir/StructureDefinition/timeBetweenLaborPainAndDeliveryInHrs");

                                    laborAndDeliveryDetailsDTO.setTimeBetweenLaborPainAndDeliveryInHrs(timeBetweenLaborPainAndDeliveryInHrs != null ? timeBetweenLaborPainAndDeliveryInHrs.getValueAsInteger() : null);

                                    laborAndDeliveryDetailsDTO.setPlaceOfBirth(BirthPlace.fromString(getExtensionValueString(deliveryProcedure, "http://fhir.moh.go.tz/fhir/StructureDefinition/placeOfBirth")));

                                    laborAndDeliveryDetailsDTO.setIsAttendantSkilled(getExtensionValueBoolean(deliveryProcedure, "http://fhir.moh.go.tz/fhir/StructureDefinition/isAttendantSkilled"));
                                }

                                // Infant and family planning counseling

                                List<Observation> familyPlanningCounselings = getObservationsByCategory(
                                        fhirClient,
                                        "family-planning-counseling", encounter,
                                        false, true);

                                if (!familyPlanningCounselings.isEmpty()) {
                                    Observation familyPlanningCounseling = familyPlanningCounselings
                                            .get(0);

                                    if (familyPlanningCounseling != null
                                            && familyPlanningCounseling
                                            .hasValueBooleanType()
                                            && familyPlanningCounseling
                                            .getValueBooleanType()
                                            .hasValue()) {
                                        laborAndDeliveryDetailsDTO
                                                .setProvidedWithFamilyPlanningCounseling(
                                                        familyPlanningCounseling
                                                                .getValueBooleanType()
                                                                .getValue());
                                    }

                                    if(familyPlanningCounseling != null){
                                        laborAndDeliveryDetailsDTO.setMotherOrigin(PlaceOfOrigin.fromString(
                                                getExtensionValueString(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-mother-origin")
                                        ));

                                        laborAndDeliveryDetailsDTO.setProvidedWithInfantFeedingCounseling(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/infant-feeding-counseling"));

                                        laborAndDeliveryDetailsDTO.setHasComeWithSpouse(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-spouse-accompaniment"));

                                        laborAndDeliveryDetailsDTO.setHasComeWithCompanion(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-companion-accompaniment"));

                                        laborAndDeliveryDetailsDTO.setPregnancyAgeInWeeks(getExtensionValueInt(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-pregnancy-age-in-weeks"));

                                        laborAndDeliveryDetailsDTO.setWasProvidedWithAntenatalCorticosteroid(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-antenatal-corticosteroid-provided"));

                                        laborAndDeliveryDetailsDTO.setHasHistoryOfFGM(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-history-of-fgm"));

                                        LDHivDetailsDTO ldHivDetailsDTO = new LDHivDetailsDTO();
                                        ldHivDetailsDTO.setStatus(STATUS.fromString(getExtensionValueString(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-hiv-details-status")));

                                        ldHivDetailsDTO.setHivTestNumber(getExtensionValueInt(familyPlanningCounseling,"http://fhir.moh.go.tz/fhir/StructureDefinition/ld-hiv-details-hivTestNumber"));

                                        ldHivDetailsDTO.setReferredToCTC(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-hiv-details-referredToCTC"));

                                        AncHivStatusDTO ldAncHivStatusDTO = new AncHivStatusDTO();
                                        ldAncHivStatusDTO.setStatus(STATUS.fromString(getExtensionValueString(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-hiv-details-ancHivStatus-status")));
                                        ldAncHivStatusDTO.setNumberOfTestTaken(getExtensionValueInt(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-hiv-details-ancHivStatus-numberOfTestsTaken"));

                                        ldHivDetailsDTO.setAncHivStatus(ldAncHivStatusDTO);
                                        laborAndDeliveryDetailsDTO.setHivDetails(ldHivDetailsDTO);

                                        LDOthersDTO ldOthers = new LDOthersDTO();
                                        EmocDTO emoc = new EmocDTO();
                                        AmstlDTO amstl = new AmstlDTO();

                                        emoc.setProvidedAntibiotic(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-others-emoc-providedAntibiotic"));
                                        emoc.setProvidedUterotonic(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-others-emoc-providedUterotonic"));
                                        emoc.setProvidedMagnesiumSulphate(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-others-emoc-providedMagnesiumSulphate"));
                                        emoc.setRemovedPlacenta(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-others-emoc-removedPlacenta"));
                                        emoc.setPerformedMvaOrDc(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-others-emoc-performedMvaOrDc"));
                                        emoc.setAdministeredBlood(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-others-emoc-administeredBlood"));

                                        amstl.setCordTractionUsed(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-others-amstl-cordTractionUsed"));
                                        amstl.setUterineMassageDone(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-others-amstl-uterineMassageDone"));
                                        amstl.setAdministeredOxytocin(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-others-amstl-administeredOxytocin"));
                                        amstl.setAdministeredEgometrine(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-others-amstl-administeredEgometrine"));
                                        amstl.setAdministeredMisoprostol(getExtensionValueBoolean(familyPlanningCounseling, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-others-amstl-administeredMisoprostol"));

                                        ldOthers.setEmoc(emoc);
                                        ldOthers.setAmstl(amstl);

                                        laborAndDeliveryDetailsDTO.setOthers(ldOthers);
                                    }
                                }

                                // Before birth complications
                                List<CodeAndNameDTO> beforeBirthComplications = new ArrayList<>();
                                List<Condition> beforeBirthComplicationConditions = getConditionsByCategory(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "before-birth-complication");
                                if (!beforeBirthComplicationConditions.isEmpty()) {
                                    for (Condition condition : beforeBirthComplicationConditions) {
                                        CodeAndNameDTO beforeBirthComplication = new CodeAndNameDTO();
                                        beforeBirthComplication
                                                .setCode(condition
                                                        .hasCode()
                                                        && condition.getCode()
                                                        .hasCoding()
                                                        && !condition.getCode()
                                                        .getCoding()
                                                        .isEmpty()
                                                        ? condition.getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getCode()
                                                        : null);
                                        beforeBirthComplication
                                                .setName(condition
                                                        .hasCode()
                                                        && condition.getCode()
                                                        .hasCoding()
                                                        && !condition.getCode()
                                                        .getCoding()
                                                        .isEmpty()
                                                        ? condition.getCode()
                                                        .getCoding()
                                                        .get(0)
                                                        .getDisplay()
                                                        : null);
                                        beforeBirthComplications.add(
                                                beforeBirthComplication);
                                    }
                                    laborAndDeliveryDetailsDTO
                                            .setBeforeBirthComplications(
                                                    beforeBirthComplications);
                                }

                                // Birth complications
                                List<CodeAndNameDTO> birthComplications = new ArrayList<>();
                                List<Condition> birthComplicationConditions = getConditionsByCategory(
                                        fhirClient,
                                        encounter.getIdElement().getIdPart(),
                                        "birth-complication");
                                if (!birthComplicationConditions.isEmpty()) {
                                    for (Condition condition : beforeBirthComplicationConditions) {
                                        CodeAndNameDTO birthComplication = new CodeAndNameDTO();
                                        birthComplication.setCode(condition
                                                .hasCode()
                                                && condition.getCode()
                                                .hasCoding()
                                                && !condition.getCode()
                                                .getCoding()
                                                .isEmpty()
                                                ? condition.getCode()
                                                .getCoding()
                                                .get(0)
                                                .getCode()
                                                : null);
                                        birthComplication.setName(condition
                                                .hasCode()
                                                && condition.getCode()
                                                .hasCoding()
                                                && !condition.getCode()
                                                .getCoding()
                                                .isEmpty()
                                                ? condition.getCode()
                                                .getCoding()
                                                .get(0)
                                                .getDisplay()
                                                : null);
                                        birthComplications
                                                .add(birthComplication);
                                    }
                                    laborAndDeliveryDetailsDTO
                                            .setBirthComplications(
                                                    birthComplications);
                                }

                                // Birth details observation
                                List<Observation> birthDetailsObservations = getObservationsByCategory(
                                        fhirClient,
                                        "labor-delivery-birth-details",
                                        encounter, false, false);
                                List<BirthDetailsDTO> birthDetailsDTOS = new ArrayList<>();
                                if (!birthDetailsObservations.isEmpty()) {
                                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                                    for (Observation observation : birthDetailsObservations) {
                                        BirthDetailsDTO birthDetailsDTO = new BirthDetailsDTO();
                                        Date dateOfBith = getNestedExtensionValueDateTime(
                                                observation,
                                                "http://fhir.moh.go.tz/fhir/StructureDefinition/newborn-birth-details",
                                                "dateOfBirth");
                                        birthDetailsDTO.setDateOfBirth(
                                                dateOfBith != null ? dateOfBith.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter) : null
                                                );
                                        birthDetailsDTO.setExclusiveBreastFed(
                                                getNestedExtensionValueBoolean(
                                                        observation,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/newborn-birth-details",
                                                        "exclusiveBreastFed"));
                                        birthDetailsDTO.setMotherAgeInYears(
                                                getNestedExtensionValueInteger(
                                                        observation,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/maternal-details",
                                                        "motherAgeInYears"));
                                        // TODO: Add Mother HIV status
                                        // birthDetailsDTO.setMotherHivStatus(getNestedExtensionValueString(observation,
                                        // "://fhir.moh.go.tz/fhir/StructureDefinition/maternal-details",
                                        // "motherHivStatus"));

                                        birthDetailsDTO.setMarcerated(
                                                getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-birthDetails-macerated")
                                        );

                                        birthDetailsDTO.setFresh(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-birthDetails-fresh"));

                                        birthDetailsDTO.setBornWithDisabilities(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-birthDetails-bornWithDisabilities"));

                                        birthDetailsDTO.setHivDnaPCRTested(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-birthDetails-hivDnaPCRTested"));

                                        birthDetailsDTO.setChildHivStatus(STATUS.fromString(
                                                getExtensionValueString(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-birthDetails-childHivStatus")
                                        ));

                                        ApgaScoreDTO ldBirthDetailsApgaScore = new ApgaScoreDTO();
                                        ldBirthDetailsApgaScore.setOneMinute(getExtensionValueInt(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-birthDetails-apgarScore-oneMinute"));

                                        ldBirthDetailsApgaScore.setFiveMinute(getExtensionValueInt(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-birthDetails-apgarScore-fiveMinute"));

                                        birthDetailsDTO.setApgaScore(ldBirthDetailsApgaScore);

                                        birthDetailsDTO.setWasBreastFedWithinOneHourAfterDelivery(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-birthDetails-wasBreastFedWithinOneHourAfterDelivery"));

                                        LDBDOutcomeDetailsDTO ldBdOutcomeDetails = new LDBDOutcomeDetailsDTO();
                                        ldBdOutcomeDetails.setIsAlive(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-birthDetails-outcomeDetails-isAlive"));
                                        ldBdOutcomeDetails.setReferredToPNC(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-birthDetails-outcomeDetails-referredToPNC"));
                                        ldBdOutcomeDetails.setReferredToHospital(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-birthDetails-outcomeDetails-referredToHospital"));
                                        ldBdOutcomeDetails.setReferredtohealthfacility(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-birthDetails-outcomeDetails-referredTohealthFacility"));

                                        birthDetailsDTO.setOutcomeDetails(ldBdOutcomeDetails);

                                        birthDetailsDTO.setMethodOfResuscitation(MethodOfResuscitation.fromString(
                                                getExtensionValueString(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/ld-birthDetails-methodOfResuscitation")
                                        ));


                                        birthDetailsDTO.setProvidedWithARV(
                                                getNestedExtensionValueBoolean(
                                                        observation,
                                                        "http://fhir.moh.go.tz/fhir/StructureDefinition/maternal-details",
                                                        "providedWithARV"));
                                        birthDetailsDTO
                                                .setWeightInKgs(getComponentValueQuantityInt(
                                                        observation,
                                                        0) != null
                                                        ? getComponentValueQuantityInt(
                                                        observation,
                                                        0)
                                                        .floatValue()
                                                        : null);
                                        birthDetailsDTO.setMultipleBirth(
                                                getComponentValueBoolean(
                                                        observation,
                                                        1));
                                        birthDetailsDTO.setBirthOrder(
                                                getComponentIntValue(
                                                        observation,
                                                        2));
                                        List<VaccinationDetailsDTO> vaccinationDetails = getVaccinationDetails(
                                                encounter.getIdElement()
                                                        .getIdPart(),
                                                patient,
                                                observation.getIdElement()
                                                        .getIdPart());
                                        birthDetailsDTO.setVaccinationDetails(
                                                vaccinationDetails);
                                        BreatheAssistanceDTO breatheAssistanceDTO = new BreatheAssistanceDTO();
                                        List<Procedure> procedures = getProceduresByCategoryAndObservationReference(
                                                fhirClient,
                                                encounter.getIdElement()
                                                        .getIdPart(),
                                                "breathe-assistance",
                                                observation.getIdElement()
                                                        .getIdPart());
                                        if (!procedures.isEmpty()) {
                                            Procedure procedure = Iterables
                                                    .getLast(procedures);
                                            breatheAssistanceDTO
                                                    .setCode(procedure
                                                            .hasCode()
                                                            && procedure.getCode()
                                                            .hasCoding()
                                                            && !procedure.getCode()
                                                            .getCoding()
                                                            .isEmpty()
                                                            ? procedure.getCode()
                                                            .getCoding()
                                                            .get(0)
                                                            .getCode()
                                                            : null);
                                            breatheAssistanceDTO
                                                    .setProvided(procedure
                                                            .hasCode()
                                                            && procedure.getCode()
                                                            .hasCoding()
                                                            && !procedure.getCode()
                                                            .getCoding()
                                                            .isEmpty());
                                        }
                                        birthDetailsDTOS.add(birthDetailsDTO);
                                    }
                                    laborAndDeliveryDetailsDTO.setBirthDetails(
                                            birthDetailsDTOS);
                                }
                                templateData.setLaborAndDeliveryDetails(
                                        laborAndDeliveryDetailsDTO);

                                // Reporting Details
                                ReportDetailsDTO reportDetailsDTO = new ReportDetailsDTO();
                                reportDetailsDTO.setReportingDate(getExtensionValueString(encounter, "http://fhir.moh.go.tz/fhir/StructureDefinition/reportingDate"));
                                templateData.setReportDetails(reportDetailsDTO);

                                // Postnatal details
                                PostnatalDetailsDTO postnatalDetailsDTO = new PostnatalDetailsDTO();
                                List<Observation> postnatalDetailsObservations = getObservationsByCategory(
                                        fhirClient,
                                        "postnatal-details", encounter, false,
                                        true);
                                if (!postnatalDetailsObservations.isEmpty()) {
                                    Observation postnatalDetailObservation = postnatalDetailsObservations
                                            .get(0);
                                    postnatalDetailsDTO.setDate(
                                            postnatalDetailObservation
                                                    .hasEffectiveDateTimeType()
                                                    ? postnatalDetailObservation
                                                    .getEffectiveDateTimeType()
                                                    .getValue()
                                                    : null);
                                    postnatalDetailsDTO
                                            .setPositiveHivStatusBeforeService(
                                                    getComponentValueBoolean(
                                                            postnatalDetailObservation,
                                                            0));
                                    List<Observation.ObservationComponentComponent> hivStatusDetailsComponents = getComponentsByCode(postnatalDetailObservation, "http://fhir.moh.go.tz/fhir/CodeSystem/maternal-child-health-codes", "hivStatusAsSeenFromAncCard");

                                    if(!hivStatusDetailsComponents.isEmpty()){
                                        Observation.ObservationComponentComponent component  = hivStatusDetailsComponents.get(0);
                                        postnatalDetailsDTO.setHivStatusAsSeenFromAncCard(
                                                STATUS.fromString(component.hasValue() && component.hasValueStringType() ? component.getValueStringType().getValue() : null)
                                        );
                                    }

                                    hivStatusDetailsComponents = getComponentsByCode(postnatalDetailObservation, "http://loinc.org", "55277-8");

                                    if(!hivStatusDetailsComponents.isEmpty()){
                                        PNCHivDetailsDTO pncHivDetailsDTO = new PNCHivDetailsDTO();
                                        Observation.ObservationComponentComponent component  = hivStatusDetailsComponents.get(0);
                                        pncHivDetailsDTO.setStatus(
                                                STATUS.fromString(
                                                        component.hasValueCodeableConcept() && component.getValueCodeableConcept().hasCoding() && !component.getValueCodeableConcept().getCoding().isEmpty() && component.getValueCodeableConcept().getCoding().get(0).hasDisplay() ? component.getValueCodeableConcept().getCoding().get(0).getDisplay() : null
                                                )
                                        );

                                        pncHivDetailsDTO.setCode(
                                                        component.hasValueCodeableConcept() && component.getValueCodeableConcept().hasCoding() && component.getValueCodeableConcept().getCoding().get(0).hasCode() ? component.getValueCodeableConcept().getCoding().get(0).getCode() : null
                                        );

                                        pncHivDetailsDTO.setHivTestNumber(getExtensionValueInt(postnatalDetailObservation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-hivDetails-hivTestNumber"));

                                        postnatalDetailsDTO.setHivDetails(pncHivDetailsDTO);
                                    }

                                    postnatalDetailsDTO.setMotherAndChildOrigin(PlaceOfOrigin.fromString(getExtensionValueString(postnatalDetailObservation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-motherAndChildOrigin")));

                                    postnatalDetailsDTO.setPlaceOfBirth(BirthPlace.fromString(getExtensionValueString(postnatalDetailObservation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-placeOfBirth")));

                                    PNCProphylaxisDTO pncProphylaxisDTO = new PNCProphylaxisDTO();
                                    pncProphylaxisDTO.setProvideWithVitaminA(getExtensionValueBoolean(postnatalDetailObservation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-prophylaxis-provideWithVitaminA"));
                                    pncProphylaxisDTO.setProvidedWithAntenatalCorticosteroids(getExtensionValueBoolean(postnatalDetailObservation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-prophylaxis-providedWithAntenatalCorticosteroids"));
                                    pncProphylaxisDTO.setProvidedWithFEFO(getExtensionValueBoolean(postnatalDetailObservation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-prophylaxis-providedWithFEFO"));

                                    postnatalDetailsDTO.setProphylaxis(pncProphylaxisDTO);

                                    List<CounsellingDTO> pncCounselling = new ArrayList<>();

                                    List<Observation.ObservationComponentComponent> pncCounsellingComponents = getComponentsByCode(postnatalDetailObservation, "http://fhir.moh.go.tz/fhir/CodeSystem/pnc-prophylaxis-codes", "counselling");

                                    for(Observation.ObservationComponentComponent component: pncCounsellingComponents){
                                        CounsellingDTO counselling = new CounsellingDTO();
                                        counselling.setName(component.hasValueCodeableConcept() && component.getValueCodeableConcept().hasCoding() && !component.getValueCodeableConcept().getCoding().isEmpty() && component.getValueCodeableConcept().getCoding().get(0).hasDisplay()
                                         ? component.getValueCodeableConcept().getCoding().get(0).getDisplay() : null);

                                        counselling.setCode(component.hasValueCodeableConcept() && component.getValueCodeableConcept().hasCoding() && !component.getValueCodeableConcept().getCoding().isEmpty() && component.getValueCodeableConcept().getCoding().get(0).hasCode()
                                                ? component.getValueCodeableConcept().getCoding().get(0).getCode() : null);

                                        pncCounselling.add(counselling);
                                    }

                                    postnatalDetailsDTO.setCounselling(pncCounselling);

                                    postnatalDetailsDTO.setDaysSinceDelivery(
                                            getExtensionValueInt(postnatalDetailObservation, "url: 'http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-daysSinceDelivery")
                                    );

                                    List<BirthDetailsDTO> birthDetailsDTOList = new ArrayList<>();

                                    List<Observation> pncBirthDetailsComponents = getObservationsByCategory(fhirClient, "postnatal-birth-details", encounter, false, true);

                                    for(Observation observation: pncBirthDetailsComponents){
                                        BirthDetailsDTO birthDetailsDTO = new BirthDetailsDTO();
                                        birthDetailsDTO.setInfantFeeding(InfantFeeding.fromString(getExtensionValueString(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-infantFeeding")));
                                        birthDetailsDTO.setGender(GENDER.fromString(getExtensionValueString(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-gender")));
                                        birthDetailsDTO.setProvidedWithKmc(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-providedWithKmc"));
                                        birthDetailsDTO.setHb(getExtensionValueInt(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-hb"));
                                        birthDetailsDTO.setHbigTested(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-hbigTested"));
                                        birthDetailsDTO.setHivDnaPCRTested(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-hivDnaPCRTested"));
                                        birthDetailsDTO.setChildHivStatus(STATUS.fromString(getExtensionValueString(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-childHivStatus")));

                                        InfectionsDTO infectionsDTO = new InfectionsDTO();
                                        infectionsDTO.setHasSepticaemia(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-infections-hasSepticaemia"));
                                        infectionsDTO.setHasOmphalitis(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-infections-hasOmphalitis"));
                                        infectionsDTO.setHasSkinInfection(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-infections-hasSkinInfection"));
                                        infectionsDTO.setHasOcularInfection(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-infections-hasOcularInfection"));
                                        infectionsDTO.setHasJaundice(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-infections-hasJaundice"));

                                        birthDetailsDTO.setInfections(infectionsDTO);

                                        PNCBirthBDOutcomeDetailsDTO outcomeDetailsDTO = new PNCBirthBDOutcomeDetailsDTO();
                                        outcomeDetailsDTO.setDischargedHome(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-outcomeDetails-dischargedHome"));
                                        outcomeDetailsDTO.setReferredToNCU(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-outcomeDetails-referredToNCU"));
                                        outcomeDetailsDTO.setReferredtohealthfacility(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-outcomeDetails-referredToHospital"));
                                        outcomeDetailsDTO.setReferredtohealthfacility(getExtensionValueBoolean(observation, "http://fhir.moh.go.tz/fhir/StructureDefinition/pnc-birthdetails-outcomeDetails-referredToHealthFacility"));

                                        birthDetailsDTO.setOutcomeDetails(outcomeDetailsDTO);

                                        birthDetailsDTOList.add(birthDetailsDTO);

                                    }

                                    postnatalDetailsDTO.setBirthDetails(birthDetailsDTOList);


                                    postnatalDetailsDTO
                                            .setReferredToCTC(
                                                    getComponentValueBoolean(
                                                            postnatalDetailObservation,
                                                            1));
                                    postnatalDetailsDTO
                                            .setReferredToClinicForFurtherServices(
                                                    getComponentValueBoolean(
                                                            postnatalDetailObservation,
                                                            2));
                                    postnatalDetailsDTO
                                            .setOutCome(getComponentValueString(
                                                    postnatalDetailObservation,
                                                    3));
                                    postnatalDetailsDTO
                                            .setAPGARScore(getComponentIntValue(
                                                    postnatalDetailObservation,
                                                    4));
                                    // TODO: Consider declaring these values first
                                    // before using them in the
                                    // condition
                                    if (getComponentValueBoolean(
                                            postnatalDetailObservation,
                                            5) != null) {
                                        ProvidedAndCodeDTO demagedNipples = new ProvidedAndCodeDTO();
                                        demagedNipples
                                                .setProvided(getComponentValueBoolean(
                                                        postnatalDetailObservation,
                                                        5));
                                        demagedNipples.setCode("61149-1");
                                        postnatalDetailsDTO.setDemagedNipples(
                                                demagedNipples);
                                    }
                                    if (getComponentValueBoolean(
                                            postnatalDetailObservation,
                                            6) != null) {
                                        ProvidedAndCodeDTO mastitis = new ProvidedAndCodeDTO();
                                        mastitis.setProvided(
                                                getComponentValueBoolean(
                                                        postnatalDetailObservation,
                                                        6));
                                        mastitis.setCode("77392-7");
                                        postnatalDetailsDTO
                                                .setMastitis(mastitis);
                                    }
                                    if (getComponentValueBoolean(
                                            postnatalDetailObservation,
                                            7) != null) {
                                        ProvidedAndCodeDTO breastAbscess = new ProvidedAndCodeDTO();
                                        breastAbscess
                                                .setProvided(getComponentValueBoolean(
                                                        postnatalDetailObservation,
                                                        7));
                                        breastAbscess.setCode("77391-9");
                                        postnatalDetailsDTO.setBreastAbscess(
                                                breastAbscess);
                                    }
                                    if (getComponentValueBoolean(
                                            postnatalDetailObservation,
                                            8) != null) {
                                        ProvidedAndCodeDTO fistula = new ProvidedAndCodeDTO();
                                        fistula.setProvided(
                                                getComponentValueBoolean(
                                                        postnatalDetailObservation,
                                                        8));
                                        fistula.setCode("37104-4");
                                        postnatalDetailsDTO.setFistula(fistula);
                                    }
                                    if (getComponentValueBoolean(
                                            postnatalDetailObservation,
                                            9) != null) {
                                        ProvidedAndCodeDTO puerperalPsychosis = new ProvidedAndCodeDTO();
                                        puerperalPsychosis
                                                .setProvided(getComponentValueBoolean(
                                                        postnatalDetailObservation,
                                                        9));
                                        puerperalPsychosis.setCode("77385-1");
                                        postnatalDetailsDTO
                                                .setPuerperalPsychosis(
                                                        puerperalPsychosis);
                                    }

                                    // TODO: Add breast feeding details

                                    // Birth details observation
                                    // TODO: Consider checking hasMember property
                                    // while fetching this observation
                                    List<Observation> birthDetailsPostnatalObservations = getObservationsByCategory(
                                            fhirClient,
                                            "postnatal-birth-details",
                                            encounter, false, false);
                                    List<BirthDetailsDTO> birthDetailsPostnatalDTOS = new ArrayList<>();
                                    if (!birthDetailsPostnatalObservations
                                            .isEmpty()) {
                                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                                        for (Observation observation : birthDetailsPostnatalObservations) {
                                            BirthDetailsDTO birthDetailsDTO = new BirthDetailsDTO();
                                            Date dateOfBith = getNestedExtensionValueDateTime(
                                                    observation,
                                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/newborn-birth-details",
                                                    "dateOfBirth");
                                            birthDetailsDTO.setDateOfBirth(dateOfBith != null ? dateOfBith.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter) : null);
                                            birthDetailsDTO.setExclusiveBreastFed(
                                                    getNestedExtensionValueBoolean(
                                                            observation,
                                                            "http://fhir.moh.go.tz/fhir/StructureDefinition/newborn-birth-details",
                                                            "exclusiveBreastFed"));
                                            birthDetailsDTO.setMotherAgeInYears(
                                                    getNestedExtensionValueInteger(
                                                            observation,
                                                            "http://fhir.moh.go.tz/fhir/StructureDefinition/maternal-details",
                                                            "motherAgeInYears"));
                                            // TODO: Add Mother HIV status
                                            // birthDetailsDTO.setMotherHivStatus(getNestedExtensionValueString(observation,
                                            // "http://fhir.moh.go.tz/fhir/StructureDefinition/maternal-details",
                                            // "motherHivStatus"));
                                            birthDetailsDTO.setProvidedWithARV(
                                                    getNestedExtensionValueBoolean(
                                                            observation,
                                                            "http://fhir.moh.go.tz/fhir/StructureDefinition/maternal-details",
                                                            "providedWithARV"));
                                            birthDetailsDTO
                                                    .setWeightInKgs(getComponentValueQuantityInt(
                                                            observation,
                                                            0) != null
                                                            ? getComponentValueQuantityInt(
                                                            observation,
                                                            0)
                                                            .floatValue()
                                                            : null);
                                            birthDetailsDTO.setMultipleBirth(
                                                    getComponentValueBoolean(
                                                            observation,
                                                            1));
                                            birthDetailsDTO.setBirthOrder(
                                                    getComponentIntValue(
                                                            observation,
                                                            2));
                                            birthDetailsDTO.setMarcerated(
                                                    getComponentValueBoolean(
                                                            observation,
                                                            3));
                                            List<VaccinationDetailsDTO> vaccinationDetails = getVaccinationDetails(
                                                    encounter.getIdElement()
                                                            .getIdPart(),
                                                    patient,
                                                    observation.getIdElement()
                                                            .getIdPart());
                                            birthDetailsDTO.setVaccinationDetails(
                                                    vaccinationDetails);
                                            BreatheAssistanceDTO breatheAssistanceDTO = new BreatheAssistanceDTO();
                                            List<Procedure> procedures = getProceduresByCategoryAndObservationReference(
                                                    fhirClient,
                                                    encounter.getIdElement()
                                                            .getIdPart(),
                                                    "breathe-assistance",
                                                    observation.getIdElement()
                                                            .getIdPart());
                                            if (!procedures.isEmpty()) {
                                                Procedure procedure = Iterables
                                                        .getLast(procedures);
                                                breatheAssistanceDTO
                                                        .setCode(procedure
                                                                .hasCode()
                                                                && procedure.getCode()
                                                                .hasCoding()
                                                                && !procedure.getCode()
                                                                .getCoding()
                                                                .isEmpty()
                                                                ? procedure.getCode()
                                                                .getCoding()
                                                                .get(0)
                                                                .getCode()
                                                                : null);
                                                breatheAssistanceDTO
                                                        .setProvided(
                                                                procedure.hasCode()
                                                                        && procedure.getCode()
                                                                        .hasCoding()
                                                                        && !procedure.getCode()
                                                                        .getCoding()
                                                                        .isEmpty());
                                            }
                                            birthDetailsPostnatalDTOS.add(
                                                    birthDetailsDTO);
                                        }
                                        postnatalDetailsDTO.setBirthDetails(
                                                birthDetailsPostnatalDTOS);
                                    }
                                    templateData.setPostnatalDetails(
                                            postnatalDetailsDTO);
                                }

                                // Admission details
                                AdmissionDetailsDTO admissionDetailsDTO = new AdmissionDetailsDTO();
                                List<Observation> admissionDetailObservations = getObservationsByCategory(
                                        fhirClient,
                                        "admission-details", encounter, false,
                                        true);
                                if (!admissionDetailObservations.isEmpty()) {
                                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                                    Observation admissionDetail = admissionDetailObservations
                                            .get(0);
                                    admissionDetailsDTO.setAdmissionDate(
                                            admissionDetail.hasEffectiveDateTimeType()
                                                    && admissionDetail
                                                    .getEffectiveDateTimeType()
                                                    .hasValue()
                                                    ? admissionDetail
                                                    .getEffectiveDateTimeType()
                                                    .getValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter)
                                                    : null);
                                    admissionDetailsDTO.setAdmissionDiagnosis(
                                            getComponentValueCodeableConceptCode(
                                                    admissionDetail,
                                                    1));
                                    admissionDetailsDTO.setDischargedOn(
                                            getComponentValueDateTime(
                                                    admissionDetail,
                                                    2).toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter));
                                    admissionDetailsDTO.setDischargeStatus(
                                            getComponentValueString(
                                                    admissionDetail,
                                                    3));
                                    templateData.setAdmissionDetails(
                                            admissionDetailsDTO);
                                }

                                sharedRecords.add(templateData.toMap());
                            }

                            // TODO: Add history when numberOfVisits > 1
                        } else if (organization != null
                                && sharedRecordsConstants.AllowRetrievingRecordsFromSourceEMR) {
                            // TODO: Request visit from facility provided
                            try {
                                Mediator facilityConnectionDetails = this.mediatorsService
                                        .getMediatorByCode(hfrCode);
                                if (facilityConnectionDetails != null) {
                                    // TODO: Add support to get the source api from
                                    // mediator
                                    Map<String, Object> emrHealthRecords = mediatorsService
                                            .routeToMediator(
                                                    facilityConnectionDetails,
                                                    "emrHealthRecords?id="
                                                            + identifier
                                                            + "&idType="
                                                            + identifierType,
                                                    "GET",
                                                    null);
                                    List<Map<String, Object>> visits = (List<Map<String, Object>>) emrHealthRecords
                                            .get("results");
                                    sharedRecords = visits;
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                                throw new Exception(
                                        "There is issue with settings to query data from source system");
                            }
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

    public List<Encounter> getLatestEncounterUsingPatientAndOrganisation(String id, Organization organization,
                                                                         Integer numberOfVisits) throws Exception {
        List<Encounter> encounters = new ArrayList<>();
        Bundle results = new Bundle();
        var encounterSearch = fhirClient.search().forResource(Encounter.class)
                .where(new ReferenceClientParam("patient").hasId(id));
        if (organization != null) {
            encounterSearch.where(Encounter.SERVICE_PROVIDER
                    .hasAnyOfIds(organization.getIdElement().getIdPart()));
        }
        results = encounterSearch.sort(new SortSpec("date").setOrder(SortOrderEnum.DESC))
                .returnBundle(Bundle.class)
                .execute();
        if (results.hasEntry() && !results.getEntry().isEmpty()) {
            int visitsLimit = results.getEntry().size() > numberOfVisits ? numberOfVisits
                    : results.getEntry().size();
            for (var count = 0; count < visitsLimit; count++) {
                encounters.add((Encounter) results.getEntry().get(count).getResource());
            }
        }
        return encounters;
    }

    public static String stringify(Object object) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Map<String, Object>> requestDataFromHealthFacility(Map<String, Object> requestPayload)
            throws Exception {
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
            Mediator mediator = mediatorsService
                    .getMediatorByCode(requestPayload.get("hfrCode").toString());
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

    public Map<String, Object> processSharedRecords(SharedHealthRecordsDTO sharedRecordPayload,
                                                    Map<String, Object> mandatoryClientRegistryIdTypes) throws Exception {

        PrintOutHelper.print(sharedRecordPayload);

        try {
            Map<String, Object> response = new HashMap<>();
            DemographicDetailsDTO demographicDetails = sharedRecordPayload.getDemographicDetails();
            FacilityDetailsDTO facilityDetails = sharedRecordPayload.getFacilityDetails();
            VisitDetailsDTO visitDetails = sharedRecordPayload.getVisitDetails();
            String mrn = sharedRecordPayload.getMrn();
            // Check if patient exists
            Patient patient = new Patient();

            List<IdentifierDTO> identifiers = demographicDetails != null
                    ? demographicDetails.getIdentifiers()
                    : null;
            String defaultIdentifierType = this.clientRegistryConstants.DefaultIdentifierType;
            // TODO: Find a way to use default identifier type to get client
            if (identifiers != null && !identifiers.isEmpty()) {
                for (IdentifierDTO identifier : identifiers) {
                    patient = this.clientRegistryService
                            .getPatientUsingIdentifier(identifier.getId());
                    if (patient != null) {
                        break;
                    }
                }
            } else if (mrn != null) {
                patient = this.clientRegistryService.getPatientUsingIdentifier(mrn);
                if (patient == null) {
                    throw new Exception("Client with MRN " + mrn
                            + " does not exists and MRN is not enough to register the client on CR. Please provide demographic details");
                }
            }

            if (patient == null) {
                // 1. Check if mandatory IDs are found to register the client
                if (mandatoryClientRegistryIdTypes == null) {
                    throw new Exception(
                            "Mandatory Identifier types have not been set. Contact ICT team");
                }
                // 2. Create patient
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

    public List<BiologicallyDerivedProduct> getBiologicallyDerivedProductByOrganizationId(String organizationId) {
        List<BiologicallyDerivedProduct> products = new ArrayList<>();

        // Step 1: Fetch all BiologicallyDerivedProduct resources (no filtering in
        // query)
        Bundle bundle = fhirClient
                .search()
                .forResource(BiologicallyDerivedProduct.class)
                .returnBundle(Bundle.class)
                .execute();

        // Step 2: Filter manually by `collection.source.reference`
        while (bundle != null) {
            for (Bundle.BundleEntryComponent entry : bundle.getEntry()) {
                if (entry.getResource() instanceof BiologicallyDerivedProduct) {
                    BiologicallyDerivedProduct product = (BiologicallyDerivedProduct) entry
                            .getResource();
                    // Check if `collection.source.reference` matches Organization/{organizationId}
                    if (product.hasCollection() && product.getCollection().hasSource()) {
                        String reference = product.getCollection().getSource().getReference(); // Example:
                        // "Organization/100097-5"
                        if (reference != null
                                && reference.equals("Organization/" + organizationId)) {
                            products.add(product);
                        }
                    }
                }
            }
            // Step 3: Handle pagination
            bundle = bundle.getLink("next") != null ? fhirClient.loadPage().next(bundle).execute() : null;
        }

        return products;
    }

    public List<Appointment> getAppointmentByEncounterId(String encounterId) throws Exception {
        List<Appointment> appointments = new ArrayList<>();

        var appointmentsSearch = fhirClient
                .search()
                .forResource(Appointment.class)
                .where(new TokenClientParam("supporting-info")
                        .exactly()
                        .code("Encounter/" + encounterId))
                .returnBundle(org.hl7.fhir.r4.model.Bundle.class)
                .execute();

        for (var entry : appointmentsSearch.getEntry()) {
            if (entry.getResource() instanceof Appointment) {
                appointments.add((Appointment) entry.getResource());
            }
        }

        return appointments;
    }

    public String extractHfrCode(String id) {
        if (id == null || !id.contains("-")) {
            return "";
        }
        String[] parts = id.split("-");
        if (parts.length < 2) {
            return "";
        }
        return parts[0] + "-" + parts[1]; // Combine the first two parts
    }

    // public List<PaymentNotice> getPaymentNoticesForAppointment(MedicationDispense appointment) throws Exception {
    //         List<PaymentNotice> paymentNotices = new ArrayList<>();

    //         // Check if the appointment has supporting information
    //         if (appointment.hasSupportingInformation()) {
    //                 for (Reference ref : appointment.getSupportingInformation()) {
    //                         String reference = ref.getReference(); // Example: "PaymentNotice/12345"

    //                         // Check if the reference starts with "PaymentNotice/"
    //                         if (reference != null && reference.startsWith("PaymentNotice/")) {
    //                                 String paymentNoticeId = reference.split("/")[1]; // Extract ID

    //                                 // Fetch the PaymentNotice by ID
    //                                 PaymentNotice paymentNotice = fhirClient
    //                                                 .read()
    //                                                 .resource(PaymentNotice.class)
    //                                                 .withId(paymentNoticeId)
    //                                                 .execute();

    //                                 if (paymentNotice != null) {
    //                                         paymentNotices.add(paymentNotice);
    //                                 }
    //                         }
    //                 }
    //         }
    //         PrintOutHelper.print("=============>" + paymentNotices);
    //         return paymentNotices;
    // }

    public List<PaymentNotice> getPaymentNoticesFromResource(Resource resource) throws Exception {
        List<PaymentNotice> paymentNotices = new ArrayList<>();
        List<Reference> references = new ArrayList<>();

        if (resource instanceof Appointment) {
            references = ((Appointment) resource).getSupportingInformation();
        } else if (resource instanceof MedicationDispense) {
            references = ((MedicationDispense) resource).getSupportingInformation();
        } else {
            throw new IllegalArgumentException("Unsupported resource type: " + resource.getClass().getSimpleName());
        }

        for (Reference ref : references) {
            String reference = ref.getReference(); // Example: "PaymentNotice/12345"
            if (reference != null && reference.startsWith("PaymentNotice/")) {
                String paymentNoticeId = reference.split("/")[1];

                PaymentNotice paymentNotice = fhirClient
                        .read()
                        .resource(PaymentNotice.class)
                        .withId(paymentNoticeId)
                        .execute();

                if (paymentNotice != null) {
                    paymentNotices.add(paymentNotice);
                }
            }
        }

        PrintOutHelper.print("=============>" + paymentNotices);

        return paymentNotices;
    }

    // TODO: Confirm if we still need this function as questionnaire response is not
    // used in the current implementation
    public List<QuestionnaireResponse> getQuestionnaireResponsesById(String encounterId) throws Exception {
        List<QuestionnaireResponse> questionnaireResponses = new ArrayList<>();
        var questionnaireResponseSearch = fhirClient.search().forResource(QuestionnaireResponse.class)
                .where(QuestionnaireResponse.ENCOUNTER.hasAnyOfIds(encounterId));

        Bundle observationBundle;
        observationBundle = questionnaireResponseSearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                QuestionnaireResponse questionnaireResponse = (QuestionnaireResponse) entryComponent
                        .getResource();
                questionnaireResponses.add(questionnaireResponse);
            }
        }
        return questionnaireResponses;
    }

    public List<DiagnosticReport> getDiagnosticReportByCategory(String encounterId, String category)
            throws Exception {
        List<DiagnosticReport> diagnosticReports = new ArrayList<>();
        var searchDiagnosticReports = fhirClient.search().forResource(DiagnosticReport.class)
                .where(DiagnosticReport.CATEGORY.exactly().code(category));
        searchDiagnosticReports.where(DiagnosticReport.ENCOUNTER.hasAnyOfIds(encounterId));
        Bundle diagnosticReportBundle = searchDiagnosticReports.sort().descending("_lastUpdated")
                .returnBundle(Bundle.class).execute();
        if (diagnosticReportBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : diagnosticReportBundle.getEntry()) {
                DiagnosticReport diagnosticReport = (DiagnosticReport) entryComponent.getResource();
                diagnosticReports.add(diagnosticReport);
            }
        }
        return diagnosticReports;
    }

    public List<Immunization> getImmunizationsByEncounterIdAndObservationReference(
            String encounterId,
            Patient patient,
            String observationId) throws Exception {

        List<Immunization> immunizations = new ArrayList<>();

        try {
            // Search for Immunizations related to the patient
            Bundle immunizationBundle = fhirClient
                    .search()
                    .forResource(Immunization.class)
                    .where(Immunization.PATIENT.hasId(patient.getIdElement().getIdPart()))
                    .returnBundle(Bundle.class)
                    .execute();

            if (immunizationBundle.hasEntry()) {
                for (Bundle.BundleEntryComponent entry : immunizationBundle.getEntry()) {
                    Resource resource = entry.getResource();
                    if (resource instanceof Immunization) {
                        Immunization immunization = (Immunization) resource;

                        // Check if the immunization references the specified encounter
                        boolean matchesEncounter = immunization.hasEncounter()
                                && ("Encounter/" + encounterId).equals(immunization
                                .getEncounter().getReference());

                        // Optionally check if the immunization references the specified
                        // observation
                        if (observationId != null) {
                            boolean matchesObservation = immunization.hasReasonReference()
                                    && !immunization.getReasonReference().isEmpty()
                                    && immunization.getReasonReference()
                                    .get(0).getReference()
                                    .equals("Observation/"
                                            + observationId);
                            if (matchesEncounter && matchesObservation) {
                                immunizations.add(immunization);
                            }
                        } else {
                            if (matchesEncounter) {
                                immunizations.add(immunization);
                            }
                        }

                    }
                }
            }
        } catch (Exception e) {
            throw e;
        }

        return immunizations;
    }

    public DocumentReference getDocumentReferenceById(String id) throws Exception {
        DocumentReference documentReference;
        documentReference = fhirClient.read().resource(DocumentReference.class).withId(id).execute();
        return documentReference;
    }

    public List<VaccinationDetailsDTO> getVaccinationDetails(
            String encounterId,
            Patient patient,
            String observationReference) throws Exception {

        List<VaccinationDetailsDTO> vaccinationDetailsDTOS = new ArrayList<>();

        // Retrieve Immunizations filtered by Encounter ID and optional Observation
        // reference
        List<Immunization> vaccinationDetails = getImmunizationsByEncounterIdAndObservationReference(
                encounterId,
                patient, observationReference);

        if (!vaccinationDetails.isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            for (Immunization immunization : vaccinationDetails) {
                VaccinationDetailsDTO vaccinationDetailsDTO = new VaccinationDetailsDTO();

                // Map Immunization data to DTO
                vaccinationDetailsDTO.setDate(
                        immunization.hasOccurrenceDateTimeType()
                                ? immunization.getOccurrenceDateTimeType().getValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter)
                                : null);
                vaccinationDetailsDTO.setCode(
                        immunization.hasVaccineCode()
                                ? immunization.getVaccineCode().getText()
                                : null);
                vaccinationDetailsDTO.setStatus(
                        immunization.hasStatus()
                                ? immunization.getStatus().getDisplay()
                                : null);
                vaccinationDetailsDTO.setDosage(
                        immunization.hasDoseQuantity()
                                ? immunization.getDoseQuantity().getValue().intValue()
                                : null);

                vaccinationDetailsDTO.setType(immunization.hasVaccineCode()
                        ? immunization.getVaccineCode().getText()
                        : null);

                if (immunization.hasNote() && !immunization.getNote().isEmpty()) {
                    vaccinationDetailsDTO.setNotes(immunization.getNote().get(0).getText());
                }

                if (immunization.hasRoute() && !immunization.getRoute().getCoding().isEmpty()) {
                    vaccinationDetailsDTO.setVaccinationModality(
                            immunization.getRoute().getCoding().get(0).getDisplay());
                }

                // Handle Reactions
                if (immunization.hasReaction() && !immunization.getReaction().isEmpty()) {
                    Immunization.ImmunizationReactionComponent reactionComponent = immunization
                            .getReaction().get(0);
                    ReactionDTO reaction = new ReactionDTO();

                    reaction.setReactionDate(
                            reactionComponent.hasDate()
                                    ? reactionComponent.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter)
                                    : null);

                     reaction.setNotes(immunization.hasNote() && !immunization.getNote().isEmpty() ? immunization.getNote().get(0).getText() : null);

                    reaction.setReported(
                            reactionComponent.hasReported()
                                    ? reactionComponent.getReported()
                                    : null);

                    vaccinationDetailsDTO.setReaction(reaction);
                }

                vaccinationDetailsDTOS.add(vaccinationDetailsDTO);
            }
        }

        return vaccinationDetailsDTOS;
    }
}
