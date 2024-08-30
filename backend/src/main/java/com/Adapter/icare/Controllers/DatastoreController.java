package com.Adapter.icare.Controllers;


import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Services.DatastoreService;
import com.google.common.collect.Maps;
import javassist.NotFoundException;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.data.domain.Page;
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
    public Map<String, Object> getDatastoreByNamespace(@PathVariable("namespace") String namespace,
                                                       @RequestParam(value="q", required = false) String q,
                                                       @RequestParam(value="page", defaultValue = "1") Integer page,
                                                       @RequestParam(value="pageSize", defaultValue = "10") Integer pageSize) throws Exception {
        Map<String, Object> returnObject = new HashMap<>();
        Page<Datastore> pagedDatastoreData = null;
        pagedDatastoreData = datastoreService.getDatastoreNamespaceDetailsByPagination(namespace, null, null, q, null, page, pageSize);
        Map<String, Object> pager = new HashMap<>();
        pager.put("page", page);
        pager.put("pageSize", pageSize);
        pager.put("totalPages",pagedDatastoreData.getTotalPages());
        pager.put("total", pagedDatastoreData.getTotalElements());
        List<Datastore> datastoreList = pagedDatastoreData.getContent();
        List<Map<String,Object>> itemsList = new ArrayList<>();
        for (Datastore datastore: datastoreList) {
            itemsList.add(datastore.toMap());
        }
        returnObject.put("results", itemsList);
        returnObject.put("pager",pager);
        return returnObject;
    }

    @GetMapping(value="{namespace}/{key}",produces = APPLICATION_JSON_VALUE)
    public Map<String, Object> getDatastoreByNamespaceAndKey(@PathVariable("namespace") String namespace, @PathVariable("key") String dataKey) throws Exception {
        return  datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey).toMap();
    }


    @GetMapping(value="{namespace}/{key}/metaData",produces = APPLICATION_JSON_VALUE)
    public @ResponseBody Map<String, Object> getDatastoreMetadataByNamespaceAndKey(@PathVariable("namespace") String namespace, @PathVariable("key") String dataKey) throws Exception {
        Datastore datastore =  datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey);
        Datastore metaData = new Datastore();
        BeanUtils.copyProperties(metaData, datastore);
        metaData.setValue(null);
        return metaData.toMap();
    }

    @PostMapping(produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
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

    @PostMapping(value = "{namespace}/{key}", produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
    public Map<String, Object> saveDatastore(@PathVariable(value = "namespace") String namespace, @PathVariable(value = "key") String key, @RequestBody Map<String, Object> datastoreValue) throws Exception {
        Datastore datastore = new Datastore();
        datastore.setNamespace(namespace);
        datastore.setDataKey(key);
        datastore.setValue(datastoreValue);
        return datastoreService.saveDatastore(datastore).toMap();
    }

    @PutMapping(value = "{uuid}", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public Map<String, Object> updateDatastore(@PathVariable("uuid") String uuid, @RequestBody Datastore datastore) throws Exception {
        if (datastore.getUuid() == null) {
            datastore.setUuid(uuid);
        }
        return datastoreService.updateDatastore(datastore).toMap();
    }

    @PutMapping(value = "{namespace}/{key}", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public Map<String, Object> updateDatastoreUsingNameSpaceAndKey(@PathVariable("namespace") String namespace, @PathVariable("key") String key, @RequestBody Datastore datastoreData) throws Exception {
        Datastore datastore =  datastoreService.getDatastoreByNamespaceAndKey(namespace, key);
        if (datastoreData.getUuid() == null) {
            datastoreData.setUuid(datastore.getUuid());
        }
        return datastoreService.updateDatastore(datastoreData).toMap();
    }

    @DeleteMapping("{uuid}")
    public void deleteDatastore(@PathVariable("uuid") String uuid) throws Exception {
        datastoreService.deleteDatastore(uuid);
    }
}
