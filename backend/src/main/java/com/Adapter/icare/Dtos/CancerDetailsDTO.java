package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class CancerDetailsDTO {
    private Date incidenceDate;
    private String topography;
    private String morphology;
    private String basisOfDiagnosis;
    private String stage;
}
