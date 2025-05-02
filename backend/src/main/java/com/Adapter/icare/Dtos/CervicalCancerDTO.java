package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CervicalCancerDTO {
    private Boolean suspected;
    private Boolean screenedWithVIA;
    private Boolean screenedWithHPVDNA;
    private Boolean viaTestPositive;
    private Boolean hpvDNAPositive;
    private Boolean diagnosedWithLargeLesion;
    private Boolean diagnosedWithSmallOrModerateLesion;
    private Boolean treatedWithCryo;
    private Boolean treatedWithThermo;
    private Boolean treatedWithLEEP;
    private Boolean firstTimeScreening;
    private Boolean treatedOnTheSameDay;
    private Boolean complicationsAfterTreatment;
    private Boolean foundWithHivAndReferredToCTC;
}

