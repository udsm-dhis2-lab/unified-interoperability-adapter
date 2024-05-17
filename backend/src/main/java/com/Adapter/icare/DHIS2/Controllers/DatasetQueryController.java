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
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;















import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.io.ByteArrayOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.Adapter.icare.Domains.Instances;
import com.Adapter.icare.DHIS2.Controllers.DatasetQueryController;
import org.springframework.web.bind.annotation.RequestMapping;



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
<<<<<<< HEAD

    @GetMapping()
=======
    @GetMapping
>>>>>>> 75069f1 (recent changes)
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

<<<<<<< HEAD
    @GetMapping("zip")
    public List<Map<String, Object>> downloadDataSetQueriesAsZip(@RequestParam(name="instance", required = true) String instance) throws Exception {
        String uuid = instance;
        Instances instanceData = instanceService.getInstanceByUuid(uuid);

//        response.setContentType("application/zip");
//        response.setHeader("Content-Disposition", "attachment; filename=\"dataset_queries_by_instance.zip\"");

        List<DatasetQuery> datasetQueries = datasetQueryService.getDataSetQueriesByInstanceId(instanceData);
        List<Map<String, Object>> datasetQueriesData = new ArrayList<>();
//        for(DatasetQuery datasetQuery: datasetQueries) {
//            Map<String, Object> datasetQueryInfo = new HashMap<>();
//            datasetQueryInfo.put("sqlQuery", datasetQuery.getSqlQuery().toString());
//            datasetQueryInfo.put("uuid", datasetQuery.getUuid());
//            datasetQueryInfo.put("dataSetUuid",datasetQuery.getDataSet().getId());
//            datasetQueryInfo.put("mappings", datasetQuery.getMappings());
//            datasetQueriesData.add(datasetQueryInfo);
//        }
//        String dataForQuery = new ObjectMapper().writeValueAsString(datasetQueriesData);
//        String fileName = "datasetquery.zip";
//        String jsonName = "datasetquery.json";
//        byte[] data = dataForQuery.getBytes();
//        byte[] bytes;
//        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
//             ZipOutputStream zipOutputStream = new ZipOutputStream(byteArrayOutputStream)) {
//            zipOutputStream.setLevel(1);
//            ZipEntry ze = new ZipEntry(jsonName);
//            ze.setSize(data.length);
//            zipOutputStream.putNextEntry(ze);
//            zipOutputStream.write(data);
//            zipOutputStream.closeEntry();
//            bytes = byteArrayOutputStream.toByteArray();
//        }
//        response.setContentType("application/zip");
//        response.setContentLength(bytes.length);
//        response.setHeader("Content-Disposition", "attachment; "
//                        + String.format("filename*=" + StandardCharsets.UTF_8.name() + "''%s", fileName));
//        ServletOutputStream outputStream = response.getOutputStream();
//        FileCopyUtils.copy(bytes, outputStream);
//        outputStream.close();
        return datasetQueriesData;
    }

=======
>>>>>>> 75069f1 (recent changes)
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
        .mapToObj(index -> {
            try {
                return metadata.getColumnName(index + 1);
            } catch (SQLException e) {
                e.printStackTrace();
                return "?";
            }
        })
        .collect(Collectors.toList());
        List<Map<String, Object>> results = new ArrayList<>();
        while (resultSet.next()) {
            Map<String, Object> row = new HashMap<>();
            colNames.forEach(columnName -> {
                try {
                    row.put(columnName, resultSet.getObject(columnName));
                } catch (JSONException | SQLException e) {
                    e.printStackTrace();
                }
            });
            results.add((row));
        }

        List<Map<String, Object>> formattedResults = new ArrayList<>();
        JSONArray mappingsArray = new JSONArray(mappings);
        for(int count=0; count < mappingsArray.length(); count++)
        {
            Map<String, Object> formattedResult = new HashMap<>();
            JSONObject object = mappingsArray.getJSONObject(count);
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

    @PostMapping("/import")
    public List<Map<String, Object>> importDataSetQueries(@RequestBody Map<String, Object> datasetQueryImportMap) throws Exception {
        //Manipulating the received request
        List<Map<String, Object>> dataSetQueryImportResponses = new ArrayList<>();
        for(Map<String, Object> datasetQueryMap: (List<Map<String, Object>>) datasetQueryImportMap.get("dataSetQueries")) {
            DatasetQuery datasetQuery = new DatasetQuery();
            Datasets dataset = dataSetsService.getDataSetInstanceByDataSetId(datasetQueryMap.get("dataSetUuid").toString());
            datasetQuery.setDataSet(dataset);
            datasetQuery.setInstance(dataset.getInstances());
            datasetQuery.setDataSource(datasourceService.getDataSourceByUuid(((Map<String, Object>) datasetQueryImportMap.get("dataSource")).get("uuid").toString()));
            datasetQuery.setSqlQuery(datasetQueryMap.get("sqlQuery").toString());
            datasetQuery.setMappings(datasetQueryMap.get("mappings").toString());
            datasetQuery.setUuid(datasetQueryMap.get("uuid").toString());
            Map<String, Object> response = datasetQueryService.saveDataSetQuery(datasetQuery).toMap();
            dataSetQueryImportResponses.add(response);
        }
        return dataSetQueryImportResponses;
    }




    @GetMapping("/download")
    public byte[] downloadDataSetQueriesAsZip(@RequestParam(name="instance", required = true) String instance) throws Exception {
        Instances instanceData = instanceService.getInstanceByUuid(instance);
        List<DatasetQuery> datasetQueries = datasetQueryService.getDataSetQueriesByInstanceId(instanceData);
        List<Map<String, Object>> datasetQueriesData = new ArrayList<>();
        for(DatasetQuery datasetQuery: datasetQueries) {
            Map<String, Object> datasetQueryInfo = new HashMap<>();
            datasetQueryInfo.put("sqlQuery", datasetQuery.getSqlQuery().toString());
            datasetQueryInfo.put("uuid", datasetQuery.getUuid());
            datasetQueryInfo.put("dataSetUuid",datasetQuery.getDataSet().getId());
            datasetQueryInfo.put("mappings", datasetQuery.getMappings());
            datasetQueriesData.add(datasetQueryInfo);
        }

        // Create a ByteArrayOutputStream to store the zip file content
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try (ZipOutputStream zipOutputStream = new ZipOutputStream(byteArrayOutputStream)) {
            for (Map<String, Object> datasetQueryInfo : datasetQueriesData) {
                String jsonName = datasetQueryInfo.get("uuid") + ".json"; // Create a unique file name
                byte[] data = datasetQueryInfo.toString().getBytes();

                // Create a new entry in the zip file
                zipOutputStream.putNextEntry(new ZipEntry(jsonName));
                zipOutputStream.write(data, 0, data.length);
                zipOutputStream.closeEntry();
            }
        }

        return byteArrayOutputStream.toByteArray(); // Return the zip file content
    }



}











