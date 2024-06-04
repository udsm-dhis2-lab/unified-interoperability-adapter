// DataSetElementsService.java
package com.Adapter.icare.DHIS2.DHISServices;

import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.stereotype.Service;
import com.Adapter.icare.DHIS2.DHISRepository.DataSetElementsRepository;
import com.Adapter.icare.Domains.DataSetElements;

import java.util.*;

@Service
public class DataSetElementsService {
    private final DataSetElementsRepository dataSetElementsRepository;

    public DataSetElementsService(DataSetElementsRepository dataSetElementsRepository) {
        this.dataSetElementsRepository = dataSetElementsRepository;
    }

    public void addDataSetElements(DataSetElements dataSetElements) {
        if (dataSetElements.getUuid() == null) {
            UUID uuid = UUID.randomUUID();
            dataSetElements.setUuid(uuid.toString());
        }
        dataSetElementsRepository.save(dataSetElements);
    }
    public DataSetElements searchExistingDataSetElements(DataSetElements dataSetElements) {
        String dataElementsCategoryOptionCombString = dataSetElements.getDataElementCategoryOptionCombo();
        String[] stringArray = dataElementsCategoryOptionCombString.split("-");
        dataSetElements.setDataElement(stringArray[0]);
        dataSetElements.setCategoryOptionCombo(stringArray[1]);

        String dataElement = dataSetElements.getDataElement();
        String categoryOptionCombo = dataSetElements.getCategoryOptionCombo();
        String dataset = dataSetElements.getDatasets().getId();
        return dataSetElementsRepository.searchExistingDataSetElements(dataElement, categoryOptionCombo, dataset);
    }

    public List<Map<String, Object>> getDatasetId(String datasetId) {
        if (datasetId == null || datasetId.isEmpty()) {
            throw new IllegalArgumentException("Dataset ID must not be null or empty");
        }

        try {
            List<Object> rawIds = dataSetElementsRepository.searchDatasetId(datasetId);
            List<Map<String, Object>> datasetElements = new ArrayList<>();

            for (Object rawId : rawIds) {
                if (rawId instanceof String) {
                    try {
                        List<Map<String, Object>> elements = searchExistingDataSetElementsPerDataSet((String) rawId);
                        datasetElements.addAll(elements);
                    } catch (NumberFormatException e) {
                        System.err.println("Error occurred: " + e.getMessage());
                    }
                } else {
                    System.err.println("Unexpected data type: " + rawId.getClass().getName());
                    // Handle unexpected data types appropriately
                }
            }

            System.out.println("Dataset IDs: " + datasetElements);
            return datasetElements;
        } catch (InvalidDataAccessApiUsageException e) {
            System.err.println("Error accessing data: " + e.getMessage());
            throw e;
        }
    }




    public List<Map<String, Object>> searchExistingDataSetElementsPerDataSet(String datasetId) {
        System.out.println("Searching DataSetElements with DataSet UUID: " + datasetId);
        List<String> results = dataSetElementsRepository.findAllSqlQueries(datasetId);
        List<Map<String, Object>> mappedResults = new ArrayList<>();

        for (String result : results) {
            String[] parts = result.split(",");
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("id", parts[0]);
            resultMap.put("created_by", parts[1]);
            resultMap.put("created_on", parts[2]);
            resultMap.put("last_updated_by", parts[3]);
            resultMap.put("last_updated_on", parts[4]);
            resultMap.put("retired", parts[5]);
            resultMap.put("retired_by", parts[6]);
            resultMap.put("sharing", parts[7]);
            resultMap.put("uuid", parts[8]);
            resultMap.put("sql_query", parts[9]);
            resultMap.put("category_option_combo", parts[10]);
            resultMap.put("data_element", parts[11]);
            resultMap.put("datasets_id", parts[12]);
            resultMap.put("datasource_id", parts[13]);

            mappedResults.add(resultMap);
        }

        System.out.println("All SQL Queries: " + mappedResults);
        System.out.println();

        return mappedResults;
    }


}

