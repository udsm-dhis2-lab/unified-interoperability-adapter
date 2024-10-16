package com.Adapter.icare.ClientRegistry.Services;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.api.SummaryEnum;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Constants.FHIRConstants;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.*;
import com.Adapter.icare.Services.UserService;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.hl7.fhir.r4.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ClientRegistryService {

    private final IGenericClient fhirClient;
    private final FHIRConstants fhirConstants;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;

    @Autowired
    public ClientRegistryService(FHIRConstants fhirConstants, UserService userService) {
        this.fhirConstants = fhirConstants;

        FhirContext fhirContext = FhirContext.forR4();
        this.fhirClient =  fhirContext.newRestfulGenericClient(fhirConstants.FHIRServerUrl);
        this.userService = userService;
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService.getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
    }

    public Patient savePatient(Patient patient) throws Exception {
        return (Patient) fhirClient.create().resource(patient).execute().getResource();
    }

    public MethodOutcome markPatientAsInActive(Patient patient) {
        patient.setActive(false);
        return fhirClient.update().resource(patient).execute();
    }

    public Map<String,Object> getPatientsWithPagination(
            int page,
            int pageSize,
            String status,
            String identifier,
            String identifierType,
            String gender,
            String firstName,
            String middleName,
            String lastName,
            Date dateOfBirth,
            Boolean onlyLinkedClients
    ) throws Exception {
        Map<String,Object> patientDataResponse = new HashMap<>();
        try {
            List<Map<String, Object>> patients = new ArrayList<>();
            Bundle response = new Bundle();
            // TODO: You might consider enumerating the gender codes
            var searchClient =  fhirClient.search().forResource(Patient.class);
            if (identifier != null) {
                searchClient.where(Patient.IDENTIFIER.exactly().identifier(identifier));
            }

            if (onlyLinkedClients != null) {
                // TODO replace hardcoded ids with dynamic ones
                searchClient.where(Patient.LINK.hasAnyOfIds("299","152"));
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
            patientDataResponse.put("results", patients);
            Map<String, Object> pager = new HashMap<>();
            pager.put("totalPages", null);
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("total", clientTotalBundle.getTotal());
            patientDataResponse.put("pager", pager);
            return patientDataResponse;
        }  catch (Exception e) {
            e.printStackTrace(); // Log the exception for referencing via logs
            throw new RuntimeException("Failed to retrieve patients from FHIR server", e);
        }
    }

    public List<Map<String, Object>> getPatients(int page,
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
            List<Map<String, Object>> patients = new ArrayList<>();
            Bundle response = new Bundle();
            // TODO: You might consider enumerating the gender codes
            var searchClient =  fhirClient.search().forResource(Patient.class);
            if (identifier != null) {
                searchClient.where(Patient.IDENTIFIER.exactly().identifier(identifier));
            }

            if (onlyLinkedClients != null) {
                // TODO replace hardcoded ids with dynamic ones
                searchClient.where(Patient.LINK.hasAnyOfIds("299","152"));
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
        }  catch (Exception e) {
            e.printStackTrace(); // Log the exception for referencing via logs
            throw new RuntimeException("Failed to retrieve patients from FHIR server", e);
        }
    }

    public int getTotalPatients() {
        Bundle response = fhirClient.search()
                .forResource(Patient.class)
                .summaryMode(SummaryEnum.COUNT)  // Request only the total count
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
        Bundle response = fhirClient.search().forResource(Patient.class).where(Patient.IDENTIFIER.exactly().identifier(identifier))
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
        var searchClient =  fhirClient.search().forResource(Patient.class)
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

    public Map<String,Object> deleteClientsWithNoIdentifiers() throws Exception {
        Bundle resourceBundle = new Bundle();
        List<Map<String,Object>> deleteClients = new ArrayList<>();
        List<Map<String,Object>> clientsFailed = new ArrayList<>();
        var searchClient =  fhirClient.search().forResource(Patient.class);
        // TODO: ENsure the number of clients to be loaded is dynamic
        resourceBundle = searchClient.count(1000).returnBundle(Bundle.class).execute();
        if (!resourceBundle.getEntry().isEmpty()) {
            for (Bundle.BundleEntryComponent entry : resourceBundle.getEntry()) {
                if (entry.getResource() instanceof Patient) {
                   Patient patient = (Patient) entry.getResource();
                   if (patient.getIdentifier().isEmpty()) {
                       try {
                           Map<String,Object> client = new HashMap<>();
                           client.put("id", patient.getIdElement().getIdPart());
                           client.put("name", patient.getName());
                           deleteClients.add(client);
                           MethodOutcome methodOutcome = fhirClient.delete().resource(patient).execute();
                       } catch (Exception e) {
                           Map<String,Object> client = new HashMap<>();
                           client.put("id", patient.getIdElement().getIdPart());
                           client.put("name", patient.getName());
                           client.put("reason", e.getMessage());
                           clientsFailed.add(client);
                           e.printStackTrace();  // This will log the internal server error details
                       }
                       Thread.sleep(100);
                   }
                }
            }
        }
        Map<String,Object> response = new HashMap<>();
        response.put("deleteClients", deleteClients);
        response.put("clientsFailed", clientsFailed);
        return response;
    }

    public PatientDTO mapToPatientDTO(Patient patient) {
        List<HumanNameDTO> nameDTOs = patient.hasName() ?
                patient.getName().stream()
                        .map(name -> new HumanNameDTO(
                                name.hasFamily() ? name.getFamily() : null,
                                name.hasGiven() ? name.getGiven().stream().map(PrimitiveType::getValue).collect(Collectors.toList()) : new ArrayList<>()
                        ))
                        .collect(Collectors.toList()) : new ArrayList<>();

        List<AddressDTO> addressDTOs = patient.hasAddress() ?
                patient.getAddress().stream()
                        .map(address -> new AddressDTO(
                                address.hasCity() ? address.getCity() : null,
                                address.hasState() ? address.getState() : null,
                                address.hasPostalCode() ? address.getPostalCode() : null,
                                address.hasCountry() ? address.getCountry() : null,
                                address.hasLine() ? address.getLine().stream().map(PrimitiveType::getValue).collect(Collectors.toList()) : new ArrayList<>()
                        ))
                        .collect(Collectors.toList()) : new ArrayList<>();

        List<ContactDTO> telecomDTOs = patient.hasTelecom() ?
                patient.getTelecom().stream()
                        .map(contactPoint -> new ContactDTO(
                                contactPoint.hasSystem() ? contactPoint.getSystem().toCode() : null,
                                contactPoint.hasValue() ? contactPoint.getValue() : null,
                                contactPoint.hasUse() ? contactPoint.getUse().toCode() : null
                        ))
                        .collect(Collectors.toList()) : new ArrayList<>();

        String gender = patient.hasGender() ? patient.getGender().toCode() : null;
        Date birthDate = patient.hasBirthDate() ? patient.getBirthDate() : null;
        String patientId = patient.getIdElement() != null ? patient.getIdElement().getIdPart() : null;
        String status = patient.hasActive() ? patient.getActive() ? "active" : "inactive" : "unknown";
        List<Identifier> identifiers = patient.getIdentifier() != null ? patient.getIdentifier() : null;
        Organization organization = patient.getManagingOrganization() != null ? (Organization) patient.getManagingOrganization().getResource() : null;
        List<ContactPeopleDTO> contactPeople = patient.hasContact() ?
                patient.getContact().stream()
                        .map(contact -> new ContactPeopleDTO(
                                contact.hasName() ? contact.getName().getFamily() : null,
                                contact.hasTelecom() ? (List<String>) contact.getTelecom().stream().map(telecom -> telecom.getValue().toString()) : null,
                                contact.hasRelationship() ? contact.getRelationship().get(0).getText() : null
                        ))
                        .collect(Collectors.toList()) : new ArrayList<>();
        String maritalStatus = patient.hasMaritalStatus() ? patient.getMaritalStatus().getText() : null;
        List<Patient.PatientLinkComponent> patientLinkComponents = patient.getLink();
        List<Map<String,Object>> relatedClients = new ArrayList();
        for (Patient.PatientLinkComponent patientLinkComponent: patientLinkComponents) {
            if (patientLinkComponent.hasType() && patientLinkComponent.hasOther()) {
                Map<String,Object> relatedClientsByType = new HashMap<>();
                relatedClientsByType.put("type",patientLinkComponent.getType().toCode());
                relatedClientsByType.put("patientDisplay",patientLinkComponent.getOther().getDisplay());
                relatedClientsByType.put("patient", (Patient) patientLinkComponent.getOther().getResource() );
                relatedClients.add(relatedClientsByType);
            }
        }
//        List<Patient> linkedClients = patient.hasLink() ? (List<Patient>) patient.getLink().stream().map(link -> link.hasOther() ? (Patient) link.getOther().getResource(): null) : null;
//        List<String> clientTypes = patient.hasLink() ? (List<String>) patient.getLink().stream().map(link -> link.hasType() ? link.getType().getDisplay(): null) : null;

        // Return the mapped PatientDTO object
        return new PatientDTO(
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
                relatedClients
        );
    }
}
