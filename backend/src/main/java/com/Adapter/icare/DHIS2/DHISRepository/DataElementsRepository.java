package com.Adapter.icare.DHIS2.DHISRepository;

import com.Adapter.icare.Domains.DataElement;
import com.Adapter.icare.Domains.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Map;

public interface DataElementsRepository  extends JpaRepository<DataElement,String> {

    @Query(value = "SELECT de.details AS dataElement FROM data_element de " +
            "WHERE de.dhis2_id = :id",
            nativeQuery = true)
    Map<String, Object> getDataElementByDHIS2Id(String id);
}
