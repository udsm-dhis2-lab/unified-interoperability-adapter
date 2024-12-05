package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class FacilityDetailsDTO {
    private String code;
    private String name;

    public Map<String,Object> toMap() {
        Map<String, Object> facilityMap = new HashMap<>();
        facilityMap.put("code", this.getCode());
        facilityMap.put("name", this.getName());
        return facilityMap;
    }
}
