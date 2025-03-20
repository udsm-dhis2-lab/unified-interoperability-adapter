package com.Adapter.icare.Dtos;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class BloodBagsDTO {
    private List<BloodBagDTO> bloodBags;

    Map<String, Object> toMap() {
        Map<String, Object> bags = new HashMap<>();
        bags.put("bloodBags", getBloodBags().stream().map(BloodBagDTO::toMap));
        return bags;
    }
}
