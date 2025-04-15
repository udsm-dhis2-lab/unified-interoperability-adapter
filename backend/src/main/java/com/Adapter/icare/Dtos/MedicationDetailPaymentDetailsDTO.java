package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Setter
@Getter
public class MedicationDetailPaymentDetailsDTO {
    private String controlNumber;
    private String statusCode;
    private String type;
    private String description;

    public Map<String, Object> toMap() {
        Map<String, Object> paymentDetails = new HashMap<>();
        paymentDetails.put("statusCode", this.getControlNumber());
        paymentDetails.put("controlNumber", this.getControlNumber());
        paymentDetails.put("type", this.getType());
        paymentDetails.put("description", this.getDescription());
        return paymentDetails;
    }
}
