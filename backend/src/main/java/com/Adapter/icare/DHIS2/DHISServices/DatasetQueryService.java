package com.Adapter.icare.DHIS2.DHISServices;

import com.Adapter.icare.DHIS2.DHISDomains.DatasetQuery;
import com.Adapter.icare.DHIS2.DHISRepository.DatasetQueryRepository;
import com.Adapter.icare.Domains.Datasets;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DatasetQueryService {

    private final DatasetQueryRepository datasetQueryRepository;

    public DatasetQueryService(DatasetQueryRepository datasetQueryRepository) {
        this.datasetQueryRepository = datasetQueryRepository;
    }

    public List<DatasetQuery> getAllDataSetsQueries() {
        return datasetQueryRepository .findAll();
    }

    public DatasetQuery saveDataSetQuery(DatasetQuery datasetQuery) {
            UUID uuid = UUID.randomUUID();
            datasetQuery.setUuid(uuid.toString());
        return datasetQueryRepository.save(datasetQuery);
    }
}
