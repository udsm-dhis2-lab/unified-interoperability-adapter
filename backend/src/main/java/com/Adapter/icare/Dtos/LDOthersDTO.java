package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class LDOthersDTO {
    private EmocDTO emoc;
    private AmstlDTO amstl;
    private List<Map<String, Object>> familyPlanning;
}
