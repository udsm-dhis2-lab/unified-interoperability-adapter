package com.Adapter.icare.ClientRegistry.Services;

import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import com.Adapter.icare.Dtos.*;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.Identifier;
import org.hl7.fhir.r4.model.Patient;
import org.hl7.fhir.r4.model.PrimitiveType;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ClientRegistryService {
    private final IGenericClient fhirClient;

    public ClientRegistryService(IGenericClient fhirClient) {
        this.fhirClient = fhirClient;
    }

    public Patient savePatient(Patient patient) throws Exception {
        return (Patient) fhirClient.create().resource(patient).execute().getResource();
    }

    public MethodOutcome markPatientAsInActive(Patient patient) {
        patient.setActive(false);
        return fhirClient.update().resource(patient).execute();
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
                                                 Date dateOfBirth) {
        try {
            List<Map<String, Object>> patients = new ArrayList<>();
            Bundle response = new Bundle();
            // TODO: You might consider enumerating the gender codes
            var searchClient =  fhirClient.search().forResource(Patient.class);
//            System.out.println(status);
//            searchClient.where(Patient.DECEASED.isMissing(true));
            if (identifier != null) {
                searchClient.where(Patient.IDENTIFIER.exactly().systemAndIdentifier(null, identifier));
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

            for (Bundle.BundleEntryComponent entry : response.getEntry()) {
                if (entry.getResource() instanceof Patient) {
                    Patient patientData = (Patient) entry.getResource();
                    patientData.getIdentifier();
                    PatientDTO patientDTO =mapToPatientDTO(patientData);
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
                .count(1)
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

    private PatientDTO mapToPatientDTO(Patient patient) {
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

        // Return the mapped PatientDTO object
        return new PatientDTO(
                patientId,
                status,
                identifiers,
                nameDTOs,
                gender,
                birthDate,
                addressDTOs,
                telecomDTOs
        );
    }
}
