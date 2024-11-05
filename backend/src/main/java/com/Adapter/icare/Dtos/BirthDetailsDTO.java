package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;

@Getter
@Setter
public class BirthDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date dateOfBirth;
    private Float weightInKgs;
    private boolean multipleBirth;
    private Float motherAgeInYears;
    private Integer birthOrder;
    private String motherHivStatus;
    private boolean providedWithARV;
    private BreatheAssistanceDTO breatheAssistance;
}
