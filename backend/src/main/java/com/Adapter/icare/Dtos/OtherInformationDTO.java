package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OtherInformationDTO {
    private CancerScreeningDTO cancerScreening;
    private List<CancerDetailsDTO> cancerDetails;
}
