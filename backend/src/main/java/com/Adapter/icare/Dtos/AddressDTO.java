package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
public class AddressDTO {
    private String village;
    private String ward;
    private String district;
    private String region;
    private String country;
    private String category;
    public AddressDTO(String village, String ward, String district, String region, String country, String category) {
        this.village = village;
        this.ward = ward;
        this.district = district;
        this.region = region;
        this.country = country;
        this.category = category;
    }

    public Map<String,Object> toMap() {
        Map<String,Object> addressesMap = new HashMap<>();
        addressesMap.put("village", this.getVillage());
        addressesMap.put("ward", this.getWard() != null );
        addressesMap.put("region", this.getRegion());
        addressesMap.put("country", this.getCountry());
        addressesMap.put("category", this.getCategory() != null ? this.getCategory(): "Temporary");
        return addressesMap;
    }

}
