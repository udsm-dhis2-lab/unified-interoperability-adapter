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
import com.Adapter.icare.Domains.Datasets;

@RestController
@RequestMapping("/api/v1/datasets")
public class DataSetsController {
    
    private final DataSetsService dataSetsService;

    public DataSetsController(DataSetsService dataSetsService) {
        this.dataSetsService = dataSetsService;
    }

    @GetMapping
    public List<Datasets> GetAllDataSets(){

        return dataSetsService.GetAllDataSets();
    }

    @GetMapping("/single")
    public Optional<Datasets> GetSingleDataSet(@RequestParam String datasetId) {

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
    public Datasets AddDataSets(@RequestBody Datasets datasets){

        return dataSetsService.AddDataSets(datasets);
    }

    @DeleteMapping("/{datasetId}")
    public void DeleteDataSets(@PathVariable("datasetId") String datasetId){

        dataSetsService.deleteDataSets(datasetId);
    }

}
