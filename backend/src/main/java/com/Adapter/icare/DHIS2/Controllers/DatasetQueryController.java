package com.Adapter.icare.DHIS2.Controllers;

import com.Adapter.icare.DHIS2.DHISDomains.DatasetQuery;
import com.Adapter.icare.DHIS2.DHISServices.DatasetQueryService;
import com.Adapter.icare.Services.DatasourceService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dataSetQueries")
public class DatasetQueryController {
    private final DatasetQueryService datasetQueryService;

    private  final DatasourceService datasourceService;
    public DatasetQueryController(DatasetQueryService datasetQueryService, DatasourceService datasourceService) {
        this.datasetQueryService = datasetQueryService;
        this.datasourceService = datasourceService;
    }

    @PostMapping
    public DatasetQuery saveDataSetQuery(@RequestBody DatasetQuery datasetQuery) throws Exception {
        //Manipulating the received request
        datasetQueryService.saveDataSetQuery(datasetQuery);
        return datasetQuery;
    }

    @GetMapping
    public List<DatasetQuery> GetAllDataSetsQueries(){
        return datasetQueryService.getAllDataSetsQueries();
    }
}
