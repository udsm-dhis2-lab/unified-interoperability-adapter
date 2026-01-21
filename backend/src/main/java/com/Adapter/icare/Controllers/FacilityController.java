package com.Adapter.icare.Controllers;

import com.Adapter.icare.Dtos.FacilityRegistrationDTO;
import com.Adapter.icare.Dtos.FacilityResponseDTO;
import com.Adapter.icare.Dtos.MediatorDTO;
import com.Adapter.icare.Services.FacilityManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller for managing facilities across integrations and backend systems
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/facilities")
@Tag(name = "Facility Management", description = "APIs for managing facilities, whitelisting, and mediator configuration")
public class FacilityController {

    private final FacilityManagementService facilityManagementService;

    public FacilityController(FacilityManagementService facilityManagementService) {
        this.facilityManagementService = facilityManagementService;
    }

    /**
     * Get all facilities with their configuration status
     */
    @GetMapping
    @Operation(summary = "Get all facilities", description = "Retrieve all facilities with their whitelist status and mediator configuration")
    public ResponseEntity<Map<String, Object>> getFacilities(
            @Parameter(description = "Page number (1-based)") @RequestParam(value = "page", defaultValue = "1") Integer page,
            @Parameter(description = "Number of items per page") @RequestParam(value = "pageSize", defaultValue = "50") Integer pageSize) {
        try {
            Map<String, Object> response = facilityManagementService.getFacilities(page, pageSize);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching facilities", e);
            Map<String, Object> error = createErrorResponse("Failed to fetch facilities", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get a specific facility by code
     */
    @GetMapping("/{code}")
    @Operation(summary = "Get facility by code", description = "Retrieve complete facility details including mediator configuration")
    public ResponseEntity<Map<String, Object>> getFacilityByCode(
            @Parameter(description = "Facility HFR code") @PathVariable String code) {
        try {
            FacilityResponseDTO facility = facilityManagementService.getFacilityByCode(code);
            return ResponseEntity.ok(facility.toMap());
        } catch (Exception e) {
            log.error("Error fetching facility: {}", code, e);
            Map<String, Object> error = createErrorResponse("Facility not found", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Register a new facility with optional mediator configuration
     */
    @PostMapping
    @Operation(summary = "Register new facility", description = "Create a new facility with optional mediator and referral configuration")
    public ResponseEntity<Map<String, Object>> registerFacility(
            @Valid @RequestBody FacilityRegistrationDTO registrationDTO) {
        try {
            log.info("Registering new facility: {}", registrationDTO.getCode());
            FacilityResponseDTO facility = facilityManagementService.registerFacility(registrationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(facility.toMap());
        } catch (Exception e) {
            log.error("Error registering facility: {}", registrationDTO.getCode(), e);
            Map<String, Object> error = createErrorResponse("Failed to register facility", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update facility access (whitelist/blacklist)
     */
    @PatchMapping("/{id}/access")
    @Operation(summary = "Update facility access", description = "Whitelist or blacklist a facility")
    public ResponseEntity<Map<String, Object>> updateFacilityAccess(
            @Parameter(description = "Facility ID (UUID)") @PathVariable String id,
            @Parameter(description = "Access allowed (true = whitelist, false = blacklist)") @RequestParam Boolean allowed) {
        try {
            if (allowed == null) {
                Map<String, Object> error = createErrorResponse("Invalid request", "'allowed' parameter is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            FacilityResponseDTO facility = facilityManagementService.updateFacilityAccess(id, allowed);
            return ResponseEntity.ok(facility.toMap());
        } catch (Exception e) {
            log.error("Error updating facility access: {}", id, e);
            Map<String, Object> error = createErrorResponse("Failed to update access", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Configure or update mediator for a facility
     */
    @PostMapping("/{code}/mediator")
    @Operation(summary = "Configure facility mediator", description = "Configure or update mediator settings for a facility")
    public ResponseEntity<Map<String, Object>> configureFacilityMediator(
            @Parameter(description = "Facility HFR code") @PathVariable String code,
            @Valid @RequestBody MediatorDTO mediatorConfig) {
        try {
            FacilityResponseDTO facility = facilityManagementService.configureFacilityMediator(code, mediatorConfig);
            return ResponseEntity.ok(facility.toMap());
        } catch (Exception e) {
            log.error("Error configuring mediator for facility: {}", code, e);
            Map<String, Object> error = createErrorResponse("Failed to configure mediator", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update mediator configuration for a facility (PUT method)
     */
    @PutMapping("/{code}/mediator")
    @Operation(summary = "Update facility mediator", description = "Update mediator settings for a facility")
    public ResponseEntity<Map<String, Object>> updateFacilityMediator(
            @Parameter(description = "Facility HFR code") @PathVariable String code,
            @Valid @RequestBody MediatorDTO mediatorConfig) {
        try {
            FacilityResponseDTO facility = facilityManagementService.configureFacilityMediator(code, mediatorConfig);
            return ResponseEntity.ok(facility.toMap());
        } catch (Exception e) {
            log.error("Error updating mediator for facility: {}", code, e);
            Map<String, Object> error = createErrorResponse("Failed to update mediator", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Delete a facility and its mediator configuration
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete facility", description = "Delete a facility and its mediator configuration")
    public ResponseEntity<Map<String, Object>> deleteFacility(
            @Parameter(description = "Facility ID (UUID)") @PathVariable String id) {
        try {
            facilityManagementService.deleteFacility(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Facility deleted successfully");
            response.put("id", id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error deleting facility: {}", id, e);
            Map<String, Object> error = createErrorResponse("Failed to delete facility", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Create a standardized error response
     */
    private Map<String, Object> createErrorResponse(String message, String details) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", "error");
        error.put("message", message);
        error.put("details", details);
        error.put("timestamp", System.currentTimeMillis());
        return error;
    }
}
