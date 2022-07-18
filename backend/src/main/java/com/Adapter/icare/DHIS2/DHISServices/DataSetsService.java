package com.Adapter.icare.DHIS2.DHISServices;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.tools.JavaFileObject;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import com.Adapter.icare.Constants.DHISConstants;
import com.Adapter.icare.DHIS2.DHISDomains.RemoteDatasets;
import com.Adapter.icare.DHIS2.DHISRepository.DataSetsRepository;
import com.Adapter.icare.Domains.Datasets;
import com.Adapter.icare.Domains.Instances;
import com.Adapter.icare.Repository.InstancesRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.bytebuddy.utility.dispatcher.JavaDispatcher.Instance;

@Service
public class DataSetsService {
    
    private final DataSetsRepository dataSetsRepository;
    private final InstancesRepository instancesRepository;

    public DataSetsService(DataSetsRepository dataSetsRepository,InstancesRepository instancesRepository) {
        this.dataSetsRepository = dataSetsRepository;
        this.instancesRepository = instancesRepository;
    }

    public List<Datasets> GetAllDataSets() {
        return dataSetsRepository.findAll();
    }

    public List<RemoteDatasets> getDhis2DataSets(long instanceId) {
        
        URL url;
        BufferedReader reader;
        String line;
        StringBuffer responseContent = new StringBuffer();
        //ObjectMapper objectMapper = new ObjectMapper();
        List<RemoteDatasets> remoteDataSetsList = new ArrayList<RemoteDatasets>();
        Optional<Instances> instance = instancesRepository.findById(instanceId);

        try {

            String instanceurl = instance.get().getUrl();
            String username = instance.get().getUsername();
            String password = instance.get().getPassword();

            url = new URL(instanceurl.concat("/api/dataSets"));

            HttpURLConnection httpURLConnection = (HttpURLConnection)url.openConnection();

            String userCredentials = username.concat(":").concat(password);
            String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));
            httpURLConnection.setRequestProperty("Authorization", basicAuth);
            httpURLConnection.setRequestMethod("GET");
            httpURLConnection.setRequestProperty("Content-Type","application/json");

            //int status = httpURLConnection.getResponseCode();

            reader = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()));
            while ((line = reader.readLine()) != null) {
                responseContent.append(line);
                
            }
            reader.close();
            JSONObject jsObject = new JSONObject(responseContent.toString());
            JSONArray js = jsObject.getJSONArray("dataSets"); 
            //System.out.println(js);


            for (Object ab : js) {
                System.out.println(ab);

                JSONObject ourDsObject = new JSONObject(ab.toString());

                Map<String, Object> remoteDataSetMap = new HashMap<String, Object>();
                remoteDataSetMap.put("id", ourDsObject.getString("id"));
                remoteDataSetMap.put("displayName", ourDsObject.getString("displayName"));

                RemoteDatasets remoteDataSetToAdd = RemoteDatasets.fromMap(remoteDataSetMap);

                remoteDataSetsList.add(remoteDataSetToAdd);

            }

            //System.out.println(remoteDataSetsList);


             //remoteDataSetsList = objectMapper.readValue(js, new TypeReference<List<RemoteDatasets>>() {
            //});

            
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        
        return remoteDataSetsList;
        
    }

    public void AddDataSets(Datasets datasets) {

        //Inserting the HTML CODE
        URL url;
        BufferedReader reader;
        String line;
        StringBuffer responseContent = new StringBuffer();
        long instanceId = datasets.getInstances().getId();
        Optional<Instances> instance = instancesRepository.findById(instanceId);

        try {

            String instanceUrl = instance.get().getUrl();
            String username = instance.get().getUsername();
            String password = instance.get().getPassword();

            url = new URL(instanceUrl.concat("/api/dataSets/"+datasets.getId()+"?fields=periodType,dataEntryForm[htmlCode]"));

            HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();

            String userCredentials = username.concat(":").concat(password);
            String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));
            httpURLConnection.setRequestProperty("Authorization", basicAuth);
            httpURLConnection.setRequestMethod("GET");
            httpURLConnection.setRequestProperty("Content-Type", "application/json");

            // int status = httpURLConnection.getResponseCode();

            reader = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()));
            while ((line = reader.readLine()) != null) {
                responseContent.append(line);

            }
            reader.close();
            JSONObject jsObject = new JSONObject(responseContent.toString());
            String htmlForm = jsObject.getJSONObject("dataEntryForm").getString("htmlCode");
            String periodType = jsObject.getString("periodType");

            datasets.setFormdesignCode(htmlForm);
            datasets.setPeriodType(periodType);
            //System.out.println(js);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        
        dataSetsRepository.save(datasets);

    }

    public Optional<Datasets> GetSingleDataSet(String datasetId) {
        return dataSetsRepository.findById(datasetId);
    }
    
}
