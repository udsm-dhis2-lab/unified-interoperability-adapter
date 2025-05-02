package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FPCervicalCancerDTO {
    private Boolean suspected;
    private Boolean screenedWithVIA;
    private Boolean viaTestPositive;
}
