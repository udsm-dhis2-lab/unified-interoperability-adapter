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
    private boolean positiveHivStatusBeforeService;
    private boolean referredToCTC;
    private boolean providedWithFamilyPlanningCounseling;
    private boolean providedWithInfantFeedingCounseling;
    private Integer gravidity;
    private Map<String,Object> hivDetails;
    private Map<String,Object> syphilisDetails;
    private SpouseDetailsDTO spouseDetails;
    private List<Map<String,Object>> otherSpouseDetails;
}
