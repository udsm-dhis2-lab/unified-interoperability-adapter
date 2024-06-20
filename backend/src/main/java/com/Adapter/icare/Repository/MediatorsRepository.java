package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.Mediator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MediatorsRepository extends JpaRepository<Mediator, Long> {

    List<Mediator> findAll();

    @Query(value = "SELECT * FROM mediator WHERE uuid=:uuid",nativeQuery = true)
    Mediator getMediatorByUuid(String uuid);

    @Query(value = "SELECT * FROM mediator WHERE category=:category",nativeQuery = true)
    Mediator getMediatorByCategory(String category);
}
