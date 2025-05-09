package com.Adapter.icare.ClientRegistry.Services;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.hl7.fhir.r4.model.Appointment;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.CodeableConcept;
import org.hl7.fhir.r4.model.Condition;
import org.hl7.fhir.r4.model.Coverage;
import org.hl7.fhir.r4.model.Encounter;
import org.hl7.fhir.r4.model.Identifier;
import org.hl7.fhir.r4.model.ImagingStudy;
import org.hl7.fhir.r4.model.Organization;
import org.hl7.fhir.r4.model.Patient;
import org.hl7.fhir.r4.model.PaymentNotice;
import org.hl7.fhir.r4.model.PrimitiveType;
import org.hl7.fhir.r4.model.Reference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.Adapter.icare.ClientRegistry.Domains.ClientRegistryIdPool;
import com.Adapter.icare.ClientRegistry.Repository.ClientRegistryIdsRepository;
import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Constants.FHIRConstants;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.AddressDTO;
import com.Adapter.icare.Dtos.AppointmentDetailsDTO;
import com.Adapter.icare.Dtos.AppointmentPaymentDetailsDTO;
import com.Adapter.icare.Dtos.AppointmentServiceDetailsDTO;
import com.Adapter.icare.Dtos.ClientRegistrationDTO;
import com.Adapter.icare.Dtos.ContactDTO;
import com.Adapter.icare.Dtos.ContactPeopleDTO;
import com.Adapter.icare.Dtos.DemographicDetailsDTO;
import com.Adapter.icare.Dtos.FacilityDetailsDTO;
import com.Adapter.icare.Dtos.FileDTO;
import com.Adapter.icare.Dtos.HumanNameDTO;
import com.Adapter.icare.Dtos.IdentifierDTO;
import com.Adapter.icare.Dtos.PatientDTO;
import com.Adapter.icare.Dtos.PaymentDetailsDTO;
import com.Adapter.icare.Dtos.VisitMainPaymentDetailsDTO;
import com.Adapter.icare.Services.UserService;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.api.SummaryEnum;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.gclient.TokenClientParam;

@Service
public class ClientRegistryService {

    private final IGenericClient fhirClient;
    private final FHIRConstants fhirConstants;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;
    private final ClientRegistryIdsRepository clientRegistryIdsRepository;

    @Autowired
    public ClientRegistryService(FHIRConstants fhirConstants,
            UserService userService,
            ClientRegistryIdsRepository clientRegistryIdsRepository) {
        this.fhirConstants = fhirConstants;
        this.clientRegistryIdsRepository = clientRegistryIdsRepository;

        FhirContext fhirContext = FhirContext.forR4();

        // Configure timeout settings
        fhirContext.getRestfulClientFactory().setConnectTimeout(60000); // 60 seconds
        fhirContext.getRestfulClientFactory().setSocketTimeout(60000); // 60 seconds

        this.fhirClient = fhirContext.newRestfulGenericClient(fhirConstants.FHIRServerUrl);
        this.userService = userService;
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService
                    .getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
    }

    public Patient savePatientToFHIR(Patient patient) throws Exception {
        return (Patient) fhirClient.create().resource(patient).execute().getResource();
    }

    public Map<String, Object> identifyDuplicates() throws Exception {
        try {
            Map<String, Object> response = new HashMap<>();
            List<Map<String, Object>> clientsList = new ArrayList<>();
            // 1 Get all clients
            // 2. Formulate payload as per algorithm
            // 3. Identify potential duplicates
            // 4. Link potential duplicates
            // 5. Save the ids of the potential duplicates
            Bundle bundle = fhirClient.search().forResource(Patient.class).returnBundle(Bundle.class).execute();
            if (bundle.hasEntry()) {
                for (Bundle.BundleEntryComponent entry : bundle.getEntry()) {

                }
            }
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }

    public MethodOutcome markPatientAsInActive(Patient patient) {
        patient.setActive(false);
        return fhirClient.update().resource(patient).execute();
    }

    public Map<String, Object> getPatientsWithPagination(
            int page,
            int pageSize,
            String status,
            String identifier,
            String identifierType,
            String hfrCode,
            String gender,
            String firstName,
            String middleName,
            String lastName,
            Date dateOfBirth,
            Boolean onlyLinkedClients) throws Exception {
        Map<String, Object> patientDataResponse = new HashMap<>();
        try {
            List<ClientRegistrationDTO> patients = new ArrayList<>();
            Bundle response = new Bundle();
            // TODO: You might consider enumerating the gender codes
            var searchClient = fhirClient.search().forResource(Patient.class);
            if (identifier != null) {
                searchClient.where(Patient.IDENTIFIER.exactly().identifier(identifier));
            }

            if (hfrCode != null) {
                searchClient.where(Patient.IDENTIFIER.hasSystemWithAnyCode(hfrCode));

                searchClient.include(Patient.INCLUDE_ALL);
            }

            if (onlyLinkedClients != null) {
                // TODO replace hardcoded ids with dynamic ones
                searchClient.where(Patient.LINK.hasAnyOfIds("299", "152"));
            }

            if (gender != null) {
                searchClient.where(Patient.GENDER.exactly().code(gender.toLowerCase()));
            }

            if (lastName != null) {
                searchClient.where(Patient.FAMILY.matches().value(lastName));
            }

            if (firstName != null) {
                searchClient.where(Patient.GIVEN.matches().value(firstName));
            }

            if (dateOfBirth != null) {
                searchClient.where(Patient.BIRTHDATE.beforeOrEquals().day(dateOfBirth));
            }

            response = searchClient.count(pageSize)
                    .offset(page - 1)
                    .returnBundle(Bundle.class)
                    .execute();

            Bundle clientTotalBundle = searchClient
                    .summaryMode(SummaryEnum.COUNT)
                    .returnBundle(Bundle.class)
                    .execute();
            if (!response.hasEntry()) {
                searchClient = fhirClient.search().forResource(Patient.class);
                if (identifier != null) {
                    searchClient.where(Patient.RES_ID.exactly().code(identifier));
                }

                if (firstName != null) {
                    searchClient.where(Patient.GIVEN.matches().value(firstName));
                }

                response = searchClient.count(pageSize)
                        .offset(page - 1)
                        .returnBundle(Bundle.class)
                        .execute();
            }

            for (Bundle.BundleEntryComponent entry : response.getEntry()) {
                if (entry.getResource() instanceof Patient) {
                    try {
                        Patient patientData = (Patient) entry.getResource();
                        PatientDTO patientDTO = mapToPatientDTO(patientData);

                        // Get coverages
                        List<Coverage> coverages = getCoveragesByPatientIdAndOrDependent(patientData.getIdElement().getIdPart(), null);
                        List<PaymentDetailsDTO> paymentDetailsDTOs = new ArrayList<>();
                        if (coverages.size() > 0) {
                            paymentDetailsDTOs = coverages.stream().map(this::mapToPaymentDetails)
                                    .collect(Collectors.toList());
                        }
                        patientDTO.setPaymentDetails(paymentDetailsDTOs);

                        if (identifier != null) {
                            List<org.hl7.fhir.r4.model.ImagingStudy> imagingStudies = getImagingStudiesForPatient(
                                    patientData.getIdElement().getIdPart());
                            List<FileDTO> fileDTOs = new ArrayList<>();
                            for (org.hl7.fhir.r4.model.ImagingStudy study : imagingStudies) {
                                for (org.hl7.fhir.r4.model.ImagingStudy.ImagingStudySeriesComponent series : study
                                        .getSeries()) {
                                    for (org.hl7.fhir.r4.model.ImagingStudy.ImagingStudySeriesInstanceComponent instance : series
                                            .getInstance()) {
                                        FileDTO fileDTO = new FileDTO();
                                        fileDTO.setName(instance.getTitle());
                                        fileDTO.setId(instance.getId());
                                        if (instance.getTitleElement() != null) {
                                            for (org.hl7.fhir.r4.model.Extension extension : instance.getTitleElement()
                                                    .getExtension()) {

                                                if (extension.getUrl()
                                                        .equals("http://hl7.org/fhir/StructureDefinition/rendering-url")) {
                                                    if (extension.getValue() instanceof org.hl7.fhir.r4.model.UrlType) {
                                                        org.hl7.fhir.r4.model.UrlType urlType = (org.hl7.fhir.r4.model.UrlType) extension
                                                                .getValue();
                                                        fileDTO.setUrl(urlType.getValueAsString());
                                                    } else {
                                                        fileDTO.setUrl(extension.getValue().toString());
                                                    }
                                                    break;
                                                }
                                            }
                                        }

                                        fileDTOs.add(fileDTO);
                                    }
                                }
                            }
                            patientDTO.setFiles(fileDTOs);
                        }
                        ClientRegistrationDTO clientDetails = new ClientRegistrationDTO();
                        clientDetails.setDemographicDetails(patientDTO.toMap());
                        Organization managingOrganization = new Organization();
                        FacilityDetailsDTO facilityDetails = new FacilityDetailsDTO();
                        managingOrganization = (Organization) patientData.getManagingOrganization().getResource();
                        if (managingOrganization != null && managingOrganization.getIdElement() != null) {
                            facilityDetails.setCode(managingOrganization.getIdElement().getIdPart());
                            facilityDetails.setName(managingOrganization.getName());
                        }
                        clientDetails.setFacilityDetails(facilityDetails);
                        patients.add(clientDetails);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
            patientDataResponse.put("results", patients);
            Map<String, Object> pager = new HashMap<>();
            pager.put("totalPages", null);
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("total", clientTotalBundle.getTotal());
            patientDataResponse.put("pager", pager);
            return patientDataResponse;
        } catch (

        Exception e) {
            e.printStackTrace(); // Log the exception for referencing via logs
            throw new RuntimeException("Failed to retrieve patients from FHIR server", e);
        }
    }

    public List<DemographicDetailsDTO> getPatients(int page,
            int pageSize,
            String status,
            String identifier,
            String identifierType,
            String gender,
            String firstName,
            String middleName,
            String lastName,
            Date dateOfBirth,
            Boolean onlyLinkedClients) {
        try {
            List<DemographicDetailsDTO> patients = new ArrayList<>();
            Bundle response = new Bundle();
            // TODO: You might consider enumerating the gender codes
            var searchClient = fhirClient.search().forResource(Patient.class);
            if (identifier != null) {
                searchClient.where(Patient.IDENTIFIER.exactly().identifier(identifier));
            }

            if (onlyLinkedClients != null) {
                // TODO replace hardcoded ids with dynamic ones
                searchClient.where(Patient.LINK.hasAnyOfIds("HCR-F-356072-1282006", "HCR-F-00101-6111991"));
            }

            if (gender != null) {
                searchClient.where(Patient.GENDER.exactly().code(gender.toLowerCase()));
            }

            if (lastName != null) {
                searchClient.where(Patient.FAMILY.matches().value(lastName));
            }

            if (firstName != null) {
                searchClient.where(Patient.GIVEN.matches().value(firstName));
            }

            if (dateOfBirth != null) {
                searchClient.where(Patient.BIRTHDATE.beforeOrEquals().day(dateOfBirth));
            }

            response = searchClient.count(pageSize)
                    .offset(page)
                    .returnBundle(Bundle.class)
                    .execute();
            Bundle clientTotalBundle = searchClient
                    .summaryMode(SummaryEnum.COUNT)
                    .returnBundle(Bundle.class)
                    .execute();

            for (Bundle.BundleEntryComponent entry : response.getEntry()) {
                if (entry.getResource() instanceof Patient) {
                    Patient patientData = (Patient) entry.getResource();
                    patientData.getIdentifier();
                    PatientDTO patientDTO = mapToPatientDTO(patientData);
                    patients.add(patientDTO.toMap());
                }
            }
            return patients;
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for referencing via logs
            throw new RuntimeException("Failed to retrieve patients from FHIR server", e);
        }
    }

    public int getTotalPatients() {
        Bundle response = fhirClient.search()
                .forResource(Patient.class)
                .summaryMode(SummaryEnum.COUNT) // Request only the total count
                .returnBundle(Bundle.class)
                .execute();
        return response.getTotal();
    }

    public Patient getPatientById(String id) {
        return fhirClient.read()
                .resource(Patient.class)
                .withId(id)
                .execute();
    }

    public Patient getPatientByIdentifier(String identifier) {
        Patient patient = new Patient();
        Bundle response = fhirClient.search().forResource(Patient.class)
                .where(Patient.IDENTIFIER.exactly().identifier(identifier))
                .returnBundle(Bundle.class)
                .execute();
        if (!response.getEntry().isEmpty()) {
            patient = (Patient) response.getEntry().get(0).getResource();
        }
        return patient;
    }

    public Patient getPatientUsingIdentifier(String identifier) throws Exception {
        Bundle response = new Bundle();
        Patient patient = new Patient();
        var searchClient = fhirClient.search().forResource(Patient.class)
                .where(Patient.IDENTIFIER.exactly().identifier(identifier));
        response = searchClient.returnBundle(Bundle.class).execute();

        if (!response.getEntry().isEmpty()) {
            // TODO: Handle potential duplicate
            for (Bundle.BundleEntryComponent entry : response.getEntry()) {
                if (entry.getResource() instanceof Patient) {
                    patient = (Patient) entry.getResource();
                }
            }
        }
        return patient;
    }

    public Map<String, Object> deleteClientsWithNoIdentifiers() throws Exception {
        Bundle resourceBundle = new Bundle();
        List<Map<String, Object>> deleteClients = new ArrayList<>();
        List<Map<String, Object>> clientsFailed = new ArrayList<>();
        var searchClient = fhirClient.search().forResource(Patient.class);
        // TODO: ENsure the number of clients to be loaded is dynamic
        resourceBundle = searchClient.count(1000).returnBundle(Bundle.class).execute();
        if (!resourceBundle.getEntry().isEmpty()) {
            for (Bundle.BundleEntryComponent entry : resourceBundle.getEntry()) {
                if (entry.getResource() instanceof Patient) {
                    Patient patient = (Patient) entry.getResource();
                    String patientId = patient.getIdElement().getIdPart();
                    if (patient.getIdentifier().isEmpty()) {
                        try {
                            Map<String, Object> client = new HashMap<>();
                            client.put("id", patient.getIdElement().getIdPart());
                            deleteClients.add(client);
                            MethodOutcome methodOutcome = fhirClient.delete().resource(patient).execute();
                        } catch (Exception e) {
                            Bundle encounterBundle = fhirClient.search().forResource(Encounter.class)
                                    .where(Encounter.PATIENT.hasId(patientId))
                                    .returnBundle(Bundle.class).execute();
                            Bundle conditionBundle = fhirClient.search().forResource(Condition.class)
                                    .where(Encounter.PATIENT.hasId(patientId))
                                    .returnBundle(Bundle.class).execute();
                            if (encounterBundle.hasEntry() && !encounterBundle.getEntry().isEmpty()) {
                                for (Bundle.BundleEntryComponent encounterEntry : encounterBundle.getEntry()) {
                                    Encounter encounter = (Encounter) encounterEntry.getResource();
                                    try {
                                        MethodOutcome methodOutcomeEncounterDelete = fhirClient.delete()
                                                .resource(encounter).execute();
                                        MethodOutcome methodOutcomeClientDelete = fhirClient.delete().resource(patient)
                                                .execute();
                                        Map<String, Object> client = new HashMap<>();
                                        client.put("id", patient.getIdElement().getIdPart());
                                        deleteClients.add(client);
                                    } catch (Exception exception) {
                                        exception.printStackTrace();
                                    }
                                }
                            }

                            // if (conditionBundle.hasEntry() && !conditionBundle.getEntry().isEmpty()) {
                            // for (Bundle.BundleEntryComponent conditionEntry: encounterBundle.getEntry())
                            // {
                            // Condition condition = (Condition) conditionEntry.getResource();
                            // try {
                            // MethodOutcome methodOutcomeEncounterDelete =
                            // fhirClient.delete().resource(condition).execute();
                            // MethodOutcome methodOutcomeClientDelete =
                            // fhirClient.delete().resource(patient).execute();
                            // Map<String,Object> client = new HashMap<>();
                            // client.put("id", patient.getIdElement().getIdPart());
                            // deleteClients.add(client);
                            // } catch (Exception condException) {
                            // condException.printStackTrace();
                            // }
                            // }
                            // }
                            Map<String, Object> client = new HashMap<>();
                            client.put("id", patient.getIdElement().getIdPart());
                            client.put("reason", e.getMessage());
                            clientsFailed.add(client);
                            e.printStackTrace();
                        }
                        Thread.sleep(100);
                    }
                }
            }
        }
        Map<String, Object> response = new HashMap<>();
        response.put("deleteClients", deleteClients);
        response.put("clientsFailed", clientsFailed);
        return response;
    }

    public boolean generateClientRegistryIdentifiers(Integer start,
            Integer limit,
            String regex) throws Exception {
        try {
            List<ClientRegistryIdPool> clientRegistryIdPools = new ArrayList<>();
            for (Integer count = start; count <= limit; count++) {
                ClientRegistryIdPool clientRegistryIdPool = new ClientRegistryIdPool();
                String id = createIdentifier(count, regex);
                clientRegistryIdPool.setIdentifier(id);
                clientRegistryIdPools.add(clientRegistryIdPool);
            }
            List<ClientRegistryIdPool> saved = clientRegistryIdsRepository.saveAll(clientRegistryIdPools);
            return Boolean.TRUE;
        } catch (Exception e) {
            e.printStackTrace();
            return Boolean.FALSE;
        }
    }

    public List<String> activateIdentifiers(List<String> identifiers) throws Exception {
        try {
            List<String> idsActivated = new ArrayList<>();
            for (String identifier : identifiers) {
                ClientRegistryIdPool clientRegistryIdPool = clientRegistryIdsRepository.getIdPoolDetails(identifier);
                clientRegistryIdPool.setUsed(false);
                ClientRegistryIdPool updatedIdentifier = clientRegistryIdsRepository.save(clientRegistryIdPool);
                if (!updatedIdentifier.isUsed()) {
                    idsActivated.add(updatedIdentifier.getIdentifier());
                }
            }
            return idsActivated;
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }

    public Integer getCountOfIdentifiersBySearchCategory(
            ClientRegistryIdPool.IdSearchCategory idSearchCategory) throws Exception {
        if (idSearchCategory.equals(ClientRegistryIdPool.IdSearchCategory.UNUSED)) {
            return Math.toIntExact(clientRegistryIdsRepository.countByUsedFalse());
        } else if (idSearchCategory.equals(ClientRegistryIdPool.IdSearchCategory.USED)) {
            return Math.toIntExact(clientRegistryIdsRepository.countByUsedTrue());
        } else {
            return Math.toIntExact(clientRegistryIdsRepository.count());
        }
    }

    private String createIdentifier(Integer idNumber, String regex) throws Exception {
        return String.format(regex.replace("^", "").replace("$", ""), idNumber);
    }

    public List<IdentifierDTO> getClientRegistryIdentifiers(Integer countOfIdentifiers) throws Exception {
        List<IdentifierDTO> identifierDTOS = new ArrayList<>();
        List<ClientRegistryIdPool> clientRegistryIdPools = clientRegistryIdsRepository.getIds(countOfIdentifiers);
        for (ClientRegistryIdPool clientRegistryIdPool : clientRegistryIdPools) {
            IdentifierDTO identifierDTO = new IdentifierDTO();
            identifierDTO.setId(clientRegistryIdPool.getIdentifier());
            identifierDTO.setType("HDU-API-ID");
            FacilityDetailsDTO facilityDetailsDTO = new FacilityDetailsDTO();
            facilityDetailsDTO.setCode("HDUAPI");
            facilityDetailsDTO.setName("HDUAPI");
            identifierDTO.setOrganization(facilityDetailsDTO);
            clientRegistryIdPool.setUsed(true);
            identifierDTOS.add(identifierDTO);
            clientRegistryIdsRepository.save(clientRegistryIdPool);
        }
        return identifierDTOS;
    }

    public PatientDTO mapToPatientDTO(Patient patient) throws Exception {
        List<HumanNameDTO> nameDTOs = patient.hasName() ? patient.getName().stream()
                .map(name -> new HumanNameDTO(
                        name.hasFamily() ? name.getFamily() : null,
                        name.hasGiven()
                                ? name.getGiven().stream().map(PrimitiveType::getValue).collect(Collectors.toList())
                                : new ArrayList<>()))
                .collect(Collectors.toList()) : new ArrayList<>();

        List<AddressDTO> addressDTOs = patient.hasAddress() ? patient.getAddress().stream()
                .map(address -> new AddressDTO(
                        address.hasText() && address.getText().contains("-") ? address.getText().split("-")[0] : null,
                        address.hasText() && address.getText().contains("-") ? address.getText().split("-")[1] : null,
                        address.hasDistrict() ? address.getDistrict() : null,
                        address.hasState() ? address.getState() : null,
                        address.hasCountry() ? address.getCountry() : null,
                        address.hasUse() && address.getUse().getDisplay().contains("home") ? "Permanent" : "Temporary"))
                .collect(Collectors.toList()) : new ArrayList<>();

        List<ContactDTO> telecomDTOs = patient.hasTelecom() ? patient.getTelecom().stream()
                .map(contactPoint -> new ContactDTO(
                        contactPoint.hasSystem() ? contactPoint.getSystem().getDisplay() : null,
                        contactPoint.hasValue() ? contactPoint.getValue() : null,
                        contactPoint.hasUse() ? contactPoint.getUse().toCode() : null))
                .collect(Collectors.toList()) : new ArrayList<>();
        String gender = patient.hasGender() ? patient.getGender().toCode() : null;
        Date birthDate = patient.hasBirthDate() ? patient.getBirthDate() : null;
        String patientId = patient.getIdElement() != null ? patient.getIdElement().getIdPart() : null;
        String status = patient.hasActive() ? patient.getActive() ? "active" : "inactive" : "unknown";
        List<Identifier> identifiers = patient.getIdentifier() != null ? patient.getIdentifier() : null;
        Organization organization = patient.getManagingOrganization() != null
                ? (Organization) patient.getManagingOrganization().getResource()
                : null;
        List<ContactPeopleDTO> contactPeople = patient.hasContact() ? patient.getContact().stream()
                .map(contact -> new ContactPeopleDTO(
                        contact.hasName() ? contact.getName().getFamily() : null,
                        contact.hasName() && !contact.getName().getGiven().isEmpty()
                                ? contact.getName().getGiven().get(0).toString()
                                : null,
                        contact.hasTelecom() ? contact.getTelecom().stream()
                                .map(telecom -> telecom.hasValue() ? telecom.getValue() : "")
                                .collect(Collectors.toList()) // Collect the stream into a list
                                : null,
                        contact.hasRelationship() ? contact.getRelationship().get(0).getText() : null))
                .collect(Collectors.toList()) : new ArrayList<>();

        String maritalStatus = patient.hasMaritalStatus() && patient.getMaritalStatus().hasCoding()
                ? patient.getMaritalStatus().getCoding().get(0).getDisplay()
                : null;
        List<Patient.PatientLinkComponent> patientLinkComponents = patient.getLink();
        List<Map<String, Object>> relatedClients = new ArrayList();
        for (Patient.PatientLinkComponent patientLinkComponent : patientLinkComponents) {
            if (patientLinkComponent.hasType() && patientLinkComponent.hasOther()) {
                Map<String, Object> relatedClientsByType = new HashMap<>();
                relatedClientsByType.put("type", patientLinkComponent.getType().toCode());
                relatedClientsByType.put("patientDisplay", patientLinkComponent.getOther().getDisplay());
                relatedClientsByType.put("patient", (Patient) patientLinkComponent.getOther().getResource());
                relatedClients.add(relatedClientsByType);
            }
        }
        // List<Patient> linkedClients = patient.hasLink() ? (List<Patient>)
        // patient.getLink().stream().map(link -> link.hasOther() ? (Patient)
        // link.getOther().getResource(): null) : null;
        // List<String> clientTypes = patient.hasLink() ? (List<String>)
        // patient.getLink().stream().map(link -> link.hasType() ?
        // link.getType().getDisplay(): null) : null;

        // Return the mapped PatientDTO object
        PatientDTO patientDTO = new PatientDTO(
                patientId,
                status,
                identifiers,
                nameDTOs,
                gender,
                birthDate,
                addressDTOs,
                telecomDTOs,
                organization,
                contactPeople,
                maritalStatus,
                relatedClients,
                getFilesForPatient(patientId)); // Replace null with method call to get files

        List<Appointment> appointmentResourceList = getAppointmentByPatientId(patient.getIdElement().getIdPart());

        List<AppointmentDetailsDTO> appointmentDetailsDTOS = new ArrayList<>();

        for (Appointment appointment : appointmentResourceList) {
            AppointmentDetailsDTO appointmentDetailsDTO = new AppointmentDetailsDTO();
            appointmentDetailsDTO.setAppointmentId(appointment.getIdElement().getIdPart());
            String appointmentHfrCode = extractHfrCode(appointment.getIdElement().getIdPart());
            appointmentDetailsDTO.setHfrCode(appointmentHfrCode);
            appointmentDetailsDTO
                    .setAppointmentStatus(appointment.hasStatus() ? appointment.getStatus().toString() : "booked");

            List<AppointmentServiceDetailsDTO> services = new ArrayList<>();
            if (appointment.hasServiceType() && !appointment.getServiceType().isEmpty()) {
                for (CodeableConcept serviceCode : appointment.getServiceType()) {
                    AppointmentServiceDetailsDTO service = new AppointmentServiceDetailsDTO();
                    service.setShortName(serviceCode.hasText() ? serviceCode.getText() : null);
                    service.setServiceCode(serviceCode.hasCoding() && !serviceCode.getCoding().isEmpty()
                            && serviceCode.getCoding().get(0).hasCode() ? serviceCode.getCoding().get(0).getCode()
                                    : null);
                    service.setServiceName(serviceCode.hasCoding() && !serviceCode.getCoding().isEmpty()
                            && serviceCode.getCoding().get(0).hasDisplay() ? serviceCode.getCoding().get(0).getDisplay()
                                    : null);
                    services.add(service);
                }
            }
            appointmentDetailsDTO.setServiceDetails(services);

            // Get appointment payment details
            List<PaymentNotice> paymentNoticeResources = getPaymentNoticesForAppointment(appointment);
            List<AppointmentPaymentDetailsDTO> paymentDetailsDTOS = new ArrayList<>();
            for (PaymentNotice paymentNoticeResource : paymentNoticeResources) {
                AppointmentPaymentDetailsDTO paymentDetailsDTO = new AppointmentPaymentDetailsDTO();
                paymentDetailsDTO.setControlNumber(
                        paymentNoticeResource.hasIdentifier() && !paymentNoticeResource.getIdentifier().isEmpty()
                                && paymentNoticeResource.getIdentifier().get(0).hasValue()
                                        ? paymentNoticeResource.getIdentifier().get(0).getValue()
                                        : null);
                paymentDetailsDTO.setStatusCode(
                        paymentNoticeResource.hasResponse() && paymentNoticeResource.getResponse().hasIdentifier()
                                && paymentNoticeResource.getResponse().getIdentifier().hasValue()
                                        ? paymentNoticeResource.getResponse().getIdentifier().getId()
                                        : null);
                paymentDetailsDTO.setDescription(
                        paymentNoticeResource.hasResponse() && paymentNoticeResource.getResponse().hasIdentifier()
                                && paymentNoticeResource.getResponse().getIdentifier().hasValue()
                                        ? paymentNoticeResource.getResponse().getIdentifier().getValue()
                                        : null);
                paymentDetailsDTOS.add(paymentDetailsDTO);
            }
            appointmentDetailsDTO.setPaymentDetails(paymentDetailsDTOS);
            appointmentDetailsDTOS.add(appointmentDetailsDTO);
        }
        patientDTO.setAppointment(appointmentDetailsDTOS);

        return patientDTO;
    }

    public PaymentDetailsDTO mapToPaymentDetails(Coverage coverage) {
        PaymentDetailsDTO paymentDetailsDTO = new PaymentDetailsDTO();
        paymentDetailsDTO.setInsuranceId(coverage.getSubscriberId());
        paymentDetailsDTO.setName(coverage.hasPayor()
                ? coverage.getPayor().get(0).getDisplay()
                : null);
        paymentDetailsDTO.setInsuranceCode(coverage.hasPayor() && coverage.getPayor().get(0).hasIdentifier()
                ? coverage.getPayor().get(0).getIdentifier().getValue()
                : null);

        paymentDetailsDTO.setType(
                coverage.hasType() && !coverage.getType().getCoding().isEmpty()
                        ? coverage.getType().getCodingFirstRep().getCode()
                        : null);

        paymentDetailsDTO.setShortName(
                coverage.hasClass_() && !coverage.getClass_().isEmpty() && coverage.getClass_().get(0).hasValue()
                        ? coverage.getClass_().get(0).getValue()
                        : null);

        return paymentDetailsDTO;
    }

    public VisitMainPaymentDetailsDTO mapToMainVisitPaymentDetails(Coverage coverage) {
        VisitMainPaymentDetailsDTO visitMainPaymentDetailsDTO = new VisitMainPaymentDetailsDTO();
        visitMainPaymentDetailsDTO.setInsuranceId(coverage.getSubscriberId());
        visitMainPaymentDetailsDTO.setName(coverage.hasPayor()
                ? coverage.getPayor().get(0).getDisplay()
                : null);
        visitMainPaymentDetailsDTO.setInsuranceCode(coverage.hasPayor() && coverage.getPayor().get(0).hasIdentifier()
                ? coverage.getPayor().get(0).getIdentifier().getValue()
                : null);

        visitMainPaymentDetailsDTO.setType(
                coverage.hasType() && !coverage.getType().getCoding().isEmpty()
                        ? coverage.getType().getCodingFirstRep().getCode()
                        : null);

        visitMainPaymentDetailsDTO.setShortName(
                coverage.hasClass_() && !coverage.getClass_().isEmpty() && coverage.getClass_().get(0).hasValue()
                        ? coverage.getClass_().get(0).getValue()
                        : null);

        return visitMainPaymentDetailsDTO;
    }

    public List<Coverage> getCoveragesByPatientIdAndOrDependent(String patientId, String dependent) throws Exception {
        try {
            List<Coverage> coverages = new ArrayList<>();
            var coveragesSearch = fhirClient.search().forResource(Coverage.class)
                    .where(Coverage.BENEFICIARY.hasId(patientId));
            if(dependent != null && !dependent.isBlank()){
                    coveragesSearch.and(Coverage.DEPENDENT.matchesExactly().value(dependent));
            }
            Bundle coverageBundle = coveragesSearch.sort().descending("_lastUpdated").returnBundle(Bundle.class)
                    .execute();
            if (coverageBundle.hasEntry()) {
                for (Bundle.BundleEntryComponent entry : coverageBundle.getEntry()) {
                    if (entry.getResource() instanceof Coverage) {
                        coverages.add((Coverage) entry.getResource());
                    }
                }
            }
            Map<String, Coverage> uniqueCoverageMap = coverages.stream()
                    .filter(coverage -> coverage.hasSubscriberId())
                    .collect(Collectors.toMap(
                            Coverage::getSubscriberId,
                            coverage -> coverage,
                            (existing, replacement) -> existing));

            return new ArrayList<>(uniqueCoverageMap.values());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return List.of();
    }

    public List<Appointment> getAppointmentByPatientId(String patientId) throws Exception {
        List<Appointment> appointments = new ArrayList<>();

        var appointmentsSearch = fhirClient
                .search()
                .forResource(Appointment.class)
                .where(new TokenClientParam("supporting-info")
                        .exactly()
                        .code("Patient/" + patientId))
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

    public List<PaymentNotice> getPaymentNoticesForAppointment(Appointment appointment) throws Exception {
        List<PaymentNotice> paymentNotices = new ArrayList<>();

        // Check if the appointment has supporting information
        if (appointment.hasSupportingInformation()) {
            for (Reference ref : appointment.getSupportingInformation()) {
                String reference = ref.getReference(); // Example: "PaymentNotice/12345"

                // Check if the reference starts with "PaymentNotice/"
                if (reference != null && reference.startsWith("PaymentNotice/")) {
                    String paymentNoticeId = reference.split("/")[1]; // Extract ID

                    // Fetch the PaymentNotice by ID
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
        }
        return paymentNotices;
    }

    /**
     * Get ImagingStudy resources for a specific patient
     * 
     * @param patientId The patient ID
     * @return List of ImagingStudy resources
     */
    private List<FileDTO> getFilesForPatient(String patientId) {
        List<FileDTO> fileDTOs = new ArrayList<>();
        try {
            List<org.hl7.fhir.r4.model.ImagingStudy> imagingStudies = getImagingStudiesForPatient(patientId);

            for (org.hl7.fhir.r4.model.ImagingStudy study : imagingStudies) {
                for (org.hl7.fhir.r4.model.ImagingStudy.ImagingStudySeriesComponent series : study.getSeries()) {
                    for (org.hl7.fhir.r4.model.ImagingStudy.ImagingStudySeriesInstanceComponent instance : series
                            .getInstance()) {
                        FileDTO fileDTO = new FileDTO();
                        fileDTO.setName(instance.getTitle());
                        fileDTO.setId(instance.getId());

                        for (org.hl7.fhir.r4.model.Extension extension : instance.getExtension()) {
                            if (extension.getUrl().equals("http://hl7.org/fhir/StructureDefinition/rendering-url")) {
                                fileDTO.setUrl(extension.getValue().toString());
                                break;
                            }
                        }

                        fileDTOs.add(fileDTO);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error retrieving files for patient: " + e.getMessage());
        }
        return fileDTOs;
    }

    /**
     * Get ImagingStudy resources for a specific patient
     * 
     * @param patientId The patient ID
     * @return List of ImagingStudy resources
     */
    public List<ImagingStudy> getImagingStudiesForPatient(String patientId) {
        List<ImagingStudy> imagingStudies = new ArrayList<>();

        try {
            Bundle response = fhirClient.search()
                    .forResource(ImagingStudy.class)
                    .where(ImagingStudy.PATIENT.hasId(patientId))
                    .returnBundle(Bundle.class)
                    .execute();

            if (response.hasEntry()) {
                for (Bundle.BundleEntryComponent entry : response.getEntry()) {
                    if (entry.getResource() instanceof ImagingStudy) {
                        imagingStudies.add((ImagingStudy) entry.getResource());
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error retrieving imaging studies: " + e.getMessage());
        }
        return imagingStudies;
    }
}