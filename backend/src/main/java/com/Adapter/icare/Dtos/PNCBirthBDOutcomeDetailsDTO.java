package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PNCBirthBDOutcomeDetailsDTO extends ParentBDOutcomeDetailsDTO {
    private Boolean dischargedHome;
    private Boolean referredToNCU;

}
