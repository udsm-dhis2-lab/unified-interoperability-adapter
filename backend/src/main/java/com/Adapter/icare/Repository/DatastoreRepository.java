package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.Datastore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;

@Repository
public interface DatastoreRepository  extends JpaRepository<Datastore, Long> {

    List<Datastore> findAll();

    @Query(value = "SELECT * FROM datastore WHERE uuid=:uuid",nativeQuery = true)
    Datastore getDatastoreByUuid(String uuid);

    @Query(value = "SELECT * FROM datastore WHERE namespace=:namespace",nativeQuery = true)
    List<Datastore> getDatastoreByNamespace(String namespace);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM datastore WHERE namespace=:namespace", nativeQuery = true)
    Integer deleteDatastoreByNamespace(String namespace);


    @Modifying
    @Transactional
    @Query(value = "UPDATE datastore SET namespace=:newNamespace WHERE namespace=:oldNamespace", nativeQuery = true)
    Integer updateNamespace(@Param("oldNamespace") String oldNamespace, @Param("newNamespace") String newNamespace);

    @Query(value = "SELECT * FROM datastore WHERE (:namespace IS NULL OR namespace = :namespace ) AND " +
            " (:key IS NULL OR data_key = :key ) AND" +
            " (:group IS NULL OR datastore_group = :group) AND" +
            " (:q IS NULL OR (" +
            "       JSON_EXTRACT(value, '$.name') LIKE CONCAT('%',:q,'%') OR " +
            "       description LIKE CONCAT('%',:q,'%') OR" +
            "       JSON_EXTRACT(value, '$.shortName') LIKE CONCAT('%',:q,'%')" +
            "       )" +
            ")",
            countQuery = "SELECT COUNT(*) FROM datastore WHERE (:namespace IS NULL OR namespace = :namespace ) AND " +
                    " (:key IS NULL OR data_key = :key ) AND" +
                    " (:group IS NULL OR datastore_group = :group) AND" +
                    " (:q IS NULL OR (" +
                    "       JSON_EXTRACT(value, '$.name') LIKE CONCAT('%',:q,'%') OR " +
                    "       description LIKE CONCAT('%',:q,'%') OR" +
                    "       JSON_EXTRACT(value, '$.shortName') LIKE CONCAT('%',:q,'%')" +
                    "       )" +
                    ")", nativeQuery = true)
    Page<Datastore> getDatastoreByNamespaceByPagination(String namespace,
                                                        Pageable pageable,
                                                        String key, String group, String q);

    @Query(value = "SELECT * FROM datastore WHERE (:namespace IS NULL OR namespace = :namespace ) AND " +
            "(:category IS NULL OR JSON_EXTRACT(value, '$.category') = :category ) AND " +
            "(:department IS NULL OR JSON_EXTRACT(value, '$.department') = :department OR JSON_EXTRACT(value, '$.class') LIKE CONCAT('%',:department,'%') ) AND " +
            "(:q IS NULL OR JSON_EXTRACT(value, '$.name') LIKE CONCAT('%',:q,'%') ) AND " +
            "(:group IS NULL OR datastore_group = :group ) AND " +
            "(:code IS NULL OR JSON_EXTRACT(value, '$.code') = :code )",
            countQuery = "SELECT COUNT(*) FROM datastore WHERE (:namespace IS NULL OR namespace = :namespace ) AND " +
                    "(:category IS NULL OR JSON_EXTRACT(value, '$.category') = :category ) AND " +
                    "(:department IS NULL OR JSON_EXTRACT(value, '$.department') = :department OR JSON_EXTRACT(value, '$.class') LIKE CONCAT('%',:department,'%')) AND " +
                    "(:q IS NULL OR JSON_EXTRACT(value, '$.name') LIKE CONCAT('%',:q,'%') ) AND " +
                    "(:group IS NULL OR datastore_group = :group ) AND " +
                    "(:code IS NULL OR JSON_EXTRACT(value, '$.code') = :code )",nativeQuery = true)
    Page<Datastore> getDatastoreByNamespaceWithPagination(String namespace,
                                                          String category,
                                                          String department,
                                                          String q,
                                                          String code,
                                                          String group,
                                                          Pageable pageable);

    @Query(value = "SELECT * FROM datastore WHERE (:namespace IS NULL OR namespace LIKE CONCAT(:namespace,'%')) AND " +
            "(:key IS NULL OR data_key = :key ) AND " +
            "(:q IS NULL OR JSON_EXTRACT(value, '$.name') LIKE CONCAT('%',:q,'%') ) AND " +
            "(:code IS NULL OR JSON_EXTRACT(value, '$.code') =:code)",
            countQuery = "SELECT COUNT(*) FROM datastore WHERE (:namespace IS NULL OR namespace LIKE CONCAT(:namespace,'%')) AND " +
                    "(:key IS NULL OR data_key = :key ) AND " +
                    "(:q IS NULL OR JSON_EXTRACT(value, '$.name') LIKE CONCAT('%',:q,'%') ) AND " +
                    "(:code IS NULL OR JSON_EXTRACT(value, '$.code') =:code)",nativeQuery = true)
    Page<Datastore> getDatastoreMatchingNamespaceFilterByPagination(String namespace,
                                                          String key,
                                                          String q,
                                                          String code,
                                                          Pageable pageable);

    @Query(value = "SELECT * FROM datastore WHERE (:namespace IS NULL OR namespace=:namespace) AND " +
            "(:dataKey IS NULL OR data_key=:dataKey)",nativeQuery = true)
    Datastore getDatastoreByNamespaceAndKey(String namespace, String dataKey);


    // TODO: Make these queries general from the controller side
    @Query(value = "SELECT * FROM datastore WHERE namespace =:namespace)",nativeQuery = true)
    List<Datastore> getHealthFacilitiesReportedData(String namespace);

    @Query(value = "SELECT * FROM datastore WHERE namespace IN (SELECT CONCAT('client-visits-',uuid) FROM datastore WHERE namespace=:namespace)",nativeQuery = true)
    List<Datastore> getDatastoreClientsVisitsNamespaceDetails(String namespace);

    @Query(value = "SELECT * FROM datastore WHERE data_key LIKE CONCAT(:dataKeyPart, '%') ",nativeQuery = true)
    List<Datastore> getDatastoreByDataKey(String dataKeyPart);
    @Query(value = "SELECT * FROM datastore WHERE data_key LIKE CONCAT(:dataKeyPart, '%') AND JSON_EXTRACT(value, '$.ageType') =:ageType " +
            "AND JSON_EXTRACT(value, '$.age') >= :startAge AND JSON_EXTRACT(value, '$.age') < :endAge",nativeQuery = true)
    List<Datastore> getDatastoreByDataKeyAndAgeGroup(String dataKeyPart, String ageType, Integer startAge, Integer endAge);

    @Query(value = "SELECT * FROM datastore WHERE data_key LIKE CONCAT(:dataKeyPart, '%')  AND JSON_EXTRACT(value, '$.ageType') =:ageType " +
            "AND JSON_EXTRACT(value, '$.age') >= :startAge AND JSON_EXTRACT(value, '$.age') < :endAge AND " +
            "JSON_CONTAINS(value, JSON_OBJECT('diagnosisCode', :diagnosisCode), '$.diagnosisDetails')",nativeQuery = true)
    List<Datastore> getDatastoreByDataKeyAndAgeGroupAndDiagnosis(String dataKeyPart, String ageType, Integer startAge, Integer endAge, String diagnosisCode);

    @Query(value = "SELECT * FROM datastore WHERE data_key LIKE CONCAT(:dataKeyPart, '%') AND JSON_EXTRACT(value, '$.ageType') =:ageType " +
            "AND JSON_EXTRACT(value, '$.age') >= :startAge AND JSON_EXTRACT(value, '$.age') < :endAge " +
            "AND JSON_EXTRACT(value, '$.gender') = :gender",nativeQuery = true)
    List<Datastore> getDatastoreByDataKeyAndAgeGroupAndGender(String dataKeyPart, String ageType, Integer startAge, Integer endAge, String gender);

    @Query(value = "SELECT * FROM datastore WHERE data_key LIKE CONCAT(:dataKeyPart, '%')  AND JSON_EXTRACT(value, '$.ageType') =:ageType " +
            "AND JSON_EXTRACT(value, '$.age') >= :startAge AND JSON_EXTRACT(value, '$.age') < :endAge " +
            "AND JSON_EXTRACT(value, '$.gender') = :gender " +
            "AND JSON_CONTAINS(value, JSON_OBJECT('diagnosisCode', :diagnosisCode), '$.diagnosisDetails')",nativeQuery = true)
    List<Datastore> getDatastoreByDataKeyAndAgeGroupAndGenderAndDiagnosis(String dataKeyPart, String ageType, Integer startAge, Integer endAge, String gender, String diagnosisCode);

    @Query(value = "SELECT COUNT(*) as aggregated FROM datastore WHERE data_key LIKE CONCAT(:dataKeyPart, '%')  AND JSON_EXTRACT(value, '$.ageType') =:ageType " +
            "AND JSON_EXTRACT(value, '$.age') >= :startAge AND JSON_EXTRACT(value, '$.age') < :endAge " +
            "AND JSON_EXTRACT(value, '$.gender') = :gender " +
            "AND JSON_CONTAINS(value, JSON_OBJECT('diagnosisCode', :diagnosisCode), '$.diagnosisDetails')",nativeQuery = true)
    List<Map<String, Object>> getDatastoreAggregateByDataKeyAndAgeGroupAndGenderAndDiagnosis(String dataKeyPart, String ageType, Integer startAge, Integer endAge, String gender, String diagnosisCode);

    @Query(value = "SELECT COUNT(*) as aggregated " +
            "FROM datastore ds " +
            "WHERE CAST(JSON_UNQUOTE(JSON_EXTRACT(value, '$.visitDate')) AS DATETIME)  BETWEEN :startDate AND :endDate " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.ageType')) = :ageType " +
            "AND JSON_EXTRACT(value, '$.age') >= :startAge " +
            "AND JSON_EXTRACT(value, '$.age') < :endAge " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.gender')) = :gender " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.orgUnit')) = :orgUnitCode " +
            "  AND  (" +
            "        SELECT COUNT(*) " +
            "        FROM (" +
            "            SELECT jt.code " +
            "            FROM datastore " +
            "            CROSS JOIN JSON_TABLE(value, '$.mappings[*]' " +
            "                COLUMNS (" +
            "                    code VARCHAR(255) PATH '$.code' " +
            "                ) " +
            "            ) AS jt WHERE namespace = :mappingsNamespace " +
            "            AND data_key = :mappingsKey " +
            "            AND JSON_CONTAINS_PATH(ds.value, 'one', '$.diagnosisDetails[*].diagnosisCode', jt.code) " +
            "        ) AS subquery " +
            "    ) > 0",nativeQuery = true)
    List<Map<String, Object>> getDatastoreAggregateByDatesAndAgeGroupAndGenderAndDiagnosis(String startDate, String endDate, String ageType, Integer startAge, Integer endAge, String gender, String mappingsNamespace, String mappingsKey, String orgUnitCode);

    @Query(value = "SELECT COUNT(*) as aggregated " +
            "FROM datastore ds " +
            "WHERE CAST(JSON_UNQUOTE(JSON_EXTRACT(value, '$.visitDate')) AS DATETIME)  BETWEEN :startDate AND :endDate " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.ageType')) = :ageType " +
            "AND JSON_EXTRACT(value, '$.age') >= :startAge " +
            "AND JSON_EXTRACT(value, '$.age') < :endAge " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.gender')) = :gender " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.orgUnit')) = :orgUnitCode " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(ds.value, '$.causesOfDeathDetails.underlyingCauseDiagnosisCode')) IN (" +
            "    SELECT jt.code " +
            "    FROM datastore sub_ds " +
            "    CROSS JOIN JSON_TABLE(sub_ds.value, '$.mappings[*]' " +
            "        COLUMNS (code VARCHAR(255) PATH '$.code') " +
            "    ) AS jt " +
            "    WHERE sub_ds.namespace = :mappingsNamespace AND sub_ds.data_key = :mappingsKey " +
            ")",nativeQuery = true)
    List<Map<String, Object>> getDatastoreAggregateDeathsByDiagnosis(String startDate, String endDate, String ageType, Integer startAge, Integer endAge, String gender, String mappingsNamespace, String mappingsKey, String orgUnitCode);


    @Query(value = "SELECT COUNT(*) as aggregated " +
            "FROM datastore ds " +
            "WHERE CAST(JSON_UNQUOTE(JSON_EXTRACT(value, '$.visitDate')) AS DATETIME)  BETWEEN :startDate AND :endDate " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.ageType')) = :ageType " +
            "AND JSON_EXTRACT(value, '$.age') >= :startAge " +
            "AND JSON_EXTRACT(value, '$.age') < :endAge " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.gender')) = :gender " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.orgUnit')) = :orgUnitCode " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.visitDetails.newThisYear')) = :newThisYear",nativeQuery = true)
    List<Map<String, Object>> getDatastoreAggregateVisitsByDatesAndAgeGroupAndGender(String startDate, String endDate, String ageType, Integer startAge, Integer endAge, String gender, String orgUnitCode, String newThisYear);


    @Query(value = "SELECT COUNT(*) as aggregated " +
            "FROM datastore ds " +
            "WHERE CAST(JSON_UNQUOTE(JSON_EXTRACT(value, '$.visitDate')) AS DATETIME)  BETWEEN :startDate AND :endDate " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.ageType')) = :ageType " +
            "AND JSON_EXTRACT(value, '$.age') >= :startAge " +
            "AND JSON_EXTRACT(value, '$.age') < :endAge " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.gender')) = :gender " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.orgUnit')) = :orgUnitCode " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.visitDetails.new')) = :isNew",nativeQuery = true)
    List<Map<String, Object>> getDatastoreAggregateNewOrRepeatVisitsByDatesAndAgeGroupAndGender(String startDate, String endDate, String ageType, Integer startAge, Integer endAge, String gender, String orgUnitCode, String isNew);


    @Query(value = "SELECT COUNT(*) as aggregated " +
            "FROM datastore ds " +
            "WHERE CAST(JSON_UNQUOTE(JSON_EXTRACT(value, '$.visitDate')) AS DATETIME)  BETWEEN :startDate AND :endDate " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.ageType')) = :ageType " +
            "AND JSON_EXTRACT(value, '$.age') >= :startAge " +
            "AND JSON_EXTRACT(value, '$.age') < :endAge " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.gender')) = :gender " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.orgUnit')) = :orgUnitCode " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.paymentCategoryDetails.type')) = :paymentCategory",nativeQuery = true)
    List<Map<String, Object>> getDatastoreAggregateVisitsByPaymentCategory(String startDate, String endDate, String ageType, Integer startAge, Integer endAge, String gender, String orgUnitCode, String paymentCategory);

    @Query(value = "SELECT COUNT(*) as aggregated " +
            "FROM datastore ds " +
            "WHERE CAST(JSON_UNQUOTE(JSON_EXTRACT(value, '$.visitDate')) AS DATETIME)  BETWEEN :startDate AND :endDate " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.ageType')) = :ageType " +
            "AND JSON_EXTRACT(value, '$.age') >= :startAge " +
            "AND JSON_EXTRACT(value, '$.age') < :endAge " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.gender')) = :gender " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.orgUnit')) = :orgUnitCode " +
            "AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.outcomeDetails.referred')) = :referred",nativeQuery = true)
    List<Map<String, Object>> getDatastoreAggregateVisitsByReferralDetails(String startDate, String endDate, String ageType, Integer startAge, Integer endAge, String gender, String orgUnitCode, String referred);

    @Query(value = "SELECT dataElement,categoryOptionCombo,SUM(dataValue) AS value " +
            "FROM datastore," +
            "JSON_TABLE(datastore.value, '$.data[*]'" +
            "    COLUMNS (" +
            "        dataElement VARCHAR(255) PATH '$.dataElement'," +
            "        categoryOptionCombo VARCHAR(255) PATH '$.categoryOptionCombo'," +
            "        dataValue INT PATH '$.value'" +
            "    )" +
            ") AS jsonTable" +
            " WHERE namespace=:namespace" +
            " AND JSON_EXTRACT(value, '$.startDate') >= :startDate AND JSON_EXTRACT(value, '$.endDate') <= :endDate" +
            " GROUP BY dataElement,categoryOptionCombo;",nativeQuery = true)
    List<Map<String, Object>> getAggregateDataByStartDateAndEndDate(String namespace, String startDate, String endDate);

    @Query(value="SELECT * FROM datastore WHERE (:namespace IS NULL OR namespace = :namespace ) AND " +
            "(:group IS NULL OR datastore_group = :group ) AND " +
            "(:key IS NULL OR data_key =:key) AND " +
            "(:version IS NULL OR JSON_EXTRACT(value, '$.majorVersion') =:version OR JSON_EXTRACT(value, '$.version') =:version) AND " +
            "(:releaseYear IS NULL OR JSON_EXTRACT(value, '$.release') =:releaseYear) AND " +
            "(:code IS NULL OR JSON_EXTRACT(value, '$.code') =:code) AND " +
            "(:q IS NULL OR JSON_EXTRACT(value, '$.name') LIKE CONCAT('%',:q,'%') OR " +
            "JSON_EXTRACT(value, '$.definitionDescription') LIKE CONCAT('%',:q,'%') OR " +
            "JSON_EXTRACT(value, '$.code') LIKE CONCAT('%',:q,'%'))",
            countQuery = "SELECT COUNT(*) FROM datastore WHERE (:namespace IS NULL OR namespace = :namespace ) AND " +
                    "(:group IS NULL OR datastore_group = :group ) AND " +
                    "(:key IS NULL OR data_key =:key) AND " +
                    "(:version IS NULL OR JSON_EXTRACT(value, '$.majorVersion') =:version  OR JSON_EXTRACT(value, '$.version') =:version) AND " +
                    "(:releaseYear IS NULL OR JSON_EXTRACT(value, '$.release') =:releaseYear) AND " +
                    "(:code IS NULL OR JSON_EXTRACT(value, '$.code') =:code) AND " +
                    "(:q IS NULL OR JSON_EXTRACT(value, '$.name') LIKE CONCAT('%',:q,'%') OR " +
                    "JSON_EXTRACT(value, '$.definitionDescription') LIKE CONCAT('%',:q,'%') OR " +
                    "JSON_EXTRACT(value, '$.code') LIKE CONCAT('%',:q,'%') )",
            nativeQuery = true)
    Page<Datastore> findDatastoreDataBySpecifiedParams(String namespace,
                                                       String key,
                                                       String version,
                                                       String releaseYear,
                                                       String code,
                                                       String q,
                                                       Pageable pageable,
                                                       String group);

    @Query(value="SELECT * FROM datastore WHERE (:namespace IS NULL OR namespace = :namespace ) AND " +
            "(:key IS NULL OR data_key =:key) AND " +
            "(:version IS NULL OR JSON_EXTRACT(value, '$.version') =:version) AND " +
            "(:releaseYear IS NULL OR JSON_EXTRACT(value, '$.release') =:releaseYear) AND " +
            "(:code IS NULL OR JSON_EXTRACT(value, '$.code') =:code) AND " +
            "(:chapter IS NULL OR JSON_EXTRACT(value, '$.category.block.chapter.code') =:chapter OR " +
            "JSON_EXTRACT(value, '$.block.chapter.code') =:chapter OR " +
            "JSON_EXTRACT(value, '$.chapter.code') =:chapter) AND " +
            "(:block IS NULL OR JSON_EXTRACT(value, '$.category.block.code') =:block OR " +
            "JSON_EXTRACT(value, '$.block.code') =:block) AND " +
            "(:category IS NULL OR JSON_EXTRACT(value, '$.category.code') =:category) AND " +
            "(:q IS NULL OR JSON_EXTRACT(value, '$.name') LIKE CONCAT('%',:q,'%') OR " +
            "JSON_EXTRACT(value, '$.definitionDescription') LIKE CONCAT('%',:q,'%') OR " +
            "JSON_EXTRACT(value, '$.code') LIKE CONCAT('%',:q,'%'))",
            countQuery = "SELECT * FROM datastore WHERE (:namespace IS NULL OR namespace = :namespace ) AND " +
                    "(:key IS NULL OR data_key =:key) AND " +
                    "(:version IS NULL OR JSON_EXTRACT(value, '$.version') =:version) AND " +
                    "(:releaseYear IS NULL OR JSON_EXTRACT(value, '$.release') =:releaseYear) AND " +
                    "(:code IS NULL OR JSON_EXTRACT(value, '$.code') =:code) AND " +
                    "(:chapter IS NULL OR JSON_EXTRACT(value, '$.category.block.chapter.code') =:chapter OR " +
                    "JSON_EXTRACT(value, '$.block.chapter.code') =:chapter OR " +
                    "JSON_EXTRACT(value, '$.chapter.code') =:chapter) AND " +
                    "(:block IS NULL OR JSON_EXTRACT(value, '$.category.block.code') =:block OR " +
                    "JSON_EXTRACT(value, '$.block.code') =:block) AND " +
                    "(:category IS NULL OR JSON_EXTRACT(value, '$.category.code') =:category) AND " +
                    "(:q IS NULL OR JSON_EXTRACT(value, '$.name') LIKE CONCAT('%',:q,'%') OR " +
                    "JSON_EXTRACT(value, '$.definitionDescription') LIKE CONCAT('%',:q,'%') OR " +
                    "JSON_EXTRACT(value, '$.code') LIKE CONCAT('%',:q,'%'))", nativeQuery = true)
    Page<Datastore> getDatastoreICDDataByParams(String namespace, String key, String version,
                                                String releaseYear, String chapter, String block, String category, String code,
                                                String q, Pageable pageable);

    @Query(value = "SELECT * FROM datastore WHERE (:namespace IS NULL OR namespace = :namespace ) AND " +
            "(:version IS NULL OR JSON_EXTRACT(value, '$.majorVersion') =:version OR JSON_EXTRACT(value, '$.version') =:version) AND " +
            "(:release IS NULL OR JSON_EXTRACT(value, '$.release') =:release) AND " +
            "(:chapter IS NULL OR JSON_EXTRACT(value, '$.chapter.code') =:chapter) ",nativeQuery = true)
    List<Datastore> getICDDataByChapter(String namespace, String chapter, String release, String version);

    @Query(value = "SELECT * FROM datastore WHERE (:namespace IS NULL OR namespace = :namespace ) AND " +
            "(:version IS NULL OR JSON_EXTRACT(value, '$.majorVersion') =:version OR JSON_EXTRACT(value, '$.version') =:version) AND " +
            "(:release IS NULL OR JSON_EXTRACT(value, '$.release') =:release) AND " +
            "(:block IS NULL OR JSON_EXTRACT(value, '$.block.code') =:block) ",nativeQuery = true)
    List<Datastore> getICDDataByBlock(String namespace, String block, String release, String version);


    @Query(value = "SELECT * FROM datastore WHERE (:namespace IS NULL OR namespace = :namespace ) AND " +
            "(:version IS NULL OR JSON_EXTRACT(value, '$.majorVersion') =:version OR JSON_EXTRACT(value, '$.version') =:version) AND " +
            "(:release IS NULL OR JSON_EXTRACT(value, '$.release') =:release) AND " +
            "(:category IS NULL OR JSON_EXTRACT(value, '$.category.code') =:category) ",nativeQuery = true)
    List<Datastore> getICDDataByCategory(String namespace, String category, String release, String version);

}
