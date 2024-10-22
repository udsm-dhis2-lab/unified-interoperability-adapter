package com.Adapter.icare.DHIS2.DHISServices;

import com.Adapter.icare.DHIS2.DHISRepository.DataSetsRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DataElementsServices {

    private final DataSetsRepository dataSetsRepository;

    public DataElementsServices(DataSetsRepository dataSetsRepository) {
        this.dataSetsRepository =  dataSetsRepository;
    }

    public Map<String,Object> getDataElementById(String id) throws Exception {
        return dataSetsRepository.getDataElementById(id);
    }

}
