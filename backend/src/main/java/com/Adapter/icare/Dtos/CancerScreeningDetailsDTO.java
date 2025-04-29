package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CancerScreeningDetailsDTO {
    private breastCancerDTO breastCancer;
    private CervicalCancer cervicalCancer;
}
