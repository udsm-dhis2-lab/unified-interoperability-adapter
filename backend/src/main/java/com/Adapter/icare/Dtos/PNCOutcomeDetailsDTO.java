package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PNCOutcomeDetailsDTO {
    private Boolean dischargedHome;
    private Boolean referredToNCU;
    private Boolean referredToHospital;
    private Boolean referredToHealthFacility;
}
