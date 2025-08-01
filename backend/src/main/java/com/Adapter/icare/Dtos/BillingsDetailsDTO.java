package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

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
    private String standardCode;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private String billDate;

    public Map<String, Object> toMap(){
        Map<String, Object> billingMap = new HashMap<>();
        billingMap.put("billingID", this.getBillID());
        billingMap.put("billingCode", this.getBillingCode());
        billingMap.put("billType", this.getBillType());
        billingMap.put("insuranceCode", this.getInsuranceCode());
        billingMap.put("insuranceName", this.getInsuranceName());
        billingMap.put("amountBilled", this.getAmountBilled());
        billingMap.put("exemptionType", this.getExemptionType());
        billingMap.put("wavedAmount", this.getWavedAmount());
        billingMap.put("standardCode", this.getStandardCode());
        return billingMap;
    }
}
