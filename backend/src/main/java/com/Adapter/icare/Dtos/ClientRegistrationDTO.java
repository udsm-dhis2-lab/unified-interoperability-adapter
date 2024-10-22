package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientRegistrationDTO {
    private FacilityDetailsDTO facilityDetails;
    private DemographicDetailsDTO demographicDetails;
}
