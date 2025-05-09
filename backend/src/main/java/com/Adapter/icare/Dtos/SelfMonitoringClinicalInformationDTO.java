package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class SelfMonitoringClinicalInformationDTO {
    private List<VitalSignDTO> vitalSigns;
}
