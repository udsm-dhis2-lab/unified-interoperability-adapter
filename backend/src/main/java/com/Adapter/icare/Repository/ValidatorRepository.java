package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.DynamicValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ValidatorRepository extends JpaRepository<DynamicValidator, Long> {
    @Query(value = "SELECT * FROM validators v WHERE v.name=:name", nativeQuery = true)
    DynamicValidator findByName(String name);

    @Query(value = "SELECT * FROM validators v WHERE v.uuid =:uuid AND (:published IS NULL OR published=:published)", nativeQuery = true)
    DynamicValidator findByUuid(String uuid, Boolean published);

    @Query(value = "SELECT * FROM validators WHERE (:code IS NULL OR code=:code) " +
            "AND (:name IS NULL OR name=:name) " +
            "AND (:published IS NULL OR published=:published)",
            countQuery = "SELECT COUNT(*) FROM validators WHERE (:code IS NULL OR code=:code) " +
                    "AND (:name IS NULL OR name=:name) " +
                    "AND (:published IS NULL OR published=:published)", nativeQuery = true)
    Page<DynamicValidator> getValidatorsListByPagination(String code, String name, Boolean published, Pageable pageable);

    @Query(value= "SELECT * from validators WHERE (:published IS NULL OR published=:published)", nativeQuery = true)
    List<DynamicValidator> findByPublised(Boolean published);
}
