package com.Adapter.icare.Organisations.Dtos;

import com.Adapter.icare.Dtos.IdentifierDTO;
import lombok.Getter;
import lombok.Setter;
import org.hl7.fhir.r4.model.Identifier;
import org.hl7.fhir.r4.model.Organization;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class OrganizationDTO {
    private String id;
    private String name;
    private List<Identifier> identifiers;
    private Boolean active;

    public OrganizationDTO(String id,
                           List<Identifier> identifierList,
                           String name,
                           Boolean active) {
        this.id = id;
        this.name = name;
        this.identifiers = identifierList;
        this.active = active;

    }
    public Map<String, Object> toMap() {
        Map<String, Object> mappedOrganization = new HashMap<>();
        mappedOrganization.put("name", this.name);
        mappedOrganization.put("active", this.active);
        mappedOrganization.put("identifiers", this.identifiers.stream().map(identifier -> new IdentifierDTO(
                identifier.getSystem(), identifier.getValue(), identifier.getUse().toString()).toMap()));
        return mappedOrganization;
    }
}
