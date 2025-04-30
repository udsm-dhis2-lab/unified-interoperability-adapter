package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostAbortionsMedicationsDTO {
    private boolean providedWithAntibiotics;
    private boolean providedWithPainKillers;
    private boolean providedWithOxytocin;
    private boolean providedWithMisoprostol;
    private boolean providedWithIvInfusion;
}
