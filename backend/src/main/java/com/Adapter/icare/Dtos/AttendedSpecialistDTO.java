package com.Adapter.icare.Dtos;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendedSpecialistDTO {
    private Boolean superSpecialist;
    private Boolean specialist;

    public Map<String,Object> toMap() {
        Map<String,Object> attendedSpecialist = new java.util.HashMap<>();
        attendedSpecialist.put("superSpecialist", this.getSuperSpecialist() ? this.getSuperSpecialist() : false);
        attendedSpecialist.put("specialist", this.getSpecialist() ? this.getSpecialist() : false);
        return attendedSpecialist;
    }
}
