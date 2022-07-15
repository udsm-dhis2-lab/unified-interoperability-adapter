package com.Adapter.icare.Services;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Adapter.icare.Domains.Datasource;
import com.Adapter.icare.Domains.Datasource.Type;
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

    public boolean databaseTypeExists(String databaseType){

        for (Type t : Type.values()) {
            if (t.name().equals(databaseType)) {
                return true;
            }
        }
        return false;
    }
        

    public Datasource AddNewDataSource(Datasource datasource) {

        boolean db = databaseTypeExists(datasource.getType());
        if(!db){
            throw new IllegalStateException("The database type is invalid");
        }

        return datasourceRepository.save(datasource);
    }

    public void deleteDatasource(Long datasourceId) {
        boolean ds = datasourceRepository.existsById(datasourceId);
        if(!ds){
            throw new IllegalStateException("The data source is not found");
        }
        datasourceRepository.deleteById(datasourceId);
    }

    public Datasource updateDatasource(Datasource datasource) {
        
        boolean db = databaseTypeExists(datasource.getType());
        if (!db) {
            throw new IllegalStateException("The database type is invalid");
        }

        return datasourceRepository.save(datasource);
    }
    
}
