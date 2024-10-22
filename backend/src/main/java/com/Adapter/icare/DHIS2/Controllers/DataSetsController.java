/**BSD 3-Clause License

 Copyright (c) 2022, UDSM DHIS2 Lab Tanzania.
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 * Neither the name of the copyright holder nor the names of its
 contributors may be used to endorse or promote products derived from
 this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package com.Adapter.icare.DHIS2.Controllers;

import java.math.BigInteger;
import java.util.*;

import com.Adapter.icare.DHIS2.Dtos.DataSetInstance;
import com.Adapter.icare.Domains.Instance;
import com.Adapter.icare.Services.InstanceService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.Adapter.icare.DHIS2.DHISDomains.RemoteDatasets;
import com.Adapter.icare.DHIS2.DHISServices.DataSetsService;
import com.Adapter.icare.Domains.Dataset;

@RestController
@RequestMapping("/api/v1/dataSets")
public class DataSetsController {
    
    private final DataSetsService dataSetsService;
    private final InstanceService instanceService;

    public DataSetsController(
            DataSetsService dataSetsService,
            InstanceService instanceService) {
        this.dataSetsService = dataSetsService;
        this.instanceService = instanceService;
    }

    @GetMapping
    public ResponseEntity<Map<String,Object>> getAllDataSets(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value="pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "instance", required = true) String instance,
            @RequestParam(value = "formType", required = false) String formType,
            @RequestParam(value="q",required = false ) String q
    ){
        try {
            Instance instanceDetails = instanceService.getInstanceByUuid(instance);
            if (instanceDetails != null) {
                List<Map<String, Object>> mediatorsList = new ArrayList<>();
                Page<Dataset> pagedDataSetsData =  dataSetsService.getDatasetsByPagination(page,pageSize,code,formType,q, BigInteger.valueOf(instanceDetails.getId()));
                for (Dataset dataset: pagedDataSetsData.getContent()) {
                    mediatorsList.add(dataset.toMap());
                }
                Map<String, Object> returnObject =  new HashMap<>();
                Map<String, Object> pager = new HashMap<>();
                pager.put("page", page);
                pager.put("pageSize", pageSize);
                pager.put("totalPages",pagedDataSetsData.getTotalPages());
                pager.put("total", pagedDataSetsData.getTotalElements());
                returnObject.put("pager",pager);
                returnObject.put("results", mediatorsList);
                return ResponseEntity.ok(returnObject);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping()
    public ResponseEntity<Map<String,Object>> addDataSet(@RequestBody DataSetInstance dataSetInstance) throws Exception {
        try {
            Dataset dataSet = dataSetsService.addDataSet(dataSetInstance.getDataSet(), dataSetInstance.getInstance());
            return ResponseEntity.ok(dataSet.toMap());
        }catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<Map<String,Object>> getDataSetByUuid(@PathVariable(value="uuid") String uuid) throws Exception {
        try {
            Map<String,Object> datasetResponse = dataSetsService.getDataSetInstanceByUuid(uuid).toMap();
            return ResponseEntity.ok(datasetResponse);
        }catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @GetMapping(value = "/remote")
    public ResponseEntity<Map<String,Object>> getDHIS2DataSets(
            @RequestParam(value="instance") String instance,
            @RequestParam(value="page", defaultValue = "1") Integer page,
            @RequestParam(value="pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "formType", required = false) String formType,
            @RequestParam(value = "periodType", required = false) String periodType) throws Exception {
        try {
            Instance instanceDetails = instanceService.getInstanceByUuid(instance);
            Map<String,Object> response = new HashMap<>();
            if (instanceDetails != null) {
                Map<String,Object> remoteDatasetsPayload = dataSetsService.getDhis2DataSets(
                        instance,
                        page,
                        pageSize,
                        q,
                        formType,
                        periodType);
                response.put("results", remoteDatasetsPayload.get("dataSets"));
                response.put("pager", remoteDatasetsPayload.get("pager"));
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Instance with uuid " + instance + " is not set");
                response.put("statusCode",HttpStatus.NOT_FOUND.value());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @GetMapping(value = "/remote/{dataSet}/{instance}")
    public ResponseEntity<Map<String,Object>> getDHIS2DataSetByUuid(
            @PathVariable(value="dataSet") String dataSet,
            @PathVariable(value="instance") String instance) throws Exception {
        try {
            RemoteDatasets remoteDatasets = dataSetsService.getDhis2DataSetsByUuid(dataSet, instance);
            return ResponseEntity.ok(remoteDatasets.toMap());
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @DeleteMapping("/{uuid}")
    public void DeleteDataSet(@PathVariable("uuid") String uuid){
        dataSetsService.deleteDataSet(uuid);
    }

}
