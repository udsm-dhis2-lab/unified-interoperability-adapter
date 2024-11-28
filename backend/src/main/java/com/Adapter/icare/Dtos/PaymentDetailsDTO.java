package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class PaymentDetailsDTO {
    private String type;
    private String shortName;
    private String name;
    private String status;
    private String insuranceId;
    private String insuranceCode;
    private String policyNumber;
    private String groupNumber;

    public Map<String,Object> toMap() {
        Map<String, Object> paymentDetailsMap = new HashMap<>();
        paymentDetailsMap.put("type", this.getType());
        paymentDetailsMap.put("shortName", this.getShortName());
        paymentDetailsMap.put("name", this.getName());
        paymentDetailsMap.put("status", this.getStatus());
        paymentDetailsMap.put("insuranceId", this.getInsuranceId());
        paymentDetailsMap.put("insuranceCode", this.getInsuranceCode());
        paymentDetailsMap.put("policyNumber", this.getPolicyNumber());
        paymentDetailsMap.put("groupNumber", this.getGroupNumber());
        return paymentDetailsMap;
    }
}
