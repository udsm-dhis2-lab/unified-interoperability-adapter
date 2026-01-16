package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.ApiLogger;
import com.Adapter.icare.Domains.DynamicValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApiLoggerRepository extends JpaRepository<ApiLogger, Long> {
    @Query(value = "SELECT * FROM api_logger v WHERE v.name=:name", nativeQuery = true)
    ApiLogger findByName(String name);

    @Query(value = "SELECT * FROM api_logger v WHERE v.uuid =:uuid", nativeQuery = true)
    ApiLogger findByUuid(String uuid);

    @Query(value = "SELECT * FROM api_logger",
            countQuery = "SELECT COUNT(*) FROM api_logger)", nativeQuery = true)
    Page<ApiLogger> getApiLogsListByPagination(Pageable pageable);
}
