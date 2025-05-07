package com.Adapter.icare.Dtos;

import arrow.typeclasses.Hash;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@Setter
public class AdmissionDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private String admissionDate;
    @NotNull
    private String admissionDiagnosis;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private String dischargedOn;
    private String dischargeStatus;


    public Map<String, Object> toMap(){
        Map<String,Object> admissionDetails = new LinkedHashMap<>();
        admissionDetails.put("admissionDate", this.getAdmissionDate());
        admissionDetails.put("admissionDiagnosis", this.getAdmissionDiagnosis());
        admissionDetails.put("dischargedOn", this.getDischargedOn());
        admissionDetails.put("dischargeStatus", this.getDischargeStatus());

        return admissionDetails;
    }
}
