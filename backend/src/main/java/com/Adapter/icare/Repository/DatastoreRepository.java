package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.Datastore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DatastoreRepository  extends JpaRepository<Datastore, Long> {
    List<Datastore> findAll();

    @Query(value = "SELECT * FROM datastore WHERE uuid=:uuid",nativeQuery = true)
    Datastore getDatastoreByUuid(String uuid);

    @Query(value = "SELECT * FROM datastore WHERE namespace=:namespace",nativeQuery = true)
    List<Datastore> getDatastoreByNamespace(String namespace);


}
