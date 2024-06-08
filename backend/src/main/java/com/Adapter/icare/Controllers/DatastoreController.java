package com.Adapter.icare.Controllers;


import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Services.DatastoreService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @GetMapping("{namespace}")
    public List<Datastore> getDatastoreByNamespace(@PathVariable("namespace") String namespace) throws Exception {
        return  datastoreService.getDatastoreNamespaceDetails(namespace);
    }

    @GetMapping("{namespace}/{key}")
    public Datastore getDatastoreByNamespaceAndKey(@PathVariable("namespace") String namespace, @PathVariable("key") String dataKey) throws Exception {
        return  datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey);
    }

    @PostMapping()
    public Datastore saveDatastore(@RequestBody Datastore datastore) throws Exception {
        return datastoreService.saveDatastore(datastore);
    }

    @PutMapping("{uuid}")
    public Datastore updateDatastore(@PathVariable("uuid") String uuid, @RequestBody Datastore datastore) throws Exception {
        if (datastore.getUuid() == null) {
            datastore.setUuid(uuid);
        }
        return datastoreService.updateDatastore(datastore);
    }

    @DeleteMapping("{uuid}")
    public void deleteDatastore(@PathVariable("uuid") String uuid) throws Exception {
        datastoreService.deleteDatastore(uuid);
    }
}
