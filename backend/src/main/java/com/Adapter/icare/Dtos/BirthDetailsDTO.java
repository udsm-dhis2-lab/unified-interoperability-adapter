package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class BirthDetailsDTO {
    private Date dateOfBirth;
    private Float weightInKgs;
    private boolean multipleBirth;
    private Float motherAgeInYears;
    private Integer birthOrder;
    private String motherHivStatus;
    private boolean providedWithARV;
    private BreatheAssistanceDTO breatheAssistance;
}
