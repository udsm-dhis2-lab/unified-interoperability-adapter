package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.Priority;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class LabTestsDTO {
    private Integer obrSetId;
    private Priority priority;
    private List<String> clinicalCodes;
    private List<String> clinicalInformation;
    private String typeOfTest;
    private Integer repeated;
    private String specimenTestedBy;
    private ReceivingFacilityDTO receivingFacility;

    public Map<String, Object> toMap(){
        Map<String, Object> labTestsMap = new HashMap<>();
        labTestsMap.put("obrSetId", this.getObrSetId());
        labTestsMap.put("priority", this.getPriority());
        labTestsMap.put("clinicalCodes", this.getClinicalCodes());
        labTestsMap.put("clinicalInformation", this.getClinicalInformation());
        labTestsMap.put("typeOfTest", this.getTypeOfTest());
        labTestsMap.put("repeated", this.getRepeated());
        labTestsMap.put("specimenTestedBy", this.getSpecimenTestedBy());
        labTestsMap.put("receivingFacility", this.getReceivingFacility().toMap());
        return labTestsMap;
    }
}
