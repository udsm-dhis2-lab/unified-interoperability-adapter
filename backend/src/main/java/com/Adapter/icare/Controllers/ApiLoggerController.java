package com.Adapter.icare.Controllers;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.DynamicValidator;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Services.ApiLoggerService;
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
public class ApiLoggerController {

    private final ApiLoggerService apiLoggerService;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;

    public ApiLoggerController(
            ApiLoggerService apiLoggerService,
            UserService userService) {
     this.apiLoggerService = apiLoggerService;
     this.userService = userService;

        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService
                    .getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
        }

    }

    @PutMapping("update-referral-transaction")
    public ResponseEntity<Map<String, Object>> updateApiLogger(
            @Valid @RequestBody Map<String, Object> referralDetails
    ) {
        try {
            String referringFacilityCode = referralDetails.containsKey("referringFacilityCode") ? (String) referralDetails.get("referringFacilityCode") : null;
            String referredFacilityCode = referralDetails.containsKey("referredFacilityCode") ? (String) referralDetails.get("referredFacilityCode") : null;
            String referralNumber = referralDetails.containsKey("referralNumber") ? (String) referralDetails.get("referralNumber") : null;
            Integer statusCode = referralDetails.containsKey("statusCode") ? (Integer) referralDetails.get("statusCode") : null;
            var updatedLogger = this.apiLoggerService.updateApiLoggerByReferralDetails(referringFacilityCode,  referredFacilityCode, referralNumber, statusCode);
            if (updatedLogger != null) {
                return ResponseEntity.status(HttpStatus.OK).body(updatedLogger.toMap());
            }
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("message", "No transaction was not found!");
            errorMap.put("error", "Failed to update api transaction.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMap);
        } catch (Exception e) {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("message", e.getMessage());
            errorMap.put("error", "Failed to update api transaction.");

            System.out.println("ERROR UPDATING API TRANSACTION: "+ e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMap);
        }
    }

}
