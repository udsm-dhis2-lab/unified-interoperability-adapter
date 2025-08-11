package com.Adapter.icare.Dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.Adapter.icare.Enums.YesNoUnknown;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class NeonatalDetails {
    private YesNoUnknown wasMultipleBirth;
    private YesNoUnknown stillbirth;
    private Boolean macerated;
    private Boolean fresh;
    private Integer motherAge;
    private Integer pregnancyAgeInWeeks;
    private Double childWeightAfterBirthInKg;
    private Integer hrsSinceBirthWithin24hrsBeforeDeath;
    private String motherConditionsThatLedToChildDeath;
}