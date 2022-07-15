package com.Adapter.icare.Services;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Adapter.icare.Domains.Datasource;
import com.Adapter.icare.Repository.DatasourceRepository;

@Service
public class DatasourceService {

    private final DatasourceRepository datasourceRepository;

    @Autowired
    public DatasourceService(DatasourceRepository datasourceRepository) {
        this.datasourceRepository = datasourceRepository;
    }

    public List<Datasource> getDatasources() {
        return datasourceRepository.findAll();
    }
        

    public void AddNewDataSource(Datasource datasource) {

        datasourceRepository.save(datasource);
    }

    public void deleteDatasource(Long datasourceId) {
        boolean ds = datasourceRepository.existsById(datasourceId);
        if(!ds){
            throw new IllegalStateException("The data source is not found");
        }
        datasourceRepository.deleteById(datasourceId);
    }

    public void updateDatasource(Long instanceId, String url) {
    }
    
}
