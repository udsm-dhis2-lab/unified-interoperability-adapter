package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.hl7.fhir.r4.model.Identifier;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@Setter
public class IdentifierDTO {
    @NotNull
    private String id;
    @NotNull
    private String type;
    private String use;
    private String system;
    private FacilityDetailsDTO organization;

    public Map<String, Object> toMap () {
        Map<String, Object> identifier =  new LinkedHashMap<>();
        identifier.put("type", this.getType());
        identifier.put("id", this.getId());
        identifier.put("preferred", this.getType() != null ? (this.getType().equals("mrn") ? true: false ): false);
        return identifier;
    }
}
