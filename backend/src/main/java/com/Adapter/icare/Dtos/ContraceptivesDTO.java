package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContraceptivesDTO {
    private Boolean didReceiveOralPillsPOP;
    private Integer popCyclesProvided;
    private Boolean didReceiveOralPillsCOC;
    private Integer cocCyclesProvided;
    private Boolean didReceivePillCycles;
    private Boolean wasInsertedWithImplanon;
    private Boolean wasInsertedWithJadelle;
    private Boolean didReceiveIUD;
    private Boolean didHaveTubalLigation;
    private Boolean didReceiveInjection;
    private Integer numberOfFemaleCondomsProvided;
    private Integer numberOfMaleCondomsProvided;
    private Boolean didReceiveSDM;
    private Boolean didUseLAM;
    private Boolean didOptToUseEmergencyMethods;
    private Boolean didRemoveIUD;
    private Boolean didHaveVasectomy;

}
