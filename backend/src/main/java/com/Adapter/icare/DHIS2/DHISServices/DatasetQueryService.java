package com.Adapter.icare.DHIS2.DHISServices;

import com.Adapter.icare.DHIS2.DHISDomains.DatasetQuery;
import com.Adapter.icare.DHIS2.DHISRepository.DatasetQueryRepository;
import com.Adapter.icare.Domains.Dataset;
import com.Adapter.icare.Domains.Instance;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DatasetQueryService {

    private final DatasetQueryRepository datasetQueryRepository;

    public DatasetQueryService(DatasetQueryRepository datasetQueryRepository) {
        this.datasetQueryRepository = datasetQueryRepository;
    }

    public List<DatasetQuery> getAllDataSetsQueries() {
        return datasetQueryRepository.findAll();
    }

    public DatasetQuery getDataSetQueryByUuid(String uuid) {
        return datasetQueryRepository.getDatasetQueryByUuid(uuid);
    }

    public DatasetQuery getDataSetQueriesByDataSetInstanceId(Dataset dataset) {
        String id =  dataset.getId();
        return datasetQueryRepository.getDatasetQueriesByDataSetInstance(id);
    }

    public List<DatasetQuery> getDataSetQueriesByInstanceId(Instance instance) {
        Long instanceId =  instance.getId();
        return datasetQueryRepository.getDataSetQueriesByInstanceId(instanceId);
    }

    public DatasetQuery saveDataSetQuery(DatasetQuery datasetQuery) {
        String uuid;
        if (datasetQuery.getUuid() == null) {
            uuid = UUID.randomUUID().toString();
        } else {
            uuid = datasetQuery.getUuid().toString();
        }
        datasetQuery.setUuid(uuid);
        return datasetQueryRepository.save(datasetQuery);
    }

    public DatasetQuery updateDataSetQuery(DatasetQuery datasetQuery) {
        DatasetQuery existingDataSetQuery = datasetQueryRepository.getDatasetQueryByUuid(datasetQuery.getUuid());
        existingDataSetQuery.setSqlQuery(datasetQuery.getSqlQuery().toString());
        existingDataSetQuery.setDataSource(datasetQuery.getDataSource());
        existingDataSetQuery.setInstances(datasetQuery.getInstances());
        existingDataSetQuery.setMappings(datasetQuery.getMappings());
        return datasetQueryRepository.save(existingDataSetQuery);
//        return datasetQueryRepository.updateDataSetQuery(datasetQuery.getSqlQuery().toString(), datasetQuery.getDataSource().getId(), datasetQuery.getInstance().getId(), datasetQuery.getUuid());
    }
}
