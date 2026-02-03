package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.HfrFacility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HfrFacilityRepository extends JpaRepository<HfrFacility, Long> {
    @Query(value = "SELECT * FROM hfr_facility f WHERE f.fac_id_number=:facIdNumber", nativeQuery = true)
    HfrFacility findByFacIdNumber(String facIdNumber);

    @Query(value = "SELECT * FROM hfr_facility f WHERE f.name=:name", nativeQuery = true)
    HfrFacility findByName(String name);

    @Query(value = "SELECT * FROM hfr_facility f WHERE f.uuid =:uuid", nativeQuery = true)
    HfrFacility findByUuid(String uuid);

    @Query(value = "SELECT * FROM hfr_facility " +
            "WHERE (:facIdNumber IS NULL OR fac_id_number LIKE CONCAT('%', :facIdNumber, '%')) " +
            "AND (:name IS NULL OR name LIKE CONCAT('%', :name, '%')) " +
            "AND (:region IS NULL OR fac_region LIKE CONCAT('%', :region, '%')) " +
            "AND (:district IS NULL OR district LIKE CONCAT('%', :district, '%')) " +
            "AND (:council IS NULL OR council LIKE CONCAT('%', :council, '%'))",
            countQuery = "SELECT COUNT(*) FROM hfr_facility " +
                    "WHERE (:facIdNumber IS NULL OR fac_id_number LIKE CONCAT('%', :facIdNumber, '%')) " +
                    "AND (:name IS NULL OR name LIKE CONCAT('%', :name, '%')) " +
                    "AND (:region IS NULL OR fac_region LIKE CONCAT('%', :region, '%')) " +
                    "AND (:district IS NULL OR district LIKE CONCAT('%', :district, '%')) " +
                    "AND (:council IS NULL OR council LIKE CONCAT('%', :council, '%'))",
            nativeQuery = true)
    Page<HfrFacility> getHfrFacilityListByPagination(Pageable pageable,
                                                     @Param("facIdNumber") String facIdNumber,
                                                     @Param("name") String name,
                                                     @Param("region") String region,
                                                     @Param("district") String district,
                                                     @Param("council") String council);
}
