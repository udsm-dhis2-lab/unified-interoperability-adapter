package com.Adapter.icare.DHIS2.DHISServices;


import org.springframework.stereotype.Service;

import com.Adapter.icare.DHIS2.DHISRepository.DataSetElementsRepository;
import com.Adapter.icare.Domains.DataSetElements;

@Service
public class DataSetElementsService {
    
    private final DataSetElementsRepository dataSetElementsRepository;

    public DataSetElementsService(DataSetElementsRepository dataSetElementsRepository) {
        this.dataSetElementsRepository = dataSetElementsRepository;
    }

    public void addDataSetElements(DataSetElements dataSetElements) {

        dataSetElementsRepository.save(dataSetElements);    
    }

    public DataSetElements SearchExistingDataSetElements(DataSetElements dataSetElements) {
        //Manipulating the received dataset element request
        String dataElementsCategoryOptionCombString = dataSetElements.getDataElementCategoryOptionCombo();
        String[] stringArray = dataElementsCategoryOptionCombString.split("-");
        dataSetElements.setDataElement(stringArray[0]);
        dataSetElements.setCategoryOptionCombo(stringArray[1]);

        String dataElement = dataSetElements.getDataElement();
        String categoryOptionCombo = dataSetElements.getCategoryOptionCombo();
        String dataset = dataSetElements.getDatasets().getId();

        return dataSetElementsRepository.searchExistingDataSetElements(dataElement,categoryOptionCombo,dataset);
    }

    

}
