package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SharedHealthRecordsDTO {
    private String mrn;
    private FacilityDetailsDTO facilityDetails;
    private ReportDetailsDTO reportDetails;
    private DemographicDetailsDTO demographicDetails;
    private VisitDetailsDTO visitDetails;
}
