package com.Adapter.icare.ClientRegistry.Controllers;

import ca.uhn.fhir.rest.api.MethodOutcome;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.Adapter.icare.ClientRegistry.Domains.ClientRegistryIdPool;
import com.Adapter.icare.ClientRegistry.Dtos.ClientRegistryIdDTO;
import com.Adapter.icare.ClientRegistry.Services.ClientRegistryService;
import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Constants.ClientRegistryConstants;
import com.Adapter.icare.Constants.DatastoreConstants;
import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.*;
import com.Adapter.icare.Services.DatastoreService;
import com.Adapter.icare.Services.MediatorsService;
import com.Adapter.icare.Services.UserService;
import org.hl7.fhir.r4.model.Address;
import org.hl7.fhir.r4.model.HumanName;
import org.hl7.fhir.r4.model.Identifier;
import org.hl7.fhir.r4.model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

// SWAGGER
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/v1/hduApi/cr")
@Tag(name = "Client Registry", description = "APIs for managing client registry")
public class ClientRegistryController {
    private final ClientRegistryService clientRegistryService;
    private final DatastoreService datastoreService;
    private final MediatorsService mediatorsService;
    private final boolean shouldUseWorkflowEngine;
    private final String defaultWorkflowEngineCode;
    private final Mediator workflowEngine;
    private final DatastoreConstants datastoreConstants;
    private final ClientRegistryConstants clientRegistryConstants;
    private final Authentication authentication;
    private final UserService userService;
    private final User authenticatedUser; // Add this field declaration

    @Autowired
    public ClientRegistryController(ClientRegistryService clientRegistryService,
            DatastoreService datastoreService,
            MediatorsService mediatorsService,
            DatastoreConstants datastoreConstants,
            ClientRegistryConstants clientRegistryConstants,
            UserService userService) throws Exception {
        this.clientRegistryService = clientRegistryService;
        this.datastoreService = datastoreService;
        this.mediatorsService = mediatorsService;
        this.userService = userService;
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService
                    .getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
        this.datastoreConstants = datastoreConstants;
        this.clientRegistryConstants = clientRegistryConstants;
        Datastore WESystemConfigurations = datastoreService.getDatastoreByNamespaceAndKey(
                datastoreConstants.ConfigurationsNamespace,
                datastoreConstants.DefaultWorkflowEngineConfigurationDatastoreKey);
        if (WESystemConfigurations != null) {
            Map<String, Object> weSystemConfigValue = WESystemConfigurations.getValue();
            if (weSystemConfigValue != null) {
                String activeConfig = weSystemConfigValue.get("active") != null
                        ? weSystemConfigValue.get("active").toString()
                        : null;
                this.shouldUseWorkflowEngine = weSystemConfigValue.get("active") != null
                        ? Boolean.parseBoolean(weSystemConfigValue.get("active").toString())
                        : false;

                this.defaultWorkflowEngineCode = weSystemConfigValue.get("code") != null
                        ? weSystemConfigValue.get("code").toString()
                        : null;

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
    }

    @PostMapping(value = "/generateIdentifiers", consumes = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> generateClientRegistryIdentifiers(
            @Valid @RequestBody ClientRegistryIdDTO clientRegistryIdDTO) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (clientRegistryIdDTO.getLimit() > 0) {
                boolean hasGenerated = clientRegistryService.generateClientRegistryIdentifiers(
                        clientRegistryIdDTO.getStart(),
                        clientRegistryIdDTO.getLimit(),
                        clientRegistryConstants.ClientRegistryIdentifierRegex);
                response.put("message", "Ids have been generated into the pool");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "limit not valid");
                response.put("statusCode", HttpStatus.EXPECTATION_FAILED.value());
                return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "activateIdentifiers", consumes = APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> activateIdentifiers(
            @Valid @RequestBody List<String> identifiers) {
        try {
            List idsActivated = clientRegistryService.activateIdentifiers(identifiers);
            return ResponseEntity.ok(idsActivated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/identifiersPool/count")
    public Integer countOfIdentifiers(
            @RequestParam(value = "category", required = false) ClientRegistryIdPool.IdSearchCategory idSearchCategory)
            throws Exception {
        try {
            return clientRegistryService.getCountOfIdentifiersBySearchCategory(idSearchCategory);
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }

    @GetMapping("/clients")
    public ResponseEntity<Map<String, Object>> getPatients(
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(value = "status", defaultValue = "true") String status,
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "idType", required = false) String idType,
            @RequestParam(value = "hfrCode", required = false) String hfrCode,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "middleName", required = false) String middleName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "dateOfBirth", required = false) Date dateOfBirth,
            @RequestParam(value = "onlyLinkedClients", required = false) Boolean onlyLinkedClients) throws Exception {
        // TODO: Add support to use configured default workflow engine

        try {
            Map<String, Object> patientDataResponse = clientRegistryService.getPatientsWithPagination(
                    page,
                    pageSize,
                    status,
                    id,
                    idType,
                    hfrCode,
                    gender,
                    firstName,
                    middleName,
                    lastName,
                    dateOfBirth,
                    onlyLinkedClients);
            return ResponseEntity.ok(patientDataResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "/clients", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> saveClient(@Valid @RequestBody ClientRegistrationDTO client)
            throws Exception {
        Map<String, Object> patientDataResponse = new HashMap<>();
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("code", "dataTemplates");
            SharedHealthRecordsDTO sharedHealthRecordsDTO = new SharedHealthRecordsDTO();
            sharedHealthRecordsDTO.setDemographicDetails(client.getDemographicDetails());
            sharedHealthRecordsDTO.setFacilityDetails(client.getFacilityDetails());
            DataTemplateDataDTO dataTemplateDataDTO = new DataTemplateDataDTO();
            dataTemplateDataDTO.setReportDetails(null);
            dataTemplateDataDTO.setFacilityDetails(client.getFacilityDetails());
            List<SharedHealthRecordsDTO> listGrid = new ArrayList<>();
            listGrid.add(sharedHealthRecordsDTO);
            dataTemplateDataDTO.setListGrid(listGrid);
            List<IdentifierDTO> clientIds = this.clientRegistryService.getClientRegistryIdentifiers(1);
            dataTemplateDataDTO.setClientIdentifiersPool(clientIds);
            payload.put("payload", dataTemplateDataDTO);
            return ResponseEntity.ok(this.mediatorsService.processWorkflowInAWorkflowEngine(workflowEngine, payload,
                    "processes/execute?async=true"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "/clients/potentialDuplicates", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getPotentialDuplicates(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "key", required = false) String key) throws Exception {
        // TODO: Replace with FHIR implementation
        try {
            Map<String, Object> patientDataResponse = new HashMap<>();
            List<DemographicDetailsDTO> patients = clientRegistryService.getPatients(
                    page,
                    pageSize,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    true);
            patientDataResponse.put("results", patients);
            Map<String, Object> pager = new HashMap<>();
            pager.put("total", patients.size());
            pager.put("totalPages", null);
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            // TODO: Use query parameter to identify if there is need to get total (For
            // addressing performance issue)
            pager.put("total", clientRegistryService.getTotalPatients());
            patientDataResponse.put("pager", pager);
            return ResponseEntity.ok(patientDataResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "/clients/merge", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> mergePatients(
            @Valid @RequestBody ClientsToMergeDTO clientsToMerge) {
        try {
            Map<String, Object> mergeResponse = new HashMap<>();
            // Get patients
            Patient patientToKeep = clientRegistryService.getPatientByIdentifier(clientsToMerge.getClientOne());
            Patient patientToDeActivate = clientRegistryService.getPatientByIdentifier(clientsToMerge.getClientTwo());

            // Merge identifiers
            List<Identifier> mergedIdentifiers = new ArrayList<>(patientToKeep.getIdentifier());
            mergedIdentifiers.addAll(patientToDeActivate.getIdentifier().stream()
                    .filter(id2 -> !mergedIdentifiers.contains(id2))
                    .collect(Collectors.toList()));
            patientToKeep.setIdentifier(mergedIdentifiers);

            // Merge names
            List<HumanName> mergedNames = new ArrayList<>(patientToKeep.getName());
            mergedNames.addAll(patientToDeActivate.getName().stream()
                    .filter(name2 -> !mergedNames.contains(name2))
                    .collect(Collectors.toList()));
            patientToKeep.setName(mergedNames);

            // Merge addresses
            List<Address> mergedAddresses = new ArrayList<>(patientToKeep.getAddress());
            mergedAddresses.addAll(patientToDeActivate.getAddress().stream()
                    .filter(address2 -> !mergedAddresses.contains(address2))
                    .collect(Collectors.toList()));
            patientToKeep.setAddress(mergedAddresses);

            if (patientToKeep.getGender() != null) {
                patientToKeep.setGender(patientToKeep.getGender());
            } else {
                patientToKeep.setGender(patientToDeActivate.getGender());
            }

            patientToKeep.setBirthDate(patientToKeep.getBirthDate() != null ? patientToKeep.getBirthDate()
                    : patientToDeActivate.getBirthDate());

            Patient mergedPatient = clientRegistryService.savePatientToFHIR(patientToKeep);
            MethodOutcome clientUpdateOutcome = clientRegistryService.markPatientAsInActive(mergedPatient);
            mergeResponse.put("mergedClient", mergedPatient);
            mergeResponse.put("deActivatedClient", patientToDeActivate);

            return ResponseEntity.ok(mergeResponse);
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping(value = "/clientsWithNoIdentifier")
    public ResponseEntity<Map<String, Object>> deleteClientsWithNoIdentifiers() throws Exception {
        try {
            return ResponseEntity.ok(this.clientRegistryService.deleteClientsWithNoIdentifiers());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "/clients/metaData")
    public ResponseEntity<Map<String, Object>> getClientsMetaData() throws Exception {
        try {
            String namespace = datastoreConstants.ResourcesMetadataNamespace;
            String key = datastoreConstants.ClientsMetadataKey;
            Datastore datastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, key);
            return ResponseEntity.ok(datastore.getValue());
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }

    @PostMapping(value = "/identifyPotentialDuplicates")
    public ResponseEntity<Map<String, Object>> identifyPotentialDuplicates(
            @RequestBody Map<String, Object> parameters) throws Exception {
        Map<String, Object> response = new HashMap<>();
        try {
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }
}
