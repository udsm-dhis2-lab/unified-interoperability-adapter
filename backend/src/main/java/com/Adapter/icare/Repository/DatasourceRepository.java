package com.Adapter.icare.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Adapter.icare.Domains.Datasource;

@Repository
public interface DatasourceRepository extends JpaRepository<Datasource, Long> {
    
    
}
