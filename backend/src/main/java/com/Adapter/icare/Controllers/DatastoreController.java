package com.Adapter.icare.Controllers;


import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Services.DatastoreService;
import javassist.NotFoundException;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.web.bind.annotation.*;

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
    public Datastore saveDatastore(@RequestBody Datastore datastore) throws Exception {
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
    public Map<String, Object> getAggregateVisits(@RequestBody Map<String, Object> requestParams) throws Exception {
        Map<String, Object> results = new HashMap<>();
        List<Map<String, Object>> data = new ArrayList<>();
        String pattern = "yyyy-MM-dd";
        Map<String, Object> mappings = (Map<String, Object>) requestParams.get("mappings");
        String mappingsNamespace = mappings.get("namespace").toString();
        String mappingsKey = mappings.get("key").toString();
        SimpleDateFormat formatter = new SimpleDateFormat(pattern);
        for(Map<String, Object> requestParam: (List<Map<String, Object>>) requestParams.get("params")) {
            Map<String, Object> dataValue = new HashMap<>();
            List<Map<String, Object>> requestedData = datastoreService.getAggregatedData(
                    requestParams.get("startDate").toString(),
                    requestParams.get("endDate").toString(),
                    requestParam.get("ageType").toString(),
                    (Integer) requestParam.get("startAge"),
                    (Integer) requestParam.get("endAge"),
                    requestParam.get("gender").toString(),
                    mappingsNamespace, mappingsKey);
//            System.out.println(requestedData);
            dataValue.put("value", requestedData.get(0).get("aggregated"));
            data.add(dataValue);
        }
        results.put("data", data);
        return results;
    }
}
