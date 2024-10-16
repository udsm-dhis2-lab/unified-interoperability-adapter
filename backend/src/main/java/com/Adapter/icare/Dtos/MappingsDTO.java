package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class MappingsDTO {
    private String dataKey;
    private Map<String, Object> mapping;
    private String namespace;
    private String description;
    private String group;
}
