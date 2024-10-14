package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.Mediator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MediatorsRepository extends JpaRepository<Mediator, Long> {

    List<Mediator> findAll();

    @Query(value = "SELECT * FROM mediator WHERE uuid=:uuid",nativeQuery = true)
    Mediator getMediatorByUuid(String uuid);

    @Query(value = "SELECT * FROM mediator WHERE category=:category",nativeQuery = true)
    Mediator getMediatorByCategory(String category);

    @Query(value = "SELECT * FROM mediator WHERE code=:code",nativeQuery = true)
    Mediator getMediatorByCode(String code);

    @Query(value = "SELECT * FROM mediator WHERE (:code IS NULL OR code=:code) AND (:category IS NULL OR category=:category)",
            countQuery = "SELECT COUNT(*) FROM mediator WHERE (:code IS NULL OR code = :code ) AND (:category IS NULL OR category=:category)",nativeQuery = true)
    Page<Mediator> getMediatorsListByPagination(String code, String category, Pageable pageable);
}
