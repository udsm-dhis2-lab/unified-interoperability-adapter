package com.Adapter.icare.SharedHealthRecords.Controllers;

import com.Adapter.icare.ClientRegistry.Services.ClientRegistryService;
import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Constants.ClientRegistryConstants;
import com.Adapter.icare.Constants.DatastoreConstants;
import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.DataTemplateDataDTO;
import com.Adapter.icare.Dtos.FacilityDetailsDTO;
import com.Adapter.icare.Dtos.IdentifierDTO;
import com.Adapter.icare.Services.DatastoreService;
import com.Adapter.icare.Services.MediatorsService;
import com.Adapter.icare.Services.UserService;
import com.Adapter.icare.Dtos.SharedHealthRecordsDTO;
import com.Adapter.icare.SharedHealthRecords.Services.SharedHealthRecordsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping("/api/v1/hduApi/shr")
public class SharedHealthRecordsController {
    private final SharedHealthRecordsService sharedHealthRecordsService;
    private final DatastoreConstants datastoreConstants;
    private final ClientRegistryConstants clientRegistryConstants;
    private final Authentication authentication;
    private final UserService userService;
    private final User authenticatedUser;
    private Map<String,Object> mandatoryClientRegistryIdTypes;
    private DatastoreService datastoreService;
    private final ClientRegistryService clientRegistryService;
    private final MediatorsService mediatorsService;
    private boolean shouldUseWorkflowEngine = false;
    private String defaultWorkflowEngineCode = null;
    private Mediator workflowEngine = null;

    public SharedHealthRecordsController(
            DatastoreConstants datastoreConstants,
            ClientRegistryConstants clientRegistryConstants,
            UserService userService,
            SharedHealthRecordsService sharedHealthRecordsService,
            DatastoreService datastoreService,
            ClientRegistryService clientRegistryService,
            MediatorsService mediatorsService) throws Exception {
        this.sharedHealthRecordsService = sharedHealthRecordsService;
        this.datastoreConstants = datastoreConstants;
        this.clientRegistryConstants = clientRegistryConstants;
        this.userService = userService;
        this.datastoreService = datastoreService;
        this.clientRegistryService = clientRegistryService;
        this.mediatorsService = mediatorsService;
        try {
            Datastore configs = this.datastoreService.getDatastoreByNamespaceAndKey(datastoreConstants.ConfigurationsNamespace, datastoreConstants.MandatoryClientRegistryIdTypes);
            if (configs!= null) {
                this.mandatoryClientRegistryIdTypes = configs.getValue();
            } else {
                this.mandatoryClientRegistryIdTypes = null;
            }

            Datastore WESystemConfigurations = datastoreService.getDatastoreByNamespaceAndKey(datastoreConstants.ConfigurationsNamespace,
                    datastoreConstants.DefaultWorkflowEngineConfigurationDatastoreKey);
            if (WESystemConfigurations != null) {
                Map<String, Object> weSystemConfigValue = WESystemConfigurations.getValue();
                if (weSystemConfigValue != null) {
                    this.shouldUseWorkflowEngine = weSystemConfigValue.get("active") != null ? Boolean.parseBoolean(weSystemConfigValue.get("active").toString()): false;

                    this.defaultWorkflowEngineCode = weSystemConfigValue.get("code") != null ? weSystemConfigValue.get("code").toString(): null;

                    if (this.defaultWorkflowEngineCode != null) {
                        this.workflowEngine = mediatorsService.getMediatorByCode(this.defaultWorkflowEngineCode);
                    } else {
                        this.workflowEngine = null;
                    }
                } else {
                    this.shouldUseWorkflowEngine = false;
                    this.defaultWorkflowEngineCode = null;
                    this.workflowEngine = null;
                }
            } else {
                this.shouldUseWorkflowEngine = false;
                this.defaultWorkflowEngineCode = null;
                this.workflowEngine = null;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService.getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
    }

    @GetMapping("/sharedRecords")
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
            Map<String,Object> sharedRecordsResponse = this.sharedHealthRecordsService.getSharedRecordsWithPagination(
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
            return ResponseEntity.ok(sharedRecordsResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "/sharedRecords", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<String> addSharedRecords(@RequestBody SharedHealthRecordsDTO sharedRecordsPayload) throws Exception {
        try {
            Map <String,Object> payload = new HashMap<>();
            DataTemplateDataDTO dataTemplateDataDTO = new DataTemplateDataDTO();
            dataTemplateDataDTO.setClientIdentifiersPool(null);
            FacilityDetailsDTO facilityDetailsDTO = sharedRecordsPayload.getFacilityDetails();
            List<SharedHealthRecordsDTO> listGrid =  new ArrayList<>();
            listGrid.add(sharedRecordsPayload);
            dataTemplateDataDTO.setListGrid(listGrid);
            dataTemplateDataDTO.setFacilityDetails(facilityDetailsDTO);
            dataTemplateDataDTO.setReportDetails(sharedRecordsPayload.getReportDetails());
            List<IdentifierDTO> clientIds = this.clientRegistryService.getClientRegistryIdentifiers(1);
            dataTemplateDataDTO.setClientIdentifiersPool(clientIds);
            payload.put("code","dataTemplates");
            payload.put("payload", dataTemplateDataDTO);
            return ResponseEntity.ok(this.mediatorsService.processWorkflowInAWorkflowEngine(this.workflowEngine, payload, "processes/execute?async=true"));
        } catch (Exception e) {
            e.printStackTrace();
            Map<String,Object> response = new HashMap<>();
            response.put("message",e.getMessage());
            response.put("statusCode",HttpStatus.BAD_REQUEST.value());
            response.put("reason",HttpStatus.BAD_REQUEST.getReasonPhrase());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response.toString());
        }
    }

}
