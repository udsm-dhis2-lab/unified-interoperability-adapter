package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class CancerScreeningDTO {
    private Date date;
    private String method;
    private String code;
    private CancerScreeningResultsDTO results;
}
