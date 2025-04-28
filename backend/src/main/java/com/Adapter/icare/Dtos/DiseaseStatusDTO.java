package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.STATUS;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DiseaseStatusDTO {
    private STATUS status;
    private String code;
    private boolean providedWithTreatment;
}
