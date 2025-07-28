package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Setter
@Getter
public class WorkflowDTO {
    private String uuid;

    public Map<String, Object> toMap(){
        Map<String, Object> workflowMap = new HashMap<>();
        workflowMap.put("uuid", this.getUuid());
        return workflowMap;
    }
}
