package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.AfterAbortionServices;
import com.Adapter.icare.Enums.CauseOfAbortion;
import com.Adapter.icare.Enums.ReferReason;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CpacDetailsDTO {
    private int pregnancyAgeInWeeks;
    private CauseOfAbortion causeOfAbortion;
    private AfterAbortionServices afterAbortionServices;
    private Boolean positiveHIVStatusBeforeAbortion;
    private CpacHivTestDTO hivTest;
    private ReferReason referReason;
    private PostAbortionsMedicationsDTO postAbortionsMedications;
    private PostAbortionCounsellingDTO postAbortionCounselling;
    private CpacContraceptivesDTO contraceptives;
}
