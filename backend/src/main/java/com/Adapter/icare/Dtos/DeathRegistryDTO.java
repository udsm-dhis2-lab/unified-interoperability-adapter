package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.PeriodType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.Adapter.icare.Enums.MannerOfDeath;
import com.Adapter.icare.Enums.PlaceOfDeath;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeathRegistryDTO {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private String dateOfDeath;
    private String lineA;
    private String lineB;
    private String lineC;
    private String lineD;
    private String causeOfDeathOther;
    private PeriodType periodTypePatientWasSick;
    private Integer timeInNumbersPatientWasSick;
    private MannerOfDeath mannerOfDeath;
    private PlaceOfDeath placeOfDeath;
    private DROtherDeathDetails otherDeathDetails;
}
