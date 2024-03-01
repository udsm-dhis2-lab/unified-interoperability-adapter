package com.Adapter.icare.DHIS2.DHISRepository;

import com.Adapter.icare.DHIS2.DHISDomains.DatasetQuery;
import com.Adapter.icare.Domains.Datasets;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DatasetQueryRepository extends JpaRepository<DatasetQuery,String> {
}
