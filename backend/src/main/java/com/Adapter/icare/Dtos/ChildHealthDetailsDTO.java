package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.InfantFeeding;
import com.Adapter.icare.Enums.ServiceModality;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChildHealthDetailsDTO {
    private ServiceModality serviceModality;
    private Integer motherAge;
    private CHProphylaxisDTO prophylaxis;
    private InfantFeeding infantFeeding;
    private Boolean providedWithInfantFeedingCounselling;
    private Boolean hasBeenBreastFedFor24Month;
    private MotherHivStatusDTO motherHivStatus;
    private Boolean referredToCTC;
}
