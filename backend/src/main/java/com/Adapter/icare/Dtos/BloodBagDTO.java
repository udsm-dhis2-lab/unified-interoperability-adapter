package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class BloodBagDTO {
    private String bloodType;
    private int quantity;

    Map<String, Object> toMap() {
        Map<String, Object> bloodBag = new HashMap<>();
        bloodBag.put("bloodType", getBloodType());
        bloodBag.put("quantity", getQuantity());
        return bloodBag;
    }
}
