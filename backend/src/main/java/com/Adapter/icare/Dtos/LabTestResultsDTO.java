package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;

@Getter
@Setter
public class LabTestResultsDTO {
    private String parameter;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date releaseDate;
    private String result;
    private String codedValue;
    private String valueType;
    private Boolean standardCode;
    private String codeType;
    private String unit;
    private String lowRange;
    private String highRange;
    private String remarks;
}
