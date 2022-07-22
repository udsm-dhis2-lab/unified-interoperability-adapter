package com.Adapter.icare.DHIS2.DHISServices;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.Adapter.icare.DHIS2.DHISDomains.DhisAggregateValues;
import com.Adapter.icare.DHIS2.DHISDomains.ReportValuesSent;
import com.Adapter.icare.DHIS2.DHISRepository.DataSetElementsRepository;
import com.Adapter.icare.DHIS2.DHISRepository.DataSetsRepository;
import com.Adapter.icare.Domains.DataSetElements;
import com.Adapter.icare.Domains.Datasets;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ReportsService {

    @Autowired
    DataSetElementsRepository dataSetElementsRepository;
    DataSetsRepository dataSetsRepository;

    public ReportsService(DataSetElementsRepository dataSetElementsRepository,DataSetsRepository dataSetsRepository) {
        this.dataSetElementsRepository = dataSetElementsRepository;
        this.dataSetsRepository = dataSetsRepository;
    }

    public List<DataSetElements> SearchDataSetElementsPerDataSet(ReportValuesSent reportValuesSent) {
        
        String dsId = reportValuesSent.getDatasetId();
        return dataSetElementsRepository.searchExistingDataSetElementsPerDataSet(dsId);
    }

    public String SendDataToDHIS(DhisAggregateValues dhisAggregateValues, String datasetId) {

        URL url;
        BufferedReader reader;
        String line;
        StringBuffer responseContent = new StringBuffer();
        Optional<Datasets> dataset= dataSetsRepository.findById(datasetId);
        JSONObject jsObject = new JSONObject();
        String ab = "";

        try {

            String instanceUrl = dataset.get().getInstances().getUrl();
            String username = dataset.get().getInstances().getUsername();
            String password = dataset.get().getInstances().getPassword();
            
            url = new URL(instanceUrl.concat("/api/dataValueSets"));
            HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
            String userCredentials = username.concat(":").concat(password);
            String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));
            httpURLConnection.setRequestProperty("Authorization", basicAuth);
            httpURLConnection.setRequestMethod("POST");
            httpURLConnection.setRequestProperty("Content-Type", "application/json");
            httpURLConnection.setDoOutput(true);

            //JSON STRING CREATION
            // Creating the ObjectMapper object
            ObjectMapper mapper = new ObjectMapper();
            // Converting the Object to JSONString
            String jsonString = mapper.writeValueAsString(dhisAggregateValues);
            System.out.println(jsonString);

            // int status = httpURLConnection.getResponseCode();

            try (OutputStream os = httpURLConnection.getOutputStream()) {
                byte[] input = jsonString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            reader = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()));
            while ((line = reader.readLine()) != null) {
                responseContent.append(line);
            }
            reader.close();
            //JSONObject jsObject = new JSONObject(responseContent.toString());
            System.out.println(responseContent.toString());
            // System.out.println(js);
            jsObject = new JSONObject(responseContent.toString());
             ab = jsObject.getString("status");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return ab;
    }
    
}
