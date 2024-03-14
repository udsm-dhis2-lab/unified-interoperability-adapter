package com.Adapter.icare.DHIS2.Controllers;

import com.Adapter.icare.DHIS2.DHISDomains.DatasetQuery;
import com.Adapter.icare.DHIS2.DHISServices.DataSetsService;
import com.Adapter.icare.DHIS2.DHISServices.DatasetQueryService;
import com.Adapter.icare.Domains.Datasets;
import com.Adapter.icare.Services.DatasourceService;
import com.Adapter.icare.Services.InstanceService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dataSetQueries")
public class DatasetQueryController {
    private final DatasetQueryService datasetQueryService;

    private final DataSetsService dataSetsService;

    private final InstanceService instanceService;

    private  final DatasourceService datasourceService;
    public DatasetQueryController(DatasetQueryService datasetQueryService, DataSetsService dataSetsService, InstanceService instanceService, DatasourceService datasourceService) {
        this.datasetQueryService = datasetQueryService;
        this.dataSetsService = dataSetsService;
        this.instanceService = instanceService;
        this.datasourceService = datasourceService;
    }

    @PostMapping
    public DatasetQuery saveDataSetQuery(@RequestBody Map<String, Object> datasetQueryMap) throws Exception {
        //Manipulating the received request
        DatasetQuery datasetQuery = new DatasetQuery();
        datasetQuery.setDataSet(dataSetsService.getDataSetByUuid(((Map<String, Object>) datasetQueryMap.get("dataSetInstance")).get("uuid").toString()));
        datasetQuery.setInstance(instanceService.getInstanceByUuid(((Map<String, Object>) datasetQueryMap.get("instance")).get("uuid").toString()));
        datasetQuery.setDataSource(datasourceService.getDataSourceByUuid(((Map<String, Object>) datasetQueryMap.get("dataSource")).get("uuid").toString()));
        datasetQuery.setSqlQuery(datasetQueryMap.get("sqlQuery").toString());
        datasetQuery.setMappings(datasetQueryMap.get("mappings").toString());
        datasetQueryService.saveDataSetQuery(datasetQuery);
        return datasetQuery;
    }

    @PutMapping
    public DatasetQuery updateDataSetQuery(@RequestBody Map<String, Object> datasetQueryMap) throws Exception {
        DatasetQuery datasetQuery = new DatasetQuery();
        datasetQuery.setDataSet(dataSetsService.getDataSetByUuid(((Map<String, Object>) datasetQueryMap.get("dataSetInstance")).get("uuid").toString()));
        datasetQuery.setInstance(instanceService.getInstanceByUuid(((Map<String, Object>) datasetQueryMap.get("instance")).get("uuid").toString()));
        datasetQuery.setDataSource(datasourceService.getDataSourceByUuid(((Map<String, Object>) datasetQueryMap.get("dataSource")).get("uuid").toString()));
        datasetQuery.setSqlQuery(datasetQueryMap.get("sqlQuery").toString());
        datasetQuery.setMappings(datasetQueryMap.get("mappings").toString());
//        System.out.println(datasetQueryMap.get("mappings").toString());
        if (datasetQueryMap.get("uuid") != null) {
            datasetQuery.setUuid(datasetQueryMap.get("uuid").toString());
        }
        datasetQueryService.updateDataSetQuery(datasetQuery);
        return datasetQuery;
    }

    @GetMapping
    public List<DatasetQuery> GetAllDataSetsQueries(@RequestParam(name="dataSet", required = false) String dataSet){
        if (dataSet == null) {
            return datasetQueryService.getAllDataSetsQueries();
        } else {
            List<DatasetQuery> datasetQueries = new ArrayList<>();
            Datasets datasetInstance = dataSetsService.getDataSetByUuid(dataSet);
            DatasetQuery datasetQuery = datasetQueryService.getDataSetQueriesByDataSetInstanceId(datasetInstance);
            datasetQueries.add(datasetQuery);
            return datasetQueries;
        }

    }

    @GetMapping("/{uuid}")
    public DatasetQuery getDataSetQueryByUuid(@PathVariable("uuid" ) String uuid) {
        return datasetQueryService.getDataSetQueryByUuid(uuid);
    }

}
