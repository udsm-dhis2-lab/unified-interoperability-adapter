package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class CancerScreeningResultsDTO {
    private Date date;
    private String value;
    private String code;
}
