package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class AppointmentServiceDetailsDTO {
    private String serviceCode;
    private String serviceName;
    private String shortName;

    public Map<String, Object> toMap() {
        Map<String, Object> appointmentServiceDetails = new HashMap<>();
        appointmentServiceDetails.put("serviceCode", this.getServiceCode());
        appointmentServiceDetails.put("serviceName", this.getServiceName());
        appointmentServiceDetails.put("shortName", this.getServiceName());
        return appointmentServiceDetails;
    }
}
