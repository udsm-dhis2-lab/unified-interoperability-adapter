package com.Adapter.icare.ClientRegistry.Controllers;

import ca.uhn.fhir.rest.api.MethodOutcome;
import com.Adapter.icare.ClientRegistry.Services.ClientRegistryService;
import com.Adapter.icare.Constants.ClientRegistryConstants;
import com.Adapter.icare.Constants.DatastoreConstants;
import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Dtos.MergeClients;
import com.Adapter.icare.Services.DatastoreService;
import com.Adapter.icare.Services.MediatorsService;
import org.hl7.fhir.r4.model.Address;
import org.hl7.fhir.r4.model.HumanName;
import org.hl7.fhir.r4.model.Identifier;
import org.hl7.fhir.r4.model.Patient;
import org.hl7.fhir.r4.model.codesystems.AdministrativeGender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

// SWAGGER
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/hduApi/cr/clients")
public class ClientRegistryController {
    private final ClientRegistryService clientRegistryService;
    private final DatastoreService datastoreService;
    private final MediatorsService mediatorsService;
    private final boolean shouldUseWorkflowEngine;
    private final String defaultWorkflowEngineCode;
    private final Mediator workflowEngine;
    private final DatastoreConstants datastoreConstants;
    private final ClientRegistryConstants clientRegistryConstants;

    public ClientRegistryController(ClientRegistryService clientRegistryService,
                                    DatastoreService datastoreService,
                                    MediatorsService mediatorsService,
                                    DatastoreConstants datastoreConstants,
                                    ClientRegistryConstants clientRegistryConstants) throws Exception {
        this.clientRegistryService = clientRegistryService;
        this.datastoreService = datastoreService;
        this.mediatorsService = mediatorsService;
        this.datastoreConstants = datastoreConstants;
        this.clientRegistryConstants = clientRegistryConstants;
        Datastore WESystemConfigurations = datastoreService.getDatastoreByNamespaceAndKey(
                datastoreConstants.ConfigurationsNamespace,
                datastoreConstants.DefaultWorkflowEngineConfigurationDatastoreKey);
        if (WESystemConfigurations != null) {
            this.shouldUseWorkflowEngine = Boolean.valueOf(WESystemConfigurations.getValue().get("status").toString());
            this.defaultWorkflowEngineCode = WESystemConfigurations.getValue().get("code").toString();
            this.workflowEngine = mediatorsService.getMediatorByCode(defaultWorkflowEngineCode);
        } else {
            this.shouldUseWorkflowEngine = false;
            this.defaultWorkflowEngineCode = null;
            this.workflowEngine = null;
        }
    }

    @GetMapping("generateIdentifiers")
    public ResponseEntity<List<Map<String, Object>>> generateClientIdentifiers(
            @RequestParam(value = "limit", defaultValue = "1") int limit
    ) throws Exception {
        try {
            String regex = clientRegistryConstants.ClientRegistryIdentifierRegex;
            if (Boolean.valueOf(clientRegistryConstants.GenerateClientIdentifier)) {
                List<Map<String,Object>> identifierPayload = new ArrayList<>();
                for(int count= 0; count < limit; count++) {
                    // TODO: Add logic for generating ids using the provided pattern
                }
                return ResponseEntity.ok(identifierPayload);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping()
    public ResponseEntity<Map<String, Object>> getPatients(
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(value = "status", defaultValue = "true") String status,
            @RequestParam( value = "identifier", required = false) String identifier,
            @RequestParam( value = "identifierType", required = false) String identifierType,
            @RequestParam( value = "gender", required = false) String gender,
            @RequestParam( value = "firstName", required = false) String firstName,
            @RequestParam( value = "middleName", required = false) String middleName,
            @RequestParam( value = "lastName", required = false) String lastName,
            @RequestParam( value = "dateOfBirth", required = false) Date dateOfBirth
    ) throws Exception {
        // TODO: Add support to use configured default workflow engine
        try {
            Map<String, Object> patientDataResponse = new HashMap<>();
            List<Map<String, Object>> patients = clientRegistryService.getPatients(
                    page,
                    pageSize,
                    status,
                    identifier,
                    identifierType,
                    gender,
                    firstName,
                    middleName,
                    lastName,
                    dateOfBirth);
            patientDataResponse.put("results", patients);
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            // TODO: Use query parameter to identify if there is need to get total (For addressing performance issue)
            pager.put("total", clientRegistryService.getTotalPatients());
            patientDataResponse.put("pager", pager);
            return ResponseEntity.ok(patientDataResponse);
        }   catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> saveClient(@RequestBody Map<String, Object> client) throws Exception {
        // TODO: This is just placeholder. Add support to save patient.
        Map<String, Object> patientDataResponse = new HashMap<>();
        try {
            return ResponseEntity.ok(patientDataResponse);
        }   catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "merge",consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> mergePatients(
            @RequestBody MergeClients clientsToMerge
    ) throws Exception {
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

            patientToKeep.setBirthDate(patientToKeep.getBirthDate() != null ? patientToKeep.getBirthDate() : patientToDeActivate.getBirthDate());

            Patient mergedPatient = clientRegistryService.savePatient(patientToKeep);
            MethodOutcome clientUpdateOutcome = clientRegistryService.markPatientAsInActive(mergedPatient);
            mergeResponse.put("mergedClient", mergedPatient);
            mergeResponse.put("deActivatedClient", patientToDeActivate);

            return ResponseEntity.ok(mergeResponse);
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
