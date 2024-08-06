package com.Adapter.icare.Controllers;


import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Services.DatastoreService;
import com.google.common.collect.Maps;
import javassist.NotFoundException;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping("/api/v1/datastore")
public class DatastoreController {

    private final DatastoreService datastoreService;

    public  DatastoreController(DatastoreService datastoreService) {
        this.datastoreService = datastoreService;
    }

    @GetMapping()
    public Map<String, Object> getDatastoreList(@RequestParam(value = "uuid", required = false) String uuid) throws Exception {
        Map<String, Object> returnResultObject = new HashMap<>();
        if (uuid == null) {
            List<Datastore> datastoreResults = datastoreService.getDatastore();
            returnResultObject.put("results",datastoreResults);
        } else {
            returnResultObject = (Map<String, Object>) datastoreService.getDatastoreByUuid(uuid);
        }
        return returnResultObject;
    }

    @GetMapping(value="{namespace}", produces = APPLICATION_JSON_VALUE)
    public List<Datastore> getDatastoreByNamespace(@PathVariable("namespace") String namespace) throws Exception {
        return  datastoreService.getDatastoreNamespaceDetails(namespace);
    }

    @GetMapping(value="{namespace}/{key}",produces = APPLICATION_JSON_VALUE)
    public Datastore getDatastoreByNamespaceAndKey(@PathVariable("namespace") String namespace, @PathVariable("key") String dataKey) throws Exception {
        return  datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey);
    }


    @GetMapping(value="{namespace}/{key}/metaData",produces = APPLICATION_JSON_VALUE)
    public @ResponseBody Datastore getDatastoreMetadataByNamespaceAndKey(@PathVariable("namespace") String namespace, @PathVariable("key") String dataKey) throws Exception {
        Datastore datastore =  datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey);
        Datastore metaData = new Datastore();
        BeanUtils.copyProperties(metaData, datastore);
        metaData.setValue(null);
        return metaData;
    }

    @PostMapping(produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
    public Datastore saveDatastore(@RequestBody Datastore datastore, @RequestParam(value="update",required = false) Boolean update) throws Exception {
        String namespace = datastore.getNamespace();
        String dataKey = datastore.getDataKey();
        // Check if exists provided update is set to true
        if (update != null && update.equals(true)) {
           Datastore existingDatastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey);
           if (existingDatastore != null) {
               existingDatastore.setValue(datastore.getValue());
               return datastoreService.updateDatastore(existingDatastore);
           } else {
               return datastoreService.saveDatastore(datastore);
           }
        } else {
            return datastoreService.saveDatastore(datastore);
        }
    }

    @PostMapping(value = "{namespace}/{key}", produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
    public Datastore saveDatastore(@PathVariable(value = "namespace") String namespace, @PathVariable(value = "key") String key, @RequestBody Map<String, Object> datastoreValue) throws Exception {
        Datastore datastore = new Datastore();
        datastore.setNamespace(namespace);
        datastore.setDataKey(key);
        datastore.setValue(datastoreValue);
        return datastoreService.saveDatastore(datastore);
    }

    @PutMapping(value = "{uuid}", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public Datastore updateDatastore(@PathVariable("uuid") String uuid, @RequestBody Datastore datastore) throws Exception {
        if (datastore.getUuid() == null) {
            datastore.setUuid(uuid);
        }
        return datastoreService.updateDatastore(datastore);
    }

    @PutMapping(value = "{namespace}/{key}", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public Datastore updateDatastoreUsingNameSpaceAndKey(@PathVariable("namespace") String namespace, @PathVariable("key") String key, @RequestBody Datastore datastoreData) throws Exception {
        Datastore datastore =  datastoreService.getDatastoreByNamespaceAndKey(namespace, key);
        if (datastoreData.getUuid() == null) {
            datastoreData.setUuid(datastore.getUuid());
        }
        return datastoreService.updateDatastore(datastoreData);
    }

    @DeleteMapping("{uuid}")
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
    public Map<String, Object>     getAggregateVisits(@RequestBody Map<String, Object> requestParams) throws Exception {
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
            if (storedToolMapping.getValue().get("type").equals("diagnosisDetails")) {
                for(Map<String, Object> requestParam: (List<Map<String, Object>>) storedToolMapping.getValue().get("params")) {
                    Map<String, Object> dataValue = new HashMap<>();
                    List<Map<String, Object>> requestedData = datastoreService.getAggregatedDataByDiagnosisDetails(
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
