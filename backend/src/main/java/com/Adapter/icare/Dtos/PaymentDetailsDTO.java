package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

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
}
