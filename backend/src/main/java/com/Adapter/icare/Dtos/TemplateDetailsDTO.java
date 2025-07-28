package com.Adapter.icare.Dtos;


import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class TemplateDetailsDTO {
    private String code;
    private String id;
    private String name;
    private CodingVersionDTO codingVersions;
    private WorkflowDTO workflow;

    public Map<String, Object> toMap(){
        Map<String, Object> templateDetailsMap = new HashMap<>();
        templateDetailsMap.put("code", this.getCode());
        templateDetailsMap.put("id", this.getId());
        templateDetailsMap.put("name", this.getName());
        templateDetailsMap.put("codingVersion", this.getCodingVersions().toMap());
        templateDetailsMap.put("workflow", this.getWorkflow().toMap());
        return templateDetailsMap;
    }
}
