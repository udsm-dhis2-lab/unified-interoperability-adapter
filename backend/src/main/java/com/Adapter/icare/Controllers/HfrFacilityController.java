package com.Adapter.icare.Controllers;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.HfrFacility;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.SystemDTO;
import com.Adapter.icare.Services.FacilityManagementService;
import com.Adapter.icare.Services.HfrFacilityService;
import com.Adapter.icare.Services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@RestController
@RequestMapping("/api/v1")
public class HfrFacilityController {

    private final HfrFacilityService hfrFacilityService;
    private final FacilityManagementService facilityManagementService;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;

    public HfrFacilityController(
            HfrFacilityService hfrFacilityService,
            FacilityManagementService facilityManagementService,
            UserService userService) {
     this.hfrFacilityService = hfrFacilityService;
     this.facilityManagementService = facilityManagementService;
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
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "region", required = false) String region,
            @RequestParam(value = "district", required = false) String district,
            @RequestParam(value = "council", required = false) String council
    ) throws Exception {
        try {
            List<Map<String, Object>> hfrFacilitiesList = new ArrayList<>();
            Page<HfrFacility> hfrFacilityData = hfrFacilityService.getHfrFacilityListByPagination(page, pageSize, paging, code,
                    name, region, district, council, "Operating");
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
    public ResponseEntity<Map<String, Object>> getHfrFacility(
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
    public ResponseEntity<Map<String, Object>> addHfrFacility(@Valid @RequestBody Map<String, Object> hfrFacilityDTO) {
        try {
            HfrFacility hfrFacilityObject = HfrFacility.fromMap(hfrFacilityDTO);
            HfrFacility createdFacility = hfrFacilityService.updateOrCreateHfrFacility(hfrFacilityObject);
            if (createdFacility == null){
                throw new Exception("Failed to save this facility information");
            }


           this.facilityManagementService.updateFacilityNameAndAccessAsync(createdFacility);

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
            @RequestParam(value = "pageSize", defaultValue = "100") Integer pageSize,
            @RequestParam(value = "forceSync", required = false) Boolean forceSync
    ) {
        try {
            forceSync = forceSync != null && forceSync;
            boolean  completeSync = this.hfrFacilityService.synchronizeHfrFacilities(page, pageSize, forceSync);
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
            System.out.println("SYNC FACILITIES FAILED: "+ e);
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
