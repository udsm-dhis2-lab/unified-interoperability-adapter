package com.Adapter.icare.Controllers;

import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Services.DatastoreService;
import com.Adapter.icare.Services.MediatorsService;
import com.google.common.collect.Maps;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @PostMapping(value = "dataTemplates", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
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
    public List<Map<String, Object>> getDatastoreByNamespace(@PathVariable("namespace") String namespace) throws Exception {
        List<Map<String, Object>> namespaceDetails = new ArrayList<>();
        for (Datastore datastore: datastoreService.getDatastoreNamespaceDetails(namespace)) {
           namespaceDetails.add(datastore.toMap());
        }
        return  namespaceDetails;
    }

    @GetMapping(value="codeSystems/icd", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getICDCodeSystemData(@RequestParam(value = "version", required = false) String version,@RequestParam(value = "release", required = false) String release) throws Exception {
        Map<String, Object> returnDataObject = new HashMap<>();
        try {
            List<Map<String, Object>> chapters = new ArrayList<>();
            String key = "icd";
            if (version != null) {
                key = "icd".concat(version);
                // Load chapters data as per the version available for the year
                String chaptersNameSpace = "ICD-CHAPTERS";
                List<Datastore> chaptersDatastore = datastoreService.getDatastoreNamespaceDetails(chaptersNameSpace);
                for(Datastore datastore: chaptersDatastore) {
                    chapters.add(datastore.getValue());
                }
            }
            String namespace = "ICD";
            if (version == null) {
              namespace = "codeSystems";
            }

            returnDataObject = datastoreService.getDatastoreByNamespaceAndKey(namespace,key).getValue();
            // Load extended data
            returnDataObject.put("chapters", chapters);
            return ResponseEntity.ok(returnDataObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value="codeSystems/loinc", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getLOINCCodeSystemData(@RequestParam(value = "version", required = false) String version,@RequestParam(value = "release", required = false) String release) throws Exception {
        Map<String, Object> returnDataObject = new HashMap<>();
        String namespace = "LOINC";
        try {
            List<Map<String, Object>> codes = new ArrayList<>();
            List<Datastore> datastoreList = new ArrayList<>();
            if (version == null && release == null) {
                datastoreList =  datastoreService.getDatastoreNamespaceDetails(namespace);
            } else if (version != null && release == null) {
                datastoreList = datastoreService.getLOINCCodesByVersion(namespace,version);
            } else if (version == null) {
                datastoreList =datastoreService.getLOINCCOdesByReleaseYear(namespace,release);
            } else {
                datastoreList =datastoreService.getLOINCCOdesByVersionAndReleaseYear(namespace,version,release);
            }
            for (Datastore datastore: datastoreList) {
                Map<String, Object> codeDetails =datastore.getValue();
                Map<String, Object> selectedParameters = new HashMap<>();
                selectedParameters.put("code", codeDetails.get("code"));
                selectedParameters.put("name", codeDetails.get("name"));
                selectedParameters.put("release", codeDetails.get("release"));
                selectedParameters.put("version", codeDetails.get("version"));
                selectedParameters.put("status", codeDetails.get("status"));
                codes.add(selectedParameters);
            }
            returnDataObject.put("results", codes);
            return ResponseEntity.ok(returnDataObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
//
//    @GetMapping(value="codeSystems/{codeSystem}/{version}", produces = APPLICATION_JSON_VALUE)
//    public Map<String, Object> getCodeSystem(@PathVariable("codeSystem") String codeSystem, @PathVariable("version") String version) throws Exception {
//        String namespace = "codeSystems";
//        Map<String, Object> results = new HashMap<>();
//        if (codeSystem.equals("icd")) {
//            List<Map<String, Object>> chapters = new ArrayList<>();
//            String chaptersNameSpace = "ICD-CHAPTERS";
//            List<Datastore> chaptersDatastore = datastoreService.getDatastoreNamespaceDetails(chaptersNameSpace);
//            for(Datastore datastore: chaptersDatastore) {
//                if (datastore.getDataKey().contains(version)) {
//                    chapters.add(datastore.toMap());
//                }
//            }
//            List<Map<String, Object>> codeSystemsData = datastoreService.getDatastoreByNamespaceKeyAndVersion( namespace, codeSystem, version);
//            results = datastoreService.getDatastoreByNamespaceAndKey( namespace,codeSystem.concat(version)).toMap();
//            results.put("chapters", chapters);
//        } else {
//            List<Map<String, Object>> loincData = new ArrayList<>();
//            List<Datastore> chaptersDatastore = datastoreService.getDatastoreNamespaceDetails(codeSystem);
//            for(Datastore datastore: chaptersDatastore) {
//                if (datastore.getDataKey().contains(version)) {
//                    loincData.add(datastore.toMap());
//                }
//            }
//            String key = "loinc-".concat(version);
//            results =  datastoreService.getDatastoreByNamespaceAndKey( namespace,key).toMap();
//            results.put("codes", loincData);
//        }
//        return results;
//    }
//
//    @GetMapping(value="codeSystems/{codeSystem}/{version}/{releaseYear}", produces = APPLICATION_JSON_VALUE)
//    public Map<String, Object> getCodeSystemData(@PathVariable("codeSystem") String codeSystem, @PathVariable("version") String version, @PathVariable("releaseYear") String releaseYear) throws Exception {
//        List<Map<String, Object>> blocks = new ArrayList<>();
//        String namespace = "codeSystems";
//        Map<String, Object> results = new HashMap<>();
//        if (codeSystem.equals("icd")) {
//            String blocksNameSpace = "ICD-BLOCKS";
//            List<Datastore> chaptersDatastore = datastoreService.getDatastoreNamespaceDetails(blocksNameSpace);
//            for(Datastore datastore: chaptersDatastore) {
//                if (datastore.getDataKey().contains(version) && datastore.getValue().get("release").equals(releaseYear)) {
//                    blocks.add(datastore.toMap());
//                }
//            }
//            results = datastoreService.getDatastoreByNamespaceAndKey( namespace,codeSystem.concat(version)).toMap();
//            results.put("chapters", blocks);
//        }
//        return results;
//    }
//
//    @GetMapping(value="codeSystems/{codeSystem}/{version}/{releaseYear}/{chapter}", produces = APPLICATION_JSON_VALUE)
//    public Map<String, Object> getCodeSystemChapterData(@PathVariable("codeSystem") String codeSystem,
//                                                        @PathVariable("version") String version,
//                                                        @PathVariable("releaseYear") String releaseYear,
//                                                        @PathVariable("chapter") String chapter) throws Exception {
//        // TODO: Improve to accommodate release year and version filtering
//        Map<String, Object> results = new HashMap<>();
//        if (codeSystem.equals("icd")) {
//            String namespace = "ICD-CHAPTERS";
//            String key = version.concat("-").concat(chapter);
//            results = datastoreService.getDatastoreByNamespaceAndKey( namespace,key).toMap();
//        } else {
//            if (chapter.equals("lab")) {
//                // For LOINC
//                String namespace = "LOINC";
//                List<Map<String, Object>> codes = new ArrayList<>();
//                for (Datastore datastore: datastoreService.getDatastoreNamespaceDetails(namespace)) {
//                    Map<String, Object> codeDetails = (Map<String, Object>) datastore.toMap().get("value");
//                    Map<String, Object> selectedParameters = new HashMap<>();
//                    selectedParameters.put("code", codeDetails.get("code"));
//                    selectedParameters.put("name", codeDetails.get("name"));
//                    selectedParameters.put("status", codeDetails.get("status"));
//                    codes.add(selectedParameters);
//                }
//                results.put("results", codes);
//            }
//        }
//        return results;
//    }
//
//    @GetMapping(value="codeSystems/icd/{version}/{releaseYear}/{chapter}/{block}", produces = APPLICATION_JSON_VALUE)
//    public Map<String, Object> getICDCodeSystemBlockData(@PathVariable("version") String version,
//                                                        @PathVariable("releaseYear") String releaseYear,
//                                                        @PathVariable("chapter") String chapter,
//                                                         @PathVariable("block") String block) throws Exception {
//        // TODO: Improve to accommodate release year, version, chapter filtering
//        Map<String, Object> results = new HashMap<>();
//        String namespace = "ICD-BLOCKS";
//        results = datastoreService.getDatastoreByNamespaceAndKey( namespace, block).toMap();
//        return results;
//    }
//
//    @GetMapping(value="codeSystems/loinc/{version}/{releaseYear}/{chapter}/{code}", produces = APPLICATION_JSON_VALUE)
//    public Map<String, Object> getLOINCCodeSystemCodeData(@PathVariable("version") String version,
//                                                         @PathVariable("releaseYear") String releaseYear,
//                                                         @PathVariable("chapter") String chapter,
//                                                         @PathVariable("code") String code) throws Exception {
//        // TODO: Improve to accommodate release year and chapter filtering
//        Map<String, Object> results = new HashMap<>();
//       if (chapter.equals("lab")) {
//           String namespace = "LOINC";
//           results = datastoreService.getDatastoreByNamespaceAndKey( namespace, version.concat("-").concat(code)).toMap();
//       }
//        return results;
//    }
//
//    @GetMapping(value="codeSystems/icd/{version}/{releaseYear}/{chapter}/{block}/{category}", produces = APPLICATION_JSON_VALUE)
//    public Map<String, Object> getICDCodeSystemCategoryData(@PathVariable("version") String version,
//                                                            @PathVariable("releaseYear") String releaseYear,
//                                                            @PathVariable("chapter") String chapter,
//                                                            @PathVariable("block") String block,
//                                                            @PathVariable("category") String category) throws Exception {
//        // TODO: Improve to accommodate release year, version, chapter filtering
//        Map<String, Object> results = new HashMap<>();
//        String namespace = "ICD-CATEGORIES";
//        results = datastoreService.getDatastoreByNamespaceAndKey( namespace, category).toMap();
//        return results;
//    }
//
//    @GetMapping(value="codeSystems/icd/{version}/{releaseYear}/{chapter}/{block}/{category}/{code}", produces = APPLICATION_JSON_VALUE)
//    public Map<String, Object> getICDCodeSystemCodeData(@PathVariable("version") String version,
//                                                        @PathVariable("releaseYear") String releaseYear,
//                                                        @PathVariable("chapter") String chapter,
//                                                        @PathVariable("block") String block,
//                                                        @PathVariable("category") String category,
//                                                        @PathVariable("code") String code) throws Exception {
//        // TODO: Improve to accommodate release year, version, chapter, block, category filtering
//        Map<String, Object> results = new HashMap<>();
//        String namespace = "ICD-CODES";
//        results = datastoreService.getDatastoreByNamespaceAndKey( namespace, code).toMap();
//        return results;
//    }

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
}
