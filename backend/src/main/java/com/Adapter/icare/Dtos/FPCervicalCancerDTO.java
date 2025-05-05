package com.Adapter.icare.Dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FPCervicalCancerDTO extends ParentCervicalCancerDTO {
    private Boolean suspected;
    private Boolean screenedWithVIA;
    private Boolean viaTestPositive;
}
