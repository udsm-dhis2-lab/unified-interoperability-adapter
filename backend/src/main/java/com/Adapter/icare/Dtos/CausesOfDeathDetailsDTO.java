package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class CausesOfDeathDetailsDTO {
    private Date dateOfDeath;
    private String lineA;
    private String lineB;
    private String lineC;
    private String lineD;
}
