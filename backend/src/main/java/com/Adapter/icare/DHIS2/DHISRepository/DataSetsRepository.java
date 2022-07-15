package com.Adapter.icare.DHIS2.DHISRepository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Adapter.icare.Domains.Datasets;

public interface DataSetsRepository extends JpaRepository<Datasets,String> {
    
}
