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

    @Query(value = "SELECT * FROM datastore WHERE namespace=:namespace AND data_key=:dataKey",nativeQuery = true)
    Datastore getDatastoreByNamespaceAndKey(String namespace, String dataKey);


    // TODO: Make these queries general from the controller side
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
}
