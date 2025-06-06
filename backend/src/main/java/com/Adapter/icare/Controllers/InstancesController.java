/**
 * BSD 3-Clause License
 * <p>
 * Copyright (c) 2022, UDSM DHIS2 Lab Tanzania.
 * All rights reserved.
 * <p>
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * <p>
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 * <p>
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * <p>
 * Neither the name of the copyright holder nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * <p>
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package com.Adapter.icare.Controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.Adapter.icare.Domains.Mediator;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Adapter.icare.Domains.Instance;
import com.Adapter.icare.Services.InstanceService;

@RestController
@RequestMapping("/api/v1/instances")
public class InstancesController {

    private final InstanceService instanceService;

    public InstancesController(InstanceService instanceService) {
        this.instanceService = instanceService;
    }

    @GetMapping()
    public ResponseEntity<Map<String, Object>> getInstances(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "paging", defaultValue = "true") boolean paging,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "url", required = false) String url,
            @RequestParam(value = "ouUid", required = false) String ouUid,
            @RequestParam(value = "q", required = false) String q
    ) {
        try {
            List<Map<String, Object>> instancesList = new ArrayList<>();
            Page<Instance> pagedInstanceData = instanceService.getInstancesByPagination(page, pageSize, paging, code, url, ouUid, q);
            for (Instance instance : pagedInstanceData.getContent()) {
                instancesList.add(instance.toMap());
            }
            Map<String, Object> returnObject = new HashMap<>();
            if (paging) {
                Map<String, Object> pager = new HashMap<>();
                pager.put("page", page);
                pager.put("pageSize", pageSize);
                pager.put("totalPages", pagedInstanceData.getTotalPages());
                pager.put("total", pagedInstanceData.getTotalElements());
                returnObject.put("pager", pager);
            }
            returnObject.put("results", instancesList);
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> addInstances(
            @RequestBody Instance instance) throws Exception {
        try {
            return ResponseEntity.ok(instanceService.AddNewInstance(instance).toMap());
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<Map<String, Object>> updateInstance(
            @RequestBody Map<String, Object> instance,
            @PathVariable(value = "uuid") String uuid) throws Exception {
        try {
            Instance instanceToUpdate = instanceService.getInstanceByUuid(uuid);
            Map<String, Object> response = new HashMap<>();
            if (instanceToUpdate != null) {
                instanceToUpdate.setCode(instance.get("code") == null ? instanceToUpdate.getCode() : instance.get("code").toString());
                instanceToUpdate.setName(instance.get("name") == null ? instanceToUpdate.getName() : instance.get("name").toString());
                instanceToUpdate.setUrl(instance.get("url") == null ? instanceToUpdate.getUrl() : instance.get("url").toString());
                instanceToUpdate.setPassword(instance.get("password") == null ? instanceToUpdate.getPassword() : instance.get("password").toString());
                instanceToUpdate.setUsername(instance.get("username") == null ? instanceToUpdate.getUsername() : instance.get("username").toString());
                response = instanceService.updateInstances(instanceToUpdate).toMap();
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Instance with uuid " + uuid + " does not exists");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<Map<String, Object>> deleteInstance(@PathVariable("uuid") String uuid) throws Exception {
        try {
            Instance instance = instanceService.getInstanceByUuid(uuid);
            Map<String, Object> response = new HashMap<>();
            if (instance != null) {
                response.put("message", "Instance with uuid " + uuid + " has been deleted");
                instanceService.deleteInstance(instance.getId());
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Instance with uuid " + uuid + " does not exists");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            throw new Exception("Issue with deleting resource");
        }
    }
}
