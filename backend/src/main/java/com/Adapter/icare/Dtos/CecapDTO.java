package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.STATUS;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CecapDTO {
    private STATUS hivStatus;
    private CancerScreeningDetailsDTO cancerScreeningDetails;
}
