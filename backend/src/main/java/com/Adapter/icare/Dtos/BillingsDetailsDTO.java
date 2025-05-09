package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
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
    private String standardCode;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private String billDate;
}
