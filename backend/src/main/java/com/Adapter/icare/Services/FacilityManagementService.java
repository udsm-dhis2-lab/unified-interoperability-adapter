package com.Adapter.icare.Services;

import com.Adapter.icare.Constants.DatastoreConstants;
import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Dtos.FacilityRegistrationDTO;
import com.Adapter.icare.Dtos.FacilityResponseDTO;
import com.Adapter.icare.Dtos.MediatorDTO;
import com.Adapter.icare.Dtos.SystemDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for managing facilities across both the integrations service
 * (for system whitelisting/blacklisting) and the backend (for mediator
 * configuration)
 */
@Service
@Slf4j
public class FacilityManagementService {

    private final MediatorsService mediatorsService;

    private boolean shouldUseWorkflowEngine = false;
    private Mediator workflowEngine = null;

    @Autowired
    public FacilityManagementService(
            MediatorsService mediatorsService,
            DatastoreService datastoreService,
            DatastoreConstants datastoreConstants) {
        this.mediatorsService = mediatorsService;

        // Initialize workflow engine from datastore
        try {
            Datastore WESystemConfigurationsDatastore = datastoreService.getDatastoreByNamespaceAndKey(
                    datastoreConstants.ConfigurationsNamespace,
                    datastoreConstants.DefaultWorkflowEngineConfigurationDatastoreKey);

            if (WESystemConfigurationsDatastore != null) {
                Map<String, Object> WESystemConfigurations = WESystemConfigurationsDatastore.getValue();

                if (WESystemConfigurations != null && WESystemConfigurations.containsKey("active")) {
                    shouldUseWorkflowEngine = Boolean.parseBoolean(
                            WESystemConfigurations.get("active").toString());

                    if (shouldUseWorkflowEngine && WESystemConfigurations.containsKey("code")) {
                        String mediatorCode = WESystemConfigurations.get("code").toString();
                        workflowEngine = mediatorsService.getMediatorByCode(mediatorCode);
                        log.info("Workflow engine initialized with mediator: {}", mediatorCode);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to initialize workflow engine: {}", e.getMessage());
            shouldUseWorkflowEngine = false;
        }
    }

    /**
     * Get all facilities with their complete configuration
     */
    public Map<String, Object> getFacilities(Integer page, Integer pageSize, String search) throws Exception {
        log.info("Fetching facilities - page: {}, pageSize: {}, search: {}", page, pageSize, search);

        if (!shouldUseWorkflowEngine || workflowEngine == null) {
            throw new Exception("Workflow engine not configured. Cannot fetch facilities.");
        }

        StringBuilder queryString = new StringBuilder(String.format("page=%d&pageSize=%d",
                page != null ? page : 1,
                pageSize != null ? pageSize : 50));

  
        if (search != null && !search.trim().isEmpty()) {
            String searchTerm = search.trim();
            queryString.append("&filter=name:ilike:").append(searchTerm);
            queryString.append("&filter=code:ilike:").append(searchTerm);
            queryString.append("&rootJoin=OR");
        }

        Map<String, Object> integrationResponse = mediatorsService.routeToMediator(
                workflowEngine,
                "systems?" + queryString.toString(),
                "GET",
                null);

        List<SystemDTO> systems = new ArrayList<>();
        if (integrationResponse.containsKey("systems")) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> systemMaps = (List<Map<String, Object>>) integrationResponse.get("systems");
            for (Map<String, Object> systemMap : systemMaps) {
                systems.add(SystemDTO.fromMap(systemMap));
            }
        } else if (integrationResponse.containsKey("error")) {
            throw new Exception("Failed to fetch facilities: " + integrationResponse.get("error"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("facilities", systems);
        response.put("pager", createPager(page, pageSize, systems.size()));

        return response;
    }

    /**
     * Get a specific facility with complete configuration
     */
    public FacilityResponseDTO getFacilityById(String id) throws Exception {
        log.info("Fetching facility details for id: {}", id);

        if (!shouldUseWorkflowEngine || workflowEngine == null) {
            throw new Exception("Workflow engine not configured. Cannot fetch facility.");
        }

        Map<String, Object> integrationResponse = mediatorsService.routeToMediator(
                workflowEngine,
                "systems/" + id,
                "GET",
                null);

        SystemDTO system = null;
        // TODO: Handle response structure properly based on actual response
        if (integrationResponse.containsKey("id")) {
            system = SystemDTO.fromMap((Map<String, Object>) integrationResponse);
        } else if (integrationResponse.containsKey("error")) {
            throw new Exception("Failed to fetch facility: " + integrationResponse.get("error"));
        }

        if (system == null) {
            throw new Exception("Facility with id " + id + " not found");
        }

        Mediator mediator = null;
        try {
            mediator = mediatorsService.getMediatorByCode(system.getCode());
        } catch (Exception e) {
            log.info("No mediator configured for facility: {}", system.getCode());
        }

        return FacilityResponseDTO.from(system, mediator);
    }

    /**
     * Get a specific facility by code
     */
    // public FacilityResponseDTO getFacilityByCode(String code) throws Exception {
    // log.info("Fetching facility details for code: {}", code);
    //
    // if (!shouldUseWorkflowEngine || workflowEngine == null) {
    // throw new Exception("Workflow engine not configured. Cannot fetch
    // facility.");
    // }
    //
    // Map<String, Object> integrationResponse = mediatorsService.routeToMediator(
    // workflowEngine,
    // "systems/" + code,
    // "GET",
    // null);
    //
    // SystemDTO system = null;
    // if (integrationResponse.containsKey("system")) {
    // @SuppressWarnings("unchecked")
    // Map<String, Object> systemMap = (Map<String, Object>)
    // integrationResponse.get("system");
    // system = SystemDTO.fromMap(systemMap);
    // } else if (integrationResponse.containsKey("error")) {
    // throw new Exception("Failed to fetch facility: " +
    // integrationResponse.get("error"));
    // }
    //
    // if (system == null) {
    // throw new Exception("Facility with code " + code + " not found");
    // }
    //
    // Mediator mediator = null;
    // try {
    // mediator = mediatorsService.getMediatorByCode(code);
    // } catch (Exception e) {
    // log.info("No mediator configured for facility: {}", code);
    // }
    //
    // return FacilityResponseDTO.from(system, mediator);
    // }

    /**
     * Register a new facility with optional mediator configuration
     */
    @Transactional
    public FacilityResponseDTO registerFacility(FacilityRegistrationDTO registrationDTO) throws Exception {
        log.info("Registering new facility: {}", registrationDTO.getCode());

        if (!shouldUseWorkflowEngine || workflowEngine == null) {
            throw new Exception("Workflow engine not configured. Cannot register facility.");
        }

        Map<String, Object> systemPayload = new HashMap<>();
        systemPayload.put("code", registrationDTO.getCode());
        systemPayload.put("name", registrationDTO.getName());
        if (registrationDTO.getType() != null) {
            systemPayload.put("type", registrationDTO.getType());
        }
        if (registrationDTO.getOwnership() != null) {
            systemPayload.put("ownership", registrationDTO.getOwnership());
        }
        if (registrationDTO.getRegion() != null) {
            systemPayload.put("region", registrationDTO.getRegion());
        }
        if (registrationDTO.getDistrict() != null) {
            systemPayload.put("district", registrationDTO.getDistrict());
        }
        if (registrationDTO.getStatus() != null) {
            systemPayload.put("status", registrationDTO.getStatus());
        }
        if (registrationDTO.getParams() != null) {
            systemPayload.put("params", registrationDTO.getParams());
        }
        systemPayload.put("allowed", registrationDTO.getAllowed() != null ? registrationDTO.getAllowed() : true);

        Map<String, Object> integrationResponse = mediatorsService.routeToMediator(
                workflowEngine,
                "systems",
                "POST",
                systemPayload);

        SystemDTO createdSystem = null;
        // TODO: Add a proper check here based on actual response structure
        if (integrationResponse.containsKey("created")) {
            createdSystem = SystemDTO.fromMap((Map<String, Object>) integrationResponse);
            log.info("Created system in integrations: {}", createdSystem.getId());
        } else if (integrationResponse.containsKey("error")) {
            throw new Exception("Failed to create facility: " + integrationResponse.get("error"));
        }

        if (createdSystem == null) {
            throw new Exception("Failed to create facility - no response from integrations");
        }

        Mediator createdMediator = null;
        if (registrationDTO.hasMediatorConfig()) {
            try {
                MediatorDTO mediatorDTO = registrationDTO.toMediatorDTO();
                createdMediator = mediatorsService.saveMediatorConfigs(
                        new Mediator().fromMap(mediatorDTO));
                log.info("Created mediator for facility: {}", registrationDTO.getCode());

                // Update mediatorConfigured flag in integrations using the system ID
                Map<String, Object> updateFlag = new HashMap<>();
                updateFlag.put("mediatorConfigured", true);
                mediatorsService.routeToMediator(
                        workflowEngine,
                        "systems/" + createdSystem.getId(),
                        "PUT",
                        updateFlag);
                log.info("Updated mediatorConfigured flag for system: {}", createdSystem.getId());
            } catch (Exception e) {
                log.error("Failed to create mediator for facility {}: {}",
                        registrationDTO.getCode(), e.getMessage());
            }
        }

        return FacilityResponseDTO.from(createdSystem, createdMediator);
    }

    /**
     * Update facility access (whitelist/blacklist)
     */
    public FacilityResponseDTO updateFacilityAccess(String id, Boolean allowed) throws Exception {
        log.info("Updating facility access - id: {}, allowed: {}", id, allowed);

        if (!shouldUseWorkflowEngine || workflowEngine == null) {
            throw new Exception("Workflow engine not configured. Cannot update facility access.");
        }

        Map<String, Object> updatePayload = new HashMap<>();
        updatePayload.put("allowed", allowed);

        Map<String, Object> integrationResponse = mediatorsService.routeToMediator(
                workflowEngine,
                "systems/" + id,
                "PUT",
                updatePayload);

        SystemDTO updatedSystem = null;
        if (integrationResponse.containsKey("updated")) {
            updatedSystem = SystemDTO.fromMap((Map<String, Object>) integrationResponse);
        } else if (integrationResponse.containsKey("error")) {
            throw new Exception("Failed to update facility access: " + integrationResponse.get("error"));
        }

        if (updatedSystem == null) {
            throw new Exception("Failed to update facility access - no response from integrations");
        }

        return FacilityResponseDTO.from(updatedSystem, null);
    }

    /**
     * Configure or update mediator for a facility
     */
    @Transactional
    public FacilityResponseDTO configureFacilityMediator(String id, MediatorDTO mediatorConfig)
            throws Exception {
        log.info("Configuring mediator for facility with id: {}", id);

        // First get the facility by ID to obtain the code
        FacilityResponseDTO existingFacility = getFacilityById(id);
        if (existingFacility == null) {
            throw new Exception("Facility with id " + id + " not found");
        }

        String code = existingFacility.getCode();

        Mediator existingMediator = null;
        try {
            existingMediator = mediatorsService.getMediatorByCode(code);
        } catch (Exception e) {
            // No existing mediator
        }

        Mediator mediator;
        if (existingMediator != null) {
            existingMediator.setBaseUrl(mediatorConfig.getBaseUrl());
            existingMediator.setPath(mediatorConfig.getPath());
            existingMediator.setAuthType(mediatorConfig.getAuthType());
            existingMediator.setAuthToken(mediatorConfig.getAuthToken());
            if (mediatorConfig.getCategory() != null) {
                existingMediator.setCategory(mediatorConfig.getCategory());
            }
            if (mediatorConfig.getApis() != null) {
                existingMediator.setApis(mediatorConfig.getApis());
            }
            mediator = mediatorsService.updateMediator(existingMediator);
            log.info("Updated mediator for facility: {}", code);
        } else {
            MediatorDTO mediatorDTO = new MediatorDTO();
            mediatorDTO.setCode(code);
            mediatorDTO.setBaseUrl(mediatorConfig.getBaseUrl());
            mediatorDTO.setPath(mediatorConfig.getPath());
            mediatorDTO.setAuthType(mediatorConfig.getAuthType());
            mediatorDTO.setAuthToken(mediatorConfig.getAuthToken());
            mediatorDTO.setCategory(mediatorConfig.getCategory());
            mediatorDTO.setApis(mediatorConfig.getApis());

            mediator = mediatorsService.saveMediatorConfigs(new Mediator().fromMap(mediatorDTO));
            log.info("Created mediator for facility: {}", code);

            // Update mediatorConfigured flag in integrations using ID
            Map<String, Object> updateFlag = new HashMap<>();
            updateFlag.put("mediatorConfigured", true);
            mediatorsService.routeToMediator(
                    workflowEngine,
                    "systems/" + id,
                    "PUT",
                    updateFlag);
        }

        SystemDTO system = new SystemDTO();
        system.setId(existingFacility.getId());
        system.setCode(existingFacility.getCode());
        system.setName(existingFacility.getName());
        system.setAllowed(existingFacility.getAllowed());
        system.setParams(existingFacility.getParams());
        system.setCreated(existingFacility.getCreated());
        system.setUpdated(existingFacility.getUpdated());
        system.setMediatorConfigured(true);

        return FacilityResponseDTO.from(system, mediator);
    }

    /**
     * Delete a facility
     */
    @Transactional
    public void deleteFacility(String id) throws Exception {
        log.info("Deleting facility with id: {}", id);

        if (!shouldUseWorkflowEngine || workflowEngine == null) {
            throw new Exception("Workflow engine not configured. Cannot delete facility.");
        }

        SystemDTO system = fetchSystemById(id);
        String code = system.getCode();

        try {
            Mediator mediator = mediatorsService.getMediatorByCode(code);
            if (mediator != null) {
                mediatorsService.deleteMediator(mediator.getUuid());
                log.info("Deleted mediator for facility: {}", code);
            }
        } catch (Exception e) {
            log.warn("No mediator to delete for facility: {}", code);
        }

        Map<String, Object> integrationResponse = mediatorsService.routeToMediator(
                workflowEngine,
                "systems/" + id,
                "DELETE",
                null);

        if (integrationResponse.containsKey("error")) {
            throw new Exception("Failed to delete facility: " + integrationResponse.get("error"));
        }

        log.info("Deleted facility from integrations: {}", id);
    }

    /**
     * Helper method to fetch system by ID
     */
    private SystemDTO fetchSystemById(String id) throws Exception {
        Map<String, Object> integrationResponse = mediatorsService.routeToMediator(
                workflowEngine,
                "systems/" + id,
                "GET",
                null);

        // TODO: Add a proper check here based on actual response structure
        if (integrationResponse.containsKey("id")) {
            return SystemDTO.fromMap((Map<String, Object>) integrationResponse);
        } else if (integrationResponse.containsKey("error")) {
            throw new Exception("Failed to fetch facility: " + integrationResponse.get("error"));
        }

        throw new Exception("Failed to fetch facility - no response from integrations");
    }

    /**
     * Create pager information for response
     */
    private Map<String, Object> createPager(Integer page, Integer pageSize, int totalResults) {
        Map<String, Object> pager = new HashMap<>();
        pager.put("page", page != null ? page : 1);
        pager.put("pageSize", pageSize != null ? pageSize : 50);
        pager.put("total", totalResults);
        return pager;
    }
}
