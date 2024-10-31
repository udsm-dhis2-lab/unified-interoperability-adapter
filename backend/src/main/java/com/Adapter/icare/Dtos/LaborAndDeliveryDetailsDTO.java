package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class LaborAndDeliveryDetailsDTO {
    private String placeOfBirth;
    private Integer timeBetweenLaborPainAndDeliveryInHrs;
    private boolean isAttendantSkilled;
    private List<String> beforeBirthComplications;
    private List<String> birthCompications;
    private Map<String,Object> others;
}
