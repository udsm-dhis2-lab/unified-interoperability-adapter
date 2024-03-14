package com.Adapter.icare.DHIS2.Controllers;

import com.Adapter.icare.DHIS2.DHISDomains.DatasetQuery;
import com.Adapter.icare.DHIS2.DHISServices.DataSetsService;
import com.Adapter.icare.DHIS2.DHISServices.DatasetQueryService;
import com.Adapter.icare.Domains.Datasets;
import com.Adapter.icare.Services.DatasourceService;
import com.Adapter.icare.Services.InstanceService;
import com.Adapter.icare.Utils.EncryptionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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
    @PostMapping("/{uuid}/generate")
    public List<Map<String, Object>> generatePayloadFromDataSetQuery(@PathVariable("uuid" ) String uuid, @RequestBody Map<String, Object> dataRequestPayload) throws Exception {
        DatasetQuery datasetQuery = datasetQueryService.getDataSetQueryByUuid(uuid);
        String startPeriod = dataRequestPayload.get("periodStart").toString();
        String endPeriod = dataRequestPayload.get("periodEnd").toString();
        String dataSourceUrl = datasetQuery.getDataSource().getUrl().toString();
        String dataSourceUserName = datasetQuery.getDataSource().getUsername();
        String decryptedPassword = EncryptionUtils.decrypt(datasetQuery.getDataSource().getPassword());
        String dataSourcePassword = decryptedPassword;
        String newQuery = datasetQuery.getSqlQuery().replaceAll("\\$\\{period-start\\}",startPeriod).replaceAll("\\$\\{period-end\\}",endPeriod);
        Connection con = DriverManager.getConnection(dataSourceUrl, dataSourceUserName, dataSourcePassword);
        ResultSet resultSet = con.prepareStatement(newQuery).executeQuery();
        ResultSetMetaData metadata = resultSet.getMetaData();
        String mappings = datasetQuery.getMappings();

        int numCols = metadata.getColumnCount();
        List<String> colNames = IntStream.range(0, numCols)
        .mapToObj(i -> {
            try {
                return metadata.getColumnName(i + 1);
            } catch (SQLException e) {
                e.printStackTrace();
                return "?";
            }
        })
        .collect(Collectors.toList());
        List<Map<String, Object>> results = new ArrayList<>();
        while (resultSet.next()) {
            Map<String, Object> row = new HashMap<>();
            colNames.forEach(cn -> {
                try {
                    row.put(cn, resultSet.getObject(cn));
                } catch (JSONException | SQLException e) {
                    e.printStackTrace();
                }
            });
            results.add((row));
        }

        List<Map<String, Object>> formattedResults = new ArrayList<>();
        JSONArray array = new JSONArray(mappings);
        for(int i=0; i < array.length(); i++)
        {
            Map<String, Object> formattedResult = new HashMap<>();
            JSONObject object = array.getJSONObject(i);
            Integer row = object.getInt("row");
            Integer column = object.getInt("column");
            String key = row+ "-" + column;
            for(Map<String, Object> result: results) {
                if (result.get(key) != null ) {
                    formattedResult.put("id", object.getString("de") + "-" + object.getString("co") + "-val");
                    formattedResult.put("row", row);
                    formattedResult.put("column", column);
                    formattedResult.put("value", result.get(key));
                    formattedResult.put("de", object.getString("de"));
                    formattedResult.put("co", object.getString("co"));
                    formattedResults.add(formattedResult);
                }
            }
        }
        return formattedResults;
    }

}
