package com.Adapter.icare.Controllers;


import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Services.DatastoreService;
import com.Adapter.icare.Services.MediatorsService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/")
public class MediatorsController {

    private final  MediatorsService mediatorsService;
    private final DatastoreService datastoreService;

    public MediatorsController(MediatorsService mediatorsService, DatastoreService datastoreService) {
        this.mediatorsService = mediatorsService;
        this.datastoreService = datastoreService;
    }


    @GetMapping("mediators")
    public List<Mediator> getMediators() throws Exception {
        return mediatorsService.getMediatorsConfigs();
    }

    @PostMapping("mediators")
    public Mediator saveMediator(@RequestBody Mediator mediator) throws Exception {
        return mediatorsService.saveMediatorConfigs(mediator);
    }

    @PutMapping("mediators/{uuid}")
    public Mediator updateMediator(@PathVariable("uuid") String uuid, @RequestBody Mediator mediator) throws Exception {
        if (mediator.getUuid() == null) {
            mediator.setUuid(uuid);
        }
        return mediatorsService.updateMediator(mediator);
    }

    @DeleteMapping("mediators/{uuid}")
    public void deleteMediator(@PathVariable("uuid") String uuid) throws Exception {
         mediatorsService.deleteMediator(uuid);
    }

    @GetMapping("dataTemplates")
    public List<Map<String, Object>> getDataTemplatesList (@RequestParam String id) throws Exception {
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

//    @GetMapping("codeSystems")
//    public Map<String, Object> getCodeSystemsList() throws Exception {
//
//    }
}
