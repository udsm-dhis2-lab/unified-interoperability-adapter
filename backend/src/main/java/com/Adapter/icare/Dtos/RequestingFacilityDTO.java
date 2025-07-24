package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class RequestingFacilityDTO {
    private String code;
    private String pointOfCare;

    public Map<String, Object> toMap(){
        Map<String, Object> requestingFacilityMap = new HashMap<>();
        requestingFacilityMap.put("code", this.getCode());
        requestingFacilityMap.put("pointOfCare", this.getPointOfCare());
        return requestingFacilityMap;
    }
}
