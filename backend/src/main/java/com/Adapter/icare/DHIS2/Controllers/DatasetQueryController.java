package com.Adapter.icare.DHIS2.Controllers;
import com.Adapter.icare.DHIS2.DHISDomains.DatasetQuery;
import com.Adapter.icare.DHIS2.DHISServices.DataSetsService;
import com.Adapter.icare.DHIS2.DHISServices.DatasetQueryService;
import com.Adapter.icare.Domains.Datasets;
import com.Adapter.icare.Services.DatasourceService;
import com.Adapter.icare.Services.InstanceService;
import com.Adapter.icare.Utils.EncryptionUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;
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
import org.springframework.web.bind.annotation.RequestMapping;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.zip.ZipInputStream;
import org.springframework.web.bind.annotation.CrossOrigin;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/dataSetQueries")
public class DatasetQueryController {
    private final DatasetQueryService datasetQueryService;
    private final ObjectMapper objectMapper;
    private final DataSetsService dataSetsService;

    private final InstanceService instanceService;

    private final DatasourceService datasourceService;

    public DatasetQueryController(DatasetQueryService datasetQueryService, ObjectMapper objectMapper, DataSetsService dataSetsService, InstanceService instanceService, DatasourceService datasourceService) {
        this.datasetQueryService = datasetQueryService;
        this.objectMapper = objectMapper;
        this.dataSetsService = dataSetsService;
        this.instanceService = instanceService;
        this.datasourceService = datasourceService;
    }

    @PostMapping
    public DatasetQuery saveDataSetQuery(@RequestBody Map<String, Object> datasetQueryMap) throws Exception {
        //Manipulating the received request
        DatasetQuery datasetQuery = new DatasetQuery();
        datasetQuery.setDataSet(dataSetsService.getDataSetInstanceByUuid(((Map<String, Object>) datasetQueryMap.get("dataSetInstance")).get("uuid").toString()));
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
        datasetQuery.setDataSet(dataSetsService.getDataSetInstanceByUuid(((Map<String, Object>) datasetQueryMap.get("dataSetInstance")).get("uuid").toString()));
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
    public List<DatasetQuery> GetAllDataSetsQueries(@RequestParam(name = "dataSet", required = false) String dataSet) {
        if (dataSet == null) {
            return datasetQueryService.getAllDataSetsQueries();
        } else {
            List<DatasetQuery> datasetQueries = new ArrayList<>();
            Datasets datasetInstance = dataSetsService.getDataSetInstanceByUuid(dataSet);
            DatasetQuery datasetQuery = datasetQueryService.getDataSetQueriesByDataSetInstanceId(datasetInstance);
            datasetQueries.add(datasetQuery);
            return datasetQueries;
        }
    }

    @GetMapping("/{uuid}")
    public DatasetQuery getDataSetQueryByUuid(@PathVariable("uuid") String uuid) {
        return datasetQueryService.getDataSetQueryByUuid(uuid);
    }

    @PostMapping("/{uuid}/generate")
    public List<Map<String, Object>> generatePayloadFromDataSetQuery(@PathVariable("uuid") String uuid, @RequestBody Map<String, Object> dataRequestPayload) throws Exception {
        DatasetQuery datasetQuery = datasetQueryService.getDataSetQueryByUuid(uuid);
        String startPeriod = dataRequestPayload.get("periodStart").toString();
        String endPeriod = dataRequestPayload.get("periodEnd").toString();
        String dataSourceUrl = datasetQuery.getDataSource().getUrl().toString();
        String dataSourceUserName = datasetQuery.getDataSource().getUsername();
        String decryptedPassword = EncryptionUtils.decrypt(datasetQuery.getDataSource().getPassword());
        String dataSourcePassword = decryptedPassword;
        String newQuery = datasetQuery.getSqlQuery().replaceAll("\\$\\{period-start\\}", startPeriod).replaceAll("\\$\\{period-end\\}", endPeriod);
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
        for (int count = 0; count < mappingsArray.length(); count++) {
            Map<String, Object> formattedResult = new HashMap<>();
            JSONObject object = mappingsArray.getJSONObject(count);
            Integer row = object.getInt("row");
            Integer column = object.getInt("column");
            String key = row + "-" + column;
            for (Map<String, Object> result : results) {
                if (result.get(key) != null) {
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
        for (Map<String, Object> datasetQueryMap : (List<Map<String, Object>>) datasetQueryImportMap.get("dataSetQueries")) {
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
    public byte[] downloadDataSetQueriesAsZip(@RequestParam(name = "instance", required = true) String instance) throws Exception {
        Instances instanceData = instanceService.getInstanceByUuid(instance);
        List<DatasetQuery> datasetQueries = datasetQueryService.getDataSetQueriesByInstanceId(instanceData);

        List<Map<String, Object>> datasetQueriesData = new ArrayList<>();

       
        for (DatasetQuery datasetQuery : datasetQueries) {
            Map<String, Object> datasetQueryInfo = new HashMap<>();
            datasetQueryInfo.put("sqlQuery", datasetQuery.getSqlQuery());
            datasetQueryInfo.put("uuid", datasetQuery.getUuid());
            datasetQueryInfo.put("mappings", datasetQuery.getMappings());
            datasetQueryInfo.put("instance", datasetQuery.getInstance().getUuid());
            datasetQueryInfo.put("dataSetUuid", datasetQuery.getDataSet().getUuid());
            datasetQueryInfo.put("dataSource", datasetQuery.getDataSource().getUuid());
            datasetQueriesData.add(datasetQueryInfo);
        }

      
        String datasetQueriesDataString = objectMapper.writeValueAsString(datasetQueriesData);

     
        byte[] datasetQueriesDataBytes = datasetQueriesDataString.getBytes();

     
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ZipOutputStream zipOutputStream = new ZipOutputStream(byteArrayOutputStream);
        ZipEntry zipEntry = new ZipEntry("datasetQueriesData.json");
        zipEntry.setSize(datasetQueriesDataBytes.length);
        zipOutputStream.putNextEntry(zipEntry);
        IOUtils.write(datasetQueriesDataBytes, zipOutputStream);
        zipOutputStream.closeEntry();
        zipOutputStream.close();

   
        return byteArrayOutputStream.toByteArray();
    }
    @PostMapping("/upload")
    public ResponseEntity<String> uploadDataSetQueriesByInstanceUuid(@RequestParam("file") MultipartFile file, @RequestParam("instance") String instanceUuid) {
     
        if (file.isEmpty()) {
            System.out.println("File is empty");
            return new ResponseEntity<>("File is empty", HttpStatus.BAD_REQUEST);
        }

        UUID instance = UUID.fromString(instanceUuid);
        System.out.println("Instance UUID: " + instance);

        try (ZipInputStream zipInputStream = new ZipInputStream(file.getInputStream())) {
            ZipEntry zipEntry;
            List<Map<String, Object>> datasetQueryImportList = new ArrayList<>();
            while ((zipEntry = zipInputStream.getNextEntry()) != null) {
//                System.out.println("Processing ZIP entry: " + zipEntry.getName());
                if (!zipEntry.isDirectory() && zipEntry.getName().endsWith(".json")) {
                  
                    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                    IOUtils.copy(zipInputStream, byteArrayOutputStream);
                    String jsonString = byteArrayOutputStream.toString();
//                    System.out.println("JSON content for entry " + zipEntry.getName() + ": " + jsonString);

                    try {
                     
                        List<Map<String, Object>> datasetQueriesData = objectMapper.readValue(jsonString, new TypeReference<List<Map<String, Object>>>() {});
                        System.out.println("Parsed dataset queries data: " + datasetQueriesData);

                        for (Map<String, Object> datasetQueryMap : datasetQueriesData) {
                            if (Objects.equals(datasetQueryMap.get("instance"), instanceUuid)) {
                                System.out.println("Instance UUID matches for dataset query: " + datasetQueryMap.get("uuid"));
                                DatasetQuery datasetQuery = new DatasetQuery();
                                Datasets dataset = dataSetsService.getDataSetInstanceByDataSetId(datasetQueryMap.get("dataSetUuid").toString());
                                datasetQuery.setDataSet(dataset);
                                datasetQuery.setInstance(dataset.getInstances());
                                datasetQuery.setDataSource(datasourceService.getDataSourceByUuid(datasetQueryMap.get("dataSourceUuid").toString()));
                                datasetQuery.setSqlQuery(datasetQueryMap.get("sqlQuery").toString());
                                datasetQuery.setMappings(datasetQueryMap.get("mappings").toString());
                                datasetQuery.setUuid(datasetQueryMap.get("uuid").toString());
                                datasetQueryService.saveDataSetQuery(datasetQuery);

                                System.out.println("Data sent to database: " + datasetQuery);
                            } else {
                                System.out.println("Skipping dataset query with different instance UUID: " + datasetQueryMap.get("instance"));
                            }
                        }
                    } catch (Exception e) {
                        System.err.println("Failed to parse JSON from file: " + zipEntry.getName() + ". Error: " + e.getMessage());
                        e.printStackTrace();
                        continue;
                    }
                } else {
                    System.out.println("Skipping non-JSON file: " + zipEntry.getName());
                }
                zipInputStream.closeEntry();
            }

            System.out.println("Data uploaded successfully");
            return new ResponseEntity<>("Data uploaded successfully", HttpStatus.OK);
        } catch (IOException e) {
            System.err.println("Failed to process ZIP file: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Error processing the file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}


















