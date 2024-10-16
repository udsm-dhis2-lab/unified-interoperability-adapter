package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
public class SharedHealthRecordsDTO {

    @NotNull(message = "value cannot be null")
    private String mrn;

    @NotNull(message = "value cannot be null")
    private FacilityDetailsDTO facilityDetails;

//    @NotNull(message = "value cannot be null")
    private ReportDetailsDTO reportDetails;
    private DemographicDetailsDTO demographicDetails;

    @NotNull(message = "value cannot be null")
    private VisitDetailsDTO visitDetails;

    private ClinicalInformationDTO clinicalInformation;

    private List<AllergiesDTO> allergies;

    private List<ChronicConditionsDTO> chronicConditions;

    private LifeStyleInformationDTO lifeStyleInformation;
}
