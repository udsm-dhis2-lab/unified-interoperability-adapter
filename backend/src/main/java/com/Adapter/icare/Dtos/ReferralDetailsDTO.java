package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ReferralDetailsDTO {
    @NotNull
    private Date referralDate;
    private List<String> reason;

    @NotNull
    private String referralNumber;

    @NotNull
    private String hfrCode;
    private Map<String,Object> referringClinician; // TODO: Add specific model
}
