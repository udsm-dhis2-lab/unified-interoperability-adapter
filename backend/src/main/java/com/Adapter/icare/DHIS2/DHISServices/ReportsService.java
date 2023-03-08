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
        String orgUnitID = dataset.get().getInstances().getOrganisationUnitId();
        dhisAggregateValues.setOrgUnit(orgUnitID);

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
