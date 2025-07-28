package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class FacilityDetailsDTO {
    private String code;
    private String name;
    private FacilitySystemDTO system;
    private List<BloodBagDTO> bloodBags;

    public Map<String,Object> toMap() {
        Map<String, Object> facilityMap = new HashMap<>();
        facilityMap.put("code", this.getCode());
        facilityMap.put("name", this.getName());
        facilityMap.put("system", this.getSystem().toMap());
        facilityMap.put("bloodBags", this.getBloodBags().stream().map(BloodBagDTO::toMap));
        return facilityMap;
    }
}
