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
    private String date;
    private Integer pregnancyAgeInWeeks;
    private Boolean positiveHivStatusBeforeService;
    private Boolean referredToCTC;
    private Integer gravidity;
    private HivDiseaseStatusDTO hivDetails;
    private DiseaseStatusDTO syphilisDetails;
    private SpouseDetailsDTO spouseDetails;
    private List<Map<String,Object>> otherSpouseDetails;

    private String lastAncVisitDate;
    private Boolean referredIn;
    private Boolean referredOut;
    private List<CounsellingDTO> counselling;
    private Boolean providedWithHivCounsellingBeforeLabTest;
    private Boolean providedWithHivCounsellingAfterLabTest;
    private ANCProphylaxisDetailsDTO prophylaxis;
    private Boolean diagnosedWithOtherSTDs;
    private Boolean providedWithTreatmentForOtherSTDs;
}
