package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class LabTestResultsDTO {
    private String parameter;
    private Date releaseDate;
    private String result;
    private String codedValue;
    private String valueType;
    private String standardCode;
    private String codeType;
    private String unit;
    private String lowRange;
    private String hiRange;
    private String remarks;
}
