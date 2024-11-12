package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
public class AddressDTO {
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String text;
    private String use;
    private List<String> line;
    public AddressDTO(String city, String state, String postalCode, String country, String text, String use, List<String> line) {
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.country = country;
        this.text = text;
        this.use =  use;
        this.line = line;
    }

    public Map<String,Object> toMap() {
        Map<String,Object> addressesMap = new HashMap<>();
        addressesMap.put("village", this.getText() != null && this.getText().contains("-") ? this.getText().split("-")[1]: null);
        addressesMap.put("ward", this.getText() != null  && this.getText().contains("-") ? this.getText().split("-")[0]: null);
        addressesMap.put("city", this.getCity());
        addressesMap.put("country", this.getCountry());
        addressesMap.put("category", this.getUse().equals("home") ? "Permanent": "Temporarily");
        return addressesMap;
    }

}
