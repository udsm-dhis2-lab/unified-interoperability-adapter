package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ReferralDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date referralDate;
    private String hfrCode;
    private String facility;
    private List<String> reason;
    @NotNull
    private String referralNumber;
    private Map<String,Object> referringClinician; // TODO: Add specific model
    private boolean referredToOtherCountry;

    public Map<String,Object> toMap() {
        Map<String,Object> referralMap = new HashMap<>();
        referralMap.put("referralDate", this.getReferralDate());
        referralMap.put("reason", this.getReason());
        referralMap.put("referralNumber", this.getReferralNumber());
        referralMap.put("hfrCode", this.getHfrCode());
        referralMap.put("facility", this.getFacility());
        referralMap.put("referringClinician", this.getReferringClinician());
        referralMap.put("referredToOtherCountry", this.isReferredToOtherCountry());
        return referralMap;
    }
}
