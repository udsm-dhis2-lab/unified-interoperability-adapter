package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.Map;

@Getter
@Setter
public class MedicationDetailsDTO {
    private String name;
    private String code;
    private Date orderDate;
    private String periodOfMedication;
    private String codeStandard;
    private String treatmentType; // TODO: Enumerate treatmentType
    // TODO: Change this to accommodate dosage parameters
    private Map<String,Object> dosage;
}
