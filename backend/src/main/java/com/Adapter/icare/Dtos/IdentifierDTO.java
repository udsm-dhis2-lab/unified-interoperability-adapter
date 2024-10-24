package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;
import org.hl7.fhir.r4.model.Identifier;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class IdentifierDTO {
    private String id;
    private String type;
    private String use;
    private String system;
    private FacilityDetailsDTO organization;

    public Map<String, Object> toMap () {
        Map<String, Object> identifier =  new HashMap<>();
        identifier.put("id", this.getId());
        identifier.put("use", this.getUse());
        identifier.put("system", this.getSystem());
        identifier.put("type", this.getType());
        identifier.put("organisation", this.getOrganization());
        return identifier;
    }
}
