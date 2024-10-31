package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class VaccinationDetailsDTO {
    private Date date;
    private String type;
    private String status;
    private String notes;
    private Integer dosage;
    private Integer dose;
    private ReactionDTO reaction;
}
