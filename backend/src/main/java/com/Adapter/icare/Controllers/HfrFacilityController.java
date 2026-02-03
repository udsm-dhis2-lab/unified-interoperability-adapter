package com.Adapter.icare.Controllers;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.DynamicValidator;
import com.Adapter.icare.Domains.HfrFacility;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Services.HfrFacilityService;
import com.Adapter.icare.Services.UserService;
import com.Adapter.icare.Services.ValidatorService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;
import java.util.zip.DataFormatException;

@RestController
@RequestMapping("/api/v1")
public class HfrFacilityController {

    private final HfrFacilityService hfrFacilityService;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;

    public HfrFacilityController(
            HfrFacilityService hfrFacilityService,
            UserService userService) {
     this.hfrFacilityService = hfrFacilityService;
     this.userService = userService;

        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService
                    .getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
        }

    }

    @GetMapping("hfr-facilities")
    public ResponseEntity<Map<String, Object>> getHfrFacilities(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "paging", defaultValue = "true") Boolean paging,
            @RequestParam(value = "search", required = false, defaultValue = "false") String search
    ) throws Exception {
        try {
            List<Map<String, Object>> hfrFacilitiesList = new ArrayList<>();
            Page<HfrFacility> hfrFacilityData = hfrFacilityService.getHfrFacilityListByPagination(page, pageSize, paging, search,
                    search, search, search, search);
            for (HfrFacility facility : hfrFacilityData.getContent()) {
                hfrFacilitiesList.add(facility.toMap());
            }
            Map<String, Object> returnObject = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages", hfrFacilityData.getTotalPages());
            pager.put("total", hfrFacilityData.getTotalElements());
            returnObject.put("pager", pager);
            returnObject.put("results", hfrFacilitiesList);
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("hfr-facility/{uuid}")
    public ResponseEntity<Map<String, Object>> getValidator(
            @PathVariable("uuid") String uuid) throws Exception {
        try {
            HfrFacility hfrFacility = hfrFacilityService.getHfrFacilityByUuid(uuid);
            if (hfrFacility != null) {
                return ResponseEntity.ok(hfrFacility.toMap());
            } else {
                throw new NoSuchElementException("Hfr Facility with uuid " + uuid + " does not exists");
            }
        } catch (NoSuchElementException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("error", "Failed to get HFR Facility");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e);
            error.put("message", "Failed to get HFR Facility");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("hfr-facility")
    public ResponseEntity<Map<String, Object>> addValidator(@Valid @RequestBody Map<String, Object> hfrFacilityDTO) {
        try {
            HfrFacility hfrFacilityObject = HfrFacility.fromMap(hfrFacilityDTO);
            if (this.authentication != null && this.authenticatedUser != null) {
                hfrFacilityObject.setCreatedBy(this.authenticatedUser);
            }
            HfrFacility createdFacility = hfrFacilityService.updateOrCreateHfrFacility(hfrFacilityObject);
            if (createdFacility == null){
                throw new Exception("Failed to save this facility information");
            }
            Map<String, Object> returnObject = new HashMap<>();
            returnObject.put("Status", 200);
            returnObject.put("Message", "Success");
            returnObject.put("FacilityCode", createdFacility.getFacIdNumber());
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("Message", "Failed");
            errorMap.put("Status", 400);

            System.out.println("ERROR SAVING HFR FACILITY: "+ e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMap);
        }
    }

    @PostMapping("hfr-synchronize")
    public ResponseEntity<Map<String, Object>> updateValidator(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "100") Integer pageSize
    ) {
        try {
            boolean  completeSync = this.hfrFacilityService.synchronizeHfrFacilities(page, pageSize);
            Map<String, Object> returnObject = new HashMap<>();
            if(completeSync){
                returnObject.put("status", 200);
                returnObject.put("message", "Synchronization completed successfully");
            } else {
                returnObject.put("status", 400);
                returnObject.put("message", "Failed to synchronize HFR Facility");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(returnObject);
            }
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            System.out.println("SYNC FALICITIES FAILED: "+ e);
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("error", "Failed to update validator");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
