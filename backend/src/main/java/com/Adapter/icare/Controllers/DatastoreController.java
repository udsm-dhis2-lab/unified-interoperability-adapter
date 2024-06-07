package com.Adapter.icare.Controllers;


import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Services.DatastoreService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/datastore")
public class DatastoreController {

    private final DatastoreService datastoreService;

    public  DatastoreController(DatastoreService datastoreService) {
        this.datastoreService = datastoreService;
    }

    @GetMapping()
    public List<Datastore> getDatastoreList() throws Exception {
        return datastoreService.getDatastore();
    }

    @GetMapping("{uuid}")
    public Datastore getDatastoreByUuid(@PathVariable("uuid") String uuid) throws Exception {
        return  datastoreService.getDatastoreByUuid(uuid);
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
