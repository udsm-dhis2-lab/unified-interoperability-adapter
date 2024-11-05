package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class CareServiceDTO {
    private String careType;
    private Integer visitNumber;

    public Map<String,Object> toMap() {
        Map<String,Object> careService = new HashMap<>();
        careService.put("careType", this.getCareType());
        careService.put("visitNumber", this.getVisitNumber());
        return careService;
    }
}
