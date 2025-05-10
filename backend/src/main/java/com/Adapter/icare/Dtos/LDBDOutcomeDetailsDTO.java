package com.Adapter.icare.Dtos;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LDBDOutcomeDetailsDTO extends ParentBDOutcomeDetailsDTO {
    private Boolean isAlive;
    private Boolean referredToPNC;
}
