package com.Adapter.icare.Controllers;

import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Services.DatastoreService;
import com.google.common.collect.Maps;
import org.springframework.web.bind.annotation.*;

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

    public  HDUAPIController(DatastoreService datastoreService) {
        this.datastoreService = datastoreService;
    }


    @DeleteMapping("datastore/{uuid}")
    public void deleteDatastore(@PathVariable("uuid") String uuid) throws Exception {
        datastoreService.deleteDatastore(uuid);
    }

    // CUSTOM implementation for supporting HDU API temporarily
    @GetMapping("clientsVisitsByNamespace/{namespace}")
    public List<Datastore> getClientsVisitsDataByNamespace(@PathVariable("namespace") String namespace) throws Exception {
        return datastoreService.getClientsVisitsDataByNameSpace(namespace);
    }

    @GetMapping("clientsVisitsByKey/{key}")
    public List<Datastore> getClientsVisitsDataByKey(@PathVariable("key") String key) throws Exception {
        return datastoreService.getClientsVisitsDataByKey(key);
    }

    @GetMapping("clientsVisits")
    public List<Datastore> getClientsVisits(@RequestParam(value = "key") String key,
                                            @RequestParam(value = "ageType") String ageType,
                                            @RequestParam(value = "startAge") Integer startAge,
                                            @RequestParam(value = "endAge") Integer endAge,
                                            @RequestParam(value = "gender", required = false) String gender,
                                            @RequestParam(value = "diagnosis", required = false) String diagnosis) throws Exception {
        return datastoreService.getClientsVisits(key, ageType, startAge, endAge, gender, diagnosis);
    }

    @PostMapping(value = "generateAggregateData",produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
    public Map<String, Object> getAggregateVisits(@RequestBody Map<String, Object> requestParams) throws Exception {
        Map<String, Object> results = new HashMap<>();
        List<Map<String, Object>> data = new ArrayList<>();
        String pattern = "yyyy-MM-dd";
        Map<String, Object> mappings = (Map<String, Object>) requestParams.get("mappings");
        Map<String, Object> orgUnit = (Map<String, Object>) requestParams.get("orgUnit");
        String mappingsNamespace = mappings.get("namespace").toString();
        String mappingsKey = mappings.get("key").toString();
        List<Datastore> storedToolMappings = datastoreService.getDatastoreNamespaceDetails(mappingsNamespace);
        SimpleDateFormat formatter = new SimpleDateFormat(pattern);
        for (Datastore storedToolMapping: storedToolMappings) {
                for(Map<String, Object> requestParam: (List<Map<String, Object>>) storedToolMapping.getValue().get("params")) {
                    Map<String, Object> dataValue = new HashMap<>();
                    List<Map<String, Object>> requestedData = List.of();
                    if (storedToolMapping.getValue().get("type").equals("diagnosisDetails")) {
                        requestedData = datastoreService.getAggregatedData(
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
                                mappingsNamespace,
                                mappingsKey,
                                orgUnit.get("code").toString(),
                                true
                        );
                    } else if (storedToolMapping.getValue().get("type").equals("visitDetails.new")) {
                        requestedData = datastoreService.getAggregatedNewOrRepeatVisitsData(
                                requestParams.get("startDate").toString(),
                                requestParams.get("endDate").toString(),
                                requestParam.get("ageType").toString(),
                                (Integer) requestParam.get("startAge"),
                                (Integer) requestParam.get("endAge"),
                                requestParam.get("gender").toString(),
                                mappingsNamespace,
                                mappingsKey,
                                orgUnit.get("code").toString(),
                                true
                        );
                    } else if (storedToolMapping.getValue().get("type").equals("visitDetails.repeat")) {
                        requestedData = datastoreService.getAggregatedNewOrRepeatVisitsData(
                                requestParams.get("startDate").toString(),
                                requestParams.get("endDate").toString(),
                                requestParam.get("ageType").toString(),
                                (Integer) requestParam.get("startAge"),
                                (Integer) requestParam.get("endAge"),
                                requestParam.get("gender").toString(),
                                mappingsNamespace,
                                mappingsKey,
                                orgUnit.get("code").toString(),
                                false
                        );
                    }
//              System.out.println(requestedData);
                    dataValue.put("value", requestedData.get(0).get("aggregated"));
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
