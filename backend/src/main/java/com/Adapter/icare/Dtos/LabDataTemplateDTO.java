package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;


@Setter
@Getter
public class LabDataTemplateDTO {
    @NotNull(message = "templateDetails field is required")
    private TemplateDetailsDTO templateDetails;
    @NotNull(message = "data field is required")
    private LabRecordsDataDTO data;

    public Map<String, Object> toMap(){
        Map<String, Object> dataTemplateMap = new HashMap<>();
        dataTemplateMap.put("templateDetails", this.getTemplateDetails());
        dataTemplateMap.put("data", this.getData());
        return dataTemplateMap;
    }
}
