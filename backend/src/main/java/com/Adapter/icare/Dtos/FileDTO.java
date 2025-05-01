package com.Adapter.icare.Dtos;

import java.util.LinkedHashMap;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileDTO {
    private String name;
    private String url;
    private String id;

    public Map<String, Object> toMap() {
        Map<String, Object> fileDetails = new LinkedHashMap<>();
        fileDetails.put("name", this.getName());
        fileDetails.put("url", this.getUrl());
        fileDetails.put("id", this.getId());
        return fileDetails;
    }
}