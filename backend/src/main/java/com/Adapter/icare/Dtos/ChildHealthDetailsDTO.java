package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.InfantFeeding;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChildHealthDetailsDTO {
    private CHProphylaxisDTO prophylaxis;
    private InfantFeeding infantFeeding;
    private Boolean providedWithInfantFeedingCounselling;
    private Boolean isStillBreastFed;
    private MotherHivStatusDTO motherHivStatus;
    private Boolean referredToCTC;
}
