package com.Adapter.icare.Dtos;


import io.netty.handler.codec.serialization.ObjectEncoder;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class CodingVersionDTO {
    private String loincVersion;
    private String icdVersion;

    public Map<String, Object> toMap(){
        Map<String, Object> codingVersionMap = new HashMap<>();
        codingVersionMap.put("icdVersion", this.getIcdVersion());
        codingVersionMap.put("loincVersion", this.getLoincVersion());
        return codingVersionMap;
    }
}
