package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class SpouseDetailsDTO {
    private DiseaseStatusDTO hivDetails;
    private DiseaseStatusDTO syphilisDetails;
    private List<Map<String,Object>> otherSpouseDetails;
}
