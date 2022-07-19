package com.Adapter.icare.DHIS2.DHISRepository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.Adapter.icare.Domains.DataSetElements;

public interface DataSetElementsRepository extends JpaRepository<DataSetElements,Long>{

    @Query(value = "SELECT * FROM data_set_elements dse WHERE dse.category_option_combo =:categoryOptionCombo AND dse.data_element=:dataElement AND dse.datasets_id=:dataset",nativeQuery = true)
    DataSetElements searchExistingDataSetElements(String dataElement, String categoryOptionCombo, String dataset);

    @Query(value = "SELECT * FROM data_set_elements dse WHERE dse.datasets_id=:dataset", nativeQuery = true)
    List<DataSetElements> searchExistingDataSetElementsPerDataSet(String dataset);
    
}
