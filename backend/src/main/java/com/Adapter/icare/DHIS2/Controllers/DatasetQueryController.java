package com.Adapter.icare.DHIS2.Controllers;

import com.Adapter.icare.DHIS2.DHISDomains.DatasetQuery;
import com.Adapter.icare.DHIS2.DHISServices.DataSetsService;
import com.Adapter.icare.DHIS2.DHISServices.DatasetQueryService;
import com.Adapter.icare.Services.DatasourceService;
import com.Adapter.icare.Services.InstanceService;
import org.springframework.web.bind.annotation.*;
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
        datasetQuery.setDataSet(dataSetsService.getDataSetByUuid(((Map<String, Object>) datasetQueryMap.get("dataSet")).get("uuid").toString()));
        datasetQuery.setInstance(instanceService.getInstanceByUuid(((Map<String, Object>) datasetQueryMap.get("instance")).get("uuid").toString()));
        datasetQueryService.saveDataSetQuery(DatasetQuery.fromMap(datasetQuery.toMap()));
        return datasetQuery;
    }

    @GetMapping
    public List<DatasetQuery> GetAllDataSetsQueries(){
        return datasetQueryService.getAllDataSetsQueries();
    }
}
