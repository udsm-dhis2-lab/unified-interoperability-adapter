package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AntenatalCareDetailsDTO {
    private Integer pregnancyAgeInWeeks;
    private boolean positiveHivStatusBeforeService;
    private Integer gravidity;
    private SpouseDetailsDTO spouseDetails;
}
