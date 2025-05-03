package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FPCervicalCancerDTO extends ParentCervicalCancerDTO {
    private Boolean suspected;
    private Boolean screenedWithVIA;
    private Boolean viaTestPositive;
}
