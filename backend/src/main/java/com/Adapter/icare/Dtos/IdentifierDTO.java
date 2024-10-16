package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class IdentifierDTO {
    private String system;
    private String value;
    private String use;
    private String type;

    public IdentifierDTO(String system,
                         String value,
                         String use,
                         String type) {
        this.system = system;
        this.value = value;
        this.use = use;
        this.type = type;
    }

    public Map<String, Object> toMap () {
        Map<String, Object> identifier =  new HashMap<>();
        identifier.put("id", this.getValue());
        identifier.put("use", this.getUse());
        identifier.put("system", this.getSystem());
        identifier.put("type", this.getType());
        return identifier;
    }
}
