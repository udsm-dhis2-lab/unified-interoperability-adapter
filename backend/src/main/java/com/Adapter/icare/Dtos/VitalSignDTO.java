package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class VitalSignDTO {
    private String bloodPressure;
    private Float weight;
    private Float temperature;
    private Float height;
    private Integer respiration;
    private Integer pulseRate;
    private String dateTime;
    private String notes;
}