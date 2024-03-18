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

package com.Adapter.icare.DHIS2.Controllers;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.Adapter.icare.Domains.Instances;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Utils.EncryptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import com.Adapter.icare.Constants.DHISConstants;
import com.Adapter.icare.DHIS2.DHISDomains.DataValueSets;
import com.Adapter.icare.DHIS2.DHISDomains.DataValues;
import com.Adapter.icare.DHIS2.DHISDomains.DhisAggregateValues;
import com.Adapter.icare.DHIS2.DHISDomains.ReportValuesSent;
import com.Adapter.icare.DHIS2.DHISServices.ReportsService;
import com.Adapter.icare.Domains.DataSetElements;
import org.hisp.dhis.integration.sdk.Dhis2ClientBuilder;
import org.hisp.dhis.integration.sdk.api.Dhis2Client;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportsController {

    @Autowired
    private final ReportsService reportsService;


    public ReportsController(ReportsService reportsService) {
        this.reportsService = reportsService;
    }


    @PostMapping
    public List<DataValueSets> SearchDataSetElementsPerDataSet(@RequestBody ReportValuesSent reportValuesSent) throws Exception {
        
        //String dataSetId = reportValuesSent.getDataSetID();
        List<DataValueSets> dvslist = new ArrayList<DataValueSets>();
        List<DataSetElements> dSetElementsList = reportsService.SearchDataSetElementsPerDataSet(reportValuesSent);
      
        for (DataSetElements dataSetElement : dSetElementsList) {

            String dataElementId = dataSetElement.getDataElement();
            String categoryComboId = dataSetElement.getCategoryOptionCombo();
            String query = dataSetElement.getSqlQuery();
            String periodStart = reportValuesSent.getPeriodStart();
            String periodEnd = reportValuesSent.getPeriodEnd();
            
            //Query manipulation
            String newQuery = query.replaceAll("\\$\\{period-start\\}",periodStart).replaceAll("\\$\\{period-end\\}",periodEnd);

            //Query execution
            String dataSourceUrl = dataSetElement.getDatasource().getUrl();
            String dataSourceUserName = dataSetElement.getDatasource().getUsername();
            String decryptedPassword = EncryptionUtils.decrypt(dataSetElement.getDatasource().getPassword());
            String dataSourcePassword = decryptedPassword;
            Connection con = DriverManager.getConnection(dataSourceUrl, dataSourceUserName, dataSourcePassword);
            ResultSet rs = con.prepareStatement(newQuery).executeQuery();
            rs.next();
            String queryResult = rs.getString(1);
            String dataElementCatCombo = dataElementId + "-" +categoryComboId +"-val";
            
            //Adding to a list
            dvslist.add(new DataValueSets(dataElementCatCombo,queryResult));
            rs.close();
            con.close();    
        }
        return dvslist;
    }

    @PostMapping("/sendValues")
    public String SendDataToDHIS(@RequestBody Map<String, Object> reportData) throws Exception {
        List<DataValues> dataValues =  (List<DataValues>) reportData.get("dataValues");
        String datasetUuid = reportData.get("dataSet").toString();
        String period = reportData.get("period").toString();
        String attributeOptCombo = null;
        if (reportData.get("attributeOptCombo") != null) {
            attributeOptCombo =  reportData.get("attributeOptCombo").toString();
        }
        String completeDate = java.time.LocalDate.now().toString();

        DhisAggregateValues dhisAggregateValues = new DhisAggregateValues(datasetUuid, completeDate,period, "",attributeOptCombo,dataValues);
        return reportsService.SendDataToDHIS(dhisAggregateValues,datasetUuid);
    }


    @GetMapping("/dhisConnection")
    public Map<String, Object> Dhis2Connection() throws Exception {
        Dhis2Client dhis2Client = null;
        Map<String, Object> me = new HashMap<>();
        try {
            dhis2Client = Dhis2ClientBuilder.newClient( "https://play.dhis2.org/2.39.1/api", "admin","district" ).build();
        } catch (Exception e) {
            System.err.println("Error establishing DHIS2 client: " + e.getMessage());
            e.printStackTrace();

        }
        if (dhis2Client != null) {
            me = dhis2Client.get("me").transfer().returnAs(Map.class);
        }
        return  me;
    }

    @PostMapping(path = "/verifyCode",consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getDHIS2OrgUnitViaCode(@RequestBody Instances instance) throws Exception {
        String url = instance.getUrl() + "/api";
        String username = instance.getUsername();
        String password =instance.getPassword();
        String code = instance.getCode();
        Map<String, Object> organisationUnit = new HashMap<>();
        try {
//            organisationUnit = reportsService.fetchOrgUnitUsingCode(url,username,password,code);
//            System.out.println(organisationUnit);
            Dhis2Client dhis2Client = null;
            try {
                dhis2Client = Dhis2ClientBuilder.newClient( url, username,password ).build();
            } catch (Exception e) {
                throw new RuntimeException("Error establishing DHIS2 client: " + e);
            }
            if (dhis2Client != null) {
                Map<String, Object> response = dhis2Client.get("organisationUnits").withFields("id,name,code").withFilter("code:eq:" + code).transfer().returnAs(Map.class);
                if (response != null && response.get("organisationUnits") != null && ((List) response.get("organisationUnits")).size() > 0) {
                    organisationUnit =(Map<String, Object>) ((List) response.get("organisationUnits")).get(0);
                } else {
                    organisationUnit.put("message", "No organisation unit matching the code " + code);
                    organisationUnit.put("status", "OK");
                }
            }

        }catch (Exception e) {
            throw new RuntimeException("Error verifying organisation unit using code: " + e);
        }
        return organisationUnit;
    }
    
}
