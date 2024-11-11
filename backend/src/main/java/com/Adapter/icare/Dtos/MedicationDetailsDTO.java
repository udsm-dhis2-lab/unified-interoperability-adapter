package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@Setter
public class MedicationDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date orderDate;
    private String code;
    private String name;
    private String periodOfMedication;
    private String codeStandard;
    private String treatmentType; // TODO: Enumerate treatmentType
    // TODO: Change this to accommodate dosage parameters
    private Map<String,Object> dosage;

    public Map<String,Object> toMap() {
        Map<String,Object> medicationDetailsMap = new LinkedHashMap<>();
        medicationDetailsMap.put("orderDate", this.getOrderDate());
        medicationDetailsMap.put("code", this.getCode());
        medicationDetailsMap.put("name", this.getName());
        medicationDetailsMap.put("periodOfMedication", this.getPeriodOfMedication());
        medicationDetailsMap.put("codeStandard", this.getCodeStandard());
        medicationDetailsMap.put("treatmentType", this.getTreatmentType());
        medicationDetailsMap.put("dosage", this.getDosage());
        return medicationDetailsMap;
    }
}
