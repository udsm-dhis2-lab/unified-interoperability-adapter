package com.Adapter.icare.Controllers;


import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Services.DatastoreService;
import com.Adapter.icare.Services.MediatorsService;
import com.Adapter.icare.Services.UserService;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<Map<String,Object>> getMediators(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "uuid", required = false) String uuid,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "category", required = false) String category
    ) throws Exception {
        try {
            List<Map<String, Object>> mediatorsList = new ArrayList<>();
            Page<Mediator> pagedMediatorData = mediatorsService.getMediatorsByPagination( page, pageSize, code, category);
            for (Mediator mediator: pagedMediatorData.getContent()) {
                mediatorsList.add(mediator.toMap());
            }
            Map<String, Object> returnObject =  new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages",pagedMediatorData.getTotalPages());
            pager.put("total", pagedMediatorData.getTotalElements());
            returnObject.put("pager",pager);
            returnObject.put("results", mediatorsList);
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("mediators")
    public ResponseEntity<Map<String,Object>> saveMediator(@RequestBody Mediator mediator) throws Exception {
        try {
            if (this.authentication != null && this.authenticatedUser != null) {
                mediator.setCreatedBy(this.authenticatedUser);
            }
            return ResponseEntity.ok(mediatorsService.saveMediatorConfigs(mediator).toMap());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("mediators/{uuid}")
    public ResponseEntity<Map<String,Object>> updateMediator(@PathVariable("uuid") String uuid, @RequestBody Mediator mediator) throws Exception {
        try {
            if (mediator.getUuid() == null) {
                mediator.setUuid(uuid);
                if (this.authentication != null && this.authenticatedUser != null) {
                    mediator.setLastUpdatedBy(this.authenticatedUser);
                }
            }
            return ResponseEntity.ok(mediatorsService.updateMediator(mediator).toMap());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("mediators/{uuid}")
    public void deleteMediator(@PathVariable("uuid") String uuid) throws Exception {
         try {
             Mediator mediator = mediatorsService.getMediatorByUuid(uuid);
             if (mediator !=null) {
                 mediatorsService.deleteMediator(uuid);
             } else {
                 throw new Exception("Mediator with uuid " + uuid + " does not exists");
             }
         } catch (Exception e) {
             throw new Exception("Issue with deleting resource");
         }
    }
}
