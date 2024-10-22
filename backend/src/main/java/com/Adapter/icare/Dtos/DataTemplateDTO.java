package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class DataTemplateDTO {
    private Map<String,Object> templateDetails;
    private DataTemplateDataDTO data;

    public Map<String, Object> toMap() {
        Map<String,Object> data = new HashMap<>();
        data.put("templateDetails", this.getTemplateDetails());
        data.put("data", this.getData());
        return data;
    }
}
