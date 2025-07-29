package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.Priority;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class LabTestsDTO {
    private Integer obrSetId;
    private Priority priority;
    private CodeDTO typeOfTest;
    private Integer repeated;

    public Map<String, Object> toMap(){
        Map<String, Object> labTestsMap = new HashMap<>();
        labTestsMap.put("obrSetId", this.getObrSetId());
        labTestsMap.put("priority", this.getPriority());
        labTestsMap.put("typeOfTest", this.getTypeOfTest().toMap());
        labTestsMap.put("repeated", this.getRepeated());
        return labTestsMap;
    }
}
