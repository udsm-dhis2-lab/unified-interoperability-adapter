package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.CareType;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class RequestingFacilityDTO {
    private String code;
    private CareType careType;

    public Map<String, Object> toMap(){
        Map<String, Object> requestingFacilityMap = new HashMap<>();
        requestingFacilityMap.put("code", this.getCode());
        requestingFacilityMap.put("careType", this.getCareType());
        return requestingFacilityMap;
    }
}
