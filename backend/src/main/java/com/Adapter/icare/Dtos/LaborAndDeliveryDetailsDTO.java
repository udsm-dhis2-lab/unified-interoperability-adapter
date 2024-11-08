package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class LaborAndDeliveryDetailsDTO {
    @NotNull
    private String placeOfBirth;
    private Integer timeBetweenLaborPainAndDeliveryInHrs;
    @NotNull
    private boolean isAttendantSkilled;
    private List<String> beforeBirthComplications;
    private List<String> birthCompications;
    private Map<String,Object> others;
}
