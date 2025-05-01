package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.BirthPlace;
import com.Adapter.icare.Enums.PlaceOfOrigin;
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
    private BirthPlace placeOfBirth;
    private Integer timeBetweenLaborPainAndDeliveryInHrs;
    @NotNull
    private Boolean isAttendantSkilled;
    private Boolean providedWithFamilyPlanningCounseling;
    private Boolean providedWithInfantFeedingCounseling;
    private List<CodeAndNameDTO> beforeBirthComplications;
    private List<CodeAndNameDTO> birthComplications;
    private List<BirthDetailsDTO> birthDetails;
    private Map<String,Object> others;
    private PlaceOfOrigin motherOrigin;
    private Boolean hasComeWithSpouse;
    private Boolean hasComeWithCompanion;
    private Integer pregnancyAgeInWeeks;
    private Boolean wasProvidedWithAntenatalCorticosteroid;
    private Boolean hasHistoryOfFGM;
    private LDHivDetailsDTO hivDetails;
}
