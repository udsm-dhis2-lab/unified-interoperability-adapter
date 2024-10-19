package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class AdmissionDetailsDTO {
    private Date admissionDate;
    private String admissionDiagnosis;
    private Date dischargedOn;
    private String dischargeStatus;
}
