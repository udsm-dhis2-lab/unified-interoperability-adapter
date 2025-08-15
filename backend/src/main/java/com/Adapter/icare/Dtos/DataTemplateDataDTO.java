package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
public class DataTemplateDataDTO {
    private FacilityDetailsDTO facilityDetails;
    private List<SharedHealthRecordsDTO> listGrid;
    private ReportDetailsDTO reportDetails;
    private List<IdentifierDTO> clientIdentifiersPool;

    public Map<String,Object> toMap() {
        Map<String, Object> mappedDataTemplateData = new HashMap<>();
        mappedDataTemplateData.put("facilityDetails", this.getFacilityDetails() != null ? this.getFacilityDetails().toMap() : null);
        mappedDataTemplateData.put("listGrid", this.getListGrid().isEmpty() ? this.getListGrid() : this.getListGrid().stream().map(SharedHealthRecordsDTO::toMap).collect(Collectors.toList()));
        mappedDataTemplateData.put("reportDetails", this.getReportDetails() != null ? this.getReportDetails().toMap() : null);
        mappedDataTemplateData.put("clientIdentifiersPool", this.getClientIdentifiersPool());
        return mappedDataTemplateData;
    }
}
