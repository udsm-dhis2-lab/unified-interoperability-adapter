package com.Adapter.icare.Dtos;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendedSpecialistDTO {
    private boolean superSpecialist;
    private boolean specialist;

    public Map<String,Object> toMap() {
        Map<String,Object> attendedSpecialist = new java.util.HashMap<>();
        attendedSpecialist.put("superSpecialist", this.isSuperSpecialist() ? this.isSuperSpecialist() : false);
        attendedSpecialist.put("specialist", this.isSpecialist() ? this.isSpecialist() : false);
        return attendedSpecialist;
    }
}
