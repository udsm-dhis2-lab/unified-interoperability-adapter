package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class AntenatalCareDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date date;
    private Integer pregnancyAgeInWeeks;
    private Boolean positiveHivStatusBeforeService;
    private Boolean referredToCTC;
    private Integer gravidity;
    private Map<String,Object> hivDetails;
    private DiseaseStatusDTO syphilisDetails;
    private SpouseDetailsDTO spouseDetails;
    private List<Map<String,Object>> otherSpouseDetails;

    private String lastAncVisitDate;
    private boolean referredIn;
    private boolean referredOut;
    private List<CounsellingDTO> counselling;
    private boolean providedWithHivCounsellingBeforeLabTest;
    private boolean providedWithHivCounsellingAfterLabTest;
    private ANCProphylaxisDetailsDTO prophylaxis;
    private boolean diagnosedWithOtherSTDs;
    private boolean providedWithTreatmentForOtherSTDs;


}
