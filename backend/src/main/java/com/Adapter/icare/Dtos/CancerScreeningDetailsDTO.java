package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CancerScreeningDetailsDTO {
    private BreastCancerDTO breastCancer;
    private ParentCervicalCancerDTO cervicalCancer;
}
