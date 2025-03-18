package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class AppointmentPaymentDetailsDTO {

    private String controlNumber;
    private String statusCode;
    private String description;

    public Map<String, Object> toMap() {
        Map<String, Object> appointmentPaymentDetails = new HashMap<>();
        appointmentPaymentDetails.put("controlNumber", this.getControlNumber());
        appointmentPaymentDetails.put("statusCode", this.getStatusCode());
        appointmentPaymentDetails.put("description", this.getDescription());
        return appointmentPaymentDetails;
    }
}
