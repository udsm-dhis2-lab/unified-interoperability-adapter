package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class CodeDTO {
    private String code;
    private String codeType;

    public Map<String, Object> toMap(){
        Map<String, Object> specimentTypeMap = new HashMap<>();
        specimentTypeMap.put("code", this.getCode());
        specimentTypeMap.put("codeType", this.getCodeType());
        return specimentTypeMap;
    }
}
