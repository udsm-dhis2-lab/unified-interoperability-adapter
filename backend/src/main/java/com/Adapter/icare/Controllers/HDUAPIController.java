package com.Adapter.icare.Controllers;

import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Services.DatastoreService;
import com.Adapter.icare.Services.MediatorsService;
import com.google.common.collect.Maps;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

    public  HDUAPIController(DatastoreService datastoreService, MediatorsService mediatorsService) {
        this.datastoreService = datastoreService;
        this.mediatorsService = mediatorsService;
    }


    @GetMapping("dataTemplates")
    public Map<String, Object> getDataTemplatesList (@RequestParam(value = "id", required = false) String id, @RequestParam(value = "uuid", required = false) String uuid) throws Exception {
        // NB: Since data templates are JSON type metadata stored on datastore, then dataTemplates namespace has been used to retrieve the configs
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

        return  dataTemplatesResults;
    }
    @GetMapping("dataTemplates/examples")
    public Map<String, Object> getDataTemplatesExamples (@RequestParam(value = "id", required = false) String id) throws Exception {
        // NB: Since data templates are JSON type metadata stored on datastore, then dataTemplates namespace has been used to retrieve the configs
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
        return dataTemplatesExampleObject;
    }

    @PostMapping(value = "dataTemplates", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public String passDataToMediator(@RequestBody Map<String, Object> data) throws Exception {
        /**
         * Send data to Mediator where all the logics will be done.
         */
        return mediatorsService.sendDataToMediatorWorkflow(data);
    }

    @DeleteMapping("datastore/{uuid}")
    public Map<String, Object> deleteDatastore(@PathVariable("uuid") String uuid) throws Exception {
        Datastore datastore = datastoreService.getDatastoreByUuid(uuid);
        Map<String, Object> returnObj = new HashMap<>();
        returnObj.put("uuid", uuid);
        returnObj.put("dataKey", datastore.getDataKey());
        returnObj.put("namespace", datastore.getNamespace());
        returnObj.put("message", "Successful deleted");
        datastoreService.deleteDatastore(uuid);
        return returnObj;
    }

    // CUSTOM implementation for supporting HDU API temporarily
    @GetMapping(value="{namespace}", produces = APPLICATION_JSON_VALUE)
    public Map<String, Object> getDatastoreByNamespace(@PathVariable("namespace") String namespace,
                                                       @RequestParam(value="category", required = false) String category,
                                                       @RequestParam(value="department", required = false) String department,
                                                       @RequestParam(value="q",required = false) String q,
                                                       @RequestParam(value="code",required = false) String code,
                                                       @RequestParam(value = "page", required = true, defaultValue = "1") Integer page,
                                                       @RequestParam(value = "pageSize", required = true, defaultValue = "10") Integer pageSize) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        Page<Datastore> pagedDatastoreData = datastoreService.getDatastoreNamespaceDetailsByPagination(namespace, category, department, q, code, page,pageSize);
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
        return returnObject;
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
                pagedDatastoreData =   datastoreService.getDatastoreMatchingParams(namespace,key,version,release,code,q,page,pageSize);
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
            } else if (block != null) {
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
            }else if (category != null) {
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
            }
            return ResponseEntity.ok(returnDataObject);
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
            Page<Datastore> pagedDatastoreData =   datastoreService.getDatastoreMatchingParams(namespace,key,version,release,code,q,page,pageSize);
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
    public Map<String, Object> saveDatastore(@RequestBody Datastore datastore, @RequestParam(value="update",required = false) Boolean update) throws Exception {
        String namespace = datastore.getNamespace();
        String dataKey = datastore.getDataKey();
        // Check if exists provided update is set to true
        if (update != null && update.equals(true)) {
            Datastore existingDatastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey);
            if (existingDatastore != null) {
                existingDatastore.setValue(datastore.getValue());
                return datastoreService.updateDatastore(existingDatastore).toMap();
            } else {
                return datastoreService.saveDatastore(datastore).toMap();
            }
        } else {
            return datastoreService.saveDatastore(datastore).toMap();
        }
    }

    @GetMapping("clientsVisitsByNamespace/{namespace}")
    public List<Map<String,Object>> getClientsVisitsDataByNamespace(@PathVariable("namespace") String namespace) throws Exception {
        List<Map<String, Object>> clientDetails = new ArrayList<>();
        for (Datastore datastore: datastoreService.getClientsVisitsDataByNameSpace(namespace)) {
            clientDetails.add(datastore.toMap());
        }
        return clientDetails;
    }

    @GetMapping("clientsVisitsByKey/{key}")
    public List<Map<String,Object>> getClientsVisitsDataByKey(@PathVariable("key") String key) throws Exception {
        List<Map<String, Object>> clientDetails = new ArrayList<>();
        for (Datastore datastore: datastoreService.getClientsVisitsDataByKey(key)) {
            clientDetails.add(datastore.toMap());
        }
        return clientDetails;
    }

    @GetMapping("clientsVisits")
    public List<Map<String,Object>> getClientsVisits(@RequestParam(value = "key") String key,
                                            @RequestParam(value = "ageType") String ageType,
                                            @RequestParam(value = "startAge") Integer startAge,
                                            @RequestParam(value = "endAge") Integer endAge,
                                            @RequestParam(value = "gender", required = false) String gender,
                                            @RequestParam(value = "diagnosis", required = false) String diagnosis) throws Exception {
        List<Map<String,Object>> mappedData = new ArrayList<>();
        for(Datastore datastore: datastoreService.getClientsVisits(key, ageType, startAge, endAge, gender, diagnosis)) {
            mappedData.add(datastore.toMap());
        }
        return mappedData;
    }

    @PostMapping(value = "generateAggregateData",produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
    public Map<String, Object> getAggregateVisits(@RequestBody Map<String, Object> requestParams) throws Exception {
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
        return results;
    }

    @GetMapping("aggregatedData")
    public Map<String, Object> getAggregateDataByStartDateAndEndDate(@RequestParam(value = "id") String id,
                                                                     @RequestParam(value = "startDate") String startDate,
                                                                     @RequestParam(value = "endDate") String endDate
    ) throws Exception {
        Map<String, Object> results = Maps.newHashMap();
        List<Map<String, Object>> dailyAggregatedDataList =  datastoreService.getAggregateDataFromDailyAggregatedData(id,startDate,endDate);
        results.put("data", dailyAggregatedDataList);
        return results;
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
