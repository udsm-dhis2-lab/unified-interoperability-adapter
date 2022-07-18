package com.Adapter.icare.DHIS2.Controllers;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.Adapter.icare.DHIS2.DHISServices.DataSetElementsService;
import com.Adapter.icare.Domains.DataSetElements;
import com.Adapter.icare.Domains.Datasource;
import com.Adapter.icare.Repository.DatasourceRepository;

@RestController
@RequestMapping("api/v1/datasetElements")
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
        
        // connect to database
        Connection con = DriverManager.getConnection(dataSourceUrl, dataSourceUserName,dataSourcePassword);
        ResultSet rs = con.prepareStatement(SqlQuery).executeQuery();
         while (rs.next()) {
            dataSetElementsService.addDataSetElements(dataSetElements);     
        } 

        return dataSetElements;    
    }

    @PostMapping("/testQuery")
    public DataSetElements testQuery(@RequestBody DataSetElements dataSetElements) throws SQLException{

       Long dataSourceId = dataSetElements.getDatasource().getId();
       Optional<Datasource> datasource = datasourceRepository.findById(dataSourceId);
       String query = dataSetElements.getSqlQuery();
       String dataSourceUrl = datasource.get().getUrl();
       String dataSourcePassword = datasource.get().getPassword();
       String dataSourceUserName = datasource.get().getUsername();
       Connection con = DriverManager.getConnection(dataSourceUrl, dataSourceUserName, dataSourcePassword);
       con.prepareStatement(query).executeQuery();

       return dataSetElements;   
    }

    @PostMapping("/searchDataSetElements")
    public DataSetElements SearchExistingDataSetElements(@RequestBody DataSetElements dataSetElements){
        
       return dataSetElementsService.SearchExistingDataSetElements(dataSetElements);
    }

    
}
