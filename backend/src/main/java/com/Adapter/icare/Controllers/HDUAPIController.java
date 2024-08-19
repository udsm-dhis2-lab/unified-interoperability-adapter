package com.Adapter.icare.Controllers;

import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Services.DatastoreService;
import com.Adapter.icare.Services.MediatorsService;
import com.google.common.collect.Maps;
import org.springframework.http.MediaType;
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
    public List<Map<String, Object>> getDataTemplatesList (@RequestParam(value = "id", required = false) String id) throws Exception {
        // NB: Since data templates are JSON type metadata stored on datastore, then dataTemplates namespace has been used to retrieve the configs
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
        return  dataTemplates;

    }

    @GetMapping("dataTemplates/{uuid}")
    public Map<String, Object> getDataTemplateByUuid(@PathVariable("uuid") String uuid) throws Exception {
        Datastore datastore = datastoreService.getDatastoreByUuid(uuid);
        if (datastore == null) {
            throw new Exception("Data template for the uuid " + uuid + " does not exists");
        }
        return datastore.getValue();
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
