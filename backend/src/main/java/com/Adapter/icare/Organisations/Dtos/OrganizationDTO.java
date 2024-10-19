package com.Adapter.icare.Organisations.Dtos;

import com.Adapter.icare.Dtos.FacilityDetailsDTO;
import com.Adapter.icare.Dtos.IdentifierDTO;
import lombok.Getter;
import lombok.Setter;
import org.hl7.fhir.r4.model.Identifier;
import org.hl7.fhir.r4.model.Organization;

import java.util.ArrayList;
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
        List<IdentifierDTO> identifierDTOs = new ArrayList<>();
        if (!this.getIdentifiers().isEmpty()) {
            for(Identifier identifier: this.getIdentifiers()) {
                IdentifierDTO identifierDTO = new IdentifierDTO();
                identifierDTO.setId(identifier.getIdElement().getId());
                identifierDTO.setType(identifier.getType().getText());
                identifierDTO.setUse(identifier.getUse().getDisplay());
                identifierDTOs.add(identifierDTO);
            }
        }
        mappedOrganization.put("identifiers", identifierDTOs);
        return mappedOrganization;
    }

    public FacilityDetailsDTO toSummary() {
        FacilityDetailsDTO mappedOrganization = new FacilityDetailsDTO();
        mappedOrganization.setName(this.name);
        String code = "";
        if (!this.identifiers.isEmpty()) {
           code = this.identifiers.get(0).getValue();
        }
        mappedOrganization.setCode(code);
        return mappedOrganization;
    }
}
