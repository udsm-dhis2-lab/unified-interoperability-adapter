package com.Adapter.icare.Dtos;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class VisitNotesDTO {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private String date;
    private List<String> chiefComplains;
    private Boolean injured;
    private List<String> historyOfPresentIllness;
    private List<ReviewOfOtherSystemsDTO> reviewOfOtherSystems;
    private List<String> pastMedicalHistory;
    private List<String> familyAndSocialHistory;
    private List<String> generalExaminationObservation;
    private List<String> localExamination;
    private List<ReviewOfOtherSystemsDTO> systemicExaminationObservation;
    private List<String> doctorPlanOrSuggestion;
    private String providerSpeciality;
}