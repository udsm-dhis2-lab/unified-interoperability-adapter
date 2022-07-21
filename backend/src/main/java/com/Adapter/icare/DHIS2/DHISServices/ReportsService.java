package com.Adapter.icare.DHIS2.DHISServices;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.Adapter.icare.DHIS2.DHISDomains.ReportValuesSent;
import com.Adapter.icare.DHIS2.DHISRepository.DataSetElementsRepository;
import com.Adapter.icare.Domains.DataSetElements;

@Service
public class ReportsService {

    @Autowired
    DataSetElementsRepository dataSetElementsRepository;

    public ReportsService(DataSetElementsRepository dataSetElementsRepository) {
        this.dataSetElementsRepository = dataSetElementsRepository;
    }

    public List<DataSetElements> SearchDataSetElementsPerDataSet(ReportValuesSent reportValuesSent) {
        
        String dsId = reportValuesSent.getDatasetId();
        return dataSetElementsRepository.searchExistingDataSetElementsPerDataSet(dsId);
    }
    
}
