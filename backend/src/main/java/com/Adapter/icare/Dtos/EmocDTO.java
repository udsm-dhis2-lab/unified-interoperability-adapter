package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmocDTO {
    private Boolean providedAntibiotic;
    private Boolean providedUterotonic;
    private Boolean providedMagnesiumSulphate;
    private Boolean removedPlacenta;
    private Boolean performedMvaOrDc;
    private Boolean administeredBlood;
}
