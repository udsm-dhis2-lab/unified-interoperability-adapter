package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class TreatmentDetailsDTO {
    private List<Map<String,Object>> chemoTherapy;
    private List<Map<String,Object>> radioTherapy;
    private List<Map<String,Object>> palliativeCare;
    private List<Map<String,Object>> surgery;
    private List<Map<String,Object>> hormoneTherapy;
    private String symptomatic;
    private String alternativeTreatment;
    private Map<String,Object> medicalProcedureDetails;
}
