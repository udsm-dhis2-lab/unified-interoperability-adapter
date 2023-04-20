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

import java.sql.*;
import java.util.*;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.Adapter.icare.DHIS2.DHISServices.DataSetElementsService;
import com.Adapter.icare.Domains.DataSetElements;
import com.Adapter.icare.Domains.Datasource;
import com.Adapter.icare.Repository.DatasourceRepository;

@RestController
@RequestMapping("/api/v1/datasetElements")
public class DataSetElementsController {
    
    private final DataSetElementsService dataSetElementsService;
    private final DatasourceRepository datasourceRepository;

    public DataSetElementsController(DataSetElementsService dataSetElementsService,DatasourceRepository datasourceRepository) {
        this.dataSetElementsService = dataSetElementsService;
        this.datasourceRepository = datasourceRepository;
       
    }

    @PostMapping
    public DataSetElements addDataSetElements(@RequestBody DataSetElements dataSetElements) throws SQLException {

        //Manipulating the received request
        String dataElementsCategoryOptionCombString = dataSetElements.getDataElementCategoryOptionCombo();
        String [] stringArray = dataElementsCategoryOptionCombString.split("-");
        dataSetElements.setDataElement(stringArray[0]);
        dataSetElements.setCategoryOptionCombo(stringArray[1]);
        Long dataSourceId = dataSetElements.getDatasource().getId();
        Optional<Datasource> datasource = datasourceRepository.findById(dataSourceId);
        
        //Obtaining the data from dataSetElements
        String SqlQuery = dataSetElements.getSqlQuery();
        String dataSourceUrl = datasource.get().getUrl();
        String dataSourcePassword = datasource.get().getPassword();
        String dataSourceUserName = datasource.get().getUsername();

        // Query manipulation
        String newQuery = SqlQuery.replaceAll("\\$\\{period-start\\}","1900-01-01").replaceAll("\\$\\{period-end\\}",
                "5000-01-01");
        
        // connect to database
        Connection con = DriverManager.getConnection(dataSourceUrl, dataSourceUserName,dataSourcePassword);
        ResultSet rs = con.prepareStatement(newQuery).executeQuery();

        while (rs.next()) {
        dataSetElementsService.addDataSetElements(dataSetElements);     
        }
        return dataSetElements;    
    }

    @PostMapping("/testQuery")
    public String testQuery(@RequestBody DataSetElements dataSetElements) throws SQLException{

       Long dataSourceId = dataSetElements.getDatasource().getId();
       Optional<Datasource> datasource = datasourceRepository.findById(dataSourceId);
       String dataSourceUrl = datasource.get().getUrl();
       String dataSourcePassword = datasource.get().getPassword();
       String dataSourceUserName = datasource.get().getUsername();
       String query = dataSetElements.getSqlQuery();
       String periodStart = dataSetElements.getPeriodStart();
       String periodEnd = dataSetElements.getPeriodEnd();

       //Query manipulation
       String newQuery = query.replaceAll("\\$\\{period-start\\}",periodStart).replaceAll("\\$\\{period-end\\}",periodEnd);

       System.out.println(newQuery);

       Connection con = DriverManager.getConnection(dataSourceUrl, dataSourceUserName, dataSourcePassword);
       ResultSet rs = con.prepareStatement(newQuery).executeQuery();
       rs.next();
       return rs.getString(1);   
    }

    @PostMapping("/testquerylist")
    public List<Map<String,Object>> queryList(@RequestBody Map<String,Object> queryMap) throws SQLException{

       String query = queryMap.get("sql").toString();
       String datasourceId = queryMap.get("datasourceid").toString();
       Datasource datasource = datasourceRepository.getById(Long.valueOf(datasourceId));
       Connection con = DriverManager.getConnection(datasource.getUrl(), datasource.getUsername(),datasource.getPassword());
       ResultSet rs = con.prepareStatement(query).executeQuery();

        // retrieve the column names and types from ResultSetMetaData
        ResultSetMetaData rsmd = rs.getMetaData();
        int columnCount = rsmd.getColumnCount();
        List<String> columnNames = new ArrayList<String>();
        for (int i = 1; i <= columnCount; i++) {
            String columnName = rsmd.getColumnName(i);
            columnNames.add(columnName);
        }

        // create a list to store the query results
        List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();

        // iterate through the result set and store the data in the list
        while (rs.next()) {
            Map<String, Object> row = new HashMap<String, Object>();
            for (String columnName : columnNames) {
                Object value = rs.getObject(columnName);
                row.put(columnName, value);
            }
            resultList.add(row);
        }

        return resultList;
    }

    @PostMapping("/searchDataSetElements")
    public DataSetElements SearchExistingDataSetElements(@RequestBody DataSetElements dataSetElements){
        
       return dataSetElementsService.SearchExistingDataSetElements(dataSetElements);
    }

    
}
