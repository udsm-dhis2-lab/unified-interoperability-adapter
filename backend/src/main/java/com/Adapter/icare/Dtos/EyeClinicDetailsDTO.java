package com.Adapter.icare.Dtos;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EyeClinicDetailsDTO {
    private Boolean refracted;
    private Boolean spectaclesPrescribed;
    private Boolean spectacleDispensed;
    private Boolean contactLenseDispensed;
    private Boolean prescribedWithLowVision;
    private Boolean isDispensedWithLowVisionDevice;
}
