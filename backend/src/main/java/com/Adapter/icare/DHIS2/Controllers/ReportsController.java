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
import java.util.List;
import java.util.Map;

import org.hisp.dhis.api.model.v2_37_7.User;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<DataValueSets> SearchDataSetElementsPerDataSet(@RequestBody ReportValuesSent reportValuesSent) throws SQLException{
        
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
            String dataSourcePassword = dataSetElement.getDatasource().getPassword();
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
    public String SendDataToDHIS(@RequestBody ReportValuesSent reportValuesSent) throws SQLException{

        DHISConstants constant = new DHISConstants();
        List<DataValues> dataValues = new ArrayList<DataValues>();
        List<DataSetElements> dSetElements = reportsService.SearchDataSetElementsPerDataSet(reportValuesSent);
        String datasetId = reportValuesSent.getDatasetId();
        String period = reportValuesSent.getPeriod();
        String completeDate = java.time.LocalDate.now().toString();
        String attributeOptCombo = "";
        //String orgUnitId = constant.OrgUnit; 

        for (DataSetElements dataSetElement : dSetElements) {
            
            String dataElementId = dataSetElement.getDataElement();
            String categoryOptionComboId = dataSetElement.getCategoryOptionCombo();
            String query = dataSetElement.getSqlQuery();
            String periodStart = reportValuesSent.getPeriodStart();
            String periodEnd = reportValuesSent.getPeriodEnd();

            // Query manipulation
            String newQuery = query.replaceAll("\\$\\{period-start\\}", periodStart).replaceAll("\\$\\{period-end\\}",
                    periodEnd);

            // Query execution
            String dataSourceUrl = dataSetElement.getDatasource().getUrl();
            String dataSourceUserName = dataSetElement.getDatasource().getUsername();
            String dataSourcePassword = dataSetElement.getDatasource().getPassword();
            Connection con = DriverManager.getConnection(dataSourceUrl, dataSourceUserName, dataSourcePassword);
            ResultSet rs = con.prepareStatement(newQuery).executeQuery();
            rs.next();
            String queryResult = rs.getString(1);
            
            //Adding the data values
            dataValues.add(new DataValues(dataElementId, categoryOptionComboId,queryResult,""));
            rs.close();
            con.close();    
        }

        DhisAggregateValues dhisAggregateValues = new DhisAggregateValues(datasetId, completeDate,period, "",attributeOptCombo,dataValues);

        return reportsService.SendDataToDHIS(dhisAggregateValues,datasetId);
    }


    @GetMapping("/dhisConnection")
    public Map<String, Object> Dhis2Connection() throws SQLException {
        System.out.println("TESTINGGGGGGGGGGGGGGGGGGGggg");
        Dhis2Client dhis2Client = Dhis2ClientBuilder.newClient( "https://tland.dhis2.udsm.ac.tz/api", "josephatjulius","Jovan2013" ).build();
        Map<String, Object> me = dhis2Client.get("me").transfer().returnAs(Map.class);

        System.out.println("dhis2Client");
        System.out.println(me);
        return  me;
    }
    
}
