package com.Adapter.icare.Controllers;

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
import com.google.common.collect.Maps;
import org.hl7.fhir.r4.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping("/api/v1/hduApi")
public class HDUAPIController {

    private final DatastoreService datastoreService;
    private final MediatorsService mediatorsService;
    private final boolean shouldUseWorkflowEngine;
    private final String defaultWorkflowEngineCode;
    private final Mediator workflowEngine;
    private final DatastoreConstants datastoreConstants;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;
    private final ClientRegistryService clientRegistryService;
    private final ClientRegistryConstants clientRegistryConstants;

    public  HDUAPIController(DatastoreService datastoreService,
                             MediatorsService mediatorsService,
                             DatastoreConstants datastoreConstants,
                             UserService userService,
                             ClientRegistryService clientRegistryService,
                             ClientRegistryConstants clientRegistryConstants) throws Exception {
        this.datastoreService = datastoreService;
        this.mediatorsService = mediatorsService;
        this.datastoreConstants = datastoreConstants;
        this.clientRegistryService = clientRegistryService;
        this.userService = userService;
        this.clientRegistryConstants = clientRegistryConstants;
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService.getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
        Datastore WESystemConfigurations = datastoreService.getDatastoreByNamespaceAndKey(datastoreConstants.ConfigurationsNamespace, datastoreConstants.DefaultWorkflowEngineConfigurationDatastoreKey);
        if (WESystemConfigurations != null) {
            Map<String, Object> weSystemConfigValue = WESystemConfigurations.getValue();
            if (weSystemConfigValue != null) {
                Object activeConfig = weSystemConfigValue.get("active");
                this.shouldUseWorkflowEngine = activeConfig != null && activeConfig instanceof Boolean ? (Boolean) activeConfig : false;

                Object codeConfig = weSystemConfigValue.get("code");
                this.defaultWorkflowEngineCode = codeConfig != null ? codeConfig.toString() : null;

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


    @GetMapping("dataTemplates")
    public ResponseEntity<Map<String, Object>> getDataTemplatesList (@RequestParam(value = "id", required = false) String id,
                                                                     @RequestParam(value = "uuid", required = false) String uuid) throws Exception {
        // NB: Since data templates are JSON type metadata stored on datastore, then dataTemplates namespace has been used to retrieve the configs
//        System.out.println(this.authentication.isAuthenticated());
        try {
            Map<String, Object> dataTemplatesResults = new HashMap<>();
            if (uuid == null) {
                List<Datastore> dataTemplateNameSpaceDetails = datastoreService.getDatastoreNamespaceDetails("dataTemplates");
                List<Map<String, Object>> dataTemplates = new ArrayList<>();
                for(Datastore datastore: dataTemplateNameSpaceDetails) {
                    Map<String, Object> dataTemplate = datastore.getValue();
                    if (id != null) {
                        if ( ((Map<String, Object>) dataTemplate.get("templateDetails")).get("id").equals(id)) {
                            dataTemplate.put("uuid", datastore.getUuid());
                            dataTemplates.add(dataTemplate);
                        }
                    } else {
                        dataTemplate.put("uuid", datastore.getUuid());
                        dataTemplates.add(dataTemplate);
                    }
                }
                if (id != null) {
                    if (!dataTemplates.isEmpty()) {
                        dataTemplatesResults =dataTemplates.get(0);
                    }
                } else {
                    dataTemplatesResults.put("results", dataTemplates);
                }
            } else {
                Datastore datastore = datastoreService.getDatastoreByUuid(uuid);
                Map<String, Object> dataTemplate = datastore.getValue();
                dataTemplate.put("uuid", datastore.getUuid());
                dataTemplatesResults = dataTemplate;
            }

            return  ResponseEntity.ok(dataTemplatesResults);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("dataTemplates/examples")
    public ResponseEntity<Map<String, Object>> getDataTemplatesExamples (
            @RequestParam(value = "id", required = false) String id) throws Exception {
        // NB: Since data templates are JSON type metadata stored on datastore, then dataTemplates namespace has been used to retrieve the configs
        try {
            List<Datastore> dataTemplateNameSpaceDetails = datastoreService.getDatastoreNamespaceDetails("dataTemplatesExamples");
            Map<String, Object> dataTemplatesExampleObject = new HashMap<>();
            List<Map<String, Object>> dataTemplatesExamples = new ArrayList<>();
            for(Datastore datastore: dataTemplateNameSpaceDetails) {
                Map<String, Object> dataTemplateExample = datastore.getValue();
                if (id != null) {
                    if ( datastore.getDataKey().equals(id)) {
                        dataTemplateExample.put("uuid", datastore.getUuid());
                        dataTemplatesExamples.add(dataTemplateExample);
                    }
                } else {
                    dataTemplateExample.put("uuid", datastore.getUuid());
                    dataTemplatesExamples.add(dataTemplateExample);
                }
            }
            if (id != null) {
                if (!dataTemplatesExamples.isEmpty()) {
                    dataTemplatesExampleObject =dataTemplatesExamples.get(0);
                }
            } else {
                dataTemplatesExampleObject.put("results", dataTemplatesExamples);
            }
            return ResponseEntity.ok(dataTemplatesExampleObject);
        }catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping(value = "dataTemplates/metaData", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String,Object>> getDataTemplatesMetaData() throws Exception {
        try {
            String namespace = datastoreConstants.ResourcesMetadataNamespace;
            String key = datastoreConstants.DataTemplateMetadataKey;
            Datastore datastore =datastoreService.getDatastoreByNamespaceAndKey(namespace,key);
            return ResponseEntity.ok(datastore.getValue());
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }

    @PostMapping(value = "dataTemplates", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String,Object>> passDataToMediator(@RequestBody DataTemplateDTO dataTemplate) throws Exception {
        /**
         * Send data to Mediator where all the logics will be done.
         */
        Map<String,Object> response = new HashMap<>();
       try {
           if (shouldUseWorkflowEngine && workflowEngine != null) {
               Map<String, Object> payload = new HashMap<>();
               payload.put("code","dataTemplates");
               List<IdentifierDTO> clientIds = new ArrayList<>();
               clientIds = clientRegistryService.getClientRegistryIdentifiers(dataTemplate.getData().getListGrid().size());
               List<Map<String,Object>> recordsWithIssues = new ArrayList<>();
               if (clientRegistryConstants.ValidateDataTemplate) {
                   // validate data Template
                   DataTemplateDataDTO validatedDataTemplate = new DataTemplateDataDTO();
                   List<SharedHealthRecordsDTO> listGrid = dataTemplate.getData().getListGrid();
                   List<SharedHealthRecordsDTO> validatedListGrid = dataTemplate.getData().getListGrid();
                   for (SharedHealthRecordsDTO sharedHealthRecordsDTO: listGrid) {
                       DemographicDetailsDTO demographicDetails = sharedHealthRecordsDTO.getDemographicDetails();
                       String mrn = sharedHealthRecordsDTO.getMrn();
                       // Check if mandatory identifier types are there or the CR ID
                       List<IdentifierDTO> identifiers = demographicDetails != null ? demographicDetails.getIdentifiers(): null;
                       Patient patient = new Patient();
                       if (identifiers != null && !identifiers.isEmpty()) {
                           for (IdentifierDTO identifier: identifiers) {
                               patient = this.clientRegistryService.getPatientUsingIdentifier(identifier.getId());
                               if (patient != null) {
                                   DemographicDetailsDTO demographicDetailsDTO = sharedHealthRecordsDTO.getDemographicDetails();
                                   demographicDetailsDTO.setId(patient.getId());
                                   SharedHealthRecordsDTO newSharedRecord = sharedHealthRecordsDTO;
                                   newSharedRecord.setDemographicDetails(demographicDetailsDTO);
                                   validatedListGrid.add(newSharedRecord);
                                   break;
                               }
                           }
                       } else if (mrn != null) {
                           patient = this.clientRegistryService.getPatientUsingIdentifier(mrn);
                           if (patient == null) {
                               Map<String,Object> recordWithIssue = new HashMap<>();
                               Map<String,Object> patientDetails = new HashMap<>();
                               VisitDetailsDTO visitDetails = sharedHealthRecordsDTO.getVisitDetails();
                               recordWithIssue.put("patientDetails", sharedHealthRecordsDTO.getDemographicDetails());
                               recordWithIssue.put("visitDetails", visitDetails);
                               recordWithIssue.put("issue", "No enough details for registering the client and saving associated records");
                               recordsWithIssues.add(recordWithIssue);
                           } else {
                               DemographicDetailsDTO demographicDetailsDTO = sharedHealthRecordsDTO.getDemographicDetails();
                               demographicDetailsDTO.setId(patient.getId());
                               SharedHealthRecordsDTO newSharedRecord = sharedHealthRecordsDTO;
                               newSharedRecord.setDemographicDetails(demographicDetailsDTO);
                               validatedListGrid.add(newSharedRecord);
                           }
                       } else {
                           Map<String,Object> recordWithIssue = new HashMap<>();
                           Map<String,Object> patientDetails = new HashMap<>();
                           VisitDetailsDTO visitDetails = sharedHealthRecordsDTO.getVisitDetails();
                           recordWithIssue.put("patientDetails", sharedHealthRecordsDTO.getDemographicDetails());
                           recordWithIssue.put("visitDetails", visitDetails);
                           recordWithIssue.put("issue", "No enough details for registering the client and saving associated records");
                           recordsWithIssues.add(recordWithIssue);
                       }
                   }
                   validatedDataTemplate.setListGrid(validatedListGrid);
                   validatedDataTemplate.setFacilityDetails(dataTemplate.getData().getFacilityDetails());
                   validatedDataTemplate.setReportDetails(dataTemplate.getData().getReportDetails());
                   validatedDataTemplate.setClientIdentifiersPool(clientIds);
                   payload.put("payload",validatedDataTemplate);
               } else {
                   DataTemplateDataDTO updatedDataTemplateData = dataTemplate.getData();
                   updatedDataTemplateData.setClientIdentifiersPool(clientIds);
                   payload.put("payload", updatedDataTemplateData);
               }
               response.put("response",mediatorsService.processWorkflowInAWorkflowEngine(workflowEngine, payload, "processes/execute?async=true"));
               response.put("recordsWithIssues", recordsWithIssues);
               return ResponseEntity.ok(response);
           } else if (!shouldUseWorkflowEngine) {
               // TODO: Review send data to mediator (OpenFN)
               response.put("response", mediatorsService.sendDataToMediatorWorkflow(dataTemplate.toMap()));
               return ResponseEntity.ok(response);
           } else {
               // TODO: handle warning appropriately
               return null;
           }
       } catch (Exception e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
       }
    }

    @DeleteMapping("datastore/{uuid}")
    public Map<String, Object> deleteDatastore(@PathVariable("uuid") String uuid) throws Exception {
        try {
            Datastore datastore = datastoreService.getDatastoreByUuid(uuid);
            Map<String, Object> returnObj = new HashMap<>();
            returnObj.put("uuid", uuid);
            returnObj.put("dataKey", datastore.getDataKey());
            returnObj.put("namespace", datastore.getNamespace());
            returnObj.put("message", "Successful deleted");
            datastoreService.deleteDatastore(uuid);
            return returnObj;
        } catch (Exception e) {
            throw new Exception("Issue with deleting");
        }
    }

    @GetMapping("generalCodes")
    public ResponseEntity<Map<String, Object>> getGeneralCodes(@RequestParam(value="namespace",required = false) String namespace,
                                               @RequestParam(value="key",required = false) String key,
                                               @RequestParam(value="code",required = false) String code,
                                               @RequestParam(value="version",required = false) String version,
                                               @RequestParam(value="q",required = false) String q,
                                               @RequestParam(value = "page", defaultValue = "1") Integer page,
                                               @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreMatchingParams(namespace, key, version, null, q, code, page,pageSize, "GENERAL-CODES");
            for (Datastore datastore: pagedDatastoreData.getContent()) {
                Map<String, Object> generalCodeDetails = datastore.getValue();
                generalCodeDetails.put("namespace", datastore.getNamespace());
                generalCodeDetails.put("key", datastore.getDataKey());
                namespaceDetails.add(generalCodeDetails);
            }
            Map<String, Object> returnObject =  new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages",pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            returnObject.put("pager",pager);
            returnObject.put("results", namespaceDetails);
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("generalCodes/{namespace}")
    public ResponseEntity<Map<String, Object>> getSpecificCodedItems(@PathVariable("namespace") String namespace,
                                               @RequestParam(value="code", required = false) String code,
                                               @RequestParam(value="q",required = false) String q,
                                               @RequestParam(value = "page", required = true, defaultValue = "1") Integer page,
                                               @RequestParam(value = "pageSize", required = true, defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreNamespaceDetailsByPagination(namespace, null, null, q, code, null, page,pageSize);
            for (Datastore datastore: pagedDatastoreData.getContent()) {
                namespaceDetails.add(datastore.getValue());
            }
            Map<String, Object> returnObject =  new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages",pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            returnObject.put("pager",pager);
            returnObject.put("results", namespaceDetails);
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "configurations", consumes = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> addConfigurations(@RequestBody DatastoreConfigurationsDTO configurations) throws Exception {
        try {
            String namespace = datastoreConstants.ConfigurationsNamespace;
            Map<String, Object> returnObject = new HashMap<>();
            String key = "";
            if (configurations.getKey() == null && configurations.getValue().get("key").toString() == null) {
                throw new Exception("code or key is missing on your request");
            } else {
                if (configurations.getKey() != null) {
                    key = configurations.getKey();
                } else {
                    key = configurations.getValue().get("code").toString();
                }
                Datastore datastore = new Datastore();
                datastore.setValue(configurations.getValue());
                datastore.setNamespace(namespace);
                datastore.setDataKey(key);
                if (configurations.getGroup() != null) {
                    datastore.setDatastoreGroup(configurations.getGroup());
                }
                Datastore response = datastoreService.saveDatastore(datastore);
                returnObject = response.toMap();
            }
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "configurations/{uuid}", consumes = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> updateConfigurations(@RequestBody DatastoreConfigurationsDTO configurations,
                                                                    @PathVariable(value = "uuid") String uuid) throws Exception {
        try {
            Datastore existingConfigs = datastoreService.getDatastoreByUuid(uuid);
            if (existingConfigs != null && existingConfigs.getNamespace() .equals(datastoreConstants.ConfigurationsNamespace)) {
                String namespace = datastoreConstants.ConfigurationsNamespace;
                Map<String, Object> returnObject = new HashMap<>();
                String key = "";
                if (configurations.getKey() == null && configurations.getValue().get("key").toString() == null) {
                    throw new Exception("code or key is missing on your request");
                } else {
                    if (configurations.getKey() != null) {
                        key = configurations.getKey();
                    } else {
                        key = configurations.getValue().get("code").toString();
                    }
                    existingConfigs.setValue(configurations.getValue());
                    existingConfigs.setNamespace(namespace);
                    existingConfigs.setDataKey(key);
                    if (configurations.getGroup() != null) {
                        existingConfigs.setDatastoreGroup(configurations.getGroup());
                    }
                    Datastore response = datastoreService.updateDatastore(existingConfigs);
                    returnObject = response.toMap();
                }
                return ResponseEntity.ok(returnObject);
            } else {
                Map<String,Object> response = new HashMap<>();
                response.put("message","Configurations with uuid " + uuid + " does not exists");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "configurations/{uuid}", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getConfigurations(@PathVariable(value = "uuid") String uuid) throws Exception {
        Map<String,Object> response = new HashMap<>();
        try {
            Datastore configurations = datastoreService.getDatastoreByUuid(uuid);
            if (configurations != null) {
                return ResponseEntity.ok(configurations.toMap());
            } else {
                response.put("message","Configurations with uuid " + uuid + " does not exists");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @GetMapping(value = "configurations", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getConfigurations(
            @RequestParam(value="q",required = false) String q,
            @RequestParam(value="group",required = false) String group,
            @RequestParam(value = "page", required = true, defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", required = true, defaultValue = "10") Integer pageSize
    ) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            String namespace = datastoreConstants.ConfigurationsNamespace;
            Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreNamespaceDetailsByPagination(
                    namespace, null, null, q, null, group, page,pageSize);
            for (Datastore datastore: pagedDatastoreData.getContent()) {
                Map<String, Object> configuration = datastore.getValue();
                configuration.put("key", datastore.getDataKey());
                configuration.put("uuid", datastore.getUuid());
                configuration.put("group", datastore.getDatastoreGroup());
                namespaceDetails.add(configuration);
            }
            Map<String, Object> returnObject =  new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages",pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            returnObject.put("pager",pager);
            returnObject.put("results", namespaceDetails);
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping(value = "configurations/{uuid}")
    public ResponseEntity<Map<String,Object>> deleteConfigurations(@PathVariable(value = "uuid") String uuid) throws Exception {
        Map<String,Object> response = new HashMap<>();
        try {
            if (datastoreService.getDatastoreByUuid(uuid) != null) {
                datastoreService.deleteDatastore(uuid);
                response.put("message", "Configurations with uuid " + uuid + " has successfully been deleted");
                return ResponseEntity.ok(response);
            } else {
                response.put("message","Configurations with uuid " + uuid + " does not exists");
                ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
        return null;
    }

    @GetMapping(value = "workflows")
    public ResponseEntity<String> getWorkflows() throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "workflows","GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "workflows/{id}")
    public ResponseEntity<String> getWorkflowById(
            @PathVariable(value = "id") String id
    ) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "workflows/" + id,"GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "workflows")
    public ResponseEntity<String> addWorkflow(@RequestBody Map<String, Object> workflow) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "workflows", "POST", workflow));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "workflows/{id}")
    public ResponseEntity<String> updateWorkflow(
            @RequestBody Map<String, Object> workflow,
            @PathVariable(value = "id") String id) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "workflows/" + id, "PUT", workflow));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping(value = "workflows/{id}")
    public ResponseEntity<String> deleteWorkflowById(
            @PathVariable(value = "id") String id
    ) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "workflows/" + id,"DELETE", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "processes")
    public ResponseEntity<String> getProcesses() throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "processes","GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "processes/{id}")
    public ResponseEntity<String> getProcessById(
            @PathVariable(value = "id") String id
    ) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "processes/" + id,"GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "processes")
    public ResponseEntity<String> addProcess(@RequestBody Map<String, Object> process) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "processes", "POST", process));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "processes/{id}")
    public ResponseEntity<String> updateProcess(
            @RequestBody Map<String, Object> process,
            @PathVariable(value = "id") String id) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "processes/" + id, "PUT", process));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping(value = "processes/{id}")
    public ResponseEntity<String> deleteProcessById(
            @PathVariable(value = "id") String id
    ) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "processes/" + id,"DELETE", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "schedules")
    public ResponseEntity<String> getSchedules() throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "schedules","GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "schedules/{id}")
    public ResponseEntity<String> getScheduleById(
            @PathVariable(value = "id") String id
    ) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "schedules/" + id,"GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "schedules")
    public ResponseEntity<String> addSchedule(@RequestBody Map<String, Object> schedule) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "schedules", "POST", schedule));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "schedules/{id}")
    public ResponseEntity<String> addSchedule(
            @RequestBody Map<String, Object> schedule,
            @PathVariable(value = "id") String id) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "schedules/" + id, "PUT", schedule));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping(value = "schedules/{id}")
    public ResponseEntity<String> deleteScheduleById(
            @PathVariable(value = "id") String id
    ) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "schedules/" + id,"DELETE", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value="mappings", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String,Object>> getMappings(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "key", required = false) String key
    ) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            String namespaceFilter = datastoreConstants.MappingsNamespaceFilter;
            Page<Datastore> pagedDatastoreData =   datastoreService.getDatastoreMatchingNamespaceFilterByPagination(
                    namespaceFilter, key,q,code,page,pageSize);
            for (Datastore datastore: pagedDatastoreData.getContent()) {
                Map<String,Object> mapping = new HashMap<>();
                mapping.put("uuid", datastore.getUuid());
                mapping.put("dataKey", datastore.getDataKey());
                mapping.put("namespace", datastore.getNamespace());
                mapping.put("group", datastore.getDatastoreGroup());
                mapping.put("description", datastore.getDescription());
                mapping.put("mapping", datastore.getValue());
                namespaceDetails.add(mapping);
            }
            Map<String, Object> response = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages",pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            response.put("pager",pager);
            response.put("results", namespaceDetails);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "mappings/{uuid}")
    public ResponseEntity<Map<String,Object>> getMappingsByUuid(@PathVariable(value = "uuid") String uuid) throws Exception {
        try {
            Map<String,Object> response = new HashMap<>();
            Datastore datastore = datastoreService.getDatastoreByUuid(uuid);
            response.put("uuid", datastore.getUuid());
            response.put("dataKey", datastore.getDataKey());
            response.put("namespace", datastore.getNamespace());
            response.put("group", datastore.getDatastoreGroup());
            response.put("description", datastore.getDescription());
            response.put("mapping", datastore.getValue());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping(value = "mappings/{uuid}")
    public ResponseEntity<Map<String,Object>> deleteMappings(@PathVariable(value="uuid") String uuid) throws Exception {
        try {
            Datastore mappingsToUpdate = datastoreService.getDatastoreByUuid(uuid);
            Map<String,Object> response = new HashMap<>();
            if (mappingsToUpdate != null) {
                datastoreService.deleteDatastore(uuid);
                response.put("message","Mapping with uuid " + uuid +" has been deleted");
                return ResponseEntity.ok(response);
            } else {
                response.put("message","Mapping with uuid " + uuid + " does not exists");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "mappings/{uuid}")
    public ResponseEntity<Map<String,Object>> updateMappingsByUuid(
            @PathVariable(value = "uuid") String uuid,
            @RequestBody Datastore datastore) throws Exception {
        try {
            Datastore mappingsToUpdate = datastoreService.getDatastoreByUuid(uuid);
            if (mappingsToUpdate != null) {
                mappingsToUpdate.setValue(datastore.getValue());
                if (authenticatedUser != null) {
                    mappingsToUpdate.setLastUpdatedBy(authenticatedUser);
                }
                return ResponseEntity.ok(datastoreService.updateDatastore(mappingsToUpdate).toMap());
            } else {
                Map<String,Object> response  = new HashMap<>();
                response.put("message","Mapping with uuid " + uuid + " does not exists");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "mappings")
    public ResponseEntity<Map<String,Object>> addMappings(
            @RequestBody MappingsDTO mappings) throws Exception {
        try {
            Datastore datastore = new Datastore();
            datastore.setNamespace(mappings.getNamespace());
            datastore.setDataKey(mappings.getDataKey());
            datastore.setDatastoreGroup(mappings.getGroup());
            datastore.setValue(mappings.getMapping());
            datastore.setDescription(mappings.getDescription());
            return ResponseEntity.ok(datastoreService.saveDatastore(datastore).toMap());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // CUSTOM implementation for supporting HDU API temporarily
    @GetMapping(value="codeSystems", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getDatastoreByNamespace(@RequestParam(value="q",required = false) String q,
                                                       @RequestParam(value="code",required = false) String code,
                                                       @RequestParam(value = "page", required = true, defaultValue = "1") Integer page,
                                                       @RequestParam(value = "pageSize", required = true, defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            String namespace = "codeSystems";
            Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreNamespaceDetailsByPagination(namespace, null, null, q, code, null, page,pageSize);
            for (Datastore datastore: pagedDatastoreData.getContent()) {
                namespaceDetails.add(datastore.getValue());
            }
            Map<String, Object> returnObject =  new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages",pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            returnObject.put("pager",pager);
            returnObject.put("results", namespaceDetails);
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value="codeSystems/icd", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getICDCodeSystemData(@RequestParam(value = "version", required = false) String version,
                                                                    @RequestParam(value = "release", required = false) String release,
                                                                    @RequestParam(value = "chapter", required = false) String chapter,
                                                                    @RequestParam(value = "block", required = false) String block,
                                                                    @RequestParam(value = "category", required = false) String category,
                                                                    @RequestParam(value = "code", required = false) String code,
                                                                    @RequestParam(value = "q", required = false) String q,
                                                                    @RequestParam(value="page", required = true, defaultValue = "1") Integer page,
                                                                    @RequestParam(value="pageSize", required = true, defaultValue = "10") Integer pageSize) throws Exception {
        Map<String, Object> returnDataObject = new HashMap<>();
        String namespace = null;
        String key = null;
        Page<Datastore> pagedDatastoreData = null;
        try {
            List<Map<String, Object>> chapters = new ArrayList<>();
            if (version == null && chapter == null && block == null && category == null && code == null) {
                // Load chapters data as per the version available for the year
                String chaptersNameSpace = "ICD-CHAPTERS";
                List<Datastore> chaptersDatastore = datastoreService.getDatastoreNamespaceDetails(chaptersNameSpace);
                for (Datastore datastore : chaptersDatastore) {
                    chapters.add(datastore.getValue());
                }
                namespace = "ICD";
                List<Datastore> icdData = datastoreService.getDatastoreNamespaceDetails(namespace);
                List<Map<String, Object>> results = new ArrayList<>();
                for(Datastore datastore: icdData) {
                    Map<String, Object> icd =  datastore.getValue();
                    // TODO: Add support to filter by available versions
                    icd.put("chapters", chapters);
                    results.add(icd);
                }
                // Load extended data
                returnDataObject.put("results", results);
            } else if (version!= null && chapter ==null && block ==null && category ==null && code == null) {
                namespace = "ICD-CHAPTERS";
                pagedDatastoreData =   datastoreService.getDatastoreMatchingParams(namespace,key,version,release,code,q,page,pageSize, null);
                Map<String, Object> pager = new HashMap<>();
                pager.put("page", page);
                pager.put("pageSize", pageSize);
                pager.put("totalPages",pagedDatastoreData.getTotalPages());
                pager.put("total", pagedDatastoreData.getTotalElements());
                List<Datastore> datastoreList = pagedDatastoreData.getContent();
                List<Map<String,Object>> itemsList = new ArrayList<>();
                for (Datastore datastore: datastoreList) {
                    itemsList.add(datastore.getValue());
                }
                returnDataObject.put("results", itemsList);
                returnDataObject.put("pager",pager);
            } else if (chapter != null && block ==null && category ==null && code == null) {
                namespace = "ICD-CHAPTERS";
                key = Objects.requireNonNullElse(version, "10").concat("-").concat(chapter);
                List<Map<String, Object>> blocks = new ArrayList<>();
                // TODO: Load specified chapter details, if found the load code blocks
                Datastore datastore = datastoreService.getDatastoreByNamespaceAndKey(namespace,key);
                if (datastore !=null) {
                    returnDataObject = datastore.getValue();
                    String blocksNamespace = "ICD-BLOCKS";
                    List<Datastore> blocksData =   datastoreService.getICDDataByChapter(blocksNamespace,chapter,release,version);
                    for (Datastore blockDatastore: blocksData) {
                        blocks.add(blockDatastore.getValue());
                    }
                    returnDataObject.put("blocks", blocks);
                }
            } else if (block != null && category ==null && code == null) {
                // TODO: Load specified block and respective categories
                namespace = "ICD-BLOCKS";
                List<Map<String, Object>> categories = new ArrayList<>();
                key = Objects.requireNonNullElse(version, "10").concat("-").concat(block);
                Datastore datastore = datastoreService.getDatastoreByNamespaceAndKey(namespace,key);
                if (datastore != null) {
                    returnDataObject = datastore.getValue();
                    String categoriesNamespace = "ICD-CATEGORIES";
                    List<Datastore> categoriesData =   datastoreService.getICDDataByBlock(categoriesNamespace,block,release,version);
                    for (Datastore categoryDatastore: categoriesData) {
                        categories.add(categoryDatastore.getValue());
                    }
                    returnDataObject.put("categories", categories);
                }
            } else if (category != null && code == null) {
                // TODO: Load specified block and respective categories
                namespace = "ICD-CATEGORIES";
                List<Map<String, Object>> codes = new ArrayList<>();
                key = Objects.requireNonNullElse(version, "10").concat("-").concat(category);
                Datastore datastore = datastoreService.getDatastoreByNamespaceAndKey(namespace,key);
                if (datastore != null) {
                    returnDataObject = datastore.getValue();
                    String codesNamespace = "ICD-CODES";
                    List<Datastore> codesData =   datastoreService.getICDDataByCategory(codesNamespace,category,release,version);
                    for (Datastore codesDatastore: codesData) {
                        codes.add(codesDatastore.getValue());
                    }
                    returnDataObject.put("codes", codes);
                }
            } else {
                key = Objects.requireNonNullElse(version, "10").concat("-").concat(code);
                Datastore datastore = datastoreService.getDatastoreByNamespaceAndKey(namespace,key);
                returnDataObject = datastore.getValue();
            }
            return ResponseEntity.ok(returnDataObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value="codeSystems/icd/codes", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getICDCodeSystemsCodes(@RequestParam(value = "version", required = false) String version,
                                                                    @RequestParam(value = "release", required = false) String release,
                                                                    @RequestParam(value = "chapter", required = false) String chapter,
                                                                    @RequestParam(value = "block", required = false) String block,
                                                                    @RequestParam(value = "category", required = false) String category,
                                                                    @RequestParam(value = "code", required = false) String code,
                                                                    @RequestParam(value = "q", required = false) String q,
                                                                    @RequestParam(value="page", defaultValue = "1") Integer page,
                                                                    @RequestParam(value="pageSize", defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            String namespace = "ICD-CODES";
            String key = null;
            Page<Datastore> pagedDatastoreData =   datastoreService.getDatastoreICDDataByParams(namespace,key,version,release, chapter, block, category,code,q,page,pageSize);
            for (Datastore datastore: pagedDatastoreData.getContent()) {
                namespaceDetails.add(datastore.getValue());
            }
            Map<String, Object> codesObject = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages",pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            codesObject.put("pager",pager);
            codesObject.put("results", namespaceDetails);
            return ResponseEntity.ok(codesObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value="codeSystems/icd/categories", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getICDCodeSystemsCategories(@RequestParam(value = "version", required = false) String version,
                                                                      @RequestParam(value = "release", required = false) String release,
                                                                      @RequestParam(value = "chapter", required = false) String chapter,
                                                                      @RequestParam(value = "block", required = false) String block,
                                                                      @RequestParam(value = "category", required = false) String category,
                                                                      @RequestParam(value = "code", required = false) String code,
                                                                      @RequestParam(value = "q", required = false) String q,
                                                                      @RequestParam(value="page", defaultValue = "1") Integer page,
                                                                      @RequestParam(value="pageSize", defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            String namespace = "ICD-CATEGORIES";
            String key = null;
            Page<Datastore> pagedDatastoreData =   datastoreService.getDatastoreICDDataByParams(namespace,key,version,release, chapter, block, category,code,q,page,pageSize);
            for (Datastore datastore: pagedDatastoreData.getContent()) {
                namespaceDetails.add(datastore.getValue());
            }
            Map<String, Object> dataObject = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages",pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            dataObject.put("pager",pager);
            dataObject.put("results", namespaceDetails);
            return ResponseEntity.ok(dataObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value="codeSystems/icd/blocks", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getICDCodeSystemsBlocks(@RequestParam(value = "version", required = false) String version,
                                                                           @RequestParam(value = "release", required = false) String release,
                                                                           @RequestParam(value = "chapter", required = false) String chapter,
                                                                           @RequestParam(value = "block", required = false) String block,
                                                                           @RequestParam(value = "category", required = false) String category,
                                                                           @RequestParam(value = "code", required = false) String code,
                                                                           @RequestParam(value = "q", required = false) String q,
                                                                           @RequestParam(value="page", required = true, defaultValue = "1") Integer page,
                                                                           @RequestParam(value="pageSize", required = true, defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            String namespace = "ICD-BLOCKS";
            String key = null;
            Page<Datastore> pagedDatastoreData =   datastoreService.getDatastoreICDDataByParams(namespace,key,version,release, chapter, block, category,code,q,page,pageSize);
            for (Datastore datastore: pagedDatastoreData.getContent()) {
                namespaceDetails.add(datastore.getValue());
            }
            Map<String, Object> dataObject = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages",pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            dataObject.put("pager",pager);
            dataObject.put("results", namespaceDetails);
            return ResponseEntity.ok(dataObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value="codeSystems/icd/chapters", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getICDCodeSystemsChapters(@RequestParam(value = "version", required = false) String version,
                                                                       @RequestParam(value = "release", required = false) String release,
                                                                       @RequestParam(value = "chapter", required = false) String chapter,
                                                                       @RequestParam(value = "block", required = false) String block,
                                                                       @RequestParam(value = "category", required = false) String category,
                                                                       @RequestParam(value = "code", required = false) String code,
                                                                       @RequestParam(value = "q", required = false) String q,
                                                                       @RequestParam(value="page", required = true, defaultValue = "1") Integer page,
                                                                       @RequestParam(value="pageSize", required = true, defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            String namespace = "ICD-CHAPTERS";
            String key = null;
            Page<Datastore> pagedDatastoreData =   datastoreService.getDatastoreICDDataByParams(namespace,key,version,release, chapter, block, category,code,q,page,pageSize);
            for (Datastore datastore: pagedDatastoreData.getContent()) {
                namespaceDetails.add(datastore.getValue());
            }
            Map<String, Object> dataObject = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages",pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            dataObject.put("pager",pager);
            dataObject.put("results", namespaceDetails);
            return ResponseEntity.ok(dataObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value="codeSystems/loinc", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getLOINCCodeSystemData(@RequestParam(value = "version", required = false) String version,
                                                                      @RequestParam(value = "release", required = false) String release,
                                                                      @RequestParam(value = "code", required = false) String code,
                                                                      @RequestParam(value = "q", required = false) String q,
                                                                      @RequestParam(value="page", required = true, defaultValue = "1") Integer page,
                                                                      @RequestParam(value="pageSize", required = true, defaultValue = "10") Integer pageSize) throws Exception {
        Map<String, Object> returnDataObject = new HashMap<>();
        String namespace = "LOINC";
        try {
            String key = null;
            List<Map<String, Object>> codes = new ArrayList<>();
            Page<Datastore> pagedDatastoreData =   datastoreService.getDatastoreMatchingParams(namespace,key,version,release,code,q,page,pageSize, null);
            List<Datastore> datastoreList = pagedDatastoreData.getContent();
            for (Datastore datastore: datastoreList) {
                codes.add(datastore.getValue());
            }
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages",pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            returnDataObject.put("results", codes);
            returnDataObject.put("pager",pager);
            return ResponseEntity.ok(returnDataObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "datastore", produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> saveDatastore(@RequestBody Datastore datastore, @RequestParam(value="update",required = false) Boolean update) throws Exception {
        String namespace = datastore.getNamespace();
        String dataKey = datastore.getDataKey();
        // Check if exists provided update is set to true
        try {
            if (update != null && update.equals(true)) {
                Datastore existingDatastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey);
                if (existingDatastore != null) {
                    existingDatastore.setValue(datastore.getValue());
                    return ResponseEntity.ok(datastoreService.updateDatastore(existingDatastore).toMap());
                } else {
                    return ResponseEntity.ok(datastoreService.saveDatastore(datastore).toMap());
                }
            } else {
                return ResponseEntity.ok(datastoreService.saveDatastore(datastore).toMap());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("clientsVisitsByNamespace/{namespace}")
    public ResponseEntity<List<Map<String,Object>>> getClientsVisitsDataByNamespace(@PathVariable("namespace") String namespace) throws Exception {
        try {
            List<Map<String, Object>> clientDetails = new ArrayList<>();
            for (Datastore datastore: datastoreService.getClientsVisitsDataByNameSpace(namespace)) {
                clientDetails.add(datastore.toMap());
            }
            return ResponseEntity.ok(clientDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("clientsVisitsByKey/{key}")
    public ResponseEntity<List<Map<String,Object>>> getClientsVisitsDataByKey(@PathVariable("key") String key) throws Exception {
        try {
            List<Map<String, Object>> clientDetails = new ArrayList<>();
            for (Datastore datastore: datastoreService.getClientsVisitsDataByKey(key)) {
                clientDetails.add(datastore.toMap());
            }
            return ResponseEntity.ok(clientDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("clientsVisits")
    public ResponseEntity<List<Map<String,Object>>> getClientsVisits(@RequestParam(value = "key") String key,
                                            @RequestParam(value = "ageType") String ageType,
                                            @RequestParam(value = "startAge") Integer startAge,
                                            @RequestParam(value = "endAge") Integer endAge,
                                            @RequestParam(value = "gender", required = false) String gender,
                                            @RequestParam(value = "diagnosis", required = false) String diagnosis) throws Exception {
        try {
            List<Map<String,Object>> mappedData = new ArrayList<>();
            for(Datastore datastore: datastoreService.getClientsVisits(key, ageType, startAge, endAge, gender, diagnosis)) {
                mappedData.add(datastore.toMap());
            }
            return ResponseEntity.ok(mappedData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "generateAggregateData",produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getAggregateVisits(@RequestBody Map<String, Object> requestParams) throws Exception {
        try {
            Map<String, Object> results = new HashMap<>();
            List<Map<String, Object>> data = new ArrayList<>();
            String pattern = "yyyy-MM-dd";
            Map<String, Object> mappings = (Map<String, Object>) requestParams.get("mappings");
            Map<String, Object> orgUnit = (Map<String, Object>) requestParams.get("orgUnit");
            String mappingsNamespace = mappings.get("namespace").toString();
            List<Datastore> storedToolMappings = datastoreService.getDatastoreNamespaceDetails(mappingsNamespace);
            SimpleDateFormat formatter = new SimpleDateFormat(pattern);
            for (Datastore storedToolMapping: storedToolMappings) {
                String mappingsKey = storedToolMapping.getDataKey();
                for(Map<String, Object> requestParam: (List<Map<String, Object>>) storedToolMapping.getValue().get("params")) {
                    Map<String, Object> dataValue = new HashMap<>();
                    List<Map<String, Object>> requestedData = List.of();
                    if (storedToolMapping.getValue().get("type").equals("diagnosisDetails")) {
                        requestedData = datastoreService.getAggregatedDataByDiagnosisDetails(
                                requestParams.get("startDate").toString(),
                                requestParams.get("endDate").toString(),
                                requestParam.get("ageType").toString(),
                                (Integer) requestParam.get("startAge"),
                                (Integer) requestParam.get("endAge"),
                                requestParam.get("gender").toString(),
                                mappingsNamespace,
                                mappingsKey,
                                orgUnit.get("code").toString()
                        );
                    } else if (storedToolMapping.getValue().get("type").equals("visitDetails.newThisYear")) {
                        requestedData = datastoreService.getAggregatedVisitsData(
                                requestParams.get("startDate").toString(),
                                requestParams.get("endDate").toString(),
                                requestParam.get("ageType").toString(),
                                (Integer) requestParam.get("startAge"),
                                (Integer) requestParam.get("endAge"),
                                requestParam.get("gender").toString(),
                                orgUnit.get("code").toString(),
                                "true"
                        );
                    } else if (storedToolMapping.getValue().get("type").equals("visitDetails.new")) {
                        requestedData = datastoreService.getAggregatedNewOrRepeatVisitsData(
                                requestParams.get("startDate").toString(),
                                requestParams.get("endDate").toString(),
                                requestParam.get("ageType").toString(),
                                (Integer) requestParam.get("startAge"),
                                (Integer) requestParam.get("endAge"),
                                requestParam.get("gender").toString(),
                                orgUnit.get("code").toString(),
                                "true"
                        );
                    } else if (storedToolMapping.getValue().get("type").equals("visitDetails.repeat")) {
                        requestedData = datastoreService.getAggregatedNewOrRepeatVisitsData(
                                requestParams.get("startDate").toString(),
                                requestParams.get("endDate").toString(),
                                requestParam.get("ageType").toString(),
                                (Integer) requestParam.get("startAge"),
                                (Integer) requestParam.get("endAge"),
                                requestParam.get("gender").toString(),
                                orgUnit.get("code").toString(),
                                "false"
                        );
                    } else if (storedToolMapping.getValue().get("type").equals("paymentCategoryDetails")) {
                        requestedData = datastoreService.getAggregatedVisitsDataByPaymentCategory(
                                requestParams.get("startDate").toString(),
                                requestParams.get("endDate").toString(),
                                requestParam.get("ageType").toString(),
                                (Integer) requestParam.get("startAge"),
                                (Integer) requestParam.get("endAge"),
                                requestParam.get("gender").toString(),
                                orgUnit.get("code").toString(),
                                requestParam.get("paymentCategory").toString()
                        );
                    } else if (storedToolMapping.getValue().get("type").equals("outcomeDetails.referred")) {
                        requestedData = datastoreService.getAggregatedVisitsDataByReferralDetails(
                                requestParams.get("startDate").toString(),
                                requestParams.get("endDate").toString(),
                                requestParam.get("ageType").toString(),
                                (Integer) requestParam.get("startAge"),
                                (Integer) requestParam.get("endAge"),
                                requestParam.get("gender").toString(),
                                orgUnit.get("code").toString(),
                                "true"
                        );
                    } else if (storedToolMapping.getValue().get("type").equals("causeOfDeath")) {
                        requestedData = datastoreService.getAggregatedDeathDataByDiagnosisDetails(
                                requestParams.get("startDate").toString(),
                                requestParams.get("endDate").toString(),
                                requestParam.get("ageType").toString(),
                                (Integer) requestParam.get("startAge"),
                                (Integer) requestParam.get("endAge"),
                                requestParam.get("gender").toString(),
                                mappingsNamespace,
                                mappingsKey,
                                orgUnit.get("code").toString()
                        );
                    }
                    BigInteger value = null;
                    if (requestedData != null && requestedData.size()> 0) {
                        value = (BigInteger) requestedData.get(0).get("aggregated");
                    } else {
                        value = BigInteger.valueOf(0);
                    }
                    dataValue.put("value", value);
                    dataValue.put("dataElement", (( Map<String, Object>)storedToolMapping.getValue().get("dataElement")).get("id").toString());
                    dataValue.put("categoryOptionCombo", requestParam.get("co"));
                    data.add(dataValue);
                }
            }
            results.put("data", data);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("aggregatedData")
    public ResponseEntity<Map<String, Object>> getAggregateDataByStartDateAndEndDate(@RequestParam(value = "id") String id,
                                                                     @RequestParam(value = "startDate") String startDate,
                                                                     @RequestParam(value = "endDate") String endDate
    ) throws Exception {
        try {
            Map<String, Object> results = Maps.newHashMap();
            List<Map<String, Object>> dailyAggregatedDataList =  datastoreService.getAggregateDataFromDailyAggregatedData(id,startDate,endDate);
            results.put("data", dailyAggregatedDataList);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private List<Map<String, Object>> formatDatastoreObject(List<Datastore> datastoreList) throws Exception {
        List<Map<String, Object>> formattedItems = new ArrayList<>();
        for (Datastore datastore: datastoreList) {
            Map<String, Object> codeDetails = datastore.getValue();
            formattedItems.add(codeDetails);
        }
        return  formattedItems;
    }
}
