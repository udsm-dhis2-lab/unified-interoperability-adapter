package com.Adapter.icare.Controllers;


import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Services.MediatorsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/")
public class MediatorsController {

    private final  MediatorsService mediatorsService;

    public MediatorsController(MediatorsService mediatorsService) {
        this.mediatorsService = mediatorsService;
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
    public List<Map<String, Object>> getDataTemplatesList () throws Exception {
        return  mediatorsService.getDataTemplatesList();
    }

    @GetMapping("dataTemplates/{id}")
    public Map<String, Object> getDataTemplateById(@PathVariable("id") String id) throws Exception {
        return mediatorsService.getDataTemplateById(id);
    }

    @PostMapping(value = "dataTemplates", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public String passDataToMediator(@RequestBody Map<String, Object> data) throws Exception {
        /**
         * Send data to Mediator where all the logics will be done.
         */

        return mediatorsService.sendDataToMediator(data);
    }
}
