package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.SpecimenAcceptanceStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

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
    private Boolean vaccinated;
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


    public Map<String, Object> toMap() {
        Map<String, Object> investigationDetails = new HashMap<>();
        investigationDetails.put("dateOccurred", this.getDateOccurred());
        investigationDetails.put("caseClassification", this.getCaseClassification());
        investigationDetails.put("daysSinceSymptoms", this.getDaysSinceSymptoms());
        investigationDetails.put("diseaseCode", this.getDiseaseCode());
        investigationDetails.put("labSpecimenTaken", this.getLabSpecimenTaken());
        investigationDetails.put("specimenSentToLab", this.getDateSpecimenSentToLab());
        investigationDetails.put("vaccinated", this.getVaccinated());
        investigationDetails.put("specimenCollected", this.getSpecimenCollected());
        investigationDetails.put("dateSpecimenCollected", this.getDateSpecimenCollected());
        investigationDetails.put("specimenCollectedFrom", this.getSpecimenCollectedFrom());
        investigationDetails.put("specimenID", this.getSpecimenID());
        investigationDetails.put("typeOfSpecimen", this.getTypeOfSpecimen());
        investigationDetails.put("dateSpecimenSentToLab", this.getDateSpecimenSentToLab());
        investigationDetails.put("laboratoryName", this.getLaboratoryName());
        investigationDetails.put("typeOfTest", this.getTypeOfTest());
        investigationDetails.put("specimenAcceptanceStatus", this.getSpecimenAcceptanceStatus());
        investigationDetails.put("specimenCollectorName", this.getSpecimenCollectorName());
        investigationDetails.put("specimenCollectorContactNumber", this.getSpecimenCollectorContactNumber());
        return investigationDetails;
    }
}
