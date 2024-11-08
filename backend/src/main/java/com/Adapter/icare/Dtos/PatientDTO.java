package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;
import org.hl7.fhir.r4.model.*;

import javax.validation.constraints.NotNull;

import java.util.*;

@Getter
@Setter
public class PatientDTO {
    private String id;
    private String status;
    private List<Identifier> identifiers;
    private List<HumanNameDTO> name;
    private String gender;
    private Date birthDate;
    private List<AddressDTO> address;
    private List<ContactDTO> telecom;
    private Organization organization;
    private List<ContactPeopleDTO> contactPeople;
    private String maritalStatus;
    private List<Map<String,Object>> relatedClients;

    public PatientDTO(String id,
                      String status,
                      List<Identifier> identifiers,
                      List<HumanNameDTO> name,
                      String gender,
                      Date birthDate,
                      List<AddressDTO> address,
                      List<ContactDTO> telecom,
                      Organization organization,
                      List<ContactPeopleDTO> contactPeople,
                      String maritalStatus,
                      List<Map<String,Object>> relatedClients) {
        this.id = id;
        this.status = status;
        this.name = name;
        this.gender = gender;
        this.birthDate = birthDate;
        this.address = address;
        this.telecom = telecom;
        this.identifiers = identifiers;
        this.organization = organization;
        this.contactPeople = contactPeople;
        this.maritalStatus = maritalStatus;
        this.relatedClients = relatedClients;
    }

    public DemographicDetailsDTO toMap() {
        DemographicDetailsDTO mappedPatient = new DemographicDetailsDTO();
        try {
            String firstName = null;
            String middleName = null;
            String lastName = null;
            if (!this.getName().isEmpty() && this.getName().get(0) != null) {
                if (!this.getName().get(0).getGiven().isEmpty()) {
                    try {
                        List<String> givenNames = this.getName().get(0).getGiven();
                        if (!givenNames.isEmpty() && givenNames.get(0) != null) {
                            firstName = givenNames.get(0);
                            if (givenNames.size() > 1) {
                                middleName = givenNames.get(1);
                            }
                        }

                    } catch (Exception exception) {
                        exception.printStackTrace();
                    }
                }
                lastName = this.getName().get(0).getFamily();
            }
            // TODO: Add support to retrieve identifier relevant to requesting health facility
            mappedPatient.setId(this.getId());
            List<IdentifierDTO> idsList = new ArrayList<>();
            if (this.getIdentifiers() != null && !this.getIdentifiers().isEmpty()) {
                for(Identifier identifier: this.getIdentifiers()) {
                    IdentifierDTO identifierDTO =  new IdentifierDTO();
                    identifierDTO.setId(identifier.hasValue() ? identifier.getValue(): this.getId());
                    identifierDTO.setType(identifier.getType().getText());
                    identifierDTO.setUse(identifier.getUse().getDisplay());
                    identifierDTO.setSystem(identifier.getSystem());
                    idsList.add(identifierDTO);
                }
            }
            mappedPatient.setIdentifiers(idsList);
            mappedPatient.setFirstName(firstName);
            mappedPatient.setMiddleName(middleName);
            mappedPatient.setLastName(lastName);

            mappedPatient.setGender(this.getGender());
            mappedPatient.setDateOfBirth(this.getBirthDate());
//            mappedPatient.setS(this.getStatus());
            mappedPatient.setMaritalStatus(this.getMaritalStatus());
            mappedPatient.setContactPeople(this.getContactPeople());
            List<Map<String,Object>> relatedClientsList = new ArrayList<>();
            if (this.relatedClients != null && !this.relatedClients.isEmpty()) {
                for (Map<String,Object> clientDetails: this.relatedClients) {
                    Map<String, Object> clientData = new HashMap<>();
                    clientData.put("type",clientDetails.get("type"));
                    clientData.put("display", clientData.get("patientDisplay"));
                    Map<String,Object> clientRelated = new HashMap<>();
                    if (clientDetails.get("patient") != null && clientDetails.get("patient") instanceof Patient) {
                        Patient patientData = (Patient) clientDetails.get("patient");
                        // TODO: return client registry identifier
                        List<String> identifiersListForRelatedClient  = new ArrayList<>();
                        clientRelated.put("id", patientData.getIdElement().getIdPart());
                        for(Identifier identifier: patientData.getIdentifier()) {
                            identifiersListForRelatedClient.add(identifier.getValue());
                        }
                        clientRelated.put("identifiers",identifiersListForRelatedClient);
                    }
                    clientData.put("client", clientRelated);
                    relatedClientsList.add(clientData);
                }
            }
            mappedPatient.setRelatedClients(relatedClientsList);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return mappedPatient;
    }

    public @NotNull List<Map<String, Object>> getIdentifierMaps() {
        List<Map<String, Object>> identifiers = new ArrayList<>();
        if (!this.getIdentifiers().isEmpty()) {
            for (Identifier identifier: this.getIdentifiers()) {
                Map<String, Object> id = new HashMap<>();
                id.put("id", identifier.getValue());
                id.put("system", identifier.getSystem());
                id.put("use", identifier.getUse());
                String type = null;
                if (identifier.getType() != null && !identifier.getType().getCoding().isEmpty()) {
                    try {
                        type = identifier.getType().getCoding().get(0).getCode();
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }
                id.put("type",type);
                identifiers.add(id);
            }
        }
        return identifiers;
    }

    public List<IdentifierDTO> getIdentifiersDTO(List<Identifier> identifiersList) {
        List<IdentifierDTO> identifiers = new ArrayList<>();
        if (identifiersList != null && !identifiersList.isEmpty()) {
            for (Identifier identifier: this.getIdentifiers()) {
                IdentifierDTO identifierDTO = new IdentifierDTO();
                identifierDTO.setId(identifier.hasValue() ? identifier.getValue(): identifier.getType().hasCoding() && identifier.getType().getCoding().get(0).getCode().equals("HCRCODE") ? this.getId(): null);
                String type = null;
                if (identifier.getType() != null && !identifier.getType().getCoding().isEmpty()) {
                    try {
                        type = identifier.getType().getCoding().get(0).getCode();
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }

                identifierDTO.setType(type);
                identifierDTO.setSystem(identifier.getSystem());
                if (identifier.getAssigner() != null) {
                    FacilityDetailsDTO facilityDetails = getFacilityDetailsDTO(identifier);
                    identifierDTO.setOrganization(facilityDetails);
                }
                identifiers.add(identifierDTO);
            }
        }
        return identifiers;
    }

    private FacilityDetailsDTO getFacilityDetailsDTO(Identifier identifier) {
        FacilityDetailsDTO facilityDetails = new FacilityDetailsDTO();
        if (identifier.getAssigner() != null) {
            if (identifier.getAssigner().getResource() instanceof Organization) {
                Organization assigner = (Organization) identifier.getAssigner().getResource();
                String code = null;
                if (assigner.getIdElement() != null) {
                    code = assigner.getIdElement().getIdPart();
                    facilityDetails.setCode(code);
                }
                if (assigner.getName() != null) {
                    facilityDetails.setName(assigner.getName());
                }
            }
        }
        return facilityDetails;
    }

    private Map<String, Object> getOrganisationMap() {
        Map<String, Object> org = new HashMap<>();
        String name = null;
        String orgType = null;
        if (this.getOrganization().getName() != null) {
            name = this.getOrganization().getName();
        }
        if (this.getOrganization().getType() != null && !this.getOrganization().getType().isEmpty()) {
            orgType =  this.getOrganization().getType().get(0).getText();
        }
        org.put("name",name);
        org.put("type", orgType);
        List<Map<String, Object>> identifiers = new ArrayList<>();
        if (!this.getOrganization().getIdentifier().isEmpty()) {
            for (Identifier identifier: this.getOrganization().getIdentifier()) {
                Map<String, Object> idObject = new HashMap<>();
                String id = null;
                String type = null;
                String system = null;
                String use = null;
                if (identifier.getValue() != null) {
                    id = identifier.getValue();
                }
                if (identifier.getType() != null) {
                    type = identifier.getType().getText();
                }
                if (identifier.getSystem() != null) {
                    system = identifier.getSystem();
                }
                if (identifier.getUse() != null) {
                    use = identifier.getUse().getDisplay();
                }
                idObject.put("id", id);
                idObject.put("type", type);
                idObject.put("system", system);
                idObject.put("use", use);
                if (identifier.getAssigner() != null) {
                    idObject.put("assignerOrganisation", identifier.getAssigner().getDisplay());
                }
                identifiers.add(idObject);
            }
        }
        org.put("identifiers",identifiers);
        return org;
    }
}