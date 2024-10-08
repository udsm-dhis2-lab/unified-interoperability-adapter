package com.Adapter.icare.SharedHealthRecords.Controllers;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Constants.ClientRegistryConstants;
import com.Adapter.icare.Constants.DatastoreConstants;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController("/api/v1/hduApi/shr/sharedRecords")
public class SharedHealthRecordsController {
    private final DatastoreConstants datastoreConstants;
    private final ClientRegistryConstants clientRegistryConstants;
    private final Authentication authentication;
    private final UserService userService;
    private final User authenticatedUser;

    public SharedHealthRecordsController(
            DatastoreConstants datastoreConstants,
            ClientRegistryConstants clientRegistryConstants,
            UserService userService) {
        this.datastoreConstants = datastoreConstants;
        this.clientRegistryConstants = clientRegistryConstants;
        this.userService = userService;
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService.getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSharedRecords (
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize
    ) throws Exception {
        try {
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
