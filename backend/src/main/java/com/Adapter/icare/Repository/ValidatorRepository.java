package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.Instance;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Domains.Validator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ValidatorRepository extends JpaRepository<Validator, Long> {
    @Query(value = "SELECT * FROM validators v WHERE v.name=:name", nativeQuery = true)
    Validator findByName(String name);

    @Query(value = "SELECT * FROM validators v WHERE v.uuid =:uuid ", nativeQuery = true)
    Validator findByUuid(String uuid);

    @Query(value = "SELECT * FROM validators WHERE (:code IS NULL OR code=:code) " +
            " AND (:name IS NULL OR name=:name)",
            countQuery = "SELECT COUNT(*) FROM validators WHERE (:code IS NULL OR code=:code) " +
                     "AND (:name IS NULL OR name=:name)", nativeQuery = true)
    Page<Validator> getValidatorsListByPagination(String code, String name, Pageable pageable);
}
