package com.Adapter.icare.DHIS2.Controllers;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.Adapter.icare.Constants.DHISConstants;
import com.Adapter.icare.DHIS2.DHISDomains.DataValueSets;
import com.Adapter.icare.DHIS2.DHISDomains.DataValues;
import com.Adapter.icare.DHIS2.DHISDomains.DhisAggregateValues;
import com.Adapter.icare.DHIS2.DHISDomains.ReportValuesSent;
import com.Adapter.icare.DHIS2.DHISServices.ReportsService;
import com.Adapter.icare.Domains.DataSetElements;

@RestController
@RequestMapping("api/v1/reports")
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
        }
        return dvslist;
    }

    @PostMapping("/sendValues")
    public void SendDataToDHIS(@RequestBody ReportValuesSent reportValuesSent) throws SQLException{

        DHISConstants constant = new DHISConstants();
        List<DhisAggregateValues> dhisAggregateValues = new ArrayList<DhisAggregateValues>();
        List<DataValues> dataValues = new ArrayList<DataValues>();
        List<DataSetElements> dSetElements = reportsService.SearchDataSetElementsPerDataSet(reportValuesSent);
        String datasetId = reportValuesSent.getDatasetId();
        String period = reportValuesSent.getPeriod();
        String completeDate = java.time.LocalDate.now().toString();
        String attributeOptCombo = "";
        String orgUnitId = constant.OrgUnit; 

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
        }

        dhisAggregateValues.add(new DhisAggregateValues(datasetId, completeDate, period, orgUnitId,attributeOptCombo,dataValues));

        reportsService.SendDataToDHIS(dhisAggregateValues,datasetId);

    }


   


    
}
