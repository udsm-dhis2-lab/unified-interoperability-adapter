package com.Adapter.icare.DHIS2.DHISRepository;

import com.Adapter.icare.DHIS2.DHISDomains.DatasetQuery;
import com.Adapter.icare.Domains.Datasets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DatasetQueryRepository extends JpaRepository<DatasetQuery,String> {

    @Query(value = "SELECT * FROM dataset_query WHERE uuid=:uuid",nativeQuery = true)
    DatasetQuery getDatasetQueryByUuid(String uuid);
    @Query(value = "SELECT * FROM dataset_query WHERE data_set_id=:id",nativeQuery = true)
    DatasetQuery getDatasetQueriesByDataSetInstance(String id);

    @Query(value = "UPDATE dataset_query SET sql_query=:sqlQuery,data_source_id=:dataSource,instance_id=:instance WHERE uuid=:uuid", nativeQuery = true)
    DatasetQuery updateDataSetQuery(String sqlQuery, Long dataSource, Long instance, String uuid);
}
