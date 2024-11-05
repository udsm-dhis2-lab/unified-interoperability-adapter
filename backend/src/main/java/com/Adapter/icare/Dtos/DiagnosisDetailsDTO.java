package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;

@Getter
@Setter
public class DiagnosisDetailsDTO {
    private String certainty;
    private String diagnosis;

    @NotNull
    private String diagnosisCode;

    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date diagnosisDate;
    private String diagnosisDescription;
}
