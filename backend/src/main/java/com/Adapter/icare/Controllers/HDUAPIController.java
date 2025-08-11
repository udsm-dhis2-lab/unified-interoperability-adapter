package com.Adapter.icare.Controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import javax.validation.Valid;

import com.Adapter.icare.Domains.DynamicValidator;
import com.Adapter.icare.Dtos.*;
import com.Adapter.icare.Services.*;
import com.Adapter.icare.validators.SharedHealthRecordValidator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.CodeSystem;
import org.hl7.fhir.r4.model.IdType;
import org.hl7.fhir.r4.model.Parameters;
import org.hl7.fhir.r4.model.ValueSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Adapter.icare.ClientRegistry.Services.ClientRegistryService;
import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Constants.ClientRegistryConstants;
import com.Adapter.icare.Constants.DatastoreConstants;
import com.Adapter.icare.Constants.FHIRConstants;
import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Domains.User;
import com.google.common.collect.Maps;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;

@RestController
@RequestMapping("/api/v1/hduApi")
public class HDUAPIController {

    @Autowired
    private Environment environment;

    private final DatastoreService datastoreService;
    private final MediatorsService mediatorsService;
    private final ValidatorService validatorService;
    private final LabDataTemplateService labDataTemplateService;
    private boolean shouldUseWorkflowEngine;
    private String defaultWorkflowEngineCode;
    private Mediator workflowEngine;
    private final DatastoreConstants datastoreConstants;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;
    private final ClientRegistryService clientRegistryService;
    private final ClientRegistryConstants clientRegistryConstants;
    private final IGenericClient fhirClient;
    private final FHIRConstants fhirConstants;

    private static final Logger log = LoggerFactory.getLogger(HDUAPIController.class);

    @Autowired
    private SharedHealthRecordValidator sharedHealthRecordValidator;

    @Autowired
    private ObjectMapper objectMapper;

    public HDUAPIController(DatastoreService datastoreService,
            MediatorsService mediatorsService,
            DatastoreConstants datastoreConstants,
            UserService userService,
            ClientRegistryService clientRegistryService,
            ClientRegistryConstants clientRegistryConstants,
            LabDataTemplateService labDataTemplateService,
            ValidatorService validatorService,
            FHIRConstants fhirConstants) throws Exception {
        this.datastoreService = datastoreService;
        this.mediatorsService = mediatorsService;
        this.datastoreConstants = datastoreConstants;
        this.clientRegistryService = clientRegistryService;
        this.userService = userService;
        this.labDataTemplateService = labDataTemplateService;
        this.validatorService = validatorService;
        this.clientRegistryConstants = clientRegistryConstants;
        FhirContext fhirContext = FhirContext.forR4();
        this.fhirConstants = fhirConstants;
        this.fhirClient = fhirContext.newRestfulGenericClient(this.fhirConstants.FHIRServerUrl);
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService
                    .getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
        Datastore WESystemConfigurations = datastoreService.getDatastoreByNamespaceAndKey(
                datastoreConstants.ConfigurationsNamespace,
                datastoreConstants.DefaultWorkflowEngineConfigurationDatastoreKey);
        if (WESystemConfigurations != null) {
            Map<String, Object> weSystemConfigValue = WESystemConfigurations.getValue();
            if (weSystemConfigValue != null) {
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

    @GetMapping("dataTemplates")
    public ResponseEntity<Map<String, Object>> getDataTemplatesList(
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "uuid", required = false) String uuid) throws Exception {
        // NB: Since data templates are JSON type metadata stored on datastore, then
        // dataTemplates namespace has been used to retrieve the configs
        // System.out.println(this.authentication.isAuthenticated());
        try {
            Map<String, Object> dataTemplatesResults = new HashMap<>();
            if (uuid == null) {
                List<Datastore> dataTemplateNameSpaceDetails = datastoreService
                        .getDatastoreNamespaceDetails("dataTemplates");
                List<Map<String, Object>> dataTemplates = new ArrayList<>();
                for (Datastore datastore : dataTemplateNameSpaceDetails) {
                    Map<String, Object> dataTemplate = datastore.getValue();
                    if (id != null) {
                        if (((Map<String, Object>) dataTemplate.get("templateDetails")).get("id").equals(id)) {
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
                        dataTemplatesResults = dataTemplates.get(0);
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

            return ResponseEntity.ok(dataTemplatesResults);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("dataTemplates/examples")
    public ResponseEntity<Map<String, Object>> getDataTemplatesExamples(
            @RequestParam(value = "id", required = false) String id) throws Exception {
        // NB: Since data templates are JSON type metadata stored on datastore, then
        // dataTemplates namespace has been used to retrieve the configs
        try {
            List<Datastore> dataTemplateNameSpaceDetails = datastoreService
                    .getDatastoreNamespaceDetails("dataTemplatesExamples");
            Map<String, Object> dataTemplatesExampleObject = new HashMap<>();
            List<Map<String, Object>> dataTemplatesExamples = new ArrayList<>();
            for (Datastore datastore : dataTemplateNameSpaceDetails) {
                Map<String, Object> dataTemplateExample = datastore.getValue();
                if (id != null) {
                    if (datastore.getDataKey().equals(id)) {
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
                    dataTemplatesExampleObject = dataTemplatesExamples.get(0);
                }
            } else {
                dataTemplatesExampleObject.put("results", dataTemplatesExamples);
            }
            return ResponseEntity.ok(dataTemplatesExampleObject);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping(value = "dataTemplates/metaData", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getDataTemplatesMetaData() throws Exception {
        try {
            String namespace = datastoreConstants.ResourcesMetadataNamespace;
            String key = datastoreConstants.DataTemplateMetadataKey;
            Datastore datastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, key);
            return ResponseEntity.ok(datastore.getValue());
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }

    @PostMapping(value = "dataTemplates", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> passDataToMediator(@Valid @RequestBody DataTemplateDTO dataTemplate,
            @RequestParam(name = "validation", required = false, defaultValue = "true") boolean performValidation,
            @RequestParam(name = "testDataValidity", required = false, defaultValue = "false") boolean testDataValidity
    ) {
        Map<String, Object> baseResponse = new HashMap<>();
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                Map<String, Object> payload = new HashMap<>();
                payload.put("code", "dataTemplates");
                List<SharedHealthRecordsDTO> listGrid = Optional.ofNullable(dataTemplate.getData())
                        .map(DataTemplateDataDTO::getListGrid)
                        .orElse(Collections.emptyList());

                if (listGrid.isEmpty()) {
                    log.warn("Received data template with empty listGrid.");
                    DataTemplateDataDTO emptyData = createEmptyDataTemplateData(dataTemplate);
                    payload.put("payload", emptyData);
                    return ResponseEntity
                            .ok(this.mediatorsService.processWorkflowInAWorkflowEngine(workflowEngine, payload,
                                    "processes/execute?async=true"));
                }

                log.info("Processing {} records from listGrid.", listGrid.size());

                Map<Integer, List<String>> validationErrorsMap = new ConcurrentHashMap<>();
                List<SharedHealthRecordsDTO> validatedListGrid = Collections.synchronizedList(new ArrayList<>());
                List<DynamicValidator> dynamicValidators = this.validatorService.getValidators(true);

                // TODO: Process clients in chunks in case exceed a certain amount (e.g 20)

                IntStream.range(0, listGrid.size()).parallel().forEach(index -> {
                    SharedHealthRecordsDTO currentRecord = listGrid.get(index);
                    List<String> errors = new ArrayList<String>();
                    if (performValidation) {
                        if(dynamicValidators.isEmpty()){
                            errors = sharedHealthRecordValidator.validate(currentRecord);
                        } else {
                            errors = sharedHealthRecordValidator.dynamicValidate(currentRecord, dynamicValidators);
                        }
                    }
                    if (errors.isEmpty()) {
                        validatedListGrid.add(currentRecord);
                    } else {
                        validationErrorsMap.put(index, errors);
                    }
                });

                // TODO: Do not reject the whole request if one record fails
                // TODO: To softcode the validation by using program rules knowledge to enhance flexibility

                List<Map<String, Object>> recordsWithIssues = validationErrorsMap.entrySet().stream()
                        .map(entry -> {
                            int index = entry.getKey();
                            List<String> errors = entry.getValue();
                            SharedHealthRecordsDTO originalRecord = listGrid.get(index);
                            Map<String, Object> issueDetail = new HashMap<>();
                            issueDetail.put("index", index);
                            issueDetail.put("identifier",
                                    generateUserFriendlyIdentifier(originalRecord.getDemographicDetails(), index));
                            issueDetail.put("validationIssues", errors);
                            return issueDetail;
                        })
                        .sorted(Comparator.comparingInt(m -> (int) m.get("index")))
                        .collect(Collectors.toList());

                if (!recordsWithIssues.isEmpty()) {
                    log.warn("Validation finished. {} out of {} records had issues.", recordsWithIssues.size(),
                            listGrid.size());
                }

                if (validatedListGrid.isEmpty() && !listGrid.isEmpty()) {
                    log.error("All {} records failed validation.", listGrid.size());
                    Map<String, Object> errorResponse = new LinkedHashMap<>();
                    errorResponse.put("status", "VALIDATION_ERROR");
                    errorResponse.put("statusCode", HttpStatus.BAD_REQUEST.value());
                    errorResponse.put("message",
                            "All submitted records failed validation. See 'validationFailures' for details.");
                    errorResponse.put("validationFailures", recordsWithIssues);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
                }

                if (!recordsWithIssues.isEmpty()) {
                    Map<String, Object> workflowResponse = new HashMap<>();
                    workflowResponse.put("statusDetails", "Completed with validation issues");
                    workflowResponse.put("validationSkippedRecordsCount", recordsWithIssues.size());
                    workflowResponse.put("validationFailures", recordsWithIssues);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(workflowResponse);
                }

                if(testDataValidity){
                    Map<String, Object> testResponse = new HashMap<>();
                    testResponse.put("statusDetails", "Completed testing data");
                    testResponse.put("message", "Congratulations your data passed through all data validation rules.");
                    return ResponseEntity.status(HttpStatus.OK).body(testResponse);
                }

                DataTemplateDataDTO validatedDataTemplatePayload = new DataTemplateDataDTO();
                validatedDataTemplatePayload.setListGrid(new ArrayList<>(validatedListGrid));
                List<IdentifierDTO> clientIds = validatedListGrid.isEmpty() ? new ArrayList<>()
                        : this.clientRegistryService.getClientRegistryIdentifiers(validatedListGrid.size());

                validatedDataTemplatePayload.setFacilityDetails(dataTemplate.getData().getFacilityDetails());
                validatedDataTemplatePayload.setReportDetails(dataTemplate.getData().getReportDetails());
                validatedDataTemplatePayload.setClientIdentifiersPool(clientIds);
                payload.put("payload", validatedDataTemplatePayload.toMap());

                // --- Call the workflow engine ---
                log.info("Sending {} valid records to workflow engine.", validatedListGrid.size());
                Map<String, Object> workflowResponse = this.mediatorsService.processWorkflowInAWorkflowEngine(
                        workflowEngine, payload,
                        "processes/execute?async=true");
                return ResponseEntity.ok(workflowResponse);

            } else if (!shouldUseWorkflowEngine) {
                log.warn(
                        "Workflow engine disabled. Sending data directly to mediator workflow. Validation via annotations might still occur if @Valid is on RequestBody, but parallel processing/composite validator logic is SKIPPED here.");
                // TODO: Decide if validation (parallel or sequential) is needed here too for
                // consistency.
                Map<String, Object> dataToSend = dataTemplate.toMap(); // TODO Ensure toMap() handles nulls safely
                log.info("Sending {} records directly.",
                        Optional.ofNullable(dataTemplate.getData()).map(d -> d.getListGrid().size()).orElse(0));
                return ResponseEntity.ok(this.mediatorsService.sendDataToMediatorWorkflow(dataToSend));

            } else {
                log.error("Workflow engine processing requested but engine is not available.");
                baseResponse.put("message", "Workflow engine configured but not available");
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(baseResponse);
            }
        } catch (Exception e) {
            log.error("Error processing data template: {}", e.getMessage(), e);
            Map<String, Object> statusResponse = new LinkedHashMap<>();
            statusResponse.put("status", "ERROR");
            statusResponse.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
            statusResponse.put("message", "An unexpected error occurred during processing: " + e.getMessage());
            statusResponse.put("validationFailures", new ArrayList<>());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(statusResponse);
        }
    }

    @PostMapping(value = "labDataTemplates", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> passLabDataToMediator(@Valid @RequestBody LabDataTemplateDTO labDataTemplate,
            @RequestParam(name = "validation", required = false, defaultValue = "true") boolean performValidation,
            @RequestParam(name = "testDataValidity", required = false, defaultValue = "false") boolean testDataValidity
    ) {

        Map<String, Object> baseResponse = new HashMap<>();

        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                Map<String, Object> payload = new HashMap<>();
                payload.put("code", "labDataTemplates");
                LabRecordsDataDTO labRecordsData = labDataTemplate.getData();

                if(labRecordsData != null){
                    List<LabRequestDetailsDTO> labRequestDetailsData = labRecordsData.getLabRequestDetails();

                    if (labRequestDetailsData.isEmpty()) {
                        log.warn("Received data template with empty lab request details data.");
                        LabRecordsDataDTO emptyData = this.createEmptyLabDataTemplate(labDataTemplate);
                        payload.put("payload", emptyData);
                        return ResponseEntity
                                .ok(this.mediatorsService.processWorkflowInAWorkflowEngine(workflowEngine, payload,
                                        "processes/execute?async=true"));
                    }

                    log.info("Processing {} records from labRequestDetails.", labRequestDetailsData.size());

                    Map<Integer, List<String>> validationErrorsMap = new ConcurrentHashMap<>();
                    List<LabRequestDetailsDTO> validatedLabRequestDetails = Collections.synchronizedList(new ArrayList<>());
                    List<DynamicValidator> dynamicValidators = this.validatorService.getValidators(testDataValidity ? null : true);

                    // TODO: Process clients in chunks in case exceed a certain amount (e.g 20)

                    IntStream.range(0, labRequestDetailsData.size()).parallel().forEach(index -> {
                        LabRequestDetailsDTO currentRecord = labRequestDetailsData.get(index);
                        List<String> errors = new ArrayList<String>();
//                    if (performValidation) {
//                        if(dynamicValidators.isEmpty()){
//                            errors = sharedHealthRecordValidator.validate(currentRecord);
//                        } else {
//                            errors = sharedHealthRecordValidator.dynamicValidate(currentRecord, dynamicValidators);
//                        }
//                    }
                        if (errors.isEmpty()) {
                            validatedLabRequestDetails.add(currentRecord);
                        } else {
                            validationErrorsMap.put(index, errors);
                        }
                    });

                    // TODO: Do not reject the whole request if one record fails
                    // TODO: To softcode the validation by using program rules knowledge to enhance flexibility

                    List<Map<String, Object>> recordsWithIssues = validationErrorsMap.entrySet().stream()
                            .map(entry -> {
                                int index = entry.getKey();
                                List<String> errors = entry.getValue();
                                LabRequestDetailsDTO originalRecord = labRequestDetailsData.get(index);
                                Map<String, Object> issueDetail = new HashMap<>();
                                issueDetail.put("index", index);
                                issueDetail.put("specimen", originalRecord.getSpecimenID());
                                issueDetail.put("validationIssues", errors);
                                return issueDetail;
                            })
                            .sorted(Comparator.comparingInt(m -> (int) m.get("index")))
                            .collect(Collectors.toList());

                    if (!recordsWithIssues.isEmpty()) {
                        log.warn("Validation finished. {} out of {} records had issues to me rectified.", recordsWithIssues.size(),
                                labRequestDetailsData.size());
                    }

                    if (validatedLabRequestDetails.isEmpty() && !labRequestDetailsData.isEmpty()) {
                        log.error("All {} records failed validation.", labRequestDetailsData.size());
                        Map<String, Object> errorResponse = new LinkedHashMap<>();
                        errorResponse.put("status", "VALIDATION_ERROR");
                        errorResponse.put("statusCode", HttpStatus.BAD_REQUEST.value());
                        errorResponse.put("message",
                                "All submitted records failed validation. See 'validationFailures' for details.");
                        errorResponse.put("validationFailures", recordsWithIssues);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
                    }

                    if (!recordsWithIssues.isEmpty()) {
                        Map<String, Object> workflowResponse = new HashMap<>();
                        workflowResponse.put("statusDetails", "Completed with validation issues");
                        workflowResponse.put("validationSkippedRecordsCount", recordsWithIssues.size());
                        workflowResponse.put("validationFailures", recordsWithIssues);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(workflowResponse);
                    }

                    if(testDataValidity){
                        Map<String, Object> testResponse = new HashMap<>();
                        testResponse.put("statusDetails", "Completed testing data");
                        testResponse.put("message", "Congratulations your data passed through all data validation rules.");
                        return ResponseEntity.status(HttpStatus.OK).body(testResponse);
                    }

                    LabRecordsDataDTO validatedLabDataTemplatePayload = new LabRecordsDataDTO();
                    validatedLabDataTemplatePayload.setLabRequestDetails(validatedLabRequestDetails);

                    validatedLabDataTemplatePayload.setFacilityDetails(labDataTemplate.getData().getFacilityDetails());
                    validatedLabDataTemplatePayload.setReportDetails(labDataTemplate.getData().getReportDetails());
                    System.out.println("Data: " + validatedLabDataTemplatePayload.toMap());
                    payload.put("payload", validatedLabDataTemplatePayload.toMap());

                    // --- Call the workflow engine ---
                    log.info("Sending {} valid lab records to workflow engine.", validatedLabRequestDetails.size());
                    Map<String, Object> workflowResponse = this.mediatorsService.processWorkflowInAWorkflowEngine(
                            workflowEngine, payload,
                            "processes/execute?async=true");
                    return ResponseEntity.ok(workflowResponse);
                }

                return ResponseEntity.badRequest().body(this.createEmptyLabDataTemplate(null).toMap());

            } else if (!shouldUseWorkflowEngine) {
                log.warn(
                        "Workflow engine is disabled. Sending data directly to mediator workflow. Validation via annotations might still occur if @Valid is on RequestBody, but parallel processing/composite validator logic is SKIPPED here.");
                // TODO: Decide if validation (parallel or sequential) is needed here too for
                // consistency.
                Map<String, Object> dataToSend = labDataTemplate.toMap(); // TODO Ensure toMap() handles nulls safely
                log.info("Sending {} records directly to mediator.",
                        Optional.ofNullable(labDataTemplate.getData()).map(d -> d.getLabRequestDetails().size()).orElse(0));
                return ResponseEntity.ok(this.mediatorsService.sendDataToMediatorWorkflow(dataToSend));

            } else {
                log.error("Workflow engine processing requested but engine is not available.");
                baseResponse.put("message", "Workflow engine configured but not available");
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(baseResponse);
            }
        } catch (Exception e) {
            log.error("Error processing data template: {}", e.getMessage(), e);
            Map<String, Object> statusResponse = new LinkedHashMap<>();
            statusResponse.put("status", "ERROR");
            statusResponse.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
            statusResponse.put("message", "An unexpected error occurred during processing: " + e.getMessage());
            statusResponse.put("validationFailures", new ArrayList<>());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(statusResponse);
        }
    }


    @GetMapping(value = "labDataTemplates")
    public ResponseEntity<Map<String, Object>> getLabDataFromFhir(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "facilityCode", required = false) String facilityCode,
            @RequestParam(value = "specimenId", required = false) String specimenId
    ){
        try {
            return ResponseEntity.ok().body(this.labDataTemplateService.getLabRecordsWithPagination(page, pageSize, facilityCode, specimenId));
        } catch (Exception e){
            Map<String, Object> exceptionMap = new HashMap<>();
            exceptionMap.put("message", "Unknown error occured!");
            exceptionMap.put("error", e.getMessage());
            log.error("Error: ", e);
            return ResponseEntity.internalServerError().body(exceptionMap);
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
    public ResponseEntity<Map<String, Object>> getGeneralCodes(
            @RequestParam(value = "namespace", required = false) String namespace,
            @RequestParam(value = "key", required = false) String key,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "version", required = false) String version,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        // TODO: Improve this to capture both datastore-based, valueset-based and
        // codesystem-based
        try {
            Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreMatchingParams(namespace, key, version,
                    null, q, code, page, pageSize, "GENERAL-CODES");
            for (Datastore datastore : pagedDatastoreData.getContent()) {
                Map<String, Object> generalCodeDetails = datastore.getValue();
                generalCodeDetails.put("namespace", datastore.getNamespace());
                generalCodeDetails.put("key", datastore.getDataKey());
                namespaceDetails.add(generalCodeDetails);
            }
            Map<String, Object> returnObject = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages", pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            returnObject.put("pager", pager);
            returnObject.put("results", namespaceDetails);
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("generalCodes/{namespace}")
    public ResponseEntity<Map<String, Object>> getSpecificCodedItems(@PathVariable("namespace") String namespace,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", required = false, defaultValue = "10") Integer pageSize,
            @RequestParam(value = "paging", required = false, defaultValue = "true") boolean paging,
            @RequestParam(value = "chapter", required = false) String chapter,
            @RequestParam(value = "department", required = false) String department) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            Map<String, Object> returnObject  = this.getPagedDatastoreCodes(namespace, page, pageSize, code, "GENERAL-CODES", q);

            int resultsCount = returnObject.containsKey("results") ? ((List<Map<String, Object>>) returnObject.get("results")).size() : 0;
            if(resultsCount > 0){
                return ResponseEntity.ok().body(returnObject);
            }

            String keysForGeneralCodes = datastoreConstants.KeysForGeneralCodes;
            // System.out.println(keysForGeneralCodes);
            // TODO: The lab has to be changed to specific valueset or code system
            if (keysForGeneralCodes.contains(namespace) || namespace.contains("laboratory")) {
                Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreNamespaceDetailsByPagination(
                        !namespace.contains("laboratory") ? namespace : "LOINC", null, department, q, code, null, page,
                        pageSize, paging);
                for (Datastore datastore : pagedDatastoreData.getContent()) {
                    namespaceDetails.add(datastore.getValue());
                }

                if (paging) {
                    Map<String, Object> pager = new HashMap<>();
                    pager.put("page", page);
                    pager.put("pageSize", pageSize);
                    pager.put("totalPages", pagedDatastoreData.getTotalPages());
                    pager.put("total", pagedDatastoreData.getTotalElements());
                    returnObject.put("pager", pager);
                }
                returnObject.put("results", namespaceDetails);
                return ResponseEntity.ok(returnObject);
            } else {
                // TODO: Add pagination support
                List<GeneralCodesDTO> generalCodes = new ArrayList<>();
                Parameters inputParameters = new Parameters();
                Map<String, Object> pager = new HashMap<>();

                if (namespace.equals("msd")) {
                    Bundle results = fhirClient
                            .search()
                            .forResource(CodeSystem.class)
                            .withTag("http://41.59.228.177/fhir/CodeSystem/tags", "msd")
                            .returnBundle(Bundle.class)
                            .execute();

                    List<Bundle.BundleEntryComponent> entries = results.getEntry();
                    for (Bundle.BundleEntryComponent entry : entries) {
                        CodeSystem codeSystem = (CodeSystem) entry.getResource();
                        GeneralCodesDTO generalCodesDTO = new GeneralCodesDTO();
                        generalCodesDTO.setStandardCode("MSD CODE");
                        generalCodesDTO.setCode(codeSystem.hasIdentifier() && !codeSystem.getIdentifier().isEmpty()
                                ? codeSystem.getIdentifier().get(0).getValue()
                                : null);
                        generalCodesDTO.setName(
                                codeSystem.hasTitle() && codeSystem.getTitle() != null ? codeSystem.getTitle() : null);
                        generalCodesDTO.setTitle(
                                codeSystem.hasTitle() && codeSystem.getTitle() != null ? codeSystem.getTitle() : null);
                        // TODO: Add version
                        // generalCodesDTO.setVersion(valueSetExpansionContainsComponent.getVersion());
                        generalCodes.add(generalCodesDTO);
                    }
                    pager.put("page", page);
                    pager.put("total", entries.size());
                } else {
                    Parameters outputParameters = fhirClient
                            .operation()
                            .onInstance(new IdType("ValueSet", namespace))
                            .named("$expand")
                            .withParameters(inputParameters)
                            .execute();

                    ValueSet expandedValueSet = (ValueSet) outputParameters.getParameter().get(0).getResource();

                    if (expandedValueSet.hasExpansion() && expandedValueSet.getExpansion().hasContains()) {
                        for (ValueSet.ValueSetExpansionContainsComponent valueSetExpansionContainsComponent : expandedValueSet
                                .getExpansion().getContains()) {
                            GeneralCodesDTO generalCodesDTO = new GeneralCodesDTO();
                            generalCodesDTO.setStandardCode(
                                    valueSetExpansionContainsComponent.getSystem().contains("loinc") ? "LOINC"
                                            : valueSetExpansionContainsComponent.getSystem().contains("nhif") ? "NHIF"
                                                    : valueSetExpansionContainsComponent.getSystem().contains("msd")
                                                            ? "MSD CODE"
                                                            : valueSetExpansionContainsComponent.getSystem()
                                                                    .contains("moh") ? "GENERAL"
                                                                            : valueSetExpansionContainsComponent
                                                                                    .getSystem().contains("icd") ? "ICD"
                                                                                            : "LOCAL");
                            generalCodesDTO.setCode(valueSetExpansionContainsComponent.getCode());
                            generalCodesDTO.setName(valueSetExpansionContainsComponent.getDisplay());
                            generalCodesDTO.setTitle(valueSetExpansionContainsComponent.getDisplay());
                            generalCodesDTO.setVersion(valueSetExpansionContainsComponent.getVersion());
                            generalCodes.add(generalCodesDTO);
                        }
                    }
                    pager.put("page", page);
                    pager.put("total", expandedValueSet.getExpansion().getTotal());
                }
                pager.put("pageSize", pageSize);
                returnObject.put("pager", pager);
                returnObject.put("results", generalCodes);

                return ResponseEntity.ok(returnObject);
            }

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("status", HttpStatus.NOT_FOUND.getReasonPhrase());
            response.put("statusCode", HttpStatus.NOT_FOUND.value());
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    private Map<String, Object> getPagedDatastoreCodes(String namespace, Integer page, Integer pageSize, String key, String group, String q) throws  Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreNamespaceUsingPagination(namespace, page, pageSize, key,group, q);

//            Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreMatchingParams(namespace, key, version,
//                    null, q, code, page, pageSize, "STANDARD-CODES");

        for (Datastore datastore : pagedDatastoreData.getContent()) {
            Map<String, Object> standardCodeDetails = datastore.getValue();
            namespaceDetails.add(standardCodeDetails);
        }
        Map<String, Object> returnObject = new HashMap<>();
        Map<String, Object> pager = new HashMap<>();
        pager.put("page", page);
        pager.put("pageSize", pageSize);
        pager.put("totalPages", pagedDatastoreData.getTotalPages());
        pager.put("total", pagedDatastoreData.getTotalElements());
        returnObject.put("pager", pager);
        returnObject.put("results", namespaceDetails);
        return returnObject;
    }


    @GetMapping("standardCodes")
    public ResponseEntity<Map<String, Object>> getStandardCodes(
            @RequestParam(value = "namespace", required = false) String namespace,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) throws Exception {

        try {

            Map<String, Object> returnObject = this.getPagedDatastoreCodes(namespace, page, pageSize, code, "STANDARD-CODES", q);
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("standardCodes/{namespace}")
    public ResponseEntity<Map<String, Object>> getSpecificStandardCodedItems(@PathVariable("namespace") String namespace,
                                                                     @RequestParam(value = "code", required = false) String code,
                                                                     @RequestParam(value = "q", required = false) String q,
                                                                     @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
                                                                     @RequestParam(value = "pageSize", required = false, defaultValue = "10") Integer pageSize,
                                                                     @RequestParam(value = "paging", required = false, defaultValue = "true") boolean paging) throws Exception {
        try {
            Map<String, Object> returnObject = this.getPagedDatastoreCodes(namespace, page, pageSize, code, "STANDARD-CODES", q);
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("status", HttpStatus.NOT_FOUND.getReasonPhrase());
            response.put("statusCode", HttpStatus.NOT_FOUND.value());
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }


    @PostMapping(value = "configurations", consumes = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> addConfigurations(
            @Valid @RequestBody DatastoreConfigurationsDTO configurations) {
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
    public ResponseEntity<Map<String, Object>> updateConfigurations(
            @Valid @RequestBody DatastoreConfigurationsDTO configurations,
            @PathVariable(value = "uuid") String uuid) {
        try {
            Datastore existingConfigs = datastoreService.getDatastoreByUuid(uuid);
            if (existingConfigs != null
                    && existingConfigs.getNamespace().equals(datastoreConstants.ConfigurationsNamespace)) {
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
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Configurations with uuid " + uuid + " does not exists");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "configurations/{uuid}", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getConfigurations(@PathVariable(value = "uuid") String uuid)
            throws Exception {
        Map<String, Object> response = new HashMap<>();
        try {
            Datastore configurations = datastoreService.getDatastoreByUuid(uuid);
            if (configurations != null) {
                return ResponseEntity.ok(configurations.toMap());
            } else {
                response.put("message", "Configurations with uuid " + uuid + " does not exists");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @GetMapping(value = "configurations", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getConfigurations(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "group", required = false) String group,
            @RequestParam(value = "page", required = true, defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", required = true, defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            String namespace = datastoreConstants.ConfigurationsNamespace;
            Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreNamespaceDetailsByPagination(
                    namespace, null, null, q, null, group, page, pageSize, true);
            for (Datastore datastore : pagedDatastoreData.getContent()) {
                Map<String, Object> configuration = datastore.getValue();
                configuration.put("key", datastore.getDataKey());
                configuration.put("uuid", datastore.getUuid());
                configuration.put("group", datastore.getDatastoreGroup());
                namespaceDetails.add(configuration);
            }
            Map<String, Object> returnObject = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages", pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            returnObject.put("pager", pager);
            returnObject.put("results", namespaceDetails);
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping(value = "configurations/{uuid}")
    public ResponseEntity<Map<String, Object>> deleteConfigurations(@PathVariable(value = "uuid") String uuid)
            throws Exception {
        Map<String, Object> response = new HashMap<>();
        try {
            if (datastoreService.getDatastoreByUuid(uuid) != null) {
                datastoreService.deleteDatastore(uuid);
                response.put("message", "Configurations with uuid " + uuid + " has successfully been deleted");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Configurations with uuid " + uuid + " does not exists");
                ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
        return null;
    }

    @GetMapping(value = "workflows")
    public ResponseEntity<Map<String, Object>> getWorkflows(
            @RequestParam(value = "fields", required = false) String fields,
            @RequestParam(value = "filter", required = false) String filter) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                String queryParamsPath = "";
                queryParamsPath += fields != null ? "fields=" + fields : "";
                queryParamsPath += filter != null ? (queryParamsPath.contains("fields") ? "&" : "") + "filter=" + filter
                        : "";
                String api = "workflows" + (queryParamsPath != "" ? "?" + queryParamsPath : "");
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, api, "GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "workflows/{id}")
    public ResponseEntity<Map<String, Object>> getWorkflowById(
            @PathVariable(value = "id") String id,
            @RequestParam(value = "fields", required = false) String fields,
            @RequestParam(value = "filter", required = false) String filter) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                String queryParamsPath = "";
                queryParamsPath += fields != null ? "fields=" + fields : "";
                queryParamsPath += filter != null ? (queryParamsPath.contains("fields") ? "&" : "") + "filter=" + filter
                        : "";
                String api = "workflows/" + id + (queryParamsPath != "" ? "?" + queryParamsPath : "");
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, api, "GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "workflows/{id}/run")
    public ResponseEntity<Map<String, Object>> runWorkflowById(
            @PathVariable(value = "id") String id) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity
                        .ok(mediatorsService.routeToMediator(workflowEngine, "workflows/" + id + "/run", "GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "workflows")
    public ResponseEntity<Map<String, Object>> addWorkflow(@RequestBody Map<String, Object> workflow) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity
                        .ok(mediatorsService.routeToMediator(workflowEngine, "workflows", "POST", workflow));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "workflows/{id}")
    public ResponseEntity<Map<String, Object>> updateWorkflow(
            @RequestBody Map<String, Object> workflow,
            @PathVariable(value = "id") String id) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity
                        .ok(mediatorsService.routeToMediator(workflowEngine, "workflows/" + id, "PUT", workflow));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping(value = "workflows/{id}")
    public ResponseEntity<Map<String, Object>> deleteWorkflowById(
            @PathVariable(value = "id") String id) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity
                        .ok(mediatorsService.routeToMediator(workflowEngine, "workflows/" + id, "DELETE", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "processes")
    public ResponseEntity<Map<String, Object>> getProcesses(
            @RequestParam(value = "fields", required = false) String fields,
            @RequestParam(value = "filter", required = false) String filter) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                String queryParamsPath = "";
                queryParamsPath += fields != null ? "fields=" + fields : "";
                queryParamsPath += filter != null ? (queryParamsPath.contains("fields") ? "&" : "") + "filter=" + filter
                        : "";
                String api = "processes" + (queryParamsPath != "" ? "?" + queryParamsPath : "");
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, api, "GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "processes/{id}")
    public ResponseEntity<Map<String, Object>> getProcessById(
            @PathVariable(value = "id") String id,
            @RequestParam(value = "fields", required = false) String fields,
            @RequestParam(value = "filter", required = false) String filter) throws Exception {
        try {

            if (shouldUseWorkflowEngine && workflowEngine != null) {
                String queryParamsPath = "";
                queryParamsPath += fields != null ? "fields=" + fields : "";
                queryParamsPath += filter != null ? (queryParamsPath.contains("fields") ? "&" : "") + "filter=" + filter
                        : "";
                String api = "processes/" + id + (queryParamsPath != "" ? "?" + queryParamsPath : "");
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, api, "GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "processes/{id}/run")
    public ResponseEntity<Map<String, Object>> runProcessById(
            @PathVariable(value = "id") String id) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity
                        .ok(mediatorsService.routeToMediator(workflowEngine, "processes/" + id + "/run", "GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "processes")
    public ResponseEntity<Map<String, Object>> addProcess(@RequestBody Map<String, Object> process) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity
                        .ok(mediatorsService.routeToMediator(workflowEngine, "processes", "POST", process));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "processes/execute")
    public ResponseEntity<Object> runProcess(
            @RequestBody Map<String, Object> process,
            @RequestParam Map<String, String> allRequestParams) throws Exception {
        try {
            System.out.println("MY ENV: " + environment.getProperty("FHIR_URL"));
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                StringBuilder urlBuilder = new StringBuilder("processes/execute");

                boolean isFirstParam = true;
                for (Map.Entry<String, String> entry : allRequestParams.entrySet()) {
                    urlBuilder.append(isFirstParam ? "?" : "&")
                            .append(entry.getKey())
                            .append("=")
                            .append(entry.getValue());
                    isFirstParam = false;
                }

                return ResponseEntity
                        .ok(mediatorsService.sendDataToExternalSystemGeneric(workflowEngine, process,
                                "POST", urlBuilder.toString()));

            } else {
                throw new Exception("Can not access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "processes/{id}")
    public ResponseEntity<Map<String, Object>> updateProcess(
            @RequestBody Map<String, Object> process,
            @PathVariable(value = "id") String id) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity
                        .ok(mediatorsService.routeToMediator(workflowEngine, "processes/" + id, "PUT", process));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping(value = "processes/{id}")
    public ResponseEntity<Map<String, Object>> deleteProcessById(
            @PathVariable(value = "id") String id) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity
                        .ok(mediatorsService.routeToMediator(workflowEngine, "processes/" + id, "DELETE", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "tasks/{id}")
    public ResponseEntity<Map<String, Object>> getTask(@PathVariable(value = "id") String id) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "tasks/" + id, "GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "schedules")
    public ResponseEntity<Map<String, Object>> getSchedules() throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity.ok(mediatorsService.routeToMediator(workflowEngine, "schedules", "GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "schedules/{id}")
    public ResponseEntity<Map<String, Object>> getScheduleById(
            @PathVariable(value = "id") String id) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity
                        .ok(mediatorsService.routeToMediator(workflowEngine, "schedules/" + id, "GET", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "schedules")
    public ResponseEntity<Map<String, Object>> addSchedule(@RequestBody Map<String, Object> schedule) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity
                        .ok(mediatorsService.routeToMediator(workflowEngine, "schedules", "POST", schedule));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "schedules/{id}")
    public ResponseEntity<Map<String, Object>> addSchedule(
            @RequestBody Map<String, Object> schedule,
            @PathVariable(value = "id") String id) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity
                        .ok(mediatorsService.routeToMediator(workflowEngine, "schedules/" + id, "PUT", schedule));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping(value = "schedules/{id}")
    public ResponseEntity<Map<String, Object>> deleteScheduleById(
            @PathVariable(value = "id") String id) throws Exception {
        try {
            if (shouldUseWorkflowEngine && workflowEngine != null) {
                return ResponseEntity
                        .ok(mediatorsService.routeToMediator(workflowEngine, "schedules/" + id, "DELETE", null));
            } else {
                throw new Exception("Can no access route/mediator due to missing configurations");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "mappings", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getMappings(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "key", required = false) String key) throws Exception {
        List<MappingsDTO> namespaceDetails = new ArrayList<>();
        try {
            String namespaceFilter = datastoreConstants.MappingsNamespaceFilter;
            Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreMatchingNamespaceFilterByPagination(
                    namespaceFilter, key, q, code, page, pageSize);
            for (Datastore datastore : pagedDatastoreData.getContent()) {
                MappingsDTO mapping = new MappingsDTO();
                mapping.setUuid(datastore.getUuid());
                mapping.setDataKey(datastore.getDataKey());
                mapping.setNamespace(datastore.getNamespace());
                if (datastore.getDatastoreGroup() != null) {
                    mapping.setGroup(datastore.getDatastoreGroup());
                }
                mapping.setDescription(datastore.getDescription());
                mapping.setMapping(datastore.getValue());
                namespaceDetails.add(mapping);
            }
            Map<String, Object> response = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages", pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            response.put("pager", pager);
            response.put("results", namespaceDetails);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "mappings/{uuid}")
    public ResponseEntity<MappingsDTO> getMappingsByUuid(@PathVariable(value = "uuid") String uuid) throws Exception {
        try {
            MappingsDTO response = new MappingsDTO();
            Datastore datastore = datastoreService.getDatastoreByUuid(uuid);
            if (datastore != null) {
                response.setUuid(datastore.getUuid());
                response.setDataKey(datastore.getDataKey());
                response.setNamespace(datastore.getNamespace());
                response.setGroup(datastore.getDatastoreGroup());
                response.setDescription(datastore.getDescription());
                response.setMapping(datastore.getValue());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "mappings/{namespace}/{key}")
    public ResponseEntity<MappingsDTO> getMappingsByNamespaceAndKey(@PathVariable(value = "namespace") String namespace,
            @PathVariable(value = "key") String key) throws Exception {
        try {
            MappingsDTO response = new MappingsDTO();
            Datastore datastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, key);
            if (datastore != null) {
                response.setUuid(datastore.getUuid());
                response.setDataKey(datastore.getDataKey());
                response.setNamespace(datastore.getNamespace());
                response.setGroup(datastore.getDatastoreGroup());
                response.setDescription(datastore.getDescription());
                response.setMapping(datastore.getValue());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping(value = "mappings/{uuid}")
    public ResponseEntity<Map<String, Object>> deleteMappings(@PathVariable(value = "uuid") String uuid)
            throws Exception {
        try {
            Datastore mappingsToUpdate = datastoreService.getDatastoreByUuid(uuid);
            Map<String, Object> response = new HashMap<>();
            if (mappingsToUpdate != null) {
                datastoreService.deleteDatastore(uuid);
                response.put("message", "Mapping with uuid " + uuid + " has been deleted");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Mapping with uuid " + uuid + " does not exists");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "mappings/{uuid}")
    public ResponseEntity<Map<String, Object>> updateMappingsByUuid(
            @PathVariable(value = "uuid") String uuid,
            @Valid @RequestBody MappingsDTO mappingsDTO) {
        try {
            Datastore mappingsToUpdate = datastoreService.getDatastoreByUuid(uuid);
            if (mappingsToUpdate != null) {
                mappingsToUpdate.setValue(mappingsDTO.getMapping());
                if (authenticatedUser != null) {
                    mappingsToUpdate.setLastUpdatedBy(authenticatedUser);
                }
                return ResponseEntity.ok(datastoreService.updateDatastore(mappingsToUpdate).toMap());
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Mapping with uuid " + uuid + " does not exists");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "mappings")
    public ResponseEntity<Map<String, Object>> addMappings(
            @Valid @RequestBody MappingsDTO mappings) {
        try {
            Datastore datastore = new Datastore();
            if (mappings.getUuid() != null) {
                datastore.setUuid(mappings.getUuid());
            }
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
    @GetMapping(value = "codeSystems", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getDatastoreByNamespace(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "page", required = true, defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", required = true, defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            String namespace = "codeSystems";
            Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreNamespaceDetailsByPagination(namespace,
                    null, null, q, code, null, page, pageSize, true);
            for (Datastore datastore : pagedDatastoreData.getContent()) {
                namespaceDetails.add(datastore.getValue());
            }
            Map<String, Object> returnObject = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages", pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            returnObject.put("pager", pager);
            returnObject.put("results", namespaceDetails);
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "codeSystems/icd", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getICDCodeSystemData(
            @RequestParam(value = "version", required = false) String version,
            @RequestParam(value = "release", required = false) String release,
            @RequestParam(value = "chapter", required = false) String chapter,
            @RequestParam(value = "block", required = false) String block,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", required = true, defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", required = true, defaultValue = "10") Integer pageSize) throws Exception {
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
                for (Datastore datastore : icdData) {
                    Map<String, Object> icd = datastore.getValue();
                    // TODO: Add support to filter by available versions
                    icd.put("chapters", chapters);
                    results.add(icd);
                }
                // Load extended data
                returnDataObject.put("results", results);
            } else if (version != null && chapter == null && block == null && category == null && code == null) {
                namespace = "ICD-CHAPTERS";
                pagedDatastoreData = datastoreService.getDatastoreMatchingParams(namespace, key, version, release, code,
                        q, page, pageSize, null);
                Map<String, Object> pager = new HashMap<>();
                pager.put("page", page);
                pager.put("pageSize", pageSize);
                pager.put("totalPages", pagedDatastoreData.getTotalPages());
                pager.put("total", pagedDatastoreData.getTotalElements());
                List<Datastore> datastoreList = pagedDatastoreData.getContent();
                List<Map<String, Object>> itemsList = new ArrayList<>();
                for (Datastore datastore : datastoreList) {
                    itemsList.add(datastore.getValue());
                }
                returnDataObject.put("results", itemsList);
                returnDataObject.put("pager", pager);
            } else if (chapter != null && block == null && category == null && code == null) {
                namespace = "ICD-CHAPTERS";
                key = Objects.requireNonNullElse(version, "10").concat("-").concat(chapter);
                List<Map<String, Object>> blocks = new ArrayList<>();
                // TODO: Load specified chapter details, if found the load code blocks
                Datastore datastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, key);
                if (datastore != null) {
                    returnDataObject = datastore.getValue();
                    String blocksNamespace = "ICD-BLOCKS";
                    List<Datastore> blocksData = datastoreService.getICDDataByChapter(blocksNamespace, chapter, release,
                            version);
                    for (Datastore blockDatastore : blocksData) {
                        blocks.add(blockDatastore.getValue());
                    }
                    returnDataObject.put("blocks", blocks);
                }
            } else if (block != null && category == null && code == null) {
                // TODO: Load specified block and respective categories
                namespace = "ICD-BLOCKS";
                List<Map<String, Object>> categories = new ArrayList<>();
                key = Objects.requireNonNullElse(version, "10").concat("-").concat(block);
                Datastore datastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, key);
                if (datastore != null) {
                    returnDataObject = datastore.getValue();
                    String categoriesNamespace = "ICD-CATEGORIES";
                    List<Datastore> categoriesData = datastoreService.getICDDataByBlock(categoriesNamespace, block,
                            release, version);
                    for (Datastore categoryDatastore : categoriesData) {
                        categories.add(categoryDatastore.getValue());
                    }
                    returnDataObject.put("categories", categories);
                }
            } else if (category != null && code == null) {
                // TODO: Load specified block and respective categories
                namespace = "ICD-CATEGORIES";
                List<Map<String, Object>> codes = new ArrayList<>();
                key = Objects.requireNonNullElse(version, "10").concat("-").concat(category);
                Datastore datastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, key);
                if (datastore != null) {
                    returnDataObject = datastore.getValue();
                    String codesNamespace = "ICD-CODES";
                    List<Datastore> codesData = datastoreService.getICDDataByCategory(codesNamespace, category, release,
                            version);
                    for (Datastore codesDatastore : codesData) {
                        codes.add(codesDatastore.getValue());
                    }
                    returnDataObject.put("codes", codes);
                }
            } else {
                key = Objects.requireNonNullElse(version, "10").concat("-").concat(code);
                Datastore datastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, key);
                returnDataObject = datastore.getValue();
            }
            return ResponseEntity.ok(returnDataObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "codeSystems/icd/codes", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getICDCodeSystemsCodes(
            @RequestParam(value = "version", required = false) String version,
            @RequestParam(value = "release", required = false) String release,
            @RequestParam(value = "chapter", required = false) String chapter,
            @RequestParam(value = "block", required = false) String block,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            String namespace = "ICD-CODES";
            String key = null;
            Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreICDDataByParams(namespace, key, version,
                    release, chapter, block, category, code, q, page, pageSize);
            for (Datastore datastore : pagedDatastoreData.getContent()) {
                namespaceDetails.add(datastore.getValue());
            }
            Map<String, Object> codesObject = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages", pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            codesObject.put("pager", pager);
            codesObject.put("results", namespaceDetails);
            return ResponseEntity.ok(codesObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "codeSystems/icd/categories", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getICDCodeSystemsCategories(
            @RequestParam(value = "version", required = false) String version,
            @RequestParam(value = "release", required = false) String release,
            @RequestParam(value = "chapter", required = false) String chapter,
            @RequestParam(value = "block", required = false) String block,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            String namespace = "ICD-CATEGORIES";
            String key = null;
            Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreICDDataByParams(namespace, key, version,
                    release, chapter, block, category, code, q, page, pageSize);
            for (Datastore datastore : pagedDatastoreData.getContent()) {
                namespaceDetails.add(datastore.getValue());
            }
            Map<String, Object> dataObject = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages", pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            dataObject.put("pager", pager);
            dataObject.put("results", namespaceDetails);
            return ResponseEntity.ok(dataObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "codeSystems/icd/blocks", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getICDCodeSystemsBlocks(
            @RequestParam(value = "version", required = false) String version,
            @RequestParam(value = "release", required = false) String release,
            @RequestParam(value = "chapter", required = false) String chapter,
            @RequestParam(value = "block", required = false) String block,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", required = true, defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", required = true, defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            String namespace = "ICD-BLOCKS";
            String key = null;
            Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreICDDataByParams(namespace, key, version,
                    release, chapter, block, category, code, q, page, pageSize);
            for (Datastore datastore : pagedDatastoreData.getContent()) {
                namespaceDetails.add(datastore.getValue());
            }
            Map<String, Object> dataObject = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages", pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            dataObject.put("pager", pager);
            dataObject.put("results", namespaceDetails);
            return ResponseEntity.ok(dataObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "codeSystems/icd/chapters", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getICDCodeSystemsChapters(
            @RequestParam(value = "version", required = false) String version,
            @RequestParam(value = "release", required = false) String release,
            @RequestParam(value = "chapter", required = false) String chapter,
            @RequestParam(value = "block", required = false) String block,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", required = true, defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", required = true, defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        try {
            String namespace = "ICD-CHAPTERS";
            String key = null;
            Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreICDDataByParams(namespace, key, version,
                    release, chapter, block, category, code, q, page, pageSize);
            for (Datastore datastore : pagedDatastoreData.getContent()) {
                namespaceDetails.add(datastore.getValue());
            }
            Map<String, Object> dataObject = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages", pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            dataObject.put("pager", pager);
            dataObject.put("results", namespaceDetails);
            return ResponseEntity.ok(dataObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "codeSystems/loinc", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getLOINCCodeSystemData(
            @RequestParam(value = "version", required = false) String version,
            @RequestParam(value = "release", required = false) String release,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", required = true, defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", required = true, defaultValue = "10") Integer pageSize) throws Exception {
        Map<String, Object> returnDataObject = new HashMap<>();
        String namespace = "LOINC";
        try {
            String key = null;
            List<Map<String, Object>> codes = new ArrayList<>();
            Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreMatchingParams(namespace, key, version,
                    release, code, q, page, pageSize, null);
            List<Datastore> datastoreList = pagedDatastoreData.getContent();
            for (Datastore datastore : datastoreList) {
                codes.add(datastore.getValue());
            }
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages", pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            returnDataObject.put("results", codes);
            returnDataObject.put("pager", pager);
            return ResponseEntity.ok(returnDataObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "datastore", produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> saveDatastore(@RequestBody Datastore datastore,
            @RequestParam(value = "update", required = false) Boolean update) throws Exception {
        String namespace = datastore.getNamespace();
        String dataKey = datastore.getDataKey();
        // Check if exists provided update is set to true
        try {
            if (update != null && update.equals(true)) {
                Datastore existingDatastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey);
                if (existingDatastore != null) {
                    existingDatastore.setValue(datastore.getValue());
                    existingDatastore.setDatastoreGroup(datastore.getDatastoreGroup() != null ? datastore.getDatastoreGroup() : existingDatastore.getDatastoreGroup());
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
    public ResponseEntity<List<Map<String, Object>>> getClientsVisitsDataByNamespace(
            @PathVariable("namespace") String namespace) throws Exception {
        try {
            List<Map<String, Object>> clientDetails = new ArrayList<>();
            for (Datastore datastore : datastoreService.getClientsVisitsDataByNameSpace(namespace)) {
                clientDetails.add(datastore.toMap());
            }
            return ResponseEntity.ok(clientDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("clientsVisitsByKey/{key}")
    public ResponseEntity<List<Map<String, Object>>> getClientsVisitsDataByKey(@PathVariable("key") String key)
            throws Exception {
        try {
            List<Map<String, Object>> clientDetails = new ArrayList<>();
            for (Datastore datastore : datastoreService.getClientsVisitsDataByKey(key)) {
                clientDetails.add(datastore.toMap());
            }
            return ResponseEntity.ok(clientDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("clientsVisits")
    public ResponseEntity<List<Map<String, Object>>> getClientsVisits(@RequestParam(value = "key") String key,
            @RequestParam(value = "ageType") String ageType,
            @RequestParam(value = "startAge") Integer startAge,
            @RequestParam(value = "endAge") Integer endAge,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "diagnosis", required = false) String diagnosis) throws Exception {
        try {
            List<Map<String, Object>> mappedData = new ArrayList<>();
            for (Datastore datastore : datastoreService.getClientsVisits(key, ageType, startAge, endAge, gender,
                    diagnosis)) {
                mappedData.add(datastore.toMap());
            }
            return ResponseEntity.ok(mappedData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "generateAggregateData", produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getAggregateVisits(@RequestBody Map<String, Object> requestParams)
            throws Exception {
        try {
            Map<String, Object> results = new HashMap<>();
            List<Map<String, Object>> data = new ArrayList<>();
            String pattern = "yyyy-MM-dd";
            Map<String, Object> mappings = (Map<String, Object>) requestParams.get("mappings");
            Map<String, Object> orgUnit = (Map<String, Object>) requestParams.get("orgUnit");
            String mappingsNamespace = mappings.get("namespace").toString();
            List<Datastore> storedToolMappings = datastoreService.getDatastoreNamespaceDetails(mappingsNamespace);
            SimpleDateFormat formatter = new SimpleDateFormat(pattern);
            for (Datastore storedToolMapping : storedToolMappings) {
                String mappingsKey = storedToolMapping.getDataKey();
                for (Map<String, Object> requestParam : (List<Map<String, Object>>) storedToolMapping.getValue()
                        .get("params")) {
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
                                orgUnit.get("code").toString());
                    } else if (storedToolMapping.getValue().get("type").equals("visitDetails.newThisYear")) {
                        requestedData = datastoreService.getAggregatedVisitsData(
                                requestParams.get("startDate").toString(),
                                requestParams.get("endDate").toString(),
                                requestParam.get("ageType").toString(),
                                (Integer) requestParam.get("startAge"),
                                (Integer) requestParam.get("endAge"),
                                requestParam.get("gender").toString(),
                                orgUnit.get("code").toString(),
                                "true");
                    } else if (storedToolMapping.getValue().get("type").equals("visitDetails.new")) {
                        requestedData = datastoreService.getAggregatedNewOrRepeatVisitsData(
                                requestParams.get("startDate").toString(),
                                requestParams.get("endDate").toString(),
                                requestParam.get("ageType").toString(),
                                (Integer) requestParam.get("startAge"),
                                (Integer) requestParam.get("endAge"),
                                requestParam.get("gender").toString(),
                                orgUnit.get("code").toString(),
                                "true");
                    } else if (storedToolMapping.getValue().get("type").equals("visitDetails.repeat")) {
                        requestedData = datastoreService.getAggregatedNewOrRepeatVisitsData(
                                requestParams.get("startDate").toString(),
                                requestParams.get("endDate").toString(),
                                requestParam.get("ageType").toString(),
                                (Integer) requestParam.get("startAge"),
                                (Integer) requestParam.get("endAge"),
                                requestParam.get("gender").toString(),
                                orgUnit.get("code").toString(),
                                "false");
                    } else if (storedToolMapping.getValue().get("type").equals("paymentCategoryDetails")) {
                        requestedData = datastoreService.getAggregatedVisitsDataByPaymentCategory(
                                requestParams.get("startDate").toString(),
                                requestParams.get("endDate").toString(),
                                requestParam.get("ageType").toString(),
                                (Integer) requestParam.get("startAge"),
                                (Integer) requestParam.get("endAge"),
                                requestParam.get("gender").toString(),
                                orgUnit.get("code").toString(),
                                requestParam.get("paymentCategory").toString());
                    } else if (storedToolMapping.getValue().get("type").equals("outcomeDetails.referred")) {
                        requestedData = datastoreService.getAggregatedVisitsDataByReferralDetails(
                                requestParams.get("startDate").toString(),
                                requestParams.get("endDate").toString(),
                                requestParam.get("ageType").toString(),
                                (Integer) requestParam.get("startAge"),
                                (Integer) requestParam.get("endAge"),
                                requestParam.get("gender").toString(),
                                orgUnit.get("code").toString(),
                                "true");
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
                                orgUnit.get("code").toString());
                    }
                    BigInteger value = null;
                    if (requestedData != null && requestedData.size() > 0) {
                        value = (BigInteger) requestedData.get(0).get("aggregated");
                    } else {
                        value = BigInteger.valueOf(0);
                    }
                    dataValue.put("value", value);
                    dataValue.put("dataElement", ((Map<String, Object>) storedToolMapping.getValue().get("dataElement"))
                            .get("id").toString());
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
    public ResponseEntity<Map<String, Object>> getAggregateDataByStartDateAndEndDate(
            @RequestParam(value = "id") String id,
            @RequestParam(value = "startDate") String startDate,
            @RequestParam(value = "endDate") String endDate) throws Exception {
        try {
            Map<String, Object> results = Maps.newHashMap();
            List<Map<String, Object>> dailyAggregatedDataList = datastoreService
                    .getAggregateDataFromDailyAggregatedData(id, startDate, endDate);
            results.put("data", dailyAggregatedDataList);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private List<Map<String, Object>> formatDatastoreObject(List<Datastore> datastoreList) throws Exception {
        List<Map<String, Object>> formattedItems = new ArrayList<>();
        for (Datastore datastore : datastoreList) {
            Map<String, Object> codeDetails = datastore.getValue();
            formattedItems.add(codeDetails);
        }
        return formattedItems;
    }

    private DataTemplateDataDTO createEmptyDataTemplateData(DataTemplateDTO dataTemplate) {
        DataTemplateDataDTO emptyData = new DataTemplateDataDTO();
        emptyData.setListGrid(new ArrayList<>());
        emptyData.setClientIdentifiersPool(new ArrayList<>());
        if (dataTemplate != null && dataTemplate.getData() != null) {
            emptyData.setFacilityDetails(dataTemplate.getData().getFacilityDetails());
            emptyData.setReportDetails(dataTemplate.getData().getReportDetails());
        }
        return emptyData;
    }

    private LabRecordsDataDTO createEmptyLabDataTemplate(LabDataTemplateDTO labData){
        LabRecordsDataDTO emptyLabRecordsDTO = new LabRecordsDataDTO();
        emptyLabRecordsDTO.setLabRequestDetails(new ArrayList<>());
        if(labData != null && labData.getData() != null){
            emptyLabRecordsDTO.setFacilityDetails(labData.getData().getFacilityDetails());
            emptyLabRecordsDTO.setReportDetails(labData.getData().getReportDetails());
        }

        return emptyLabRecordsDTO;
    }

    private String generateUserFriendlyIdentifier(DemographicDetailsDTO details, int index) {
        if (details == null) {
            return "Record at index " + index + " (Missing Demographic Details)";
        }
        // Try MRN from identifiers
        if (!CollectionUtils.isEmpty(details.getIdentifiers())) {
            Optional<IdentifierDTO> mrn = details.getIdentifiers().stream()
                    .filter(id -> id != null && "MRN".equalsIgnoreCase(id.getType())
                            && !StringUtils.isEmpty(id.getId()))
                    .findFirst();
            if (mrn.isPresent())
                return "MRN=" + mrn.get().getId().trim();

            Optional<IdentifierDTO> first = details.getIdentifiers().stream()
                    .filter(id -> id != null && !StringUtils.isEmpty(id.getType()) && !StringUtils.isEmpty(id.getId()))
                    .findFirst();
            if (first.isPresent())
                return first.get().getType() + "=" + first.get().getId().trim();
        }
        // Try Name + DOB
        String name = Stream.of(details.getFirstName(), details.getLastName())
                .filter(s -> !StringUtils.isEmpty(s))
                .collect(Collectors.joining(" "));
        String dob = details.getDateOfBirth();
        if (!StringUtils.isEmpty(name) || !StringUtils.isEmpty(dob)) {
            return String.format("%s (DOB: %s)",
                    StringUtils.isEmpty(name) ? "N/A" : name.trim(),
                    StringUtils.isEmpty(dob) ? "N/A" : dob.trim());
        }
        return "Record at index " + index;
    }

}
