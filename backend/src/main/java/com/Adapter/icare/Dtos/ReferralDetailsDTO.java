package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ReferralDetailsDTO {
    private Date referralDate;
    private List<String> reason;
    private String referralNumber;
    private String hfrCode;
    private Map<String,Object> referringClinician; // TODO: Add specific model
}
