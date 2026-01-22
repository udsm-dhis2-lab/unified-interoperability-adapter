package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * DTO for registering a new facility with optional mediator configuration
 */
@Getter
@Setter
public class FacilityRegistrationDTO {

    @NotNull(message = "Facility code is required")
    private String code;

    @NotNull(message = "Facility name is required")
    private String name;

    private Boolean allowed = true;
    private String type;
    private String ownership;
    private String region;
    private String district;
    private String status = "ACTIVE";
    private Object params;

    @JsonProperty("mediatorConfig")
    private MediatorDTO mediatorConfig;

    /**
     * Check if mediator configuration is provided
     */
    public boolean hasMediatorConfig() {
        return mediatorConfig != null &&
                mediatorConfig.getBaseUrl() != null &&
                !mediatorConfig.getBaseUrl().trim().isEmpty() &&
                mediatorConfig.getAuthType() != null &&
                !mediatorConfig.getAuthType().trim().isEmpty();
    }

    /**
     * Convert to System DTO for integrations service
     */
    public SystemDTO toSystemDTO() {
        SystemDTO systemDTO = new SystemDTO();
        systemDTO.setCode(this.code);
        systemDTO.setName(this.name);
        systemDTO.setAllowed(this.allowed != null ? this.allowed : true);
        systemDTO.setParams(this.params);
        return systemDTO;
    }

    /**
     * Convert to Mediator DTO for backend service
     */
    public MediatorDTO toMediatorDTO() {
        if (!hasMediatorConfig()) {
            return null;
        }

        mediatorConfig.setCode(this.code);
        return mediatorConfig;
    }
}
