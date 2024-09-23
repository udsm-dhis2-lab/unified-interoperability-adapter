package com.Adapter.icare.Dtos;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HumanNameDTO {
    private String family;
    private List<String> given;

    public HumanNameDTO() {}

    public HumanNameDTO(String family, List<String> given) {
        this.family = family;
        this.given = given;
    }

    public Map<String, Object> toMap() {
        Map<String, Object> names = new HashMap<>();
        String firstName = null;
        String middleName = null;
        if (!getGiven().isEmpty() && getGiven().get(0) != null) {
            firstName = getGiven().get(0);
        }
        if (!getGiven().isEmpty() && getGiven().get(1) != null) {
            middleName = getGiven().get(1);
        }
        names.put("firstName",firstName);
        names.put("middleName",middleName);
        names.put("lastName",getFamily());
        return names;
    }

    public String getFamily() {
        return family;
    }

    public void setFamily(String family) {
        this.family = family;
    }

    public List<String> getGiven() {
        return given;
    }

    public void setGiven(List<String> given) {
        this.given = given;
    }

}
