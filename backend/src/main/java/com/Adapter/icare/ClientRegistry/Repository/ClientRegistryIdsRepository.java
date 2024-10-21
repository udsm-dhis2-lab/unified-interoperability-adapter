package com.Adapter.icare.ClientRegistry.Repository;

import com.Adapter.icare.ClientRegistry.Domains.ClientRegistryIdPool;
import com.Adapter.icare.Domains.Datasource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClientRegistryIdsRepository extends JpaRepository<ClientRegistryIdPool, Long> {
    List<ClientRegistryIdPool> findAll();

    @Query(value = "SELECT * FROM client_registry_id_pool WHERE is_used=false LIMIT= :limit",nativeQuery = true)
    List<ClientRegistryIdPool> getIds(Integer limit);

//    @Query(value = "SELECT COUNT(cridp) FROM client_registry_id_pool cridp WHERE is_used = true ")
//    Integer getCountOfAllIdsUsed();
    Long countByUsedTrue();

    Long countByUsedFalse();
//
//    @Query(value = "SELECT COUNT(cridp) FROM client_registry_id_pool cridp WHERE is_used = false ")
//    Integer getCountOfAllIdsUnUsed();
}

