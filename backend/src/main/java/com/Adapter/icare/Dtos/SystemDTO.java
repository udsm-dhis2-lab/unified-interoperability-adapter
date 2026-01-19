package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

/**
 * DTO representing a System in the integrations service
 */
@Getter
@Setter
public class SystemDTO {
    private String id;
    private String code;
    private String name;
    private Boolean allowed;
    private Object params;
    private String created;
    private String updated;

    /**
     * Convert to Map for JSON serialization
     */
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        if (id != null)
            map.put("id", id);
        map.put("code", code);
        map.put("name", name);
        map.put("allowed", allowed != null ? allowed : true);
        if (params != null)
            map.put("params", params);
        return map;
    }

    /**
     * Create from Map (for deserializing integrations API response)
     */
    public static SystemDTO fromMap(Map<String, Object> map) {
        SystemDTO dto = new SystemDTO();
        dto.setId(map.get("id") != null ? map.get("id").toString() : null);
        dto.setCode(map.get("code") != null ? map.get("code").toString() : null);
        dto.setName(map.get("name") != null ? map.get("name").toString() : null);
        dto.setAllowed(map.get("allowed") != null ? (Boolean) map.get("allowed") : true);
        dto.setParams(map.get("params"));
        dto.setCreated(map.get("created") != null ? map.get("created").toString() : null);
        dto.setUpdated(map.get("updated") != null ? map.get("updated").toString() : null);
        return dto;
    }
}
