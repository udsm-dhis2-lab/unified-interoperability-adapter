package com.Adapter.icare.ClientRegistry.Services;

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

    public List<Map<String, Object>> getPatients(int page,
                                                 int pageSize,
                                                 String identifier,
                                                 String identifierType,
                                                 String gender) {
        try {
            List<Map<String, Object>> patients = new ArrayList<>();
            Bundle response = new Bundle();
            // TODO: You might consider enumerating the gender codes
            var searchClient =  fhirClient.search().forResource(Patient.class);
            if (identifier != null) {
                searchClient.where(Patient.IDENTIFIER.exactly().systemAndIdentifier(null, identifier));
            }
            if (gender != null) {
                searchClient.where(Patient.GENDER.exactly().code(gender.toLowerCase()));
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
        List<Identifier> identifiers = patient.getIdentifier() != null ? patient.getIdentifier() : null;

        // Return the mapped PatientDTO object
        return new PatientDTO(
                patientId,
                identifiers,
                nameDTOs,
                gender,
                birthDate,
                addressDTOs,
                telecomDTOs
        );
    }
}
