package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;
import org.hl7.fhir.r4.model.Identifier;
import org.jetbrains.annotations.NotNull;

import java.util.*;

@Getter
@Setter
public class PatientDTO {
    private String id;
    private List<Identifier> identifiers;
    private List<HumanNameDTO> name;
    private String gender;
    private Date birthDate;
    private List<AddressDTO> address;
    private List<ContactDTO> telecom;

    public PatientDTO() {}

    public PatientDTO(String id, List<Identifier> identifiers, List<HumanNameDTO> name, String gender, Date birthDate, List<AddressDTO> address, List<ContactDTO> telecom) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.birthDate = birthDate;
        this.address = address;
        this.telecom = telecom;
        this.identifiers = identifiers;
    }

    public Map<String, Object> toMap() {
        Map<String, Object> mappedPatient = new HashMap<>();
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
                        }
                        if (!givenNames.isEmpty() && givenNames.get(1) != null) {
                            middleName = givenNames.get(1);
                        }
                    } catch (Exception exception) {

                    }
                }
                lastName = this.getName().get(0).getFamily();
            }
            mappedPatient.put("firstName",firstName);
            mappedPatient.put("middleName",middleName);
            mappedPatient.put("lastName",lastName);

            mappedPatient.put("gender", this.getGender());
            mappedPatient.put("dateOfBirth", this.getBirthDate());
            mappedPatient.put("fhirName", this.getName());
            List<Map<String, Object>> identifiers = getIdentifierMaps();

            mappedPatient.put("identifiers", identifiers);

        } catch (Exception ignored) {

        }
        return mappedPatient;
    }

    private @NotNull List<Map<String, Object>> getIdentifierMaps() {
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
                    } catch (Exception ignored) {

                    }
                }
                id.put("type",type);
                identifiers.add(id);
            }
        }
        return identifiers;
    }
}
