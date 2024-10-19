package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class InvestigationDetailsDTO {
    private String caseClassification;
    private Date dateOccurred;
    private Integer daysSinceSymptoms;
    private String diseaseCode;
    private String labSpecimenTaken;
    private String specimenSentTo;
    private String vaccinated;
}
