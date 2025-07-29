package com.Adapter.icare.Controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.DataFormatException;

import org.apache.commons.beanutils.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Services.DatastoreService;
import com.Adapter.icare.Services.UserService;

import javax.xml.crypto.Data;

@RestController
@RequestMapping("/api/v1/datastore")
public class DatastoreController {

    private final DatastoreService datastoreService;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;

    public DatastoreController(DatastoreService datastoreService, UserService userService) {
        this.datastoreService = datastoreService;
        this.userService = userService;
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService
                    .getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
    }

    // @GetMapping()
    // public ResponseEntity<Map<String, Object>>
    // getDatastoreList(@RequestParam(value = "uuid", required = false) String uuid)
    // throws Exception {
    // try {
    // Map<String, Object> returnResultObject = new HashMap<>();
    // if (uuid == null) {
    // List<Datastore> datastoreResults = datastoreService.getDatastore();
    // returnResultObject.put("results",datastoreResults);
    // } else {
    // returnResultObject = datastoreService.getDatastoreByUuid(uuid).toMap();
    // }
    // return ResponseEntity.ok(returnResultObject);
    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    // }
    // }

    @GetMapping(value = "{namespace}", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getDatastoreByNamespace(@PathVariable("namespace") String namespace,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) throws Exception {
        try {
            Map<String, Object> returnObject = new HashMap<>();
            Page<Datastore> pagedDatastoreData = null;
            pagedDatastoreData = datastoreService.getDatastoreNamespaceDetailsByPagination(namespace, null, null, q,
                    null, null, page, pageSize, true);
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages", pagedDatastoreData.getTotalPages());
            pager.put("total", pagedDatastoreData.getTotalElements());
            List<Datastore> datastoreList = pagedDatastoreData.getContent();
            List<Map<String, Object>> itemsList = new ArrayList<>();
            for (Datastore datastore : datastoreList) {
                itemsList.add(datastore.toMap());
            }
            returnObject.put("results", itemsList);
            returnObject.put("pager", pager);
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "{namespace}/{key}", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getDatastoreByNamespaceAndKey(
            @PathVariable("namespace") String namespace, @PathVariable("key") String dataKey) throws Exception {
        try {
            return ResponseEntity.ok(datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey).toMap());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "{namespace}/{key}/metaData", produces = APPLICATION_JSON_VALUE)
    public @ResponseBody ResponseEntity<Map<String, Object>> getDatastoreMetadataByNamespaceAndKey(
            @PathVariable("namespace") String namespace, @PathVariable("key") String dataKey) throws Exception {
        try {
            Datastore datastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey);
            Datastore metaData = new Datastore();
            BeanUtils.copyProperties(metaData, datastore);
            metaData.setValue(null);
            return ResponseEntity.ok(metaData.toMap());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(produces = APPLICATION_JSON_VALUE, consumes = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> saveDatastore(@RequestBody Datastore datastore,
            @RequestParam(value = "update", required = false) Boolean update) throws Exception {
        try {
            String namespace = datastore.getNamespace();
            String dataKey = datastore.getDataKey();
            // Check if exists provided update is set to true
            if (update != null && update.equals(true)) {
                Datastore existingDatastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, dataKey);
                if (existingDatastore != null) {
                    existingDatastore.setValue(datastore.getValue());
                    existingDatastore.setDatastoreGroup(datastore.getDatastoreGroup() != null ? datastore.getDatastoreGroup() : existingDatastore.getDatastoreGroup());
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
    public ResponseEntity<Map<String, Object>> saveDatastore(@PathVariable(value = "namespace") String namespace,
            @PathVariable(value = "key") String key, @RequestBody Map<String, Object> datastoreValue) throws Exception {
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
    public ResponseEntity<Map<String, Object>> updateDatastore(@PathVariable("uuid") String uuid,
            @RequestBody Datastore datastore) throws Exception {
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
    public ResponseEntity<Map<String, Object>> updateDatastoreUsingNameSpaceAndKey(
            @PathVariable("namespace") String namespace, @PathVariable("key") String key,
            @RequestBody Datastore datastoreData) throws Exception {
        try {
            Datastore datastore = datastoreService.getDatastoreByNamespaceAndKey(namespace, key);
            if (datastoreData.getUuid() == null) {
                datastoreData.setUuid(datastore.getUuid());
            }
            return ResponseEntity.ok(datastoreService.updateDatastore(datastoreData).toMap());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PutMapping(value = "namespace", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> updateDatastoreNamespace(
            @RequestBody Map<String, Object> namespacesObject
    ) throws Exception {
        try {
            String oldNamespace = null;
            String newNamespace = null;

            if (namespacesObject.containsKey("oldNamespace") && namespacesObject.get("oldNamespace") instanceof String) {
                oldNamespace = (String) namespacesObject.get("oldNamespace");
            }

            if (namespacesObject.containsKey("newNamespace") && namespacesObject.get("newNamespace") instanceof String) {
                newNamespace = (String) namespacesObject.get("newNamespace");
            }

            if(oldNamespace == null || newNamespace == null || oldNamespace.isEmpty() || newNamespace.isEmpty()){
                throw new DataFormatException("Old Namespace and New Namespace should be specified in your request body!");
            }

            List<Datastore> existingNamespace = datastoreService.getDatastoreNamespaceDetails(newNamespace);

            if(!existingNamespace.isEmpty()){
                throw new DataFormatException("New namespace is already existing!");
            }


            Integer updatedRecords = datastoreService.updateDatastoreNamespace(oldNamespace, newNamespace);
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("message", "Namespace updated successfully!");
            responseMap.put("value", updatedRecords + " number of records using this namespace where updated!");
            return ResponseEntity.ok().body(responseMap);
        } catch (DataFormatException e) {
            Map<String, Object> errorMap = new HashMap<String, Object>();
            System.out.println("UPDATE_DATA_STORE_NAMESPACE_ERROR " + e);
            errorMap.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMap);
        }
        catch (Exception e) {
            Map<String, Object> errorMap = new HashMap<String, Object>();
            System.out.println("UPDATE_DATA_STORE_NAMESPACE_ERROR " + e);
            errorMap.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMap);
        }
    }

    @DeleteMapping(value = "namespace/{namespace}")
    public ResponseEntity<Map<String, Object>> updateDatastoreNamespace(
            @PathVariable("namespace") String namespace
    ) throws Exception {
        try {
            if(namespace == null || namespace.isEmpty()){
                throw new DataFormatException("Namespace should be specified!");
            }
            Integer updatedRecords = datastoreService.deleteDatastoreByNamespace(namespace);
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("message", "Namespace deleted successfully!");
            responseMap.put("value", updatedRecords + " number of records using this namespace where updated!");
            return ResponseEntity.ok(responseMap);
        } catch (DataFormatException e) {
            Map<String, Object> errorMap = new HashMap<String, Object>();
            System.out.println("DELETE_DATA_STORE_NAMESPACE_ERROR " + e);
            errorMap.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMap);
        }
        catch (Exception e) {
            Map<String, Object> errorMap = new HashMap<String, Object>();
            System.out.println("DELETE_DATA_STORE_NAMESPACE_ERROR " + e);
            errorMap.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMap);
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
