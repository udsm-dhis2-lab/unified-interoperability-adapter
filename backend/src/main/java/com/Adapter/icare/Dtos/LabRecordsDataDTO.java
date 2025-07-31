package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
public class LabRecordsDataDTO {
    private FacilityDetailsDTO facilityDetails;
    private List<LabRequestDetailsDTO> labRequestDetails;
    private ReportDetailsDTO reportDetails;

    public Map<String,Object> toMap() {
        Map<String, Object> mappedDataTemplateData = new HashMap<>();
        mappedDataTemplateData.put("facilityDetails", this.getFacilityDetails().toMap());
        mappedDataTemplateData.put("labRequestDetails", !this.getLabRequestDetails().isEmpty() ? this.getLabRequestDetails().stream().map(LabRequestDetailsDTO::toMap).collect(Collectors.toList()) : this.getLabRequestDetails());
        mappedDataTemplateData.put("reportDetails", this.getReportDetails().toMap());
        return mappedDataTemplateData;
    }
}
