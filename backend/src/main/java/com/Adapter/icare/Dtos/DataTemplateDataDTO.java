package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class DataTemplateDataDTO {
    private FacilityDetailsDTO facilityDetails;
    private List<SharedHealthRecordsDTO> listGrid;
    private ReportDetailsDTO reportDetails;
    private List<IdentifierDTO> clientIdentifiersPool;
}
