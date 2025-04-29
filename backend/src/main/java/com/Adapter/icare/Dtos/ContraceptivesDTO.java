package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContraceptivesDTO {
    private boolean didReceiveOralPillsPOP;
    private int popCyclesProvided;
    private boolean didReceiveOralPillsCOC;
    private int cocCyclesProvided;
    private boolean didReceivePillCycles;
    private boolean wasInsertedWithImplanon;
    private boolean wasInsertedWithJadelle;
    private boolean didReceiveIUD;
    private boolean didHaveTubalLigation;
    private boolean didReceiveInjection;
    private int numberOfFemaleCondomsProvided;
    private int numberOfMaleCondomsProvided;
    private Boolean didReceiveSDM;
    private Boolean didUseLAM;
    private Boolean didOptToUseEmergencyMethods;
    private Boolean didRemoveIUD;
    private Boolean didHaveVasectomy;

}
