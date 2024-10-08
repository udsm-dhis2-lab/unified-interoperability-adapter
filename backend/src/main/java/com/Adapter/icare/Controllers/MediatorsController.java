package com.Adapter.icare.Controllers;


import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Services.DatastoreService;
import com.Adapter.icare.Services.MediatorsService;
import com.Adapter.icare.Services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;

    public MediatorsController(MediatorsService mediatorsService,
                               DatastoreService datastoreService,
                               UserService userService) {
        this.mediatorsService = mediatorsService;
        this.datastoreService = datastoreService;
        this.userService = userService;
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService.getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
    }


    @GetMapping("mediators")
    public ResponseEntity<List<Mediator>> getMediators() throws Exception {
        try {
            return ResponseEntity.ok(mediatorsService.getMediatorsConfigs());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("mediators")
    public ResponseEntity<Mediator> saveMediator(@RequestBody Mediator mediator) throws Exception {
        try {
            if (this.authentication != null && this.authenticatedUser != null) {
                mediator.setCreatedBy(this.authenticatedUser);
            }
            return ResponseEntity.ok(mediatorsService.saveMediatorConfigs(mediator));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("mediators/{uuid}")
    public ResponseEntity<Mediator> updateMediator(@PathVariable("uuid") String uuid, @RequestBody Mediator mediator) throws Exception {
        try {
            if (mediator.getUuid() == null) {
                mediator.setUuid(uuid);
                if (this.authentication != null && this.authenticatedUser != null) {
                    mediator.setLastUpdatedBy(this.authenticatedUser);
                }
            }
            return ResponseEntity.ok(mediatorsService.updateMediator(mediator));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("mediators/{uuid}")
    public void deleteMediator(@PathVariable("uuid") String uuid) throws Exception {
         try {
             mediatorsService.deleteMediator(uuid);
         } catch (Exception e) {
             throw new Exception("Issue with deleting resource");
         }
    }

    @GetMapping("dataTemplates")
    public ResponseEntity<List<Map<String, Object>>> getDataTemplatesList (@RequestParam(required = false) String id) throws Exception {
        // NB: Since data templates are JSON type metadata stored on datastore, then dataTemplates namespace has been used to retrieve the configs
        try {
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
            return ResponseEntity.ok(dataTemplates);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("dataTemplates/{uuid}")
    public ResponseEntity<Map<String, Object>> getDataTemplateByUuid(@PathVariable("uuid") String uuid) throws Exception {
        try {
            Datastore datastore = datastoreService.getDatastoreByUuid(uuid);
            if (datastore == null) {
                throw new Exception("Data template for the uuid " + uuid + " does not exists");
            }
            return ResponseEntity.ok(datastore.getValue());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "dataTemplates", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public String passDataToMediator(@RequestBody Map<String, Object> data) throws Exception {
        /**
         * Send data to Mediator where all the logics will be done.
         */
        try {
            return mediatorsService.sendDataToMediatorWorkflow(data);
        } catch (Exception e) {
            throw new Exception("Issue with adding data template");
        }
    }
}
