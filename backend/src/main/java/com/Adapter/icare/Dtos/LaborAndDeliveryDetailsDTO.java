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
public class LaborAndDeliveryDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date date;
    @NotNull
    private Map<String,Object> deliveryMethod;
    @NotNull
    private String placeOfBirth;
    private Integer timeBetweenLaborPainAndDeliveryInHrs;
    @NotNull
    private boolean isAttendantSkilled;
    private boolean providedWithFamilyPlanningCounseling;
    private boolean providedWithInfantFeedingCounseling;
    private List<String> beforeBirthComplications;
    private List<String> birthCompications;
    private List<BirthDetailsDTO> birthDetails;
    private Map<String,Object> others;
}
