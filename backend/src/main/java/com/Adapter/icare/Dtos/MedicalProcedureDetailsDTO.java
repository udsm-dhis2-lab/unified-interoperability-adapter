package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MedicalProcedureDetailsDTO {
    private Date procedureDate;
    private String procedureType;
    private String findings;
}
