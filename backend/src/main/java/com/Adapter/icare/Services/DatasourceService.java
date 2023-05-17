package com.Adapter.icare.Services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import com.Adapter.icare.Domains.Datasource;
import com.Adapter.icare.Domains.Datasource.Type;
import com.Adapter.icare.Repository.DatasourceRepository;

@Service
public class DatasourceService {

    private final DatasourceRepository datasourceRepository;

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
        
        String url = datasource.getUrl();            
        
        switch (datasource.getType()) {
            case "postgres":
                datasource.setUrl("jdbc:postgres://"+url);
                break;
            case "mysql":
                datasource.setUrl("jdbc:mysql://"+url);
                break;
            case "oracle":
                datasource.setUrl("jdbc:oracle:thin:@//"+url);
                break;
            case "mariadb":
                datasource.setUrl("jdbc:mariadb://"+url);
                break;    
            default:
                break;
        }
        UUID uuid = UUID.randomUUID();
        datasource.setUuid(uuid);
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
