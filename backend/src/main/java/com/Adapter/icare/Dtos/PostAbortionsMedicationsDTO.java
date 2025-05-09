package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostAbortionsMedicationsDTO {
    private Boolean providedWithAntibiotics;
    private Boolean providedWithPainKillers;
    private Boolean providedWithOxytocin;
    private Boolean providedWithMisoprostol;
    private Boolean providedWithIvInfusion;
}
