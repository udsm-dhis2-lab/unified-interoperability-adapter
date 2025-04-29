package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.InfantFeeding;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChildHealthDetailsDTO {
    private CHProphylaxisDTO prophylaxis;
    private InfantFeeding infantFeeding;
    private boolean providedWithInfantFeedingCounselling;
    private boolean isStillBreastFed;
    private MotherHivStatusDTO motherHivStatus;
    private boolean referredToCTC;
}
