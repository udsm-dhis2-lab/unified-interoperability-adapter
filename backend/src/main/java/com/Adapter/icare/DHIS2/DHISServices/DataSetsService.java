/**BSD 3-Clause License

 Copyright (c) 2022, UDSM DHIS2 Lab Tanzania.
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 * Neither the name of the copyright holder nor the names of its
 contributors may be used to endorse or promote products derived from
 this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package com.Adapter.icare.DHIS2.DHISServices;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import com.Adapter.icare.DHIS2.DHISDomains.RemoteDatasets;
import com.Adapter.icare.DHIS2.DHISRepository.DataSetsRepository;
import com.Adapter.icare.Domains.Datasets;
import com.Adapter.icare.Domains.Instances;
import com.Adapter.icare.Repository.InstancesRepository;



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

            url = new URL(instanceurl.concat("/api/dataSets?fields=id,code,shortName,name,displayName,formType,version,timelyDays,compulsoryFieldsCompleteOnly,renderHorizontally,renderAsTabs,periodType,openFuturePeriods,expiryDays,dataSetElements~size"));

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
            System.out.println(jsObject);
            JSONArray js = jsObject.getJSONArray("dataSets"); 
            //System.out.println(js);


            for (Object ab : js) {
               // System.out.println(ab);

                JSONObject ourDsObject = new JSONObject(ab.toString());

                Map<String, Object> remoteDataSetMap = new HashMap<String, Object>();
                remoteDataSetMap.put("id", ourDsObject.getString("id"));
                remoteDataSetMap.put("displayName", ourDsObject.getString("displayName"));

                if(ourDsObject.has("formType")){
                    remoteDataSetMap.put("formType", ourDsObject.getString("formType"));
                }

                if(ourDsObject.has("code")){
                    remoteDataSetMap.put("code", ourDsObject.getString("code"));
                }
                if(ourDsObject.has("shortName")){
                    remoteDataSetMap.put("shortName",ourDsObject.getString("shortName"));
                }

                if(ourDsObject.has("periodType")){
                    remoteDataSetMap.put("periodType",ourDsObject.getString("periodType"));
                }

                if(ourDsObject.has("dataSetElements")){
                    remoteDataSetMap.put("dataSetElements",ourDsObject.getInt("dataSetElements"));
                }

                if(ourDsObject.has("version")){
                    remoteDataSetMap.put("version",ourDsObject.getInt("version"));
                }

                if(ourDsObject.has("expiryDays")){
                    remoteDataSetMap.put("expiryDays",ourDsObject.getInt("expiryDays"));
                }

                if(ourDsObject.has("timelyDays")){
                    remoteDataSetMap.put("timelyDays",ourDsObject.getInt("timelyDays"));
                }

                if(ourDsObject.has("openFuturePeriods")){
                    remoteDataSetMap.put("openFuturePeriods",ourDsObject.getInt("openFuturePeriods"));
                }

                if(ourDsObject.has("renderAsTabs")){
                    remoteDataSetMap.put("renderAsTabs",ourDsObject.getBoolean("renderAsTabs"));
                }

                if(ourDsObject.has("renderHorizontally")){
                    remoteDataSetMap.put("renderHorizontally",ourDsObject.getBoolean("renderHorizontally"));
                }

                if(ourDsObject.has("compulsoryFieldsCompleteOnly")){
                    remoteDataSetMap.put("compulsoryFieldsCompleteOnly",ourDsObject.getBoolean("compulsoryFieldsCompleteOnly"));
                }

                RemoteDatasets remoteDataSetToAdd = RemoteDatasets.fromMap(remoteDataSetMap);
                remoteDataSetsList.add(remoteDataSetToAdd);

            }
            
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return remoteDataSetsList; 
    }

    public Datasets AddDataSets(Datasets datasets) {

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

            url = new URL(instanceUrl.concat("/api/dataSets/"+datasets.getId()+"?fields=id,code,shortName,name,displayName,formType,version,dataEntryForm[*],sections[id,name,showColumnTotals,showRowTotals,sortOrder,dataElements[id]],timelyDays,compulsoryFieldsCompleteOnly,renderHorizontally,renderAsTabs,periodType,openFuturePeriods,expiryDays,categoryCombo[id,name,dataDimensionType,categoryOptionCombos[id,name,code]],dataSetElements[dataElement[id,name,code,shortName,aggregationType,domainType,valueType,zeroIsSignificant,optionSetValue,categoryCombo[id,name,dataDimensionType,categoryOptionCombos[id,name,code]]]],attributeValues[*]"));

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
            if(jsObject.has("formType")) {
                String formType = jsObject.getString("formType");
                datasets.setFormType(formType);
            }
            //String htmlForm = jsObject.getJSONObject("dataEntryForm").getString("htmlCode");
            if(jsObject.has("periodType")) {
                String periodType = jsObject.getString("periodType");
                datasets.setPeriodType(periodType);
            }

            if(jsObject.has("timelyDays")) {
                int timelyDays = jsObject.getInt("timelyDays");
                datasets.setTimelyDays(timelyDays);
            }

            if (jsObject.has("expiryDays")) {
                int expiryDays = jsObject.getInt("expiryDays");
                datasets.setExpiryDays(expiryDays);
            }

            if(jsObject.has("code")) {
                String code = jsObject.getString("code");
                datasets.setCode(code);
            }

            datasets.setDatasetFields(jsObject.toString());
            //datasets.setFormDesignCode(htmlForm);


            //System.out.println(js);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        UUID uuid = UUID.randomUUID();
        datasets.setUuid(uuid);
        return dataSetsRepository.save(datasets);
    }

    public Optional<Datasets> GetSingleDataSet(String datasetId) {
        return dataSetsRepository.findById(datasetId);
    }

    public Datasets getDataSetByUuid(String uuid) {
        return dataSetsRepository.getDatasetInstanceUuid(uuid);
    }
    public void deleteDataSets(String datasetId)  {

        boolean exists = dataSetsRepository.existsById(datasetId);
        if (!exists) {
            throw new IllegalStateException("The instance with id " + datasetId + " does not exist");
        }
        dataSetsRepository.deleteById(datasetId);
    }

    public List<RemoteDatasets> getSearchedDataset(long instanceId, String searchTerm) {

       //Searching datasets 
       URL url;
       BufferedReader reader;
       String line;
       StringBuffer responseContent = new StringBuffer();
       List<RemoteDatasets> remoteDataSetsList = new ArrayList<RemoteDatasets>();
       Optional<Instances> instance = instancesRepository.findById(instanceId);

       try {

           String instanceurl = instance.get().getUrl();
           String username = instance.get().getUsername();
           String password = instance.get().getPassword();

           url = new URL(instanceurl.concat("/api/dataSets?query="+searchTerm));

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
           JSONArray js = jsObject.getJSONArray("dataSets");
           // System.out.println(js);

           for (Object ab : js) {

               JSONObject ourDsObject = new JSONObject(ab.toString());
               Map<String, Object> remoteDataSetMap = new HashMap<String, Object>();
               remoteDataSetMap.put("id", ourDsObject.getString("id"));
               remoteDataSetMap.put("displayName", ourDsObject.getString("displayName"));
               RemoteDatasets remoteDataSetToAdd = RemoteDatasets.fromMap(remoteDataSetMap);
               remoteDataSetsList.add(remoteDataSetToAdd);
           }

       } catch (Exception e) {
           System.out.println(e.getMessage());
       }

       return remoteDataSetsList;
    }
    
}
