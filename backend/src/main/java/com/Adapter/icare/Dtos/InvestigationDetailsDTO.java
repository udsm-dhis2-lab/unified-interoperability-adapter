package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.SpecimenAcceptanceStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;

@Getter
@Setter
public class InvestigationDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date dateOccurred;
    private String caseClassification;
    private Integer daysSinceSymptoms;
    @NotNull
    private String diseaseCode;
    private Boolean labSpecimenTaken;
    private Boolean specimenSentToLab;
    private String vaccinated;
    private Boolean specimenCollected;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date dateSpecimenCollected;
    private String specimenCollectedFrom;
    private String specimenID;
    private String typeOfSpecimen;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date dateSpecimenSentToLab;
    private String laboratoryName;
    private String typeOfTest;
    private SpecimenAcceptanceStatus specimenAcceptanceStatus;
    private String specimenCollectorName;
    private String specimenCollectorContactNumber;
}
