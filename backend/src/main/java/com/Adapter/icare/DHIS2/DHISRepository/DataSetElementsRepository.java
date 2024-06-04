// DataSetElementsRepository.java
package com.Adapter.icare.DHIS2.DHISRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.Adapter.icare.Domains.DataSetElements;
import java.util.List;

public interface DataSetElementsRepository extends JpaRepository<DataSetElements, Long> {
    @Query(value = "SELECT * FROM data_set_elements dse WHERE dse.category_option_combo = :categoryOptionCombo AND dse.data_element = :dataElement AND dse.uuid = :datasetId", nativeQuery = true)
    DataSetElements searchExistingDataSetElements(@Param("dataElement") String dataElement, @Param("categoryOptionCombo") String categoryOptionCombo, @Param("datasetId") String dataset);

    @Query(value = "SELECT * FROM data_set_elements dse WHERE dse.uuid = :datasetId", nativeQuery = true)
    List<DataSetElements> searchExistingDataSetElementsPerDataSet(@Param("datasetId") String datasetId);
    @Query(value = "SELECT dse.id FROM datasets dse WHERE dse.uuid = :datasetId", nativeQuery = true)
    List<Object> searchDatasetId(@Param("datasetId") String datasetId);

    @Query(value = "SELECT * FROM data_set_elements dse WHERE dse.datasets_id = :datasetId", nativeQuery = true)
    List<String> findAllSqlQueries(@Param("datasetId") String datasetId);

    @Query(value = "SELECT COUNT(*) FROM data_set_elements dse WHERE dse.uuid = :datasetId", nativeQuery = true)
    Integer countExistingDataSetsInDataSetElements(@Param("datasetId") String datasetId);

}

