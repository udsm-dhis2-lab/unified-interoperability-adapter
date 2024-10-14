package com.Adapter.icare.SharedHealthRecords.Controllers;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Constants.ClientRegistryConstants;
import com.Adapter.icare.Constants.DatastoreConstants;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Services.UserService;
import com.Adapter.icare.Dtos.SharedHealthRecordsDTO;
import com.Adapter.icare.SharedHealthRecords.Services.SharedHealthRecordsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/hduApi/shr/sharedRecords")
public class SharedHealthRecordsController {
    private final SharedHealthRecordsService sharedHealthRecordsService;
    private final DatastoreConstants datastoreConstants;
    private final ClientRegistryConstants clientRegistryConstants;
    private final Authentication authentication;
    private final UserService userService;
    private final User authenticatedUser;

    public SharedHealthRecordsController(
            DatastoreConstants datastoreConstants,
            ClientRegistryConstants clientRegistryConstants,
            UserService userService,
            SharedHealthRecordsService sharedHealthRecordsService) {
        this.sharedHealthRecordsService = sharedHealthRecordsService;
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
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam( value = "id", required = false) String id,
            @RequestParam( value = "idType", required = false) String idType,
            @RequestParam( value = "onlyLinkedClients", required = false) boolean onlyLinkedClients,
            @RequestParam( value = "gender", required = false) String gender,
            @RequestParam( value = "firstName", required = false) String firstName,
            @RequestParam( value = "middleName", required = false) String middleName,
            @RequestParam( value = "lastName", required = false) String lastName,
            @RequestParam( value = "hfrCode", required = false) String hfrCode,
            @RequestParam( value = "includeDeceased", defaultValue = "false") boolean includeDeceased,
            @RequestParam( value = "numberOfVisits", defaultValue = "1") Integer numberOfVisits
    ) throws Exception {
        try {
            Map<String,Object> sharedRecordsResponse = new HashMap<>();
            List<Map<String,Object>> sharedRecords = this.sharedHealthRecordsService.getSharedRecords(
                    page,
                    pageSize,
                    id,
                    idType,
                    onlyLinkedClients,
                    gender,
                    firstName,
                    middleName,
                    lastName,
                    hfrCode,
                    includeDeceased,
                    numberOfVisits);
            sharedRecordsResponse.put("results", sharedRecords);
            Map<String, Object> pager = new HashMap<>();
            pager.put("total", null);
            pager.put("totalPages", null);
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            sharedRecordsResponse.put("pager",pager);
            return ResponseEntity.ok(sharedRecordsResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping()
    public ResponseEntity<Map<String,Object>> addSharedRecords(@RequestBody SharedHealthRecordsDTO sharedRecordsPayload) throws Exception {
        try {
            return ResponseEntity.ok(sharedHealthRecordsService.processSharedRecords(sharedRecordsPayload));
        } catch (Exception e) {
            System.err.println(e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

}
