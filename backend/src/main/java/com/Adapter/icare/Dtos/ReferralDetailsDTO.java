package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.Map;

@Getter
@Setter
public class ReferralDetailsDTO {
    private Date referralDate;
    private String reason;
    private Map<String,Object> referringClinician; // TODO: Add specific model
}
