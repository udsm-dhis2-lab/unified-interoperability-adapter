package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class DiagnosisDetailsDTO {
    private String certainty;
    private String diagnosis;
    private String diagnosisCode;
    private Date diagnosisDate;
    private String diagnosisDescription;
}
