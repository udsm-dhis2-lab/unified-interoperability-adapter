package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;

@Getter
@Setter
public class CausesOfDeathDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private String dateOfDeath;
    private String lineA;
    private String lineB;
    private String lineC;
    private String lineD;
    private String causeOfDeathOther;
    private String mannerOfDeath;
    private String placeOfDeath;
    private OtherDeathDetailsDTO otherDeathDetails;
}
