package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Setter
@Getter
public class ReceivingFacilityDTO {
    private String code;
    private String section;

    public Map<String, Object> toMap() {
        Map<String, Object> receivingFacilityMap = new HashMap<>();
        receivingFacilityMap.put("code", this.getCode());
        receivingFacilityMap.put("section", this.getSection());
        return receivingFacilityMap;
    }
}
