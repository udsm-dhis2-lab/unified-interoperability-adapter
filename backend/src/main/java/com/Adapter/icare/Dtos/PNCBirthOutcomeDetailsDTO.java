package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PNCBirthOutcomeDetailsDTO extends ParentOutcomeDetailsDTO {
    private Boolean dischargedHome;
    private Boolean referredToNCU;
}
