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
    @Query(value = "SELECT * FROM api_logger l WHERE l.name=:name", nativeQuery = true)
    ApiLogger findByName(String name);

    @Query(value = "SELECT * FROM api_logger l WHERE l.uuid =:uuid", nativeQuery = true)
    ApiLogger findByUuid(String uuid);

    @Query(value = "SELECT * FROM api_logger",
            countQuery = "SELECT COUNT(*) FROM api_logger)", nativeQuery = true)
    Page<ApiLogger> getApiLogsListByPagination(Pageable pageable);

    @Query(value = "SELECT * FROM api_logger l WHERE l.facility_code = :referringFacilityCode " +
            "AND l.transaction_type = 'REFERRAL'" +
            "AND l.referred_facility_code = :referredFacilityCode " +
            "AND l.referral_number = :referralNumber", nativeQuery = true)
    List<ApiLogger> getApiLogsListByReferralDetails(String referringFacilityCode, String referredFacilityCode, String referralNumber);
}
