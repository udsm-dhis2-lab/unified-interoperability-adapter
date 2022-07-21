package com.Adapter.icare.DHIS2.DHISServices;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.Adapter.icare.DHIS2.DHISDomains.DhisAggregateValues;
import com.Adapter.icare.DHIS2.DHISDomains.ReportValuesSent;
import com.Adapter.icare.DHIS2.DHISRepository.DataSetElementsRepository;
import com.Adapter.icare.DHIS2.DHISRepository.DataSetsRepository;
import com.Adapter.icare.Domains.DataSetElements;
import com.Adapter.icare.Domains.Datasets;
import com.Adapter.icare.Repository.InstancesRepository;

@Service
public class ReportsService {

    @Autowired
    DataSetElementsRepository dataSetElementsRepository;
    DataSetsRepository dataSetsRepository;

    public ReportsService(DataSetElementsRepository dataSetElementsRepository,InstancesRepository instancesRepository) {
        this.dataSetElementsRepository = dataSetElementsRepository;
        this.dataSetsRepository = dataSetsRepository;
    }

    public List<DataSetElements> SearchDataSetElementsPerDataSet(ReportValuesSent reportValuesSent) {
        
        String dsId = reportValuesSent.getDatasetId();
        return dataSetElementsRepository.searchExistingDataSetElementsPerDataSet(dsId);
    }

    public void SendDataToDHIS(List<DhisAggregateValues> dhisAggregateValues, String datasetId) {

        URL url;
        BufferedReader reader;
        String line;
        StringBuffer responseContent = new StringBuffer();
        Optional<Datasets> dataset= dataSetsRepository.findById(datasetId);

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

            // int status = httpURLConnection.getResponseCode();

            reader = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()));
            while ((line = reader.readLine()) != null) {
                responseContent.append(line);

            }
            reader.close();
            
            // System.out.println(js);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
    
}
