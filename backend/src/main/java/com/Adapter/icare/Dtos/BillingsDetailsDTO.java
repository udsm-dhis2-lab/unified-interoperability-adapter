package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class BillingsDetailsDTO {
    private String billID;
    private String billingCode;
    private String billType;
    private String insuranceCode;
    private String insuranceName;
    private Number amountBilled;
    private String exemptionType;
    private String wavedAmount;
    private Date billDate;
}
