package com.Adapter.icare.Dtos;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EyeClinicDetailsDTO {
    private boolean refracted;
    private boolean spectaclesPrescribed;
    private boolean spectaclesDispensed;
    private boolean contactLensDispensed;
    private boolean prescribedWithLowVision;
    private boolean isDispensedWithLowVisionDevice;
}
