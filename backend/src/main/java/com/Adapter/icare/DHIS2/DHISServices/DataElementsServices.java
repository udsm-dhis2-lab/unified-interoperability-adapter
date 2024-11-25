package com.Adapter.icare.DHIS2.DHISServices;

import com.Adapter.icare.DHIS2.DHISRepository.DataElementsRepository;
import com.Adapter.icare.DHIS2.DHISRepository.DataSetsRepository;
import com.Adapter.icare.Domains.DataElement;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DataElementsServices {

    private final DataSetsRepository dataSetsRepository;
    private final DataElementsRepository dataElementsRepository;

    public DataElementsServices(DataSetsRepository dataSetsRepository,
                                DataElementsRepository dataElementsRepository) {
        this.dataSetsRepository =  dataSetsRepository;
        this.dataElementsRepository = dataElementsRepository;
    }

    public Map<String,Object> getDataElementByDHIS2Id(String id) throws Exception {
        return dataElementsRepository.getDataElementByDHIS2Id(id);
    }

    public void saveDataElements(List<DataElement> dataElements) throws Exception {
        for (DataElement dataElement: dataElements) {
            try {
                dataElementsRepository.save(dataElement);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
