package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class DataTemplateDataDTO {
    private FacilityDetailsDTO facilityDetails;
    private List<SharedHealthRecordsDTO> listGrid;
    private ReportDetailsDTO reportDetails;
    private List<IdentifierDTO> clientIdentifiersPool;

    public Map<String,Object> toMap() {
        Map<String, Object> mappedDataTemplateData = new HashMap<>();
        mappedDataTemplateData.put("facilityDetails", this.getFacilityDetails().toMap());
        mappedDataTemplateData.put("listGrid", this.getListGrid().stream().map(sharedHealthRecordsDTO -> sharedHealthRecordsDTO.toMap()));
        mappedDataTemplateData.put("reportDetails", this.getReportDetails());
        mappedDataTemplateData.put("clientIdentifiersPool", this.getClientIdentifiersPool());
        return mappedDataTemplateData;
    }
}
