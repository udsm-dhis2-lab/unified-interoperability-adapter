package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class VitalSignDTO {
    private String bloodPressure;
    private Integer weight;
    private Integer temperature;
    private Integer height;
    private Integer respiration;
    private Integer pulseRate;
    private String dateTime;
    private String notes;
}