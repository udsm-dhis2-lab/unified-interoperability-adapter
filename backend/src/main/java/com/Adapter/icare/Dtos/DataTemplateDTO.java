package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class DataTemplateDTO {
    @NotNull(message = "templateDetails field is required")
    private TemplateDetailsDTO templateDetails;
    @NotNull(message = "data field is required")
    private DataTemplateDataDTO data;

    public Map<String, Object> toMap() {
        Map<String,Object> data = new HashMap<>();
        data.put("templateDetails", this.getTemplateDetails());
        data.put("data", this.getData());
        return data;
    }
}
