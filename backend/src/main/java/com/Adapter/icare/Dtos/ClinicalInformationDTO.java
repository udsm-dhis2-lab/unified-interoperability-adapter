package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ClinicalInformationDTO {
    // TODO: Improve by adding DTOs for specific area
    private List<Map<String,Object>> vitalSigns;
    private List<Map<String,Object>> visitNotes;
}
