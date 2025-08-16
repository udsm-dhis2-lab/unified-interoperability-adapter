package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        facilityMap.put("system", this.getSystem() != null ? this.getSystem().toMap() : null);
        facilityMap.put("bloodBags", this.getBloodBags() == null || this.getBloodBags().isEmpty() ? this.getBloodBags() : this.getBloodBags().stream().map(BloodBagDTO::toMap).collect(Collectors.toList()));
        return facilityMap;
    }
    public Map<String,Object> toMap(Boolean excludeBloodBags) {
        Map<String, Object> facilityMap = new HashMap<>();
        facilityMap.put("code", this.getCode());
        facilityMap.put("system", this.getSystem() != null ? this.getSystem().toMap() : null);
        return facilityMap;
    }
}
