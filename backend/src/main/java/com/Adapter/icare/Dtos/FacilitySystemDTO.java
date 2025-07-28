package com.Adapter.icare.Dtos;


import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class FacilitySystemDTO {
    private String name;
    private String version;

    public Map<String, Object> toMap(){
        Map<String, Object> systemMap = new HashMap<>();
        systemMap.put("name", this.getName());
        systemMap.put("version", this.getVersion());
        return systemMap;
    }
}
