package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;


//TODO: We should standardize the vitals to use this DTO
@Getter
@Setter
public class VitalSignDTO {
    private String bloodPressure;
    private Integer weight;
    private Integer temperature;
    private Integer height;
    private String respiration;
    private Integer pulseRate;
    private String dateTime;
    private String notes;
}