package com.Adapter.icare.Dtos;

import com.Adapter.icare.Domains.Mediator;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

/**
 * DTO representing complete facility information including system and mediator
 * configuration
 */
@Getter
@Setter
public class FacilityResponseDTO {

    // System/Basic Information
    private String id;
    private String code;
    private String name;
    private Boolean allowed;
    private String type;
    private String ownership;
    private String region;
    private String district;
    private String status;
    private Object params;
    private String created;
    private String updated;

    // Mediator Information
    private Boolean mediatorConfigured = false;
    private String mediatorUuid;
    private String mediatorBaseUrl;
    private String mediatorPath;
    private String mediatorAuthType;
    private String mediatorCategory;

    // Referral Information
    private Boolean referralEnabled = false;
    private String referralEndpoint;

    /**
     * Convert to Map for JSON response
     */
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();

        // Basic info
        map.put("id", id);
        map.put("code", code);
        map.put("name", name);
        map.put("allowed", allowed);

        if (type != null)
            map.put("type", type);
        if (ownership != null)
            map.put("ownership", ownership);
        if (region != null)
            map.put("region", region);
        if (district != null)
            map.put("district", district);
        if (status != null)
            map.put("status", status);
        if (params != null)
            map.put("params", params);
        if (created != null)
            map.put("created", created);
        if (updated != null)
            map.put("updated", updated);

        // Mediator info
        map.put("mediatorConfigured", mediatorConfigured);
        if (mediatorConfigured) {
            Map<String, Object> mediatorInfo = new HashMap<>();
            mediatorInfo.put("uuid", mediatorUuid);
            mediatorInfo.put("baseUrl", mediatorBaseUrl);
            mediatorInfo.put("path", mediatorPath);
            mediatorInfo.put("authType", mediatorAuthType);
            mediatorInfo.put("category", mediatorCategory);
            map.put("mediator", mediatorInfo);
        }

        // Referral info
        map.put("referralEnabled", referralEnabled);
        if (referralEnabled && referralEndpoint != null) {
            map.put("referralEndpoint", referralEndpoint);
        }

        return map;
    }

    /**
     * Create FacilityResponseDTO from System and Mediator
     */
    public static FacilityResponseDTO from(SystemDTO system, Mediator mediator) {
        FacilityResponseDTO dto = new FacilityResponseDTO();

        if (system != null) {
            dto.setId(system.getId());
            dto.setCode(system.getCode());
            dto.setName(system.getName());
            dto.setAllowed(system.getAllowed());
            dto.setParams(system.getParams());
            dto.setCreated(system.getCreated());
            dto.setUpdated(system.getUpdated());
        }

        if (mediator != null) {
            dto.setMediatorConfigured(true);
            dto.setMediatorUuid(mediator.getUuid());
            dto.setMediatorBaseUrl(mediator.getBaseUrl());
            dto.setMediatorPath(mediator.getPath());
            dto.setMediatorAuthType(mediator.getAuthType());
            dto.setMediatorCategory(mediator.getCategory());

            if (mediator.getApis() != null) {
                mediator.getApis().stream()
                        .filter(api -> "REFERRAL".equalsIgnoreCase(api.getCategory()))
                        .findFirst()
                        .ifPresent(referralApi -> {
                            dto.setReferralEnabled(referralApi.getActive());
                            dto.setReferralEndpoint(referralApi.getApi());
                        });
            }
        }

        return dto;
    }
}
