package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class ObservationDTO {
    private String code;
    private String type;

    public Map<String, Object> toMap(){
        Map<String, Object> observationMap = new HashMap<>();
        observationMap.put("code", this.getCode());
        observationMap.put("type", this.getType());
        return observationMap;
    }
}
