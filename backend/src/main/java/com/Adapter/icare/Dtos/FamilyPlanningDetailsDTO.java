package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.ServiceLocations;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class FamilyPlanningDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date date;
    private boolean positiveHivStatusBeforeService;
    private boolean wasCounselled;
    private boolean hasComeWithSpouse;
    private ServiceLocations serviceLocation;
    private boolean referred;
    private CancerScreeningDetailsDTO cancerScreeningDetails;
    private FPHivStatusDTO hivStatus;
    private FPHivStatusDTO spouseHivStatus;
    private boolean breastFeeding;
    private SideEffectsDTO sideEffects;
}
