package com.Adapter.icare.Dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CervicalCancerDTO extends ParentCervicalCancerDTO {
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

