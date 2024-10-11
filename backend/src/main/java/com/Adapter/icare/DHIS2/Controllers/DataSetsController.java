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

import java.util.List;
import java.util.Optional;
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
@RequestMapping("/api/v1/datasets")
public class DataSetsController {
    
    private final DataSetsService dataSetsService;

    public DataSetsController(DataSetsService dataSetsService) {
        this.dataSetsService = dataSetsService;
    }

    @GetMapping
    public List<Dataset> GetAllDataSets(){

        return dataSetsService.GetAllDataSets();
    }

    @GetMapping("/single")
    public Optional<Dataset> GetSingleDataSet(@RequestParam String datasetId) {

        return dataSetsService.GetSingleDataSet(datasetId);
    }

    @GetMapping(value = "/remote/{instanceId}")
    public List<RemoteDatasets> getDHIS2DataSets(@PathVariable("instanceId") long instanceId){

        return dataSetsService.getDhis2DataSets(instanceId);
    } 

    @GetMapping("/remote/{instanceId}/{searchTerm}")
    public List<RemoteDatasets> getSearchedDataset(@PathVariable("instanceId") long instanceId,@PathVariable("searchTerm") String searchTerm){

        return dataSetsService.getSearchedDataset(instanceId,searchTerm);
    }

    @PostMapping
    public Dataset AddDataSets(@RequestBody Dataset dataset){

        return dataSetsService.AddDataSets(dataset);
    }

    @DeleteMapping("/{datasetId}")
    public void DeleteDataSets(@PathVariable("datasetId") String datasetId){

        dataSetsService.deleteDataSets(datasetId);
    }

}
