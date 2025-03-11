package com.Adapter.icare.Dtos;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ServiceComplaintsDTO {
    private boolean providedComplaints;
    private String complaints;

    public Map<String,Object> toMap() {
        Map<String,Object> serviceComplaints = new java.util.HashMap<>();
        serviceComplaints.put("providedComplaints", this.isProvidedComplaints());
        serviceComplaints.put("complaints", this.getComplaints());
        return serviceComplaints;
    }
}
