package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.Map;

@Getter
@Setter
public class MedicationDetailsDTO {
    private String name;
    private String code;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date orderDate;
    private String periodOfMedication;
    private String codeStandard;
    private String treatmentType; // TODO: Enumerate treatmentType
    // TODO: Change this to accommodate dosage parameters
    private Map<String,Object> dosage;
}
