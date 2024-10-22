package com.Adapter.icare.Controllers;


import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Services.DatastoreService;
import com.Adapter.icare.Services.UserService;
import com.google.common.collect.Maps;
import javassist.NotFoundException;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;

    public  DatastoreController(DatastoreService datastoreService, UserService userService) {
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

//    @GetMapping()
//    public ResponseEntity<Map<String, Object>> getDatastoreList(@RequestParam(value = "uuid", required = false) String uuid) throws Exception {
//        try {
//            Map<String, Object> returnResultObject = new HashMap<>();
//            if (uuid == null) {
//                List<Datastore> datastoreResults = datastoreService.getDatastore();
//                returnResultObject.put("results",datastoreResults);
//            } else {
//                returnResultObject = datastoreService.getDatastoreByUuid(uuid).toMap();
//            }
//            return ResponseEntity.ok(returnResultObject);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }

    @GetMapping(value="{namespace}", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getDatastoreByNamespace(@PathVariable("namespace") String namespace,
                                                       @RequestParam(value="q", required = false) String q,
                                                       @RequestParam(value="page", defaultValue = "1") Integer page,
                                                       @RequestParam(value="pageSize", defaultValue = "10") Integer pageSize) throws Exception {
        try {
            Map<String, Object> returnObject = new HashMap<>();
            Page<Datastore> pagedDatastoreData = null;
            pagedDatastoreData = datastoreService.getDatastoreNamespaceDetailsByPagination(namespace, null, null, q, null, null, page, pageSize);
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
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value="{namespace}/{key}",produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getDatastoreByNamespaceAndKey(@PathVariable("namespace") String namespace, @PathVariable("key") String dataKey) throws Exception {
        try {
            return  ResponseEntity.ok(datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey).toMap());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping(value="{namespace}/{key}/metaData",produces = APPLICATION_JSON_VALUE)
    public @ResponseBody ResponseEntity<Map<String, Object>> getDatastoreMetadataByNamespaceAndKey(@PathVariable("namespace") String namespace, @PathVariable("key") String dataKey) throws Exception {
        try {
            Datastore datastore =  datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey);
            Datastore metaData = new Datastore();
            BeanUtils.copyProperties(metaData, datastore);
            metaData.setValue(null);
            return ResponseEntity.ok(metaData.toMap());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> saveDatastore(@RequestBody Datastore datastore, @RequestParam(value="update",required = false) Boolean update) throws Exception {
        try {
            String namespace = datastore.getNamespace();
            String dataKey = datastore.getDataKey();
            // Check if exists provided update is set to true
            if (update != null && update.equals(true)) {
                Datastore existingDatastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey);
                if (existingDatastore != null) {
                    existingDatastore.setValue(datastore.getValue());
                    if (this.authentication != null && this.authenticatedUser != null) {
                        existingDatastore.setLastUpdatedBy(this.authenticatedUser);
                    }
                    return ResponseEntity.ok(datastoreService.updateDatastore(existingDatastore).toMap());
                } else {
                    if (this.authentication != null && this.authenticatedUser != null) {
                        datastore.setCreatedBy(this.authenticatedUser);
                    }
                    return ResponseEntity.ok(datastoreService.saveDatastore(datastore).toMap());
                }
            } else {
                return ResponseEntity.ok(datastoreService.saveDatastore(datastore).toMap());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(value = "{namespace}/{key}", produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> saveDatastore(@PathVariable(value = "namespace") String namespace, @PathVariable(value = "key") String key, @RequestBody Map<String, Object> datastoreValue) throws Exception {
        try {
            Datastore datastore = new Datastore();
            datastore.setNamespace(namespace);
            datastore.setDataKey(key);
            datastore.setValue(datastoreValue);
            return ResponseEntity.ok(datastoreService.saveDatastore(datastore).toMap());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "{uuid}", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> updateDatastore(@PathVariable("uuid") String uuid, @RequestBody Datastore datastore) throws Exception {
        try {
            if (datastore.getUuid() == null) {
                datastore.setUuid(uuid);
            }
            if (authenticatedUser != null) {
                datastore.setLastUpdatedBy(authenticatedUser);
            }
            return ResponseEntity.ok(datastoreService.updateDatastore(datastore).toMap());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "{namespace}/{key}", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> updateDatastoreUsingNameSpaceAndKey(@PathVariable("namespace") String namespace, @PathVariable("key") String key, @RequestBody Datastore datastoreData) throws Exception {
        try {
            Datastore datastore =  datastoreService.getDatastoreByNamespaceAndKey(namespace, key);
            if (datastoreData.getUuid() == null) {
                datastoreData.setUuid(datastore.getUuid());
            }
            return ResponseEntity.ok(datastoreService.updateDatastore(datastoreData).toMap());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("{uuid}")
    public void deleteDatastore(@PathVariable("uuid") String uuid) throws Exception {
        try {
            datastoreService.deleteDatastore(uuid);
        } catch (Exception e) {
            throw new Exception("Issue with deleting user");
        }
    }
}
