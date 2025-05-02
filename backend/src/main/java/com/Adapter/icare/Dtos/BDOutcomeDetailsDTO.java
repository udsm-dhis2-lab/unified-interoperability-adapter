package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BDOutcomeDetailsDTO {
    private Boolean isAlive;
    private Boolean referredToHospital;
    private Boolean referredToHealthFacility;
    private Boolean referredToPNC;
}
